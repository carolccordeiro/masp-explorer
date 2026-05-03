import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Megaphone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Ad {
  id: string;
  brand: string;
  headline: string;
  headlineEn: string;
  tagline: string;
  taglineEn: string;
  address: string;
  distance: string;
  image: string;
}

const ads: Ad[] = [
  {
    id: 'balaio',
    brand: 'Restaurante Balaio',
    headline: 'Sabores do Brasil ao lado do MASP',
    headlineEn: 'Flavors of Brazil next to MASP',
    tagline: 'Culinária brasileira contemporânea',
    taglineEn: 'Contemporary Brazilian cuisine',
    address: 'R. Pamplona, 1024',
    distance: '~400m',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=300&fit=crop',
  },
  {
    id: 'livraria-da-vila',
    brand: 'Livraria da Vila',
    headline: 'Leve a arte para casa',
    headlineEn: 'Take art home with you',
    tagline: 'Livros de arte, design e arquitetura',
    taglineEn: 'Books on art, design and architecture',
    address: 'Al. Lorena, 1731',
    distance: '~600m',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=300&fit=crop',
  },
];

export function AdBanner() {
  const { lang } = useLanguage();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % ads.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const ad = ads[index];

  return (
    <div className="px-6 pb-2">
      <div className="relative border border-border overflow-hidden">
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 bg-background/90 px-2 py-1">
          <Megaphone className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">
            {lang === 'en' ? 'Sponsored' : 'Anúncio'}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={ad.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-[120px_1fr] md:grid-cols-[180px_1fr]"
          >
            <div
              className="bg-cover bg-center"
              style={{ backgroundImage: `url(${ad.image})` }}
              role="img"
              aria-label={ad.brand}
            />
            <div className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                {ad.brand}
              </p>
              <h3 className="text-sm md:text-base font-black text-foreground leading-tight mb-1">
                {lang === 'en' ? ad.headline : ad.headline}
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                {lang === 'en' ? ad.taglineEn : ad.tagline}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <MapPin className="w-3 h-3 text-primary shrink-0" />
                <span>{ad.address}</span>
                <span className="text-primary font-bold ml-1">{ad.distance}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-1 absolute bottom-2 right-2">
          {ads.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-1.5 h-1.5 transition-colors ${
                i === index ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
              aria-label={`Anúncio ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground/60 mt-1 text-center">
        {lang === 'en' ? 'Want to advertise here? Contact Flexmedia.' : 'Quer anunciar aqui? Fale com a Flexmedia.'}
      </p>
    </div>
  );
}
