type IconProps = { className?: string };

export function Chevron({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 10 6"
      fill="none"
      aria-hidden
      className={className}
      strokeWidth={1.2}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 1L5 5L9 1" />
    </svg>
  );
}

export function MapPin({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 18"
      fill="none"
      aria-hidden
      className={className}
      stroke="currentColor"
      strokeWidth={1.375}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.076 17.022a.83.83 0 0 1-1.027 0C2.622 13.867-2.076 7.377 2.674 2.688A6.93 6.93 0 0 1 7.562.687c1.834 0 3.593.72 4.889 2a6.93 6.93 0 0 1 0 9.799 20.4 20.4 0 0 1-4.375 4.536Z" />
      <path d="M7.564 8.938a1.833 1.833 0 1 0 0-3.667 1.833 1.833 0 0 0 0 3.667Z" />
    </svg>
  );
}

export function Diamond({ className }: IconProps) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden className={className}>
      <rect
        x="6"
        y="0.7"
        width="7.5"
        height="7.5"
        transform="rotate(45 6 0.7)"
        stroke="currentColor"
        strokeWidth={0.9}
      />
    </svg>
  );
}

/** The circular badge glyph used on the Al Marjan map markers. */
export function WaveGlyph({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 12" fill="none" aria-hidden className={className}>
      <rect x="2" y="1" width="12" height="1.5" rx="0.75" fill="currentColor" />
      <rect x="3.5" y="5.25" width="9" height="1.5" rx="0.75" fill="currentColor" />
      <rect x="5" y="9.5" width="6" height="1.5" rx="0.75" fill="currentColor" />
    </svg>
  );
}

export function LinkedIn({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.2 8.94h3.5V21H3.2V8.94Zm5.7 0h3.35v1.65h.05c.47-.85 1.6-1.75 3.3-1.75 3.53 0 4.18 2.2 4.18 5.07V21h-3.5v-5.4c0-1.29-.02-2.95-1.85-2.95-1.85 0-2.13 1.4-2.13 2.85V21H8.9V8.94Z" />
    </svg>
  );
}

export function Instagram({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      aria-hidden
      className={className}
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Facebook({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.63c-.29-.04-1.27-.13-2.41-.13-2.38 0-4.02 1.46-4.02 4.13V9.9H7.5V13h2.77v8h3.23Z" />
    </svg>
  );
}

export function Mail({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      aria-hidden
      className={className}
    >
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m3.8 7 8.2 6 8.2-6" />
    </svg>
  );
}

export function Phone({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      aria-hidden
      className={className}
    >
      <path d="M6.2 3.5h3l1.5 4-2 1.3a12 12 0 0 0 5.5 5.5l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.2 5.7a2 2 0 0 1 2-2.2Z" />
    </svg>
  );
}

export function Menu({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      aria-hidden
      className={className}
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function Close({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      aria-hidden
      className={className}
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

/* ---- Property spec icons ---- */

export function Building({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M3 17.5V4.5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v13" />
      <path d="M12 8.5h4a1 1 0 0 1 1 1v8" />
      <path d="M1.5 17.5h17M5.5 6.5h1.5M8.5 6.5H10M5.5 9.5h1.5M8.5 9.5H10M5.5 12.5h1.5M8.5 12.5H10M14 11.5h1.5M14 14h1.5" />
    </svg>
  );
}

export function Bath({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M2.5 10.5h15v2a3.5 3.5 0 0 1-3.5 3.5H6a3.5 3.5 0 0 1-3.5-3.5v-2Z" />
      <path d="M4.5 10.5V5.2A1.7 1.7 0 0 1 6.2 3.5c.8 0 1.5.55 1.68 1.3" />
      <path d="M6.6 6.1h2.6M5 16v1.5M15 16v1.5" />
    </svg>
  );
}

export function Bed({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M2 15.5v-4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
      <path d="M2 13.5h16M4.5 9.5V7a1.5 1.5 0 0 1 1.5-1.5h8A1.5 1.5 0 0 1 15.5 7v2.5" />
      <path d="M7.5 9.5V8h5v1.5" />
    </svg>
  );
}

export function Area({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect x="3" y="3" width="14" height="14" rx="1" />
      <path d="M3 7.5h3M3 12.5h3M7.5 3v3M12.5 3v3" />
    </svg>
  );
}

export function Stairs({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M2.5 16.5h4v-4h4v-4h4v-4h3" />
    </svg>
  );
}

export function ViewIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M2 12.5c1.6-1.6 3.2-1.6 4.8 0s3.2 1.6 4.8 0 3.2-1.6 4.4 0" />
      <path d="M2 8c1.6-1.6 3.2-1.6 4.8 0s3.2 1.6 4.8 0 3.2-1.6 4.4 0" />
    </svg>
  );
}

export function Search({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      aria-hidden
      className={className}
    >
      <circle cx="9" cy="9" r="5.5" />
      <path d="m13.2 13.2 3.3 3.3" />
    </svg>
  );
}

/** WhatsApp handset-in-bubble mark, drawn as a solid glyph. */
export function WhatsApp({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.33 4.97L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2Zm0 18.15h-.01a8.24 8.24 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 5.83 2.42 8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.19-.53.06-.25-.12-1.05-.38-1.99-1.23-.74-.65-1.23-1.46-1.38-1.71-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.14.17-.25.25-.41.09-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43l-.47-.01c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.74 2.65 4.21 3.72.59.25 1.05.4 1.4.52.59.18 1.13.16 1.55.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}
