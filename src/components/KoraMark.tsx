import { cn } from "@/lib/utils";

/** Marca KORA: monograma em bloco arredondado + ponto de status (o "olhar" da IA). */
export function KoraIcon({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="18" fill="currentColor" />
      <path d="M21 16v32M21 34l17-18M27 28l14 20" stroke="rgb(var(--bg))" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="46" cy="18" r="5" fill="rgb(var(--accent))" />
    </svg>
  );
}

export function KoraWordmark({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-display font-extrabold tracking-[-0.04em]", className)}>
      <KoraIcon size={size === "lg" ? 44 : size === "md" ? 30 : 24} className="text-ink" />
      <span className={cn(size === "lg" ? "text-[34px]" : size === "md" ? "text-[22px]" : "text-[18px]")}>kora</span>
    </span>
  );
}
