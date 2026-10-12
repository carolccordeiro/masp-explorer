import { cn } from "@/lib/utils";

/** Cor do ponto da marca (o "olhar" da KORA). */
export const KORA_DOT = "#A53324";

/* Geometria da marca (2026-10): K formado por duas linhas sobre uma base, ponto vermelho no topo. */
const MARK = (
  <>
    <polygon points="95,16 432,347 360,347 95,101" />
    <polygon points="603,7 603,95 378.6,294.7 330,246.5" />
    <rect x="95" y="347" width="508" height="67" />
  </>
);
const WORD = "M96 463H119.2V519.9L178.3 463H205.7L151.8 514.6L214.2 600H186.6L136 529.3L119.2 545.1V600H96ZM293.9 478.8Q275.8 478.8 265.2 492.9Q254.7 507 254.7 531.6Q254.7 556.2 265.2 570.3Q275.6 584.5 293.9 584.5Q311.9 584.5 322.4 570.3Q332.9 556.1 332.9 531.6Q332.9 507.3 322.4 493Q311.9 478.8 293.9 478.8ZM293.9 459.7Q323.2 459.7 340 478.8Q356.7 497.9 356.7 531.6Q356.7 565.3 340 584.4Q323.2 603.5 293.9 603.5Q264.4 603.5 247.7 584.4Q231 565.3 231 531.6Q231 497.9 247.7 478.8Q264.4 459.7 293.9 459.7ZM472.2 484Q468.5 481.8 464 480.8Q459.5 479.8 454.1 479.8Q435.1 479.8 424.8 492.2Q414.6 504.6 414.6 527.8V600H392V463H414.6V484.3Q421.7 471.8 433.1 465.8Q444.5 459.7 460.7 459.7Q463.1 459.7 465.9 460Q468.7 460.3 472.1 460.9ZM555.8 531.1Q528.5 531.1 518 537.4Q507.5 543.6 507.5 558.7Q507.5 570.6 515.4 577.7Q523.3 584.7 536.9 584.7Q555.6 584.7 566.9 571.4Q578.2 558.2 578.2 536.1V531.1ZM600.7 521.8V600H578.2V579.2Q570.5 591.7 559 597.6Q547.5 603.5 530.9 603.5Q509.8 603.5 497.4 591.7Q485 579.9 485 560.1Q485 537 500.5 525.3Q515.9 513.5 546.6 513.5H578.2V511.3Q578.2 495.8 568 487.3Q557.8 478.8 539.3 478.8Q527.6 478.8 516.4 481.6Q505.3 484.4 495 490V469.2Q507.4 464.5 519 462.1Q530.6 459.7 541.6 459.7Q571.4 459.7 586 475.1Q600.7 490.5 600.7 521.8Z";

/** Só o símbolo. `size` é a largura aproximada em px. */
export function KoraIcon({ size = 32, className, dot = KORA_DOT }: { size?: number; className?: string; dot?: string }) {
  const w = size * 0.8;
  return (
    <svg width={w} height={w * (407 / 508)} viewBox="95 7 508 407" className={cn("shrink-0", className)} aria-hidden="true">
      <g fill="currentColor">{MARK}</g>
      <circle cx="348.5" cy="57.5" r="37.5" fill={dot} />
    </svg>
  );
}

/** Logo completo empilhado (símbolo + "kora"), centralizado. `size` é a largura em px. */
export function KoraLogo({ size = 120, className, dot = KORA_DOT }: { size?: number; className?: string; dot?: string }) {
  return (
    <svg width={size} height={size * (604 / 516)} viewBox="91 3 516 604" className={cn("shrink-0", className)} role="img" aria-label="KORA">
      <g fill="currentColor">
        {MARK}
        <path d={WORD} />
      </g>
      <circle cx="348.5" cy="57.5" r="37.5" fill={dot} />
    </svg>
  );
}

export function KoraWordmark({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-display font-extrabold tracking-[-0.04em]", className)}>
      <KoraIcon size={size === "lg" ? 52 : size === "md" ? 38 : 30} className="text-ink" />
      <span className={cn(size === "lg" ? "text-[34px]" : size === "md" ? "text-[22px]" : "text-[18px]")}>kora</span>
    </span>
  );
}
