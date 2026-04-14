import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      className="fixed inset-0 z-[100] bg-primary flex flex-col items-center justify-center px-8"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-[200px] font-black text-primary-foreground leading-none select-none">M</div>
        <div className="absolute bottom-10 right-10 text-[200px] font-black text-primary-foreground leading-none select-none">P</div>
      </div>

      {/* Logo */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 mb-8"
      >
        <h1 className="text-7xl md:text-9xl font-black text-primary-foreground tracking-tighter">
          MASP
        </h1>
        <p className="text-center text-primary-foreground/70 text-sm font-medium tracking-widest uppercase mt-2">
          Museu de Arte de São Paulo
        </p>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 text-primary-foreground/60 text-sm text-center mb-12 max-w-sm"
      >
        {t('welcome.subtitle')}
      </motion.p>

      {/* Consent checkbox */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="relative z-10 mb-8 max-w-sm"
      >
        <label className="flex items-start gap-3 cursor-pointer group">
          <div
            onClick={() => setAccepted(!accepted)}
            className={`w-6 h-6 border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
              accepted
                ? 'bg-primary-foreground border-primary-foreground'
                : 'border-primary-foreground/50 group-hover:border-primary-foreground'
            }`}
          >
            {accepted && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                width="14" height="14" viewBox="0 0 14 14" fill="none"
              >
                <path d="M2 7L5.5 10.5L12 3.5" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            )}
          </div>
          <span className="text-xs text-primary-foreground/70 leading-relaxed">
            {t('welcome.consent')}
          </span>
        </label>
      </motion.div>

      {/* Pulsing CTA button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="relative z-10"
      >
        <motion.button
          onClick={() => accepted && onStart()}
          disabled={!accepted}
          animate={accepted ? {
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 0 0 0 rgba(255,255,255,0.4)',
              '0 0 0 20px rgba(255,255,255,0)',
              '0 0 0 0 rgba(255,255,255,0)',
            ],
          } : {}}
          transition={accepted ? { repeat: Infinity, duration: 2, ease: 'easeInOut' } : {}}
          className={`px-12 py-5 text-lg font-black tracking-wide transition-all ${
            accepted
              ? 'bg-primary-foreground text-primary cursor-pointer hover:bg-primary-foreground/90'
              : 'bg-primary-foreground/20 text-primary-foreground/40 cursor-not-allowed'
          }`}
        >
          {t('welcome.start')}
        </motion.button>
      </motion.div>

      {/* Bottom decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 text-center z-10"
      >
        <p className="text-primary-foreground/30 text-xs">
          Av. Paulista, 1578 · São Paulo
        </p>
      </motion.div>
    </motion.div>
  );
}
