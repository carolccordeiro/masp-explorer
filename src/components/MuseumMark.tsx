import type { MuseumMeta } from "@/data/types";

/** Sigla do museu; pinta com o acento a letra que a identidade destaca (ex.: o "A" do MAM). */
export function MuseumMark({ m, className }: { m: Pick<MuseumMeta, "short" | "accent" | "brandMark">; className?: string }) {
  if (m.brandMark == null) return <span className={className}>{m.short}</span>;
  return (
    <span className={className}>
      {m.short.split("").map((ch, i) => (
        <span key={i} style={i === m.brandMark ? { color: m.accent } : undefined}>
          {ch}
        </span>
      ))}
    </span>
  );
}
