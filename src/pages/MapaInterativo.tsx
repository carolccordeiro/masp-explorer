import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { MaspHeader } from '@/components/MaspHeader';
import { exhibitions } from '@/data/exhibitions';
import { useLanguage } from '@/contexts/LanguageContext';

interface FloorInfo {
  id: string;
  name: string;
  building: string;
  description: string;
  highlights: string[];
}

const floors: FloorInfo[] = [
  {
    id: 'vao-livre',
    name: 'Vão Livre',
    building: 'Edifício Lina Bo Bardi',
    description: 'O icônico vão livre de 74 metros, espaço público aberto que abriga feiras, eventos e manifestações culturais.',
    highlights: ['Feiras de antiguidades aos domingos', 'Eventos culturais', 'Espaço aberto ao público'],
  },
  {
    id: '1-subsolo',
    name: '1º Subsolo',
    building: 'Edifício Lina Bo Bardi',
    description: 'Andar dedicado às exposições temporárias. Atualmente abriga as principais mostras em cartaz.',
    highlights: ['Exposições temporárias', 'Galeria de arte contemporânea', 'Espaço educativo'],
  },
  {
    id: '2-subsolo',
    name: '2º Subsolo',
    building: 'Edifício Lina Bo Bardi',
    description: 'Espaço para exposições de videoarte, desenho e instalações de menor escala.',
    highlights: ['Sala de vídeo', 'Exposições de desenho', 'Instalações'],
  },
  {
    id: '1-andar',
    name: '1º Andar',
    building: 'Edifício Lina Bo Bardi',
    description: 'Espaço administrativo e educativo do museu, incluindo o centro de documentação.',
    highlights: ['Centro de documentação', 'Programa educativo', 'Ateliê'],
  },
  {
    id: '2-andar',
    name: '2º Andar',
    building: 'Edifício Lina Bo Bardi',
    description: 'Abriga o Acervo em Transformação, apresentado nos icônicos cavaletes de cristal projetados por Lina Bo Bardi.',
    highlights: ['Cavaletes de cristal', 'Acervo permanente', 'Obras de Van Gogh, Renoir, Rafael'],
  },
  {
    id: 'pmb-terreo',
    name: 'Térreo',
    building: 'Edifício Pietro Maria Bardi',
    description: 'Inaugurado em 2024, abriga o restaurante MASP A Baianeira e a loja do museu.',
    highlights: ['Restaurante MASP A Baianeira', 'Loja MASP', 'Bilheteria'],
  },
  {
    id: 'pmb-subsolo',
    name: 'Subsolo',
    building: 'Edifício Pietro Maria Bardi',
    description: 'Espaço para exposições e programação cultural no novo edifício.',
    highlights: ['Exposições temporárias', 'Auditório', 'Espaço multiuso'],
  },
];

export default function MapaInterativo() {
  const [selectedFloor, setSelectedFloor] = useState<FloorInfo | null>(null);
  const [activeBuilding, setActiveBuilding] = useState<string>('Edifício Lina Bo Bardi');
  const { t } = useLanguage();

  const buildings = ['Edifício Lina Bo Bardi', 'Edifício Pietro Maria Bardi'];
  const filteredFloors = floors.filter((f) => f.building === activeBuilding);

  const getExhibitionsForFloor = (floorName: string) =>
    exhibitions.filter((e) => e.floor === floorName);

  return (
    <div className="min-h-screen bg-background">
      <MaspHeader />

      <div className="px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-foreground mb-2">{t('mapa.titulo')}</h1>
          <p className="text-muted-foreground text-sm mb-8">{t('mapa.subtitulo')}</p>
        </motion.div>

        {/* Building selector */}
        <div className="flex gap-2 mb-6">
          {buildings.map((b) => (
            <button
              key={b}
              onClick={() => { setActiveBuilding(b); setSelectedFloor(null); }}
              className={`flex-1 py-3 px-4 text-xs font-bold text-center border transition-colors ${
                activeBuilding === b
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-foreground hover:border-primary'
              }`}
            >
              {b.replace('Edifício ', '')}
            </button>
          ))}
        </div>

        {/* Visual floor stack */}
        <div className="space-y-2 mb-8">
          {filteredFloors.map((floor, i) => {
            const expos = getExhibitionsForFloor(floor.name);
            const isSelected = selectedFloor?.id === floor.id;

            return (
              <motion.div
                key={floor.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <button
                  onClick={() => setSelectedFloor(isSelected ? null : floor)}
                  className={`w-full text-left border transition-colors ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'
                  }`}
                >
                  <div className="flex items-center gap-4 p-4">
                    <div className={`w-16 h-16 flex items-center justify-center border-2 shrink-0 ${
                      isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground'
                    }`}>
                      <span className="text-xs font-black text-center leading-tight">{floor.name}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground">{floor.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{floor.description}</p>
                      {expos.length > 0 && (
                        <p className="text-xs text-primary font-semibold mt-1">
                          {expos.length} {expos.length === 1 ? 'exposição' : 'exposições'} em cartaz
                        </p>
                      )}
                    </div>
                    <ChevronRight className={`w-5 h-5 shrink-0 transition-transform ${isSelected ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
                  </div>
                </button>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-x border-b border-primary"
                    >
                      <div className="p-4 space-y-4">
                        <div>
                          <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">{t('mapa.destaques')}</p>
                          <div className="flex flex-wrap gap-2">
                            {floor.highlights.map((h) => (
                              <span key={h} className="text-xs px-2 py-1 bg-muted text-foreground">
                                {h}
                              </span>
                            ))}
                          </div>
                        </div>

                        {expos.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">{t('mapa.exposicoes')}</p>
                            <div className="space-y-2">
                              {expos.map((expo) => (
                                <div key={expo.id} className="flex items-center gap-3 p-2 bg-muted">
                                  <img src={expo.image} alt={expo.title} className="w-12 h-12 object-cover shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-sm font-bold text-foreground truncate">{expo.artist}</p>
                                    <p className="text-xs text-muted-foreground truncate">{expo.title}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
