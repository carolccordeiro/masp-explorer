import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { MaspHeader } from '@/components/MaspHeader';
import { exhibitions } from '@/data/exhibitions';
import { useLanguage } from '@/contexts/LanguageContext';

interface FloorInfo {
  id: string;
  name: string;
  nameEn: string;
  building: string;
  buildingEn: string;
  description: string;
  descriptionEn: string;
  highlights: string[];
  highlightsEn: string[];
}

const floors: FloorInfo[] = [
  {
    id: 'vao-livre',
    name: 'Vão Livre',
    nameEn: 'Free Span',
    building: 'Edifício Lina Bo Bardi',
    buildingEn: 'Lina Bo Bardi Building',
    description: 'O icônico vão livre de 74 metros, espaço público aberto que abriga feiras, eventos e manifestações culturais.',
    descriptionEn: 'The iconic 74-meter free span, a public open space hosting fairs, events and cultural gatherings.',
    highlights: ['Feiras de antiguidades aos domingos', 'Eventos culturais', 'Espaço aberto ao público'],
    highlightsEn: ['Antique fairs on Sundays', 'Cultural events', 'Open to the public'],
  },
  {
    id: '1-subsolo',
    name: '1º Subsolo',
    nameEn: '1st Underground',
    building: 'Edifício Lina Bo Bardi',
    buildingEn: 'Lina Bo Bardi Building',
    description: 'Andar dedicado às exposições temporárias. Atualmente abriga as principais mostras em cartaz.',
    descriptionEn: 'Floor dedicated to temporary exhibitions. Currently houses the main shows on view.',
    highlights: ['Exposições temporárias', 'Galeria de arte contemporânea', 'Espaço educativo'],
    highlightsEn: ['Temporary exhibitions', 'Contemporary art gallery', 'Educational space'],
  },
  {
    id: '2-subsolo',
    name: '2º Subsolo',
    nameEn: '2nd Underground',
    building: 'Edifício Lina Bo Bardi',
    buildingEn: 'Lina Bo Bardi Building',
    description: 'Espaço para exposições de videoarte, desenho e instalações de menor escala.',
    descriptionEn: 'Space for video art exhibitions, drawing and smaller-scale installations.',
    highlights: ['Sala de vídeo', 'Exposições de desenho', 'Instalações'],
    highlightsEn: ['Video room', 'Drawing exhibitions', 'Installations'],
  },
  {
    id: '1-andar',
    name: '1º Andar',
    nameEn: '1st Floor',
    building: 'Edifício Lina Bo Bardi',
    buildingEn: 'Lina Bo Bardi Building',
    description: 'Espaço administrativo e educativo do museu, incluindo o centro de documentação.',
    descriptionEn: 'Museum administrative and educational space, including the documentation center.',
    highlights: ['Centro de documentação', 'Programa educativo', 'Ateliê'],
    highlightsEn: ['Documentation center', 'Educational program', 'Atelier'],
  },
  {
    id: '2-andar',
    name: '2º Andar',
    nameEn: '2nd Floor',
    building: 'Edifício Lina Bo Bardi',
    buildingEn: 'Lina Bo Bardi Building',
    description: 'Abriga o Acervo em Transformação, apresentado nos icônicos cavaletes de cristal projetados por Lina Bo Bardi.',
    descriptionEn: 'Hosts the Collection in Transformation, presented on the iconic crystal easels designed by Lina Bo Bardi.',
    highlights: ['Cavaletes de cristal', 'Acervo permanente', 'Obras de Van Gogh, Renoir, Rafael'],
    highlightsEn: ['Crystal easels', 'Permanent collection', 'Works by Van Gogh, Renoir, Rafael'],
  },
  {
    id: 'pmb-terreo',
    name: 'Térreo',
    nameEn: 'Ground Floor',
    building: 'Edifício Pietro Maria Bardi',
    buildingEn: 'Pietro Maria Bardi Building',
    description: 'Inaugurado em 2024, abriga o restaurante MASP A Baianeira e a loja do museu.',
    descriptionEn: 'Inaugurated in 2024, houses the MASP A Baianeira restaurant and the museum store.',
    highlights: ['Restaurante MASP A Baianeira', 'Loja MASP', 'Bilheteria'],
    highlightsEn: ['MASP A Baianeira Restaurant', 'MASP Store', 'Ticket office'],
  },
  {
    id: 'pmb-subsolo',
    name: 'Subsolo',
    nameEn: 'Underground',
    building: 'Edifício Pietro Maria Bardi',
    buildingEn: 'Pietro Maria Bardi Building',
    description: 'Espaço para exposições e programação cultural no novo edifício.',
    descriptionEn: 'Space for exhibitions and cultural programming in the new building.',
    highlights: ['Exposições temporárias', 'Auditório', 'Espaço multiuso'],
    highlightsEn: ['Temporary exhibitions', 'Auditorium', 'Multipurpose space'],
  },
];

export default function MapaInterativo() {
  const [selectedFloor, setSelectedFloor] = useState<FloorInfo | null>(null);
  const [activeBuilding, setActiveBuilding] = useState<string>('Edifício Lina Bo Bardi');
  const { t, lang } = useLanguage();

  // Helpers de localizacao: devolvem os campos certos conforme idioma
  const fName = (f: FloorInfo) => (lang === 'en' ? f.nameEn : f.name);
  const fBuilding = (f: FloorInfo) => (lang === 'en' ? f.buildingEn : f.building);
  const fDescription = (f: FloorInfo) => (lang === 'en' ? f.descriptionEn : f.description);
  const fHighlights = (f: FloorInfo) => (lang === 'en' ? f.highlightsEn : f.highlights);

  const buildings = ['Edifício Lina Bo Bardi', 'Edifício Pietro Maria Bardi'];
  const filteredFloors = floors.filter((f) => f.building === activeBuilding);
  const activeBuildingLabel = lang === 'en'
    ? activeBuilding.replace('Edifício Lina Bo Bardi', 'Lina Bo Bardi Building').replace('Edifício Pietro Maria Bardi', 'Pietro Maria Bardi Building')
    : activeBuilding;

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
            {activeBuildingLabel}
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
                        {fName(floor)}
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
              {lang === 'en' ? 'exhibitions on the floor' : 'número de exposições no andar'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 border-t border-dashed border-primary" />
              {lang === 'en' ? 'street level, Paulista Ave.' : 'nível da rua, Av. Paulista'}
            </span>
            <span>{lang === 'en' ? 'Tap to see details' : 'Toque para ver detalhes'}</span>
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
                      <span className="text-xs font-black text-center leading-tight">{fName(floor)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground">{fName(floor)}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{fDescription(floor)}</p>
                      {expos.length > 0 && (
                        <p className="text-xs text-primary font-semibold mt-1">
                          {expos.length} {lang === 'en'
                            ? (expos.length === 1 ? 'exhibition' : 'exhibitions') + ' on view'
                            : (expos.length === 1 ? 'exposição' : 'exposições') + ' em cartaz'}
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
                            {fHighlights(floor).map((h) => (
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
