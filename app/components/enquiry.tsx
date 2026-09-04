"use client";

/**
 * "Enquire Now", wherever it appears, without sending the reader away.
 *
 * A card in a grid is the wrong place to ask someone to leave for
 * `/contact-us` and re-state what they were looking at, so the form comes to
 * them. This module is only the wiring: the provider holds which enquiry is
 * open and nothing else, so the dialog — and with it the form, the select menu
 * and the Server Action — is a separate chunk that downloads on first click
 * rather than on every page that happens to show a unit.
 */

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useState } from "react";
import type { EnquiryType } from "@/app/lib/leads/schema";

/** What the reader is enquiring *about*, as far as the dialog needs to know. */
export type EnquiryContext = {
  /**
   * The line above the heading — "Marmara Vista 2 Bedrooms · Beylikdüzü".
   * Already localised by the caller, which is the only place that knows how to
   * word the thing being enquired about.
   */
  eyebrow?: string;
  /** Pre-fills the subject, so nobody retypes what they just clicked. */
  subject?: string;
  enquiryType?: EnquiryType;
  programme?: string;
};

type OpenEnquiry = (context?: EnquiryContext) => void;

const EnquiryDialog = dynamic(() => import("./enquiry-dialog"), {
  // Nothing to render until a click, and the dialog reads `document` on mount.
  ssr: false,
});

const EnquiryContextValue = createContext<OpenEnquiry | null>(null);

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [enquiry, setEnquiry] = useState<EnquiryContext | null>(null);
  const open = useCallback<OpenEnquiry>((context = {}) => {
    setEnquiry(context);
  }, []);

  return (
    <EnquiryContextValue.Provider value={open}>
      {children}
      {enquiry ? (
        <EnquiryDialog
          context={enquiry}
          onClose={() => setEnquiry(null)}
        />
      ) : null}
    </EnquiryContextValue.Provider>
  );
}

/**
 * Null outside a provider, so a call site can keep whatever link it would have
 * had rather than render a button that quietly does nothing.
 */
export function useEnquiry(): OpenEnquiry | null {
  return useContext(EnquiryContextValue);
}
