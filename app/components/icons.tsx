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

export function YouTube({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.28 5 12 5 12 5s-6.28 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.78 2 12 2 12s0 3.22.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.72 19 12 19 12 19s6.28 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.22 22 12 22 12s0-3.22-.4-4.8ZM10 15.2V8.8l5.5 3.2-5.5 3.2Z" />
    </svg>
  );
}

export function X({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.53 3h3.2l-6.99 7.99L22 21h-6.3l-4.93-6.44L5.13 21H1.92l7.28-8.32L2 3h6.46l4.6 6.08L17.53 3Zm-1.12 16.06h1.77L7.66 4.84H5.76l10.65 14.22Z" />
    </svg>
  );
}

export function TikTok({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M16.6 2h-3.2v13.2a2.35 2.35 0 1 1-1.72-2.27V9.66a5.55 5.55 0 1 0 4.92 5.52V8.9a6.1 6.1 0 0 0 3.6 1.17V6.86A3.5 3.5 0 0 1 16.6 2Z" />
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

export function Download({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M12 3.5v11" />
      <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
      <path d="M4.5 17v2.5h15V17" />
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

/* ---- Amenity icons ----
   One glyph per kind of amenity rather than per name: an indoor pool, an
   outdoor pool and a pool terrace are all a pool to a reader scanning a list.
   `AmenityIcon` in `amenity-icon.tsx` is what maps names onto these. */

export function Bell({ className }: IconProps) {
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
      <path d="M3 14.5h14a6.5 6.5 0 0 0-6.5-6.5h-1A6.5 6.5 0 0 0 3 14.5Z" />
      <path d="M1.5 17h17M10 8V5.5M8.5 4.5h3" />
    </svg>
  );
}

export function Shield({ className }: IconProps) {
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
      <path d="M10 2.5 3.5 5v5c0 3.4 2.6 6.5 6.5 7.5 3.9-1 6.5-4.1 6.5-7.5V5L10 2.5Z" />
      <path d="m7.4 9.9 1.9 1.9 3.5-3.6" />
    </svg>
  );
}

export function Sofa({ className }: IconProps) {
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
      <path d="M4 9V6.5A1.5 1.5 0 0 1 5.5 5h9A1.5 1.5 0 0 1 16 6.5V9" />
      <path d="M2.5 14.5v-3.9A1.6 1.6 0 0 1 4.1 9c.9 0 1.6.7 1.6 1.6v1.4h8.6v-1.4c0-.9.7-1.6 1.6-1.6a1.6 1.6 0 0 1 1.6 1.6v3.9Z" />
      <path d="M4.5 14.5V16M15.5 14.5V16" />
    </svg>
  );
}

export function Rooftop({ className }: IconProps) {
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
      <path d="M2 17.5h16" />
      <path d="M4.5 17.5V9l5.5-3.5L15.5 9v8.5" />
      <path d="M8 17.5v-4h4v4M7 3.5v2M13 3.5v2" />
    </svg>
  );
}

export function Cinema({ className }: IconProps) {
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
      <rect x="2.5" y="4" width="15" height="9.5" rx="1" />
      <path d="m8.5 6.8 4 1.95-4 1.95V6.8Z" />
      <path d="M6.5 17h7" />
    </svg>
  );
}

export function Desk({ className }: IconProps) {
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
      <rect x="4.5" y="4.5" width="11" height="7.5" rx="1" />
      <path d="M2.5 14.5h15M6 17.5l1.2-3M14 17.5l-1.2-3" />
    </svg>
  );
}

export function Elevator({ className }: IconProps) {
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
      <rect x="3.5" y="2.5" width="13" height="15" rx="1" />
      <path d="M10 2.5v15" />
      <path d="m6 9 1.3-1.6L8.6 9M14 11l-1.3 1.6L11.4 11" />
    </svg>
  );
}

export function Dining({ className }: IconProps) {
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
      <path d="M6 2.5v6a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-6M4 10.5v7" />
      <path d="M13.5 2.5c2 0 3.5 2 3.5 4.5S15.5 11 14.5 11v6.5" />
    </svg>
  );
}

export function Spa({ className }: IconProps) {
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
      <path d="M16.6 3.6C9.2 3.6 4 8 4 13.8c0 1 .1 1.9.4 2.6 7.2.8 12.2-4.4 12.2-12.8Z" />
      <path d="M4.4 16.4C6.6 12 9.9 8.7 13.9 6.8" />
    </svg>
  );
}

export function Sauna({ className }: IconProps) {
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
      <path d="M10 17.5c2.5 0 4.5-1.9 4.5-4.2 0-3.3-4.5-5.3-3.4-9.3-2.6 1-4.4 3.6-4.4 6.2 0 1.2.4 2 .4 2.7 0 .9-.7 1.4-1.3 1.1.1 2 1.9 3.5 4.2 3.5Z" />
    </svg>
  );
}

export function Dumbbell({ className }: IconProps) {
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
      <path d="M4 7.5v5M2 8.5v3M16 7.5v5M18 8.5v3" />
      <rect x="4" y="6.5" width="2.5" height="7" rx="0.8" />
      <rect x="13.5" y="6.5" width="2.5" height="7" rx="0.8" />
      <path d="M6.5 10h7" />
    </svg>
  );
}

