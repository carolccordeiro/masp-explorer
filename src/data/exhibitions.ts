export interface Exhibition {
  id: string;
  title: string;
  artist: string;
  description: string;
  duration: number; // estimated minutes
  floor: string;
  image: string;
  category: string;
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
  },
];
