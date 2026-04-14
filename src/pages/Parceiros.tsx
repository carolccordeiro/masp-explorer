import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Clock, Utensils, BookOpen } from 'lucide-react';
import { MaspHeader } from '@/components/MaspHeader';
import { useLanguage } from '@/contexts/LanguageContext';

interface Partner {
  id: string;
  name: string;
  type: string;
  typeEn: string;
  description: string;
  descriptionEn: string;
  address: string;
  distance: string;
  hours: string;
  hoursEn: string;
  image: string;
  icon: React.ReactNode;
}

const partners: Partner[] = [
  {
    id: 'balaio',
    name: 'Restaurante Balaio',
    type: 'Restaurante',
    typeEn: 'Restaurant',
    description: 'Restaurante de culinária brasileira contemporânea, com pratos que celebram a diversidade gastronômica do Brasil. Localizado na região da Avenida Paulista, é uma ótima opção para almoço ou jantar após a visita ao MASP.',
    descriptionEn: 'Contemporary Brazilian cuisine restaurant, with dishes celebrating the gastronomic diversity of Brazil. Located in the Avenida Paulista area, it is a great option for lunch or dinner after visiting MASP.',
    address: 'R. Pamplona, 1024 – Jardim Paulista, São Paulo',
    distance: '~400m do MASP',
    hours: 'Terça a Sexta: 12h às 15h e 19h às 23h | Sábado: 12h às 23h | Domingo: 12h às 17h',
    hoursEn: 'Tue-Fri: 12pm-3pm & 7pm-11pm | Sat: 12pm-11pm | Sun: 12pm-5pm',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    icon: <Utensils className="w-6 h-6" />,
  },
  {
    id: 'livraria-da-vila',
    name: 'Livraria da Vila',
    type: 'Livraria',
    typeEn: 'Bookstore',
    description: 'Livraria referência em São Paulo, com um acervo diversificado de livros de arte, arquitetura, design e literatura. A loja próxima ao MASP oferece um ambiente acolhedor para explorar publicações relacionadas às exposições do museu.',
    descriptionEn: 'A leading bookstore in São Paulo, with a diverse collection of books on art, architecture, design and literature. The store near MASP offers a welcoming environment to explore publications related to the museum\'s exhibitions.',
    address: 'R. Fradique Coutinho, 915 – Pinheiros / Al. Lorena, 1731 – Jardim Paulista',
    distance: '~600m do MASP (unidade Lorena)',
    hours: 'Segunda a Sábado: 10h às 22h | Domingo: 12h às 20h',
    hoursEn: 'Mon-Sat: 10am-10pm | Sun: 12pm-8pm',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    icon: <BookOpen className="w-6 h-6" />,
  },
];

export default function Parceiros() {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <MaspHeader />

      <div className="px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-foreground mb-2">{t('parceiros.titulo')}</h1>
          <p className="text-muted-foreground text-sm mb-8">{t('parceiros.subtitulo')}</p>
        </motion.div>

        <div className="space-y-6">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border border-border overflow-hidden"
            >
              <img
                src={partner.image}
                alt={partner.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {partner.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-foreground">{partner.name}</h3>
                    <span className="text-xs font-semibold uppercase text-primary tracking-wider">
                      {lang === 'en' ? partner.typeEn : partner.type}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {lang === 'en' ? partner.descriptionEn : partner.description}
                </p>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary" />
                    <span>{partner.address}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary font-bold shrink-0">{partner.distance}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary" />
                    <span>{lang === 'en' ? partner.hoursEn : partner.hours}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
