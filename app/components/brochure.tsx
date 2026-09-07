"use client";

/**
 * "Download Brochure", wherever it appears, without sending the reader away.
 *
 * The same arrangement as `./enquiry.tsx`, and for the same reasons: the
 * provider holds only which brochure is being asked for, so the dialog — with
 * its form and its Server Action — is a separate chunk that arrives on the
 * first click rather than on every page that lists a residence.
 *
 * What is behind the button is a lead, not a link. The reader leaves their
 * name, phone and email; the brochure arrives in their inbox and the enquiry
 * arrives wherever the contact form's enquiries go.
 */

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useState } from "react";

/** Which development's brochure is being requested. */
export type BrochureContext = {
  /** The project slug; the server resolves the file from it. */
  slug: string;
  /** The development's name, which is the same in every language. */
  project: string;
  /** The line above the heading — "Marmara Vista 2 Bedrooms · Beylikdüzü". */
  eyebrow?: string;
};

type OpenBrochure = (context: BrochureContext) => void;

const BrochureDialog = dynamic(() => import("./brochure-dialog"), {
  // Nothing to render until a click, and the dialog reads `document` on mount.
  ssr: false,
});

const BrochureContextValue = createContext<OpenBrochure | null>(null);

export function BrochureProvider({ children }: { children: React.ReactNode }) {
  const [request, setRequest] = useState<BrochureContext | null>(null);
  const open = useCallback<OpenBrochure>((context) => {
    setRequest(context);
  }, []);

  return (
    <BrochureContextValue.Provider value={open}>
      {children}
      {request ? (
        <BrochureDialog
          context={request}
          onClose={() => setRequest(null)}
        />
      ) : null}
    </BrochureContextValue.Provider>
  );
}

/**
 * Null outside a provider, so a call site can fall back to linking straight at
 * the PDF rather than rendering a button that quietly does nothing.
 */
export function useBrochure(): OpenBrochure | null {
  return useContext(BrochureContextValue);
}
