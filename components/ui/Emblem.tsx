import type { SVGProps } from "react";

/** Razor crest: double ring, straight razor and "FH" monogram. */
export function Emblem({ size = 40, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true" {...props}>
      <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 3" opacity="0.6" />
      {/* Straight razor, drawn behind the monogram */}
      <path d="M31 69 L63 30 Q68 25 72 29 Q74 32 70 36 L38 74 Z" fill="currentColor" opacity="0.14" />
      <path
        d="M31 69 L63 30 Q68 25 72 29 Q74 32 70 36 L38 74"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        opacity="0.7"
      />
      <path d="M34.5 71.5 L24 84" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontFamily="var(--font-syne), sans-serif"
        fontWeight="800"
        fontSize="23"
        letterSpacing="1"
        fill="currentColor"
      >
        FH
      </text>
    </svg>
  );
}
