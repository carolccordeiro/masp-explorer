import { cn } from "@/lib/utils";

/** Cor do ponto da marca (o "olhar" da KORA). */
export const KORA_DOT = "#A53324";

/**
 * Marca KORA: duas linhas que se cruzam sobre uma base, formando o K,
 * com o ponto vermelho acima. `size` é a altura aproximada em px.
 */
export function KoraIcon({ size = 32, className, dot = KORA_DOT }: { size?: number; className?: string; dot?: string }) {
  const h = size * 0.62;
  return (
    <svg width={h * (920 / 500)} height={h} viewBox="87 424 920 500" className={cn("shrink-0", className)} aria-hidden="true">
      <g fill="currentColor">
        <polygon points="87,510 562,870 479,870 87,576" />
        <polygon points="457,785 1007,430 1007,493 498,820" />
        <rect x="87" y="870" width="920" height="52" />
      </g>
      <circle cx="457.5" cy="483.5" r="58" fill={dot} />
    </svg>
  );
}

export function KoraWordmark({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-display font-extrabold tracking-[-0.04em]", className)}>
      <KoraIcon size={size === "lg" ? 60 : size === "md" ? 44 : 36} className="text-ink" />
      <span className={cn(size === "lg" ? "text-[34px]" : size === "md" ? "text-[22px]" : "text-[18px]")}>kora</span>
    </span>
  );
}
