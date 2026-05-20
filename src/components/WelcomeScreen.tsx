import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [accepted, setAccepted] = useState(false);
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] bg-primary text-primary-foreground flex flex-col overflow-hidden"
    >
      {/* Top rail: heavy hairline + meta in caps, like a brutalist signage strip */}
      <motion.header
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative z-10 flex items-center justify-between px-10 py-7 border-b-2 border-primary-foreground/15"
      >
        <span className="text-[9px] sm:text-[10px] font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase whitespace-nowrap">
          Totem oficial · Av. Paulista 1578
        </span>
        <span className="text-[9px] sm:text-[10px] font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase whitespace-nowrap">
          MASP · 2026
        </span>
      </motion.header>

      {/* Massive M / P typography occupying the canvas, à la Lina Bo Bardi signage */}
      <div aria-hidden className="absolute inset-0 pointer-events-none select-none">
        <span className="absolute -top-10 -left-6 text-[clamp(20rem,46vw,46rem)] font-black leading-[0.8] tracking-[-0.08em] text-primary-foreground/10">
          M
        </span>
        <span className="absolute -bottom-32 -right-12 text-[clamp(20rem,46vw,46rem)] font-black leading-[0.8] tracking-[-0.08em] text-primary-foreground/10">
          P
        </span>
      </div>

      {/* Hero block: left-aligned, brutalist grid */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-10 md:px-16">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[11px] font-black tracking-[0.42em] uppercase text-primary-foreground/80 inline-flex items-center gap-3"
        >
          <span className="block w-12 h-[2px] bg-primary-foreground/80" />
          Bem-vindo ao
        </motion.span>

        <motion.h1
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.32, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-black text-[clamp(7rem,18vw,18rem)] tracking-[-0.06em] leading-[0.82] mt-4"
        >
          MASP
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-32 h-1 bg-primary-foreground mt-8 origin-left"
        />

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-lg md:text-2xl font-bold tracking-tight max-w-2xl mt-8 leading-tight"
        >
          Museu de Arte de São Paulo Assis Chateaubriand.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="text-sm md:text-base font-normal text-primary-foreground/80 max-w-2xl mt-4 leading-tight"
        >
          Roteiro personalizado para sua visita.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="text-[10px] tracking-[0.32em] uppercase text-primary-foreground/60 mt-6 font-medium"
        >
          Sua sessão é anônima · Sem login, sem cadastro
        </motion.p>
      </div>

      {/* Bottom block: consent + CTA. Heavy borders, sharp corners. */}
      <motion.footer
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.4 }}
        className="relative z-10 border-t-2 border-primary-foreground/15 px-10 md:px-16 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div className="max-w-md">
          {/* LGPD reescrito curto e amigavel apos auditoria UX. O texto longo
              estava assustando visitantes nao-tech. */}
          <p className="text-[11px] text-primary-foreground leading-relaxed mb-3">
            <span className="font-bold">Visita anônima.</span>{' '}
            Não pedimos nome, e-mail ou CPF.
          </p>
          <label className="flex items-start gap-3 cursor-pointer group">
            <button
              type="button"
              onClick={() => setAccepted(!accepted)}
              aria-pressed={accepted}
              aria-label="Concordo com a política de privacidade do MASP"
              className={`w-5 h-5 border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                accepted
                  ? 'bg-primary-foreground border-primary-foreground'
                  : 'border-primary-foreground/60 group-hover:border-primary-foreground'
              }`}
            >
              {accepted && (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  width="12" height="12" viewBox="0 0 14 14" fill="none"
                >
                  <path d="M2 7L5.5 10.5L12 3.5" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              )}
            </button>
            <span className="text-[11px] text-primary-foreground/80 leading-relaxed">
              Concordo com a Política de Privacidade do MASP (LGPD)
            </span>
          </label>
        </div>

        <motion.button
          onClick={() => accepted && onStart()}
          disabled={!accepted}
          whileTap={accepted ? { scale: 0.98 } : {}}
          className={`shrink-0 px-12 py-5 text-xs font-black tracking-[0.32em] uppercase transition-colors border-2 ${
            accepted
              ? 'bg-primary-foreground text-primary border-primary-foreground cursor-pointer hover:bg-transparent hover:text-primary-foreground'
              : 'bg-transparent text-primary-foreground/40 border-primary-foreground/30 cursor-not-allowed'
          }`}
        >
          {t('welcome.start')}
        </motion.button>
      </motion.footer>
    </motion.div>
  );
}
