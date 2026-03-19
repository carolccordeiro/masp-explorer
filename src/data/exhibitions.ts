export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year?: string;
  image: string;
  description: string;
}

export interface Exhibition {
  id: string;
  title: string;
  artist: string;
  description: string;
  duration: number;
  floor: string;
  image: string;
  category: string;
  isMainExhibition?: boolean;
  artworks?: Artwork[];
}

export const exhibitions: Exhibition[] = [
  {
    id: '1',
    title: 'Pop andino',
    artist: 'La Chola Poblete',
    description: 'Exposição que explora a estética pop andina, misturando referências da cultura popular dos Andes com a arte contemporânea. La Chola Poblete cria obras vibrantes que questionam identidade, gênero e colonialismo.',
    duration: 30,
    floor: '1º Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae22b861cf27ea79234cc_1XGXWFIRwoiOOU0zUTNu-Ojik4VH6cZWtTFTJBpKt%20(1).jpg',
    category: 'Arte Contemporânea',
    isMainExhibition: true,
    artworks: [
      { id: '1-1', title: 'Virgem do Cerro', artist: 'La Chola Poblete', year: '2023', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae22b861cf27ea79234cc_1XGXWFIRwoiOOU0zUTNu-Ojik4VH6cZWtTFTJBpKt%20(1).jpg', description: 'Pintura que reinterpreta iconografia andina com estética pop' },
      { id: '1-2', title: 'Chola Power', artist: 'La Chola Poblete', year: '2022', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae22b861cf27ea79234cc_1XGXWFIRwoiOOU0zUTNu-Ojik4VH6cZWtTFTJBpKt%20(1).jpg', description: 'Série de retratos que celebram a identidade chola' },
    ],
  },
  {
    id: '2',
    title: 'Réplica',
    artist: 'Sandra Gamarra Heshiki',
    description: 'Sandra Gamarra Heshiki questiona a história da arte e os museus através de pinturas que replicam e subvertem obras canônicas, revelando narrativas ocultas e relações de poder colonial.',
    duration: 40,
    floor: '1º Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae1742e4f18d134b0a6a9_j8wDMCouaIgUhcak21ZG-xEWgQ2DgKFdsLFb9uETI.jpg',
    category: 'Pintura',
    artworks: [
      { id: '2-1', title: 'Museu do Esquecimento', artist: 'Sandra Gamarra Heshiki', year: '2023', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae1742e4f18d134b0a6a9_j8wDMCouaIgUhcak21ZG-xEWgQ2DgKFdsLFb9uETI.jpg', description: 'Pintura que replica obras de museus europeus para questionar a propriedade cultural' },
    ],
  },
  {
    id: '3',
    title: 'Viver tecendo',
    artist: 'Claudia Alarcón & Silät',
    description: 'Exposição que apresenta a tradição têxtil Wichí do norte da Argentina. As tecelãs do coletivo Silät criam obras que entrelaçam conhecimento ancestral, resistência cultural e arte contemporânea.',
    duration: 25,
    floor: '1º Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae173ea428cf79c31a06b_p1eX1K7OuzyUpTN7uhoh-HQmymEGGYfLm7RPxaIRY.jpg',
    category: 'Têxtil',
    artworks: [
      { id: '3-1', title: 'Mapa do Território Wichí', artist: 'Silät', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae173ea428cf79c31a06b_p1eX1K7OuzyUpTN7uhoh-HQmymEGGYfLm7RPxaIRY.jpg', description: 'Tecido monumental que mapeia o território ancestral Wichí' },
    ],
  },
  {
    id: '4',
    title: 'Sala de Vídeo',
    artist: 'Clara Ianni',
    description: 'Videoarte que investiga as relações entre poder, território e memória no contexto brasileiro contemporâneo.',
    duration: 20,
    floor: '2º Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/698e0789d036961a573fad73_EDT_still_site.jpg',
    category: 'Videoarte',
  },
  {
    id: '5',
    title: 'Ecologia social',
    artist: 'Minerva Cuevas',
    description: 'Minerva Cuevas explora as interseções entre ecologia, economia e política através de instalações, pinturas e intervenções que questionam sistemas de exploração e consumo.',
    duration: 35,
    floor: '1º Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69370f02beead80798cd47a1_Site_banner_MC_01.png',
    category: 'Instalação',
    artworks: [
      { id: '5-1', title: 'Del Montte', artist: 'Minerva Cuevas', year: '2023', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69370f02beead80798cd47a1_Site_banner_MC_01.png', description: 'Instalação que questiona o monopólio de corporações na agricultura' },
    ],
  },
  {
    id: '6',
    title: 'Ser imagem',
    artist: 'André Taniki Yanomami',
    description: 'Primeira exposição individual de André Taniki Yanomami no MASP, apresentando desenhos que documentam a cosmologia, mitologia e o cotidiano do povo Yanomami.',
    duration: 25,
    floor: '2º Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/693c5cef57a818c2e90bdc48__MG_1816-copy%20copy.jpg',
    category: 'Desenho',
    artworks: [
      { id: '6-1', title: 'Xapiri', artist: 'André Taniki Yanomami', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/693c5cef57a818c2e90bdc48__MG_1816-copy%20copy.jpg', description: 'Desenho que representa os espíritos xapiri da cosmologia Yanomami' },
    ],
  },
  {
    id: '7',
    title: 'Mogaje Guihu: A árvore da vida e da abundância',
    artist: 'Abel Rodríguez',
    description: 'Abel Rodríguez, conhecedor botânico do povo Nonuya da Amazônia colombiana, apresenta pinturas detalhadas que documentam a biodiversidade da floresta tropical.',
    duration: 20,
    floor: '2º Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/68ff6b07eeee7c1739d94aef_C%C3%B3pia%20de%20Abel%20Rodri%CC%81guez.jpg',
    category: 'Pintura',
    artworks: [
      { id: '7-1', title: 'Ciclo Anual da Floresta', artist: 'Abel Rodríguez', year: '2020', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/68ff6b07eeee7c1739d94aef_C%C3%B3pia%20de%20Abel%20Rodri%CC%81guez.jpg', description: 'Pintura detalhada do ciclo das árvores na floresta amazônica' },
    ],
  },
  {
    id: '8',
    title: 'O Outro, Eu e os Outros',
    artist: 'Iván Argote',
    description: 'Iván Argote cria instalações e vídeos que provocam reflexões sobre monumentos, história colonial e relações humanas, convidando o público a repensar narrativas oficiais.',
    duration: 30,
    floor: '1º Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/68877d1f22041eb041e9f2e5__DSC5111%20(1).jpg',
    category: 'Instalação',
    artworks: [
      { id: '8-1', title: 'Monumento ao Esquecido', artist: 'Iván Argote', year: '2023', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/68877d1f22041eb041e9f2e5__DSC5111%20(1).jpg', description: 'Escultura que questiona monumentos coloniais' },
    ],
  },
  {
    id: '9',
    title: 'Acervo em Transformação',
    artist: 'Coletivo',
    description: 'Exposição permanente que apresenta o acervo do MASP de forma inovadora, utilizando os icônicos cavaletes de cristal de Lina Bo Bardi. Com mais de 11 mil obras, o acervo abrange arte europeia, brasileira, africana, asiática e das Américas.',
    duration: 60,
    floor: '2º Andar',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg',
    category: 'Acervo',
    artworks: [
      { id: '9-1', title: 'A Estudante', artist: 'Amedeo Modigliani', year: '1918', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Retrato característico do estilo de Modigliani com pescoço alongado' },
      { id: '9-2', title: 'Rosa e Azul', artist: 'Pierre-Auguste Renoir', year: '1881', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Retrato das filhas do banqueiro Cahen, uma das obras mais conhecidas do MASP' },
      { id: '9-3', title: 'O Escolar', artist: 'Vincent van Gogh', year: '1888', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Retrato de um jovem estudante pintado durante o período em Arles' },
      { id: '9-4', title: 'Ressurreição de Cristo', artist: 'Rafael Sanzio', year: '1502', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Obra renascentista de Rafael, parte do acervo desde a fundação do museu' },
      { id: '9-5', title: 'Cinco Moças de Guaratinguetá', artist: 'Emiliano Di Cavalcanti', year: '1930', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Uma das obras mais emblemáticas do modernismo brasileiro' },
      { id: '9-6', title: 'A Negra', artist: 'Tarsila do Amaral', year: '1923', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Obra icônica do modernismo brasileiro que retrata a herança africana' },
      { id: '9-7', title: 'Abaporu', artist: 'Tarsila do Amaral', year: '1928', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'A obra mais valiosa da arte brasileira, marco do Movimento Antropofágico' },
      { id: '9-8', title: 'Natureza morta com maçãs', artist: 'Paul Cézanne', year: '1895', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Natureza morta do pós-impressionista francês' },
    ],
  },
  {
    id: '10',
    title: 'Histórias LGBTQIA+',
    artist: 'Diversos artistas',
    description: 'Exposição que reúne obras que exploram identidades, vivências e narrativas LGBTQIA+ na arte, promovendo a diversidade e a inclusão no espaço museológico.',
    duration: 30,
    floor: '1º Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/67d078a508438d83117a472a_Sala-de-Video--Janaina-Wagner-.jpg',
    category: 'Videoarte',
    artworks: [
      { id: '10-1', title: 'Corpo Político', artist: 'Diversos', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/67d078a508438d83117a472a_Sala-de-Video--Janaina-Wagner-.jpg', description: 'Videoinstalação sobre identidades e corpos dissidentes' },
    ],
  },
];

export const allArtworks: Artwork[] = exhibitions.flatMap(
  (expo) => (expo.artworks || []).map((art) => ({ ...art, exhibition: expo.title }))
);
