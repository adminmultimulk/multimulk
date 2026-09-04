/**
 * Cache tags shared by the read layer and the dashboard's server actions.
 *
 * Own module, and free of `server-only`, so an action can invalidate a tag
 * without importing the reader (which pulls in Prisma and the whole static
 * content layer behind it).
 */
export const ARTICLES_TAG = "cms-articles";
export const PROPERTIES_TAG = "cms-properties";
