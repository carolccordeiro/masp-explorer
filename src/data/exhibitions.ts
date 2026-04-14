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
  dates?: string;
  isMainExhibition?: boolean;
  artworks?: Artwork[];
}

export const exhibitions: Exhibition[] = [
  {
    id: '1',
    title: 'Pop andino',
    artist: 'La Chola Poblete',
    description: 'Exposição que explora a estética pop andina, misturando referências da cultura popular dos Andes com a arte contemporânea. La Chola Poblete cria obras vibrantes que questionam identidade, gênero e colonialismo. A artista argentina, nascida em Mendoza, utiliza elementos da cultura andina, do catolicismo popular e da vivência travesti para compor obras que mesclam pintura, performance e instalação.',
    duration: 30,
    floor: '1º Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae22b861cf27ea79234cc_1XGXWFIRwoiOOU0zUTNu-Ojik4VH6cZWtTFTJBpKt%20(1).jpg',
    category: 'Arte Contemporânea',
    dates: '6.3 - 2.8.2026',
    isMainExhibition: true,
    artworks: [
      { id: '1-1', title: 'Virgem do Cerro', artist: 'La Chola Poblete', year: '2023', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae22b861cf27ea79234cc_1XGXWFIRwoiOOU0zUTNu-Ojik4VH6cZWtTFTJBpKt%20(1).jpg', description: 'Pintura que reinterpreta iconografia andina com estética pop, fundindo a imagem da Virgem Maria com paisagens dos Andes e símbolos da cultura chola.' },
      { id: '1-2', title: 'Chola Power', artist: 'La Chola Poblete', year: '2022', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae22b861cf27ea79234cc_1XGXWFIRwoiOOU0zUTNu-Ojik4VH6cZWtTFTJBpKt%20(1).jpg', description: 'Série de retratos que celebram a identidade chola, desafiando padrões de beleza e gênero impostos pela colonização.' },
      { id: '1-3', title: 'Pachamama Digital', artist: 'La Chola Poblete', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae22b861cf27ea79234cc_1XGXWFIRwoiOOU0zUTNu-Ojik4VH6cZWtTFTJBpKt%20(1).jpg', description: 'Instalação multimídia que conecta a reverência ancestral à Mãe Terra com a era digital, questionando a relação entre tecnologia e natureza.' },
      { id: '1-4', title: 'Carnaval Andino', artist: 'La Chola Poblete', year: '2023', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae22b861cf27ea79234cc_1XGXWFIRwoiOOU0zUTNu-Ojik4VH6cZWtTFTJBpKt%20(1).jpg', description: 'Pintura vibrante que retrata a energia e as cores do carnaval nos Andes, com referências a festas populares e rituais de resistência cultural.' },
    ],
  },
  {
    id: '2',
    title: 'Réplica',
    artist: 'Sandra Gamarra Heshiki',
    description: 'Sandra Gamarra Heshiki questiona a história da arte e os museus através de pinturas que replicam e subvertem obras canônicas, revelando narrativas ocultas e relações de poder colonial. Nascida em Lima, Peru, a artista cria um "museu fictício" que expõe como as instituições culturais perpetuam visões eurocêntricas.',
    duration: 40,
    floor: '1º Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae1742e4f18d134b0a6a9_j8wDMCouaIgUhcak21ZG-xEWgQ2DgKFdsLFb9uETI.jpg',
    category: 'Pintura',
    dates: '6.3 - 7.6.2026',
    artworks: [
      { id: '2-1', title: 'Museu do Esquecimento', artist: 'Sandra Gamarra Heshiki', year: '2023', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae1742e4f18d134b0a6a9_j8wDMCouaIgUhcak21ZG-xEWgQ2DgKFdsLFb9uETI.jpg', description: 'Pintura que replica obras de museus europeus para questionar a propriedade cultural e o saque colonial de patrimônio artístico.' },
      { id: '2-2', title: 'Loja de Souvenirs', artist: 'Sandra Gamarra Heshiki', year: '2022', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae1742e4f18d134b0a6a9_j8wDMCouaIgUhcak21ZG-xEWgQ2DgKFdsLFb9uETI.jpg', description: 'Instalação que transforma a loja de museu em espaço crítico, questionando a mercantilização da arte e da cultura.' },
      { id: '2-3', title: 'Natureza Morta Colonial', artist: 'Sandra Gamarra Heshiki', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae1742e4f18d134b0a6a9_j8wDMCouaIgUhcak21ZG-xEWgQ2DgKFdsLFb9uETI.jpg', description: 'Reinterpretação de naturezas-mortas europeias incluindo frutas e plantas nativas das Américas, questionando a invisibilização da biodiversidade colonial.' },
    ],
  },
  {
    id: '3',
    title: 'Viver tecendo',
    artist: 'Claudia Alarcón & Silät',
    description: 'Exposição que apresenta a tradição têxtil Wichí do norte da Argentina. As tecelãs do coletivo Silät criam obras que entrelaçam conhecimento ancestral, resistência cultural e arte contemporânea. Os tecidos documentam mapas territoriais, plantas medicinais e narrativas cosmológicas do povo Wichí.',
    duration: 25,
    floor: '1º Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae173ea428cf79c31a06b_p1eX1K7OuzyUpTN7uhoh-HQmymEGGYfLm7RPxaIRY.jpg',
    category: 'Têxtil',
    dates: '6.3 - 2.8.2026',
    artworks: [
      { id: '3-1', title: 'Mapa do Território Wichí', artist: 'Silät', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae173ea428cf79c31a06b_p1eX1K7OuzyUpTN7uhoh-HQmymEGGYfLm7RPxaIRY.jpg', description: 'Tecido monumental que mapeia o território ancestral Wichí, documentando rios, caminhos e lugares sagrados através de padrões tradicionais.' },
      { id: '3-2', title: 'Yuchán (Árvore Garrafa)', artist: 'Silät', year: '2023', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae173ea428cf79c31a06b_p1eX1K7OuzyUpTN7uhoh-HQmymEGGYfLm7RPxaIRY.jpg', description: 'Tecido que representa a árvore sagrada Yuchán, central na cosmologia Wichí, usando fibras naturais e técnicas ancestrais de tecelagem.' },
      { id: '3-3', title: 'Plantas Medicinais do Chaco', artist: 'Silät', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae173ea428cf79c31a06b_p1eX1K7OuzyUpTN7uhoh-HQmymEGGYfLm7RPxaIRY.jpg', description: 'Série de tecidos que catalogam as plantas medicinais do Gran Chaco, preservando conhecimento botânico ancestral em forma artística.' },
    ],
  },
  {
    id: '4',
    title: 'Sala de Vídeo',
    artist: 'Clara Ianni',
    description: 'Videoarte que investiga as relações entre poder, território e memória no contexto brasileiro contemporâneo. Clara Ianni utiliza a linguagem do vídeo para criar narrativas que questionam estruturas de vigilância, controle e memória histórica.',
    duration: 20,
    floor: '2º Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/698e0789d036961a573fad73_EDT_still_site.jpg',
    category: 'Videoarte',
    artworks: [
      { id: '4-1', title: 'Estado de Exceção', artist: 'Clara Ianni', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/698e0789d036961a573fad73_EDT_still_site.jpg', description: 'Vídeo que investiga a relação entre arquitetura institucional e poder, filmado em edifícios governamentais de Brasília.' },
      { id: '4-2', title: 'Trabalho de Campo', artist: 'Clara Ianni', year: '2023', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/698e0789d036961a573fad73_EDT_still_site.jpg', description: 'Documentário experimental sobre as transformações do território rural brasileiro e os conflitos de terra.' },
    ],
  },
  {
    id: '5',
    title: 'Ecologia social',
    artist: 'Minerva Cuevas',
    description: 'Minerva Cuevas explora as interseções entre ecologia, economia e política através de instalações, pinturas e intervenções que questionam sistemas de exploração e consumo. A artista mexicana cria obras que revelam como corporações multinacionais afetam comunidades locais e o meio ambiente.',
    duration: 35,
    floor: '1º Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69370f02beead80798cd47a1_Site_banner_MC_01.png',
    category: 'Instalação',
    dates: '5.12.2025 - 12.4.2026',
    artworks: [
      { id: '5-1', title: 'Del Montte', artist: 'Minerva Cuevas', year: '2023', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69370f02beead80798cd47a1_Site_banner_MC_01.png', description: 'Instalação que questiona o monopólio de corporações na agricultura, usando embalagens reapropriadas da marca Del Monte para revelar relações de exploração.' },
      { id: '5-2', title: 'Dissidência Orgânica', artist: 'Minerva Cuevas', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69370f02beead80798cd47a1_Site_banner_MC_01.png', description: 'Série de pinturas sobre pesticidas e sementes transgênicas, questionando o controle corporativo sobre a alimentação global.' },
      { id: '5-3', title: 'Hidrocarbonetos', artist: 'Minerva Cuevas', year: '2022', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69370f02beead80798cd47a1_Site_banner_MC_01.png', description: 'Obra que mapeia a cadeia de produção de petróleo e seus impactos ambientais e sociais em comunidades indígenas do México.' },
    ],
  },
  {
    id: '6',
    title: 'Ser imagem',
    artist: 'André Taniki Yanomami',
    description: 'Primeira exposição individual de André Taniki Yanomami no MASP, apresentando desenhos que documentam a cosmologia, mitologia e o cotidiano do povo Yanomami. Os desenhos revelam um universo visual rico, onde espíritos xapiri, animais da floresta e cenas da vida na aldeia se entrelaçam.',
    duration: 25,
    floor: '2º Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/693c5cef57a818c2e90bdc48__MG_1816-copy%20copy.jpg',
    category: 'Desenho',
    dates: '5.12.2025 - 12.4.2026',
    artworks: [
      { id: '6-1', title: 'Xapiri', artist: 'André Taniki Yanomami', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/693c5cef57a818c2e90bdc48__MG_1816-copy%20copy.jpg', description: 'Desenho que representa os espíritos xapiri da cosmologia Yanomami, seres luminosos que dançam e protegem a floresta.' },
      { id: '6-2', title: 'A Floresta Viva', artist: 'André Taniki Yanomami', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/693c5cef57a818c2e90bdc48__MG_1816-copy%20copy.jpg', description: 'Desenho panorâmico que retrata a biodiversidade da floresta amazônica e sua importância para o povo Yanomami.' },
      { id: '6-3', title: 'Vida na Aldeia', artist: 'André Taniki Yanomami', year: '2023', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/693c5cef57a818c2e90bdc48__MG_1816-copy%20copy.jpg', description: 'Série de desenhos que documentam o cotidiano da vida Yanomami: festas, caça, pesca e rituais de passagem.' },
    ],
  },
  {
    id: '7',
    title: 'Mogaje Guihu: A árvore da vida e da abundância',
    artist: 'Abel Rodríguez',
    description: 'Abel Rodríguez, conhecedor botânico do povo Nonuya da Amazônia colombiana, apresenta pinturas detalhadas que documentam a biodiversidade da floresta tropical. Seus desenhos são considerados verdadeiros tratados científicos e artísticos sobre a ecologia amazônica.',
    duration: 20,
    floor: '2º Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/68ff6b07eeee7c1739d94aef_C%C3%B3pia%20de%20Abel%20Rodri%CC%81guez.jpg',
    category: 'Pintura',
    dates: '10.10.2025 - 12.4.2026',
    artworks: [
      { id: '7-1', title: 'Ciclo Anual da Floresta', artist: 'Abel Rodríguez', year: '2020', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/68ff6b07eeee7c1739d94aef_C%C3%B3pia%20de%20Abel%20Rodri%CC%81guez.jpg', description: 'Pintura detalhada do ciclo das árvores na floresta amazônica ao longo das quatro estações, mostrando frutificação, florescimento e dormência.' },
      { id: '7-2', title: 'Árvore de Abundância', artist: 'Abel Rodríguez', year: '2019', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/68ff6b07eeee7c1739d94aef_C%C3%B3pia%20de%20Abel%20Rodri%CC%81guez.jpg', description: 'Representação da árvore Mogaje Guihu, que na cosmologia Nonuya é a fonte de todos os frutos e alimentos da floresta.' },
      { id: '7-3', title: 'Rio Subterrâneo', artist: 'Abel Rodríguez', year: '2021', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/68ff6b07eeee7c1739d94aef_C%C3%B3pia%20de%20Abel%20Rodri%CC%81guez.jpg', description: 'Pintura que documenta o ecossistema aquático da Amazônia, incluindo peixes, plantas aquáticas e o ciclo das águas.' },
    ],
  },
  {
    id: '8',
    title: 'O Outro, Eu e os Outros',
    artist: 'Ivan Argote',
    description: 'Ivan Argote cria instalações e vídeos que provocam reflexões sobre monumentos, história colonial e relações humanas, convidando o público a repensar narrativas oficiais. O artista colombiano radicado em Paris questiona como a história é contada e por quem.',
    duration: 30,
    floor: '1º Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/68877d1f22041eb041e9f2e5__DSC5111%20(1).jpg',
    category: 'Instalação',
    artworks: [
      { id: '8-1', title: 'Monumento ao Esquecido', artist: 'Ivan Argote', year: '2023', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/68877d1f22041eb041e9f2e5__DSC5111%20(1).jpg', description: 'Escultura que questiona monumentos coloniais, propondo homenagear aqueles que foram apagados da história oficial.' },
      { id: '8-2', title: 'Ternura Radical', artist: 'Ivan Argote', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/68877d1f22041eb041e9f2e5__DSC5111%20(1).jpg', description: 'Vídeo-instalação sobre gestos de carinho e afeto como formas de resistência política em espaços públicos.' },
    ],
  },
  {
    id: '9',
    title: 'Acervo em Transformação',
    artist: 'Coletivo',
    description: 'Exposição permanente que apresenta o acervo do MASP de forma inovadora, utilizando os icônicos cavaletes de cristal de Lina Bo Bardi. Com mais de 11 mil obras, o acervo abrange arte europeia, brasileira, africana, asiática e das Américas, desde a Antiguidade até o século 21. Os cavaletes de vidro permitem que as obras sejam vistas de todos os lados, eliminando a hierarquia entre obras e criando um diálogo visual único.',
    duration: 60,
    floor: '2º Andar',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg',
    category: 'Acervo',
    dates: 'Desde 2015',
    artworks: [
      { id: '9-1', title: 'A Estudante', artist: 'Amedeo Modigliani', year: '1918', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Retrato característico do estilo de Modigliani com pescoço alongado. Adquirido pelo MASP em 1948, é uma das obras mais visitadas do museu.' },
      { id: '9-2', title: 'Rosa e Azul', artist: 'Pierre-Auguste Renoir', year: '1881', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Retrato das filhas do banqueiro Louis Cahen d\'Anvers. Uma das obras mais conhecidas e reproduzidas do MASP, também chamada "As Meninas Cahen d\'Anvers".' },
      { id: '9-3', title: 'O Escolar', artist: 'Vincent van Gogh', year: '1888', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Retrato de um jovem estudante pintado durante o período em Arles. Representa a fase mais produtiva e colorida do artista holandês.' },
      { id: '9-4', title: 'Ressurreição de Cristo', artist: 'Rafael Sanzio', year: '1502', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Obra renascentista de Rafael, parte do acervo desde a fundação do museu. É uma das mais antigas e valiosas pinturas da coleção.' },
      { id: '9-5', title: 'Cinco Moças de Guaratinguetá', artist: 'Emiliano Di Cavalcanti', year: '1930', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Uma das obras mais emblemáticas do modernismo brasileiro, retratando mulheres brasileiras com formas sensuais e cores vibrantes.' },
      { id: '9-6', title: 'A Negra', artist: 'Tarsila do Amaral', year: '1923', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Obra icônica do modernismo brasileiro que retrata a herança africana. Considerada precursora do Movimento Antropofágico, mostra uma figura feminina negra monumental.' },
      { id: '9-7', title: 'Abaporu', artist: 'Tarsila do Amaral', year: '1928', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'A obra mais valiosa da arte brasileira, marco do Movimento Antropofágico. O nome vem do tupi "aba" (homem) e "poru" (que come), significando "homem que come gente".' },
      { id: '9-8', title: 'Natureza morta com maçãs', artist: 'Paul Cézanne', year: '1895', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Natureza morta do pós-impressionista francês, considerado o pai da arte moderna. A obra demonstra sua técnica revolucionária de construção de formas geométricas.' },
      { id: '9-9', title: 'Autorretrato', artist: 'Rembrandt van Rijn', year: '1660', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Um dos muitos autorretratos do mestre holandês, demonstrando sua maestria no uso de luz e sombra (chiaroscuro).' },
      { id: '9-10', title: 'Paisagem com Touro', artist: 'Candido Portinari', year: '1940', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Obra do maior muralista brasileiro que retrata a paisagem rural com cores terrosas e formas expressivas.' },
      { id: '9-11', title: 'Nymphéas', artist: 'Claude Monet', year: '1903', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Parte da célebre série de Ninfeias de Monet, capturando os reflexos de luz na lagoa de seu jardim em Giverny.' },
      { id: '9-12', title: 'Futebol', artist: 'Maria Auxiliadora', year: '1970', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Pintura da artista autodidata mineira que retrata uma cena de futebol popular, com sua técnica única de aplicação de tinta em relevo.' },
    ],
  },
  {
    id: '10',
    title: 'Histórias LGBTQIA+',
    artist: 'Diversos artistas',
    description: 'Exposição que reúne obras que exploram identidades, vivências e narrativas LGBTQIA+ na arte, promovendo a diversidade e a inclusão no espaço museológico. A mostra apresenta trabalhos que abordam corpos, desejos e existências dissidentes.',
    duration: 30,
    floor: '1º Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/67d078a508438d83117a472a_Sala-de-Video--Janaina-Wagner-.jpg',
    category: 'Videoarte',
    artworks: [
      { id: '10-1', title: 'Corpo Político', artist: 'Diversos', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/67d078a508438d83117a472a_Sala-de-Video--Janaina-Wagner-.jpg', description: 'Videoinstalação sobre identidades e corpos dissidentes, explorando como a performatividade de gênero se manifesta no espaço público.' },
      { id: '10-2', title: 'Travessia', artist: 'Diversos', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/67d078a508438d83117a472a_Sala-de-Video--Janaina-Wagner-.jpg', description: 'Série fotográfica que documenta trajetórias de vida de pessoas trans e não-binárias, celebrando suas conquistas e resistências.' },
    ],
  },
];

export const allArtworks: Artwork[] = exhibitions.flatMap(
  (expo) => (expo.artworks || []).map((art) => ({ ...art, exhibition: expo.title }))
);
