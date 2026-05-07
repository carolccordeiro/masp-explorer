import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { exhibitions } from '@/data/exhibitions';
import { useLanguage } from '@/contexts/LanguageContext';

export function EditorialHighlights() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const featured = exhibitions.slice(0, 6);

  return (
    <section className="px-6 pb-4">
      <div className="flex items-end justify-between mb-3">
        <div>
          <span className="editorial-eyebrow">
            <span className="editorial-rule" />
            {lang === 'en' ? 'Now on view' : 'Em cartaz'}
          </span>
          <h2 className="text-lg font-black text-foreground mt-1 leading-tight">
            {lang === 'en' ? 'Exhibitions' : 'Exposições'}
          </h2>
        </div>
        <button
          onClick={() => navigate('/informacoes')}
          className="text-[11px] font-bold uppercase tracking-wider text-primary inline-flex items-center gap-1"
        >
          {lang === 'en' ? 'See all' : 'Ver todas'} <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 marquee-fade -mx-6 px-6 snap-x snap-mandatory">
        {featured.map((expo, i) => (
          <motion.button
            key={expo.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate('/colecao')}
            className="snap-start shrink-0 w-[180px] text-left group"
          >
            <div className="relative w-full h-[120px] overflow-hidden border border-border">
              <img
                src={expo.image}
                alt={expo.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {expo.isMainExhibition && (
                <span className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-wider bg-primary text-primary-foreground px-1.5 py-0.5">
                  {lang === 'en' ? 'Main' : 'Principal'}
                </span>
              )}
            </div>
            <p className="editorial-eyebrow mt-2 text-[9px]">{expo.floor}</p>
            <p className="text-sm font-bold text-foreground leading-tight mt-0.5 line-clamp-2 group-hover:text-primary transition-colors">
              {expo.artist}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-1 italic">{expo.title}</p>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
