/** Isotipo: terrazas escalonadas abstractas dentro de un sello. */
export function Isotipo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden className="shrink-0">
      <circle cx="24" cy="24" r="22" fill="var(--maiz)" stroke="var(--cacao)" strokeWidth="3" />
      <path d="M8 34h32v-5h-6v-5h-6v-5h-8v5h-6v5H8z" fill="var(--andino)" stroke="var(--cacao)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 38h20" stroke="var(--arcilla)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="12" r="3.5" fill="var(--crema)" stroke="var(--cacao)" strokeWidth="2" />
    </svg>
  );
}

/** Lettering vectorial RAÍCES: grueso, redondeado, inclinado, con contorno cacao y sombra desplazada. */
export function Wordmark({ className = "", height = 40 }: { className?: string; height?: number }) {
  const text = (
    <text x="8" y="58" fontFamily="Lilita One, sans-serif" fontSize="60" letterSpacing="-1" transform="skewX(-10) translate(10 0)">
      RAÍCES
    </text>
  );
  return (
    <svg viewBox="0 0 250 76" height={height} className={className} role="img" aria-label="RAÍCES">
      <g fill="var(--cacao)" stroke="var(--cacao)" strokeWidth="10" strokeLinejoin="round" transform="translate(5 5)">{text}</g>
      <g fill="var(--cacao)" stroke="var(--cacao)" strokeWidth="10" strokeLinejoin="round">{text}</g>
      <g fill="var(--maiz)" stroke="var(--crema)" strokeWidth="3" strokeLinejoin="round" paintOrder="stroke">{text}</g>
    </svg>
  );
}

export function Logo({ height = 36 }: { height?: number }) {
  return (
    <span className="flex items-center gap-2">
      <Isotipo size={height} />
      <Wordmark height={height} />
    </span>
  );
}

export function Sello({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-label="Cocina Boliviana">
      <defs>
        <path id="sc" d="M60 60m-42 0a42 42 0 1 1 84 0a42 42 0 1 1 -84 0" />
      </defs>
      <circle cx="60" cy="60" r="56" fill="var(--maiz)" stroke="var(--cacao)" strokeWidth="4" />
      <circle cx="60" cy="60" r="30" fill="var(--andino)" stroke="var(--cacao)" strokeWidth="3" />
      <path d="M42 70h36v-6h-8v-6h-8v-6h-4v6h-8v6h-8z" fill="var(--maiz)" />
      <text fontFamily="Lilita One" fontSize="15" fill="var(--cacao)" letterSpacing="2">
        <textPath href="#sc">COCINA BOLIVIANA • COCINA BOLIVIANA •</textPath>
      </text>
    </svg>
  );
}
