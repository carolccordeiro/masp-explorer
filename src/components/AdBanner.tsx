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
    <div className="px-6 pb-4">
      <div className="relative border border-border bg-background overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={ad.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-[1fr_220px]"
          >
            <div className="relative h-44 md:h-auto md:min-h-[160px] overflow-hidden">
              <motion.div
                key={`img-${ad.id}`}
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 6, ease: 'easeOut' }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${ad.image})` }}
                role="img"
                aria-label={ad.brand}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10" />
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-background/95 backdrop-blur px-2 py-1">
                <Megaphone className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">
                  {lang === 'en' ? 'Sponsored' : 'Anúncio'}
                </span>
              </div>
            </div>

            <div className="p-5 md:p-6 flex flex-col justify-center md:border-l md:border-border">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">
                {ad.brand}
              </p>
              <h3 className="text-lg md:text-xl font-black text-foreground leading-tight tracking-tight mb-2">
                {lang === 'en' ? ad.headlineEn : ad.headline}
              </h3>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                {lang === 'en' ? ad.taglineEn : ad.tagline}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <MapPin className="w-3 h-3 text-primary shrink-0" />
                <span>{ad.address}</span>
                <span className="text-primary font-bold ml-2">{ad.distance}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slim progress bar at the bottom indicates rotation cadence */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted-foreground/10">
          <motion.div
            key={`bar-${ad.id}`}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 6, ease: 'linear' }}
            className="h-full bg-primary"
          />
        </div>

        <div className="absolute bottom-3 right-3 flex gap-1">
          {ads.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-6 h-0.5 transition-colors ${
                i === index ? 'bg-primary' : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
              }`}
              aria-label={`Anúncio ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground/60 mt-2 text-right">
        {lang === 'en' ? 'Want to advertise here? Contact Flexmedia.' : 'Quer anunciar aqui? Fale com a Flexmedia.'}
      </p>
    </div>
  );
}