export function Pool({ className }: IconProps) {
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
      <path d="M7 12.5V5a2 2 0 0 1 2-2M13 12.5V5a2 2 0 0 1 2-2" />
      <path d="M7 6.5h6M7 9.5h6" />
      <path d="M2 15c1.3 0 1.3 1.2 2.7 1.2S6 15 7.3 15s1.3 1.2 2.7 1.2 1.3-1.2 2.7-1.2 1.3 1.2 2.6 1.2S16.7 15 18 15" />
    </svg>
  );
}

export function Tree({ className }: IconProps) {
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
      <path d="M10 2.8 5.8 9h8.4L10 2.8Z" />
      <path d="M10 7 4.2 14.2h11.6L10 7Z" />
      <path d="M10 14.2v3.3M6.5 17.5h7" />
    </svg>
  );
}

export function Play({ className }: IconProps) {
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
      <circle cx="10" cy="10" r="7" />
      <path d="M10 3c2.1 2 3.2 4.3 3.2 7s-1.1 5-3.2 7M10 3C7.9 5 6.8 7.3 6.8 10s1.1 5 3.2 7" />
      <path d="M3 10h14" />
    </svg>
  );
}

export function Track({ className }: IconProps) {
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
      <rect x="1.5" y="5" width="17" height="10" rx="5" />
      <rect x="5" y="8" width="10" height="4" rx="2" />
    </svg>
  );
}

export function Racket({ className }: IconProps) {
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
      <ellipse cx="11.5" cy="7.5" rx="5" ry="5.5" transform="rotate(20 11.5 7.5)" />
      <path d="M8.2 11.8 4 17.5M7.9 5.6l6.5 4.6M12.4 3.2l-3.7 8.6" />
    </svg>
  );
}

export function Grill({ className }: IconProps) {
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
      <path d="M3 8.5h14a7 7 0 0 1-3.5 5.6L15 17.5M5 17.5l1.5-3.4A7 7 0 0 1 3 8.5Z" />
      <path d="M8 5.5c0-1 1-1.3 1-2.3.8.6 1.2 1.3 1.2 2.3M11.5 5.5c0-.7.6-1 .6-1.7.6.4.9.9.9 1.7" />
    </svg>
  );
}

export function Car({ className }: IconProps) {
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
      <path d="M3 13.5v-3l1.6-4A1.5 1.5 0 0 1 6 5.5h8a1.5 1.5 0 0 1 1.4 1l1.6 4v3" />
      <path d="M3 10.5h14" />
      <path d="M4 13.5v1.8M16 13.5v1.8M5.5 12h1.5M13 12h1.5" />
    </svg>
  );
}

export function Plug({ className }: IconProps) {
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
      <path d="M6.5 3v4M13.5 3v4" />
      <path d="M4.5 7h11v2.5a5.5 5.5 0 0 1-5.5 5.5A5.5 5.5 0 0 1 4.5 9.5V7Z" />
      <path d="M10 15v2.5" />
    </svg>
  );
}

export function SmartHome({ className }: IconProps) {
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
      <path d="M3 8.8 10 3.5l7 5.3v7.2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.8Z" />
      <path d="M7.9 12.4a3 3 0 0 1 4.2 0M9.4 14.3h1.2" />
    </svg>
  );
}

export function Paw({ className }: IconProps) {
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
      <ellipse cx="6.2" cy="7.2" rx="1.7" ry="2.2" />
      <ellipse cx="13.8" cy="7.2" rx="1.7" ry="2.2" />
      <ellipse cx="3.6" cy="11.8" rx="1.5" ry="1.8" />
      <ellipse cx="16.4" cy="11.8" rx="1.5" ry="1.8" />
      <path d="M10 10.2c2.2 0 4 1.9 4 4a2.6 2.6 0 0 1-3.7 2.4 1 1 0 0 0-.6 0A2.6 2.6 0 0 1 6 14.2c0-2.1 1.8-4 4-4Z" />
    </svg>
  );
}

export function Wave({ className }: IconProps) {
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
      <path d="M1.5 7.5c1.4 0 1.4 1.3 2.8 1.3S5.7 7.5 7.1 7.5s1.4 1.3 2.9 1.3 1.4-1.3 2.8-1.3 1.4 1.3 2.8 1.3S17 7.5 18.5 7.5" />
      <path d="M1.5 11.5c1.4 0 1.4 1.3 2.8 1.3s1.4-1.3 2.8-1.3 1.4 1.3 2.9 1.3 1.4-1.3 2.8-1.3 1.4 1.3 2.8 1.3S17 11.5 18.5 11.5" />
      <path d="M1.5 15.5c1.4 0 1.4 1.3 2.8 1.3s1.4-1.3 2.8-1.3 1.4 1.3 2.9 1.3 1.4-1.3 2.8-1.3 1.4 1.3 2.8 1.3 1.4-1.3 2.9-1.3" />
    </svg>
  );
}
