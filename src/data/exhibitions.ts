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
    description: 'Exposicao que explora a estetica pop andina, misturando referencias da cultura popular dos Andes com a arte contemporanea. La Chola Poblete cria obras vibrantes que questionam identidade, genero e colonialismo. A artista argentina, nascida em Mendoza, utiliza elementos da cultura andina, do catolicismo popular e da vivencia travesti para compor obras que mesclam pintura, performance e instalacao.',
    duration: 30,
    floor: '1o Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae22b861cf27ea79234cc_1XGXWFIRwoiOOU0zUTNu-Ojik4VH6cZWtTFTJBpKt%20(1).jpg',
    category: 'Arte Contemporanea',
    dates: '6.3 - 2.8.2026',
    isMainExhibition: true,
    artworks: [
      { id: '1-1', title: 'Virgem do Cerro', artist: 'La Chola Poblete', year: '2023', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae22b861cf27ea79234cc_1XGXWFIRwoiOOU0zUTNu-Ojik4VH6cZWtTFTJBpKt%20(1).jpg', description: 'Pintura que reinterpreta iconografia andina com estetica pop, fundindo a imagem da Virgem Maria com paisagens dos Andes e simbolos da cultura chola.' },
      { id: '1-2', title: 'Chola Power', artist: 'La Chola Poblete', year: '2022', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae22b861cf27ea79234cc_1XGXWFIRwoiOOU0zUTNu-Ojik4VH6cZWtTFTJBpKt%20(1).jpg', description: 'Serie de retratos que celebram a identidade chola, desafiando padroes de beleza e genero impostos pela colonizacao.' },
      { id: '1-3', title: 'Pachamama Digital', artist: 'La Chola Poblete', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae22b861cf27ea79234cc_1XGXWFIRwoiOOU0zUTNu-Ojik4VH6cZWtTFTJBpKt%20(1).jpg', description: 'Instalacao multimidia que conecta a reverencia ancestral a Mae Terra com a era digital, questionando a relacao entre tecnologia e natureza.' },
      { id: '1-4', title: 'Carnaval Andino', artist: 'La Chola Poblete', year: '2023', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae22b861cf27ea79234cc_1XGXWFIRwoiOOU0zUTNu-Ojik4VH6cZWtTFTJBpKt%20(1).jpg', description: 'Pintura vibrante que retrata a energia e as cores do carnaval nos Andes, com referencias a festas populares e rituais de resistencia cultural.' },
    ],
  },
  {
    id: '2',
    title: 'Replica',
    artist: 'Sandra Gamarra Heshiki',
    description: 'Sandra Gamarra Heshiki questiona a historia da arte e os museus atraves de pinturas que replicam e subvertem obras canonicas, revelando narrativas ocultas e relacoes de poder colonial. Nascida em Lima, Peru, a artista cria um "museu ficticio" que expoe como as instituicoes culturais perpetuam visoes eurocentrircas.',
    duration: 40,
    floor: '1o Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae1742e4f18d134b0a6a9_j8wDMCouaIgUhcak21ZG-xEWgQ2DgKFdsLFb9uETI.jpg',
    category: 'Pintura',
    dates: '6.3 - 7.6.2026',
    artworks: [
      { id: '2-1', title: 'Museu do Esquecimento', artist: 'Sandra Gamarra Heshiki', year: '2023', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae1742e4f18d134b0a6a9_j8wDMCouaIgUhcak21ZG-xEWgQ2DgKFdsLFb9uETI.jpg', description: 'Pintura que replica obras de museus europeus para questionar a propriedade cultural e o saque colonial de patrimonio artistico.' },
      { id: '2-2', title: 'Loja de Souvenirs', artist: 'Sandra Gamarra Heshiki', year: '2022', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae1742e4f18d134b0a6a9_j8wDMCouaIgUhcak21ZG-xEWgQ2DgKFdsLFb9uETI.jpg', description: 'Instalacao que transforma a loja de museu em espaco critico, questionando a mercantilizacao da arte e da cultura.' },
      { id: '2-3', title: 'Natureza Morta Colonial', artist: 'Sandra Gamarra Heshiki', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae1742e4f18d134b0a6a9_j8wDMCouaIgUhcak21ZG-xEWgQ2DgKFdsLFb9uETI.jpg', description: 'Reinterpretacao de naturezas-mortas europeias incluindo frutas e plantas nativas das Americas, questionando a invisibilizacao da biodiversidade colonial.' },
    ],
  },
  {
    id: '3',
    title: 'Viver tecendo',
    artist: 'Claudia Alarcon & Silat',
    description: 'Exposicao que apresenta a tradicao textil Wichi do norte da Argentina. As tecelas do coletivo Silat criam obras que entrelacam conhecimento ancestral, resistencia cultural e arte contemporanea. Os tecidos documentam mapas territoriais, plantas medicinais e narrativas cosmologicas do povo Wichi.',
    duration: 25,
    floor: '1o Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae173ea428cf79c31a06b_p1eX1K7OuzyUpTN7uhoh-HQmymEGGYfLm7RPxaIRY.jpg',
    category: 'Textil',
    dates: '6.3 - 2.8.2026',
    artworks: [
      { id: '3-1', title: 'Mapa do Territorio Wichi', artist: 'Silat', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae173ea428cf79c31a06b_p1eX1K7OuzyUpTN7uhoh-HQmymEGGYfLm7RPxaIRY.jpg', description: 'Tecido monumental que mapeia o territorio ancestral Wichi, documentando rios, caminhos e lugares sagrados atraves de padroes tradicionais.' },
      { id: '3-2', title: 'Yuchan (Arvore Garrafa)', artist: 'Silat', year: '2023', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae173ea428cf79c31a06b_p1eX1K7OuzyUpTN7uhoh-HQmymEGGYfLm7RPxaIRY.jpg', description: 'Tecido que representa a arvore sagrada Yuchan, central na cosmologia Wichi, usando fibras naturais e tecnicas ancestrais de tecelagem.' },
      { id: '3-3', title: 'Plantas Medicinais do Chaco', artist: 'Silat', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69aae173ea428cf79c31a06b_p1eX1K7OuzyUpTN7uhoh-HQmymEGGYfLm7RPxaIRY.jpg', description: 'Serie de tecidos que catalogam as plantas medicinais do Gran Chaco, preservando conhecimento botanico ancestral em forma artistica.' },
    ],
  },
  {
    id: '4',
    title: 'Sala de Video',
    artist: 'Clara Ianni',
    description: 'Videoarte que investiga as relacoes entre poder, territorio e memoria no contexto brasileiro contemporaneo. Clara Ianni utiliza a linguagem do video para criar narrativas que questionam estruturas de vigilancia, controle e memoria historica.',
    duration: 20,
    floor: '2o Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/698e0789d036961a573fad73_EDT_still_site.jpg',
    category: 'Videoarte',
    artworks: [
      { id: '4-1', title: 'Estado de Excecao', artist: 'Clara Ianni', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/698e0789d036961a573fad73_EDT_still_site.jpg', description: 'Video que investiga a relacao entre arquitetura institucional e poder, filmado em edificios governamentais de Brasilia.' },
      { id: '4-2', title: 'Trabalho de Campo', artist: 'Clara Ianni', year: '2023', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/698e0789d036961a573fad73_EDT_still_site.jpg', description: 'Documentario experimental sobre as transformacoes do territorio rural brasileiro e os conflitos de terra.' },
    ],
  },
  {
    id: '5',
    title: 'Ecologia social',
    artist: 'Minerva Cuevas',
    description: 'Minerva Cuevas explora as intersecoes entre ecologia, economia e politica atraves de instalacoes, pinturas e intervencoes que questionam sistemas de exploracao e consumo. A artista mexicana cria obras que revelam como corporacoes multinacionais afetam comunidades locais e o meio ambiente.',
    duration: 35,
    floor: '1o Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69370f02beead80798cd47a1_Site_banner_MC_01.png',
    category: 'Instalacao',
    dates: '5.12.2025 - 12.4.2026',
    artworks: [
      { id: '5-1', title: 'Del Montte', artist: 'Minerva Cuevas', year: '2023', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69370f02beead80798cd47a1_Site_banner_MC_01.png', description: 'Instalacao que questiona o monopolio de corporacoes na agricultura, usando embalagens reapropriadas da marca Del Monte para revelar relacoes de exploracao.' },
      { id: '5-2', title: 'Disidencia Organica', artist: 'Minerva Cuevas', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69370f02beead80798cd47a1_Site_banner_MC_01.png', description: 'Serie de pinturas sobre pesticidas e sementes transgenicas, questionando o controle corporativo sobre a alimentacao global.' },
      { id: '5-3', title: 'Hidrocarburos', artist: 'Minerva Cuevas', year: '2022', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/69370f02beead80798cd47a1_Site_banner_MC_01.png', description: 'Obra que mapeia a cadeia de producao de petroleo e seus impactos ambientais e sociais em comunidades indigenas do Mexico.' },
    ],
  },
  {
    id: '6',
    title: 'Ser imagem',
    artist: 'Andre Taniki Yanomami',
    description: 'Primeira exposicao individual de Andre Taniki Yanomami no MASP, apresentando desenhos que documentam a cosmologia, mitologia e o cotidiano do povo Yanomami. Os desenhos revelam um universo visual rico, onde espiritos xapiri, animais da floresta e cenas da vida na aldeia se entrelaçam.',
    duration: 25,
    floor: '2o Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/693c5cef57a818c2e90bdc48__MG_1816-copy%20copy.jpg',
    category: 'Desenho',
    dates: '5.12.2025 - 12.4.2026',
    artworks: [
      { id: '6-1', title: 'Xapiri', artist: 'Andre Taniki Yanomami', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/693c5cef57a818c2e90bdc48__MG_1816-copy%20copy.jpg', description: 'Desenho que representa os espiritos xapiri da cosmologia Yanomami, seres luminosos que dançam e protegem a floresta.' },
      { id: '6-2', title: 'A Floresta Viva', artist: 'Andre Taniki Yanomami', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/693c5cef57a818c2e90bdc48__MG_1816-copy%20copy.jpg', description: 'Desenho panoramico que retrata a biodiversidade da floresta amazonica e sua importancia para o povo Yanomami.' },
      { id: '6-3', title: 'Vida na Aldeia', artist: 'Andre Taniki Yanomami', year: '2023', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/693c5cef57a818c2e90bdc48__MG_1816-copy%20copy.jpg', description: 'Serie de desenhos que documentam o cotidiano da vida Yanomami: festas, caca, pesca e rituais de passagem.' },
    ],
  },
  {
    id: '7',
    title: 'Mogaje Guihu: A arvore da vida e da abundancia',
    artist: 'Abel Rodriguez',
    description: 'Abel Rodriguez, conhecedor botanico do povo Nonuya da Amazonia colombiana, apresenta pinturas detalhadas que documentam a biodiversidade da floresta tropical. Seus desenhos sao considerados verdadeiros tratados cientificos e artisticos sobre a ecologia amazonica.',
    duration: 20,
    floor: '2o Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/68ff6b07eeee7c1739d94aef_C%C3%B3pia%20de%20Abel%20Rodri%CC%81guez.jpg',
    category: 'Pintura',
    dates: '10.10.2025 - 12.4.2026',
    artworks: [
      { id: '7-1', title: 'Ciclo Anual da Floresta', artist: 'Abel Rodriguez', year: '2020', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/68ff6b07eeee7c1739d94aef_C%C3%B3pia%20de%20Abel%20Rodri%CC%81guez.jpg', description: 'Pintura detalhada do ciclo das arvores na floresta amazonica ao longo das quatro estacoes, mostrando fruticacao, florescimento e dormencia.' },
      { id: '7-2', title: 'Arvore de Abundancia', artist: 'Abel Rodriguez', year: '2019', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/68ff6b07eeee7c1739d94aef_C%C3%B3pia%20de%20Abel%20Rodri%CC%81guez.jpg', description: 'Representacao da arvore Mogaje Guihu, que na cosmologia Nonuya e a fonte de todos os frutos e alimentos da floresta.' },
      { id: '7-3', title: 'Rio Subterraneo', artist: 'Abel Rodriguez', year: '2021', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/68ff6b07eeee7c1739d94aef_C%C3%B3pia%20de%20Abel%20Rodri%CC%81guez.jpg', description: 'Pintura que documenta o ecossistema aquatico da Amazonia, incluindo peixes, plantas aquaticas e o ciclo das aguas.' },
    ],
  },
  {
    id: '8',
    title: 'O Outro, Eu e os Outros',
    artist: 'Ivan Argote',
    description: 'Ivan Argote cria instalacoes e videos que provocam reflexoes sobre monumentos, historia colonial e relacoes humanas, convidando o publico a repensar narrativas oficiais. O artista colombiano radicado em Paris questiona como a historia e contada e por quem.',
    duration: 30,
    floor: '1o Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/68877d1f22041eb041e9f2e5__DSC5111%20(1).jpg',
    category: 'Instalacao',
    artworks: [
      { id: '8-1', title: 'Monumento ao Esquecido', artist: 'Ivan Argote', year: '2023', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/68877d1f22041eb041e9f2e5__DSC5111%20(1).jpg', description: 'Escultura que questiona monumentos coloniais, propondo homenagear aqueles que foram apagados da historia oficial.' },
      { id: '8-2', title: 'Ternura Radical', artist: 'Ivan Argote', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/68877d1f22041eb041e9f2e5__DSC5111%20(1).jpg', description: 'Video-instalacao sobre gestos de carinho e afeto como formas de resistencia politica em espacos publicos.' },
    ],
  },
  {
    id: '9',
    title: 'Acervo em Transformacao',
    artist: 'Coletivo',
    description: 'Exposicao permanente que apresenta o acervo do MASP de forma inovadora, utilizando os iconicos cavaletes de cristal de Lina Bo Bardi. Com mais de 11 mil obras, o acervo abrange arte europeia, brasileira, africana, asiatica e das Americas, desde a Antiguidade ate o seculo 21. Os cavaletes de vidro permitem que as obras sejam vistas de todos os lados, eliminando a hierarquia entre obras e criando um dialogo visual unico.',
    duration: 60,
    floor: '2o Andar',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg',
    category: 'Acervo',
    dates: 'Desde 2015',
    artworks: [
      { id: '9-1', title: 'A Estudante', artist: 'Amedeo Modigliani', year: '1918', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Retrato caracteristico do estilo de Modigliani com pescoco alongado. Adquirido pelo MASP em 1948, e uma das obras mais visitadas do museu.' },
      { id: '9-2', title: 'Rosa e Azul', artist: 'Pierre-Auguste Renoir', year: '1881', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Retrato das filhas do banqueiro Louis Cahen dAnvers. Uma das obras mais conhecidas e reproduzidas do MASP, tambem chamada "As Meninas Cahen dAnvers".' },
      { id: '9-3', title: 'O Escolar', artist: 'Vincent van Gogh', year: '1888', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Retrato de um jovem estudante pintado durante o periodo em Arles. Representa a fase mais produtiva e colorida do artista holandes.' },
      { id: '9-4', title: 'Ressurreicao de Cristo', artist: 'Rafael Sanzio', year: '1502', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Obra renascentista de Rafael, parte do acervo desde a fundacao do museu. E uma das mais antigas e valiosas pinturas da colecao.' },
      { id: '9-5', title: 'Cinco Mocas de Guaratingueta', artist: 'Emiliano Di Cavalcanti', year: '1930', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Uma das obras mais emblematicas do modernismo brasileiro, retratando mulheres brasileiras com formas sensuais e cores vibrantes.' },
      { id: '9-6', title: 'A Negra', artist: 'Tarsila do Amaral', year: '1923', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Obra iconica do modernismo brasileiro que retrata a heranca africana. Considerada precursora do Movimento Antropofagico, mostra uma figura feminina negra monumental.' },
      { id: '9-7', title: 'Abaporu', artist: 'Tarsila do Amaral', year: '1928', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'A obra mais valiosa da arte brasileira, marco do Movimento Antropofagico. O nome vem do tupi "aba" (homem) e "poru" (que come), significando "homem que come gente".' },
      { id: '9-8', title: 'Natureza morta com macas', artist: 'Paul Cezanne', year: '1895', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Natureza morta do pos-impressionista frances, considerado o pai da arte moderna. A obra demonstra sua tecnica revolucionaria de construcao de formas geometricas.' },
      { id: '9-9', title: 'Autorretrato', artist: 'Rembrandt van Rijn', year: '1660', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Um dos muitos autorretratos do mestre holandes, demonstrando sua maestria no uso de luz e sombra (chiaroscuro).' },
      { id: '9-10', title: 'Paisagem com Touro', artist: 'Candido Portinari', year: '1940', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Obra do maior muralista brasileiro que retrata a paisagem rural com cores terrosas e formas expressivas.' },
      { id: '9-11', title: 'Nympheas', artist: 'Claude Monet', year: '1903', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Parte da celebre serie de Ninfeias de Monet, capturando os reflexos de luz na lagoa de seu jardim em Giverny.' },
      { id: '9-12', title: 'Futebol', artist: 'Maria Auxiliadora', year: '1970', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/695d09e3fe6fd822b917a0a7__DSC4877-Pano-Edit-2.jpg', description: 'Pintura da artista autodidata mineira que retrata uma cena de futebol popular, com sua tecnica unica de aplicacao de tinta em relevo.' },
    ],
  },
  {
    id: '10',
    title: 'Historias LGBTQIA+',
    artist: 'Diversos artistas',
    description: 'Exposicao que reune obras que exploram identidades, vivencias e narrativas LGBTQIA+ na arte, promovendo a diversidade e a inclusao no espaco museologico. A mostra apresenta trabalhos que abordam corpos, desejos e existencias dissidentes.',
    duration: 30,
    floor: '1o Subsolo',
    image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/67d078a508438d83117a472a_Sala-de-Video--Janaina-Wagner-.jpg',
    category: 'Videoarte',
    artworks: [
      { id: '10-1', title: 'Corpo Politico', artist: 'Diversos', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/67d078a508438d83117a472a_Sala-de-Video--Janaina-Wagner-.jpg', description: 'Videoinstalacao sobre identidades e corpos dissidentes, explorando como a performatividade de genero se manifesta no espaco publico.' },
      { id: '10-2', title: 'Travessia', artist: 'Diversos', year: '2024', image: 'https://cdn.prod.website-files.com/67338a991d8aa120d15ef8c5/67d078a508438d83117a472a_Sala-de-Video--Janaina-Wagner-.jpg', description: 'Serie fotografica que documenta trajetorias de vida de pessoas trans e nao-binarias, celebrando suas conquistas e resistencias.' },
    ],
  },
];

export const allArtworks: Artwork[] = exhibitions.flatMap(
  (expo) => (expo.artworks || []).map((art) => ({ ...art, exhibition: expo.title }))
);
