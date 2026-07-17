/**
 * Original single-stroke eucalyptus sprig — the site's botanical voice.
 * Line-art on purpose: no watercolour rasters (Canva licensing + it would
 * imitate rather than interpret the flyer). Strokes carry `pathLength=1`
 * so draw-on animation is a plain dashoffset 1 → 0.
 */
export function Sprig({
  className,
  flip = false,
  title,
}: {
  className?: string;
  flip?: boolean;
  title?: string;
}) {
  const leaves: string[] = [
    "M59 140 Q 44 136 34 124",
    "M60 124 Q 76 120 85 107",
    "M59 108 Q 44 104 36 92",
    "M60 92  Q 75 88 83 75",
    "M59 76  Q 45 72 38 61",
    "M60 61  Q 74 57 80 45",
    "M60 47  Q 48 43 43 33",
    "M62 34  Q 73 30 77 20",
  ];
  return (
    <svg
      viewBox="0 0 120 160"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      fill="none"
    >
      {title ? <title>{title}</title> : null}
      {/* stem */}
      <path
        className="sprig-stroke"
        d="M60 156 C 58 128 62 104 59 78 C 57 56 61 34 66 12"
        stroke="var(--sage)"
        strokeWidth="1.6"
        strokeLinecap="round"
        pathLength={1}
      />
      {leaves.map((d, i) => (
        <path
          key={i}
          className="sprig-stroke"
          d={d}
          stroke="var(--sage)"
          strokeWidth="1.3"
          strokeLinecap="round"
          pathLength={1}
        />
      ))}
      {/* gold buds */}
      <circle className="sprig-bud" cx="68" cy="9" r="2" fill="var(--gold)" />
      <circle className="sprig-bud" cx="79" cy="18" r="1.5" fill="var(--gold)" />
      <circle className="sprig-bud" cx="45" cy="31" r="1.5" fill="var(--gold)" />
    </svg>
  );
}
