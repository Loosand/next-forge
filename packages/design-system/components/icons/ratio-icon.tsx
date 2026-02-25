import { cn } from "@repo/design-system/lib/utils";

function parseRatio(ratio: string): [number, number] {
  const parts = ratio.split(":").map(Number);
  if (parts.length === 2 && parts[0] > 0 && parts[1] > 0) {
    return [parts[0], parts[1]];
  }
  return [1, 1];
}

export function RatioIcon({
  className,
  ratio,
}: {
  className?: string;
  ratio: string;
}) {
  const [w, h] = parseRatio(ratio);
  const maxDim = 10;
  const scale = maxDim / Math.max(w, h);
  const rw = w * scale;
  const rh = h * scale;
  const x = (16 - rw) / 2;
  const y = (16 - rh) / 2;

  return (
    <svg className={cn("size-5", className)} fill="none" viewBox="0 0 16 16">
      <rect
        fill="none"
        height={rh - 1}
        rx={1.5}
        ry={1.5}
        stroke="currentColor"
        strokeWidth={1}
        width={rw - 1}
        x={x + 0.5}
        y={y + 0.5}
      />
    </svg>
  );
}
