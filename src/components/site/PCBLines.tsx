/**
 * Subtle PCB-style connection line decorations inspired by the brand mark.
 * Renders SVGs with copper strokes and small "node" circles.
 */

export function PCBLines({
  className = "",
  variant = "left",
  opacity = 0.35,
}: {
  className?: string;
  variant?: "left" | "right" | "divider" | "corner";
  opacity?: number;
}) {
  const stroke = "var(--copper)";

  if (variant === "divider") {
    return (
      <svg
        className={className}
        viewBox="0 0 1200 40"
        fill="none"
        aria-hidden
        style={{ opacity }}
        preserveAspectRatio="none"
      >
        <path
          d="M0 20 H180 L200 8 H420 L440 32 H660 L680 20 H900 L920 8 H1200"
          stroke={stroke}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {[180, 420, 660, 900].map((cx, i) => (
          <circle key={i} cx={cx} cy={i % 2 === 0 ? 20 : 32} r="2.5" fill={stroke} />
        ))}
      </svg>
    );
  }

  if (variant === "right") {
    return (
      <svg
        className={className}
        viewBox="0 0 300 400"
        fill="none"
        aria-hidden
        style={{ opacity }}
      >
        <g stroke={stroke} strokeWidth="1" strokeLinecap="round">
          <path d="M300 60 L220 60 L200 80 L120 80" />
          <path d="M300 140 L180 140 L160 160 L60 160" />
          <path d="M300 220 L240 220 L220 240 L140 240" />
          <path d="M300 300 L200 300 L180 320 L80 320" />
        </g>
        {[
          [120, 80],
          [60, 160],
          [140, 240],
          [80, 320],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="4" fill="none" stroke={stroke} strokeWidth="1.25" />
            <circle cx={cx} cy={cy} r="1.5" fill={stroke} />
          </g>
        ))}
      </svg>
    );
  }

  if (variant === "corner") {
    return (
      <svg
        className={className}
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden
        style={{ opacity }}
      >
        <g stroke={stroke} strokeWidth="1" strokeLinecap="round">
          <path d="M0 40 L60 40 L80 60 L160 60" />
          <path d="M0 100 L40 100 L60 120 L200 120" />
        </g>
        <circle cx="160" cy="60" r="3.5" fill="none" stroke={stroke} strokeWidth="1.25" />
        <circle cx="160" cy="60" r="1.25" fill={stroke} />
      </svg>
    );
  }

  // left (default)
  return (
    <svg
      className={className}
      viewBox="0 0 300 400"
      fill="none"
      aria-hidden
      style={{ opacity }}
    >
      <g stroke={stroke} strokeWidth="1" strokeLinecap="round">
        <path d="M0 60 L80 60 L100 80 L180 80" />
        <path d="M0 140 L120 140 L140 160 L240 160" />
        <path d="M0 220 L60 220 L80 240 L160 240" />
        <path d="M0 300 L100 300 L120 320 L220 320" />
      </g>
      {[
        [0, 60],
        [0, 140],
        [0, 220],
        [0, 300],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx + 4} cy={cy} r="4" fill="none" stroke={stroke} strokeWidth="1.25" />
          <circle cx={cx + 4} cy={cy} r="1.5" fill={stroke} />
        </g>
      ))}
    </svg>
  );
}
