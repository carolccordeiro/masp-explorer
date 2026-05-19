import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowUpRight } from 'lucide-react';
import { exhibitions } from '@/data/exhibitions';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Carrossel das proximas exposicoes do ciclo curatorial "Historias
 * Latino-Americanas" do MASP 2026. Aparece logo depois das em cartaz
 * na home, sinalizado com badge "Em breve".
 */
export function UpcomingExhibitions() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const upcoming = exhibitions.filter((e) => e.upcoming);
  if (upcoming.length === 0) return null;

  return (
    <section className="px-6 pt-2 pb-4">
      <div className="flex items-end justify-between mb-4">
        <div>
          <span className="editorial-eyebrow">
            <span className="editorial-rule-long" />
            {lang === 'en' ? 'Coming up in 2026' : 'Em breve no MASP'}
          </span>
          <h2 className="font-display text-3xl text-foreground mt-2 uppercase">
            {lang === 'en' ? 'Upcoming exhibitions' : 'Próximas exposições'}
          </h2>
        </div>
        <button
          onClick={() => navigate('/sobre-masp')}
          className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary inline-flex items-center gap-1 hover:gap-2 transition-all shrink-0"
        >
          {lang === 'en' ? 'About MASP' : 'Sobre o MASP'} <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 marquee-fade -mx-6 px-6 snap-x snap-mandatory">
        {upcoming.map((expo, i) => (
          <motion.div
            key={expo.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="snap-start shrink-0 w-[220px] sm:w-[240px] border-2 border-foreground bg-background flex flex-col"
          >
            <div className="relative h-[180px] overflow-hidden bg-muted">
              <img
                src={expo.image}
                alt={expo.title}
                className="w-full h-full object-cover opacity-90"
                loading="lazy"
              />
              <span className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-[0.22em] bg-foreground text-background px-2 py-1">
                {lang === 'en' ? 'Upcoming' : 'Em breve'}
              </span>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                {expo.dates}
              </span>
              <p className="font-display text-lg text-foreground leading-tight mt-2 line-clamp-2">
                {expo.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{expo.artist}</p>
              <p className="text-[10px] text-muted-foreground mt-2">{expo.floor}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
