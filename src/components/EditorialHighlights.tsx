import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Calendar } from 'lucide-react';
import { exhibitions } from '@/data/exhibitions';
import { useLanguage } from '@/contexts/LanguageContext';

export function EditorialHighlights() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  // Pull only exhibitions that are physically on view right now, not the acervo
  // (kept separately on the Coleção page) or the upcoming Damián Ortega.
  const featured = exhibitions.filter((e) => e.id !== 'acervo' && !e.upcoming).slice(0, 6);

  return (
    <section className="px-6 pt-2 pb-4">
      <div className="flex items-end justify-between mb-4">
        <div>
          <span className="editorial-eyebrow">
            <span className="editorial-rule-long" />
            {lang === 'en' ? 'Now on view' : 'Em cartaz no museu'}
          </span>
          <h2 className="font-display text-3xl text-foreground mt-2 leading-[1.05]">
            {lang === 'en' ? 'Exhibitions' : 'Exposições'}
          </h2>
        </div>
        <button
          onClick={() => navigate('/colecao')}
          className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary inline-flex items-center gap-1 hover:gap-2 transition-all"
        >
          {lang === 'en' ? 'See all' : 'Ver todas'} <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 marquee-fade -mx-6 px-6 snap-x snap-mandatory">
        {featured.map((expo, i) => (
          <motion.button
            key={expo.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => navigate('/colecao')}
            className="snap-start shrink-0 w-[220px] text-left group"
          >
            <div className="relative w-full h-[260px] overflow-hidden bg-muted">
              <img
                src={expo.image}
                alt={expo.title}
                className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-[1.04]"
                loading="lazy"
              />
              {expo.isMainExhibition && (
                <span className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-[0.18em] bg-primary text-primary-foreground px-2 py-1">
                  {lang === 'en' ? 'Featured' : 'Destaque'}
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
              {expo.dates && (
                <div className="absolute bottom-2 left-3 right-3 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                  <Calendar className="w-3 h-3" />
                  <span>{expo.dates}</span>
                </div>
              )}
            </div>
            <p className="editorial-eyebrow mt-3 text-[9px]">{expo.floor}</p>
            <p className="font-display text-lg text-foreground leading-tight mt-1 line-clamp-2 group-hover:text-primary transition-colors">
              {expo.title}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{expo.artist}</p>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
