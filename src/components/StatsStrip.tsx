import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export function StatsStrip() {
  const { lang } = useLanguage();
  const stats = [
    { value: '11K', suffix: '+', label: lang === 'en' ? 'Artworks' : 'Obras no acervo' },
    { value: '1947', suffix: '', label: lang === 'en' ? 'Founded' : 'Fundação' },
    { value: '74', suffix: 'm', label: lang === 'en' ? 'Free span' : 'Vão livre' },
    { value: '2', suffix: '', label: lang === 'en' ? 'Buildings' : 'Edifícios' },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mx-6 mb-2 grid grid-cols-4 border-y border-border"
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`px-3 py-5 text-center ${i > 0 ? 'border-l border-border' : ''}`}
        >
          <div className="flex items-baseline justify-center gap-0.5">
            <span className="font-display text-3xl md:text-4xl text-primary leading-none">
              {s.value}
            </span>
            {s.suffix && (
              <span className="font-display text-xl text-primary leading-none">
                {s.suffix}
              </span>
            )}
          </div>
          <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground mt-2">
            {s.label}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
