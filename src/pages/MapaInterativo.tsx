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

  // Ordenar floors de cima pra baixo, igual ao SVG do mapa
  const floorPriority = (id: string) => {
    if (id === '2-andar') return 0;
    if (id === '1-andar') return 1;
    if (id === 'vao-livre' || id === 'pmb-terreo') return 2;
    if (id === '1-subsolo' || id === 'pmb-subsolo') return 3;
    if (id === '2-subsolo') return 4;
    return 5;
  };
  const orderedFloors = [...filteredFloors].sort((a, b) => floorPriority(a.id) - floorPriority(b.id));

  // Match flexivel pra cruzar floor name do exhibitions (ex: "1º Andar Lina Bo Bardi")
  // com floor name do mapa (ex: "1º Andar"). Tambem trata caso "Lina Bo Bardi" sozinho.
  const getExhibitionsForFloor = (floor: FloorInfo) => {
    const buildingShort = floor.building.replace('Edifício ', '');
    return exhibitions.filter((e) => {
      if (!e.floor) return false;
      // Match exato (ex: "Vão Livre")
      if (e.floor === floor.name) return true;
      // Match com nome+edifício (ex: "1º Andar Lina Bo Bardi" pra floor.name "1º Andar")
      if (e.floor.startsWith(floor.name) && e.floor.includes(buildingShort)) return true;
      return false;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <MaspHeader />

      <div className="px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <span className="editorial-eyebrow"><span className="editorial-rule" />MASP</span>
          <h1 className="text-3xl font-black text-foreground mt-2 leading-tight">{t('mapa.titulo')}</h1>
          <p className="text-muted-foreground text-sm mt-2 mb-8">{t('mapa.subtitulo')}</p>
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

        {/* Visual schematic, vertical stack of floors with top-down order.
            Each rectangle is clickable and syncs with the expandable list below. */}
        <div className="mb-6 border border-border bg-muted/20 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            {activeBuilding}
          </p>

          {(() => {
            // Order floors from top to bottom of the building.
            const priority = (id: string) => {
              if (id === '2-andar') return 0;
              if (id === '1-andar') return 1;
              if (id === 'vao-livre' || id === 'pmb-terreo') return 2;
              if (id === '1-subsolo' || id === 'pmb-subsolo') return 3;
              if (id === '2-subsolo') return 4;
              return 5;
            };
            const ordered = [...filteredFloors].sort((a, b) => priority(a.id) - priority(b.id));
            const rowH = 36;
            const groundIdx = ordered.findIndex((f) => f.id === 'vao-livre' || f.id === 'pmb-terreo');
            const totalH = ordered.length * rowH + 24;

            return (
              <svg
                viewBox={`0 0 320 ${totalH}`}
                className="w-full h-auto max-w-md mx-auto block"
                role="img"
                aria-label={`Corte esquemático do ${activeBuilding}`}
              >
                <defs>
                  <pattern id="hash" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="6" stroke="hsl(var(--muted-foreground) / 0.25)" strokeWidth="1" />
                  </pattern>
                </defs>

                {ordered.map((floor, i) => {
                  const y = 12 + i * rowH;
                  const isSelected = selectedFloor?.id === floor.id;
                  const isGround = floor.id === 'vao-livre' || floor.id === 'pmb-terreo';
                  const expoCount = getExhibitionsForFloor(floor).length;

                  return (
                    <g
                      key={floor.id}
                      onClick={() => setSelectedFloor(isSelected ? null : floor)}
                      style={{ cursor: 'pointer' }}
                    >
                      <rect
                        x="40"
                        y={y}
                        width="240"
                        height={rowH - 4}
                        fill={isSelected ? 'hsl(var(--primary))' : isGround ? 'url(#hash)' : 'hsl(var(--background))'}
                        stroke={isSelected ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                        strokeWidth="1.5"
                      />
                      <text
                        x="52"
                        y={y + (rowH - 4) / 2}
                        fontSize="13"
                        fontWeight="700"
                        fontFamily="inherit"
                        fill={isSelected ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))'}
                        dominantBaseline="middle"
                      >
                        {floor.name}
                      </text>
                      {expoCount > 0 && (
                        <g>
                          <circle
                            cx="265"
                            cy={y + (rowH - 4) / 2}
                            r="11"
                            fill={isSelected ? 'hsl(var(--primary-foreground))' : 'hsl(var(--primary))'}
                          />
                          <text
                            x="265"
                            y={y + (rowH - 4) / 2}
                            fontSize="12"
                            fontWeight="800"
                            fontFamily="inherit"
                            fill={isSelected ? 'hsl(var(--primary))' : 'hsl(var(--primary-foreground))'}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            {expoCount}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Ground line drawn in the gap between the ground floor row and the first subsoil */}
                {groundIdx >= 0 && (() => {
                  const groundY = 12 + (groundIdx + 1) * rowH - 2;
                  return (
                    <line
                      x1="20"
                      y1={groundY}
                      x2="300"
                      y2={groundY}
                      stroke="hsl(var(--primary))"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  );
                })()}

                {/* Side rule */}
                <line x1="34" y1="6" x2="34" y2={totalH - 6} stroke="hsl(var(--border))" strokeWidth="1.5" />
              </svg>
            );
          })()}

          <div className="flex items-center justify-between mt-3 text-[10px] text-muted-foreground gap-2 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 bg-primary rounded-full" />
              número de exposições no andar
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 border-t border-dashed border-primary" />
              nível da rua, Av. Paulista
            </span>
            <span>Toque para ver detalhes</span>
          </div>
        </div>

        {/* Visual floor stack, ordenado de cima pra baixo igual ao SVG */}
        <div className="space-y-2 mb-8">
          {orderedFloors.map((floor, i) => {
            const expos = getExhibitionsForFloor(floor);
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
