import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/app/lib/db";
import { isRole, type Role, SUPERADMIN_USERNAME } from "@/app/lib/auth/roles";
import { ensureSuperadmin, verifyPassword } from "@/app/lib/auth/superadmin";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: Role;
      mustChangePassword: boolean;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    role?: Role;
    mustChangePassword?: boolean;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  /*
   * Database sessions and the Credentials provider are mutually exclusive in
   * Auth.js — a credentials sign-in never writes a Session row, so a database
   * strategy would authenticate the person and then fail to remember it. The
   * adapter above is still wired, so adding an OAuth provider later is config.
   */
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },

  pages: { signIn: "/admin/login", error: "/admin/login" },

  // Behind a proxy in development, and on Vercel the host is already trusted.
  trustHost: true,

  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = String(credentials?.username ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!username || !password) return null;

        // The one account that may not exist yet. Cheap, and only on the path
        // that would otherwise be the first person locked out.
        if (username === SUPERADMIN_USERNAME) await ensureSuperadmin();

        const user = await prisma.user.findUnique({ where: { username } });
        // Still hash-compare against a dummy when the user is missing, so a
        // wrong username and a wrong password take the same time to refuse.
        const hash =
          user?.passwordHash ??
          "$2b$12$0000000000000000000000000000000000000000000000000000";
        const ok = await verifyPassword(password, hash);

        if (!user || !ok || !user.active || !isRole(user.role)) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email ?? undefined,
          username: user.username,
          role: user.role,
          mustChangePassword: user.mustChangePassword,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as { username: string }).username;
        token.role = (user as { role: Role }).role;
        token.mustChangePassword = (
          user as { mustChangePassword: boolean }
        ).mustChangePassword;
      }

      /*
       * The token carries identity and nothing else that matters. Role,
       * whether the account is still enabled and whether a password change is
       * outstanding are all re-read from the database on every admin request —
       * see `app/lib/admin/guard.ts` — because a token is a snapshot and a
       * revocation has to take effect now, not in eight hours.
       */
      return token;
    },

    async session({ session, token }) {
      if (token.id) session.user.id = token.id;
      if (token.username) session.user.username = token.username;
      if (token.role) session.user.role = token.role;
      session.user.mustChangePassword = token.mustChangePassword ?? false;
      return session;
    },
  },
});
