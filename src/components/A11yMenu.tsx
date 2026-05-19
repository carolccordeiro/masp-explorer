import { useState, useRef, useEffect } from 'react';
import { Accessibility, X, Type, Contrast, Zap } from 'lucide-react';
import { useA11y } from '@/contexts/AccessibilityContext';

/**
 * Botão pequeno no header que abre um popover com as preferências de
 * acessibilidade do totem: tamanho de fonte (A-/A/A+), alto contraste
 * e reduce motion. As preferências são persistidas em localStorage e
 * aplicadas como classes no <html>.
 */
export function A11yMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { fontScale, setFontScale, highContrast, toggleHighContrast, reduceMotion, toggleReduceMotion } = useA11y();

  // Fecha o popover quando clica fora dele
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 transition-colors ${
          open ? 'text-primary' : 'text-muted-foreground hover:text-primary'
        }`}
        aria-label="Preferências de acessibilidade"
        aria-expanded={open}
      >
        <Accessibility className="w-4 h-4" />
        <span className="text-xs font-bold uppercase hidden sm:inline">Acessib.</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Acessibilidade"
          className="absolute right-0 top-full mt-3 w-80 bg-background border-2 border-foreground z-50 shadow-[6px_6px_0_0_hsl(var(--primary))]"
        >
          <div className="flex items-center justify-between border-b-2 border-foreground p-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              Acessibilidade
            </span>
            <button
              onClick={() => setOpen(false)}
              className="w-6 h-6 flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
              aria-label="Fechar"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Tamanho de fonte */}
          <div className="p-4 border-b-2 border-foreground">
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-4 h-4 text-foreground" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-foreground">
                Tamanho do texto
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['sm', 'md', 'lg'] as const).map((size) => {
                const isActive = fontScale === size;
                const label = size === 'sm' ? 'A-' : size === 'md' ? 'A' : 'A+';
                const fs = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg';
                return (
                  <button
                    key={size}
                    onClick={() => setFontScale(size)}
                    aria-pressed={isActive}
                    className={`py-3 font-display ${fs} border-2 transition-colors ${
                      isActive
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-background text-foreground border-foreground/30 hover:border-foreground'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Alto contraste */}
          <div className="p-4 border-b-2 border-foreground">
            <label className="flex items-center gap-3 cursor-pointer">
              <Contrast className="w-4 h-4 text-foreground shrink-0" />
              <div className="flex-1">
                <span className="block text-xs font-bold uppercase tracking-[0.18em] text-foreground">
                  Alto contraste
                </span>
                <span className="block text-[10px] text-muted-foreground mt-1">
                  Mais legibilidade pra baixa visão
                </span>
              </div>
              <button
                type="button"
                onClick={toggleHighContrast}
                role="switch"
                aria-checked={highContrast}
                className={`w-12 h-7 border-2 border-foreground relative transition-colors shrink-0 ${
                  highContrast ? 'bg-primary' : 'bg-background'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-foreground transition-all ${
                    highContrast ? 'left-[22px] bg-primary-foreground' : 'left-0.5'
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Reduce motion */}
          <div className="p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <Zap className="w-4 h-4 text-foreground shrink-0" />
              <div className="flex-1">
                <span className="block text-xs font-bold uppercase tracking-[0.18em] text-foreground">
                  Reduzir movimento
                </span>
                <span className="block text-[10px] text-muted-foreground mt-1">
                  Diminui animações e transições
                </span>
              </div>
              <button
                type="button"
                onClick={toggleReduceMotion}
                role="switch"
                aria-checked={reduceMotion}
                className={`w-12 h-7 border-2 border-foreground relative transition-colors shrink-0 ${
                  reduceMotion ? 'bg-primary' : 'bg-background'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-foreground transition-all ${
                    reduceMotion ? 'left-[22px] bg-primary-foreground' : 'left-0.5'
                  }`}
                />
              </button>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
