// MA drawn as one continuous trace, with nodes on its vertices and an offset copy for depth.
const TRACE = "M6 42 L6 6 L22 30 L38 6 L38 42 L49 6 L60 42";
const BAR = "M41.7 30 L56.3 30";
const NODES: [number, number][] = [
  [6, 42],
  [22, 30],
  [38, 42],
  [49, 6],
  [60, 42],
];

type Props = {
  size?: number;
  className?: string;
  /** Show the vertex nodes. */
  nodes?: boolean;
  /** Show the offset depth stroke. */
  depth?: boolean;
  title?: string;
  /** Stroke weight in viewBox units; lower it for large sizes. */
  weight?: number;
};

export function Monogram({ size = 28, className = "", nodes = true, depth = true, title, weight = 3.4 }: Props) {
  return (
    <svg
      viewBox="0 0 68 50"
      width={(size * 68) / 50}
      height={size}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {depth && (
        <g data-mono-depth stroke="var(--color-accent)" strokeOpacity={0.35} strokeWidth={weight * 0.75} transform="translate(2.6 2.6)">
          <path d={TRACE} pathLength={1} strokeDasharray={1} />
          <path d={BAR} pathLength={1} strokeDasharray={1} />
        </g>
      )}
      <g data-mono-trace stroke="currentColor" strokeWidth={weight}>
        <path d={TRACE} pathLength={1} strokeDasharray={1} />
        <path d={BAR} pathLength={1} strokeDasharray={1} />
      </g>
      {nodes &&
        NODES.map(([x, y]) => (
          <circle key={`${x}-${y}`} data-mono-node cx={x} cy={y} r={weight * 0.85} fill="var(--color-paper)" stroke="var(--color-accent)" strokeWidth={weight * 0.5} />
        ))}
    </svg>
  );
}
