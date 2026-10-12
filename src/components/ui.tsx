import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: "sm" | "md" | "lg"; icon?: ReactNode }
>(({ className, variant = "primary", size = "md", icon, children, ...p }, ref) => (
  <button
    ref={ref}
    className={cn(
      "tap inline-flex items-center justify-center gap-2 rounded-full font-semibold select-none disabled:opacity-40 disabled:pointer-events-none",
      size === "sm" && "h-9 px-4 text-[13px]",
      size === "md" && "h-11 px-5 text-[15px]",
      size === "lg" && "h-14 px-7 text-[17px]",
      variant === "primary" && "bg-accent text-accent-ink shadow-soft hover:brightness-110",
      variant === "secondary" && "bg-ink text-bg hover:opacity-90",
      variant === "ghost" && "bg-ink/[0.06] text-ink hover:bg-ink/10",
      variant === "outline" && "border hairline bg-surface text-ink hover:bg-ink/[0.03]",
      className,
    )}
    {...p}
  >
    {icon}
    {children}
  </button>
));
Button.displayName = "Button";

export const IconButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { label: string; active?: boolean }>(
  ({ className, label, active, children, ...p }, ref) => (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      className={cn(
        "tap grid h-10 w-10 place-items-center rounded-full transition-colors",
        active ? "bg-accent text-accent-ink" : "bg-ink/[0.06] text-ink hover:bg-ink/10",
        className,
      )}
      {...p}
    >
      {children}
    </button>
  ),
);
IconButton.displayName = "IconButton";

export function Chip({ on, className, children, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { on?: boolean }) {
  return (
    <button aria-pressed={on} className={cn("chip tap whitespace-nowrap", on && "chip-on", className)} {...p}>
      {children}
    </button>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode }[];
  className?: string;
}) {
  return (
    <div role="radiogroup" className={cn("inline-flex rounded-full bg-ink/[0.06] p-1", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-150",
            value === o.value ? "bg-surface text-ink shadow-soft" : "text-muted hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn("relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-150", checked ? "bg-success" : "bg-ink/30")}
    >
      <span
        className={cn(
          "absolute top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.25)] transition-transform duration-150",
          checked ? "translate-x-[22px]" : "translate-x-[2px]",
        )}
      />
    </button>
  );
}

export function StatusDot({ color = "success", className }: { color?: "success" | "danger" | "warning" | "accent"; className?: string }) {
  const c = { success: "bg-success", danger: "bg-danger", warning: "bg-warning", accent: "bg-accent" }[color];
  return (
    <span className={cn("relative inline-flex h-2 w-2", className)}>
      <span className={cn("absolute inset-0 rounded-full animate-pulse-dot", c)} />
      <span className={cn("relative h-2 w-2 rounded-full", c)} />
    </span>
  );
}

export function SectionTitle({ eyebrow, title, action, className }: { eyebrow?: string; title: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("mb-4 flex items-end justify-between gap-4", className)}>
      <div>
        {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
        <h2 className="text-[22px] font-extrabold leading-tight md:text-[26px]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Stat({ value, label, className }: { value: ReactNode; label: ReactNode; className?: string }) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="num text-[34px] leading-none md:text-[44px]">{value}</div>
      <div className="mt-1.5 text-[12px] font-semibold text-muted">{label}</div>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-2xl", className)} />;
}

export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={cn("mx-auto w-full max-w-6xl px-4 pb-32 pt-4 md:px-8 md:pt-8", className)}>{children}</main>;
}
