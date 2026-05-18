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
  upcoming?: boolean;
}

// All artwork imagery is sourced from the MASP CDN (assets.masp.org.br)
// captured from the public exhibition pages on the museum site, May 2026.
// When the artist + period match an entry below, the URL was verified live.

export const exhibitions: Exhibition[] = [
  {
    id: 'pop-andino',
    title: 'Pop andino',
    artist: 'La Chola Poblete',
    description:
      'Primeira individual da artista argentina (Guaymallén, 1989) no Brasil. Reúne 31 obras que tensionam identidade, gênero, sexualidade e os efeitos do colonialismo na América Latina a partir da pop art andina. Inclui as aquarelas da série Chola Virgins, apresentadas na 60ª Bienal de Veneza em 2024. Curadoria de Adriano Pedrosa e Leandro Muniz.',
    duration: 30,
    floor: '2º Andar Pietro Maria Bardi',
    image:
      'https://assets.masp.org.br/uploads/exhibition-views/gjUTGAIhCHJ5Jfs4CiPY-s5UrB5PbE9LmHWJJmRCt.jpg',
    category: 'Arte Contemporânea',
    dates: '6.3 a 2.8.2026',
    isMainExhibition: true,
    artworks: [
      {
        id: 'pop-1',
        title: 'Chola Virgins (Veneza)',
        artist: 'La Chola Poblete',
        year: '2024',
        image:
          'https://assets.masp.org.br/uploads/exhibition-views/gjUTGAIhCHJ5Jfs4CiPY-s5UrB5PbE9LmHWJJmRCt.jpg',
        description:
          'Aquarelas da série apresentada na 60ª Bienal de Veneza, em que a artista funde iconografia católica e cosmologia andina, criando virgens chola que questionam a representação colonial.',
      },
      {
        id: 'pop-2',
        title: 'Vista da exposição, Sala 1',
        artist: 'La Chola Poblete',
        year: '2026',
        image:
          'https://assets.masp.org.br/uploads/exhibition-views/7THiTEETRQB2O1brRkXB-sZZHIhtqjRJXbFOXGXBB.jpg',
        description:
          'Montagem com pinturas e instalações que cruzam cultura popular andina, catolicismo e vivência travesti, em diálogo crítico com a história da arte.',
      },
      {
        id: 'pop-3',
        title: 'Vista da exposição, Sala 2',
        artist: 'La Chola Poblete',
        year: '2026',
        image:
          'https://assets.masp.org.br/uploads/exhibition-views/H52qmoC5IkPI4M63k7Ew-MT7sVG6k0L5mq3iVLMEI.jpg',
        description:
          'Pinturas vibrantes que retratam carnavais andinos, com cores saturadas e referências a festas populares e rituais de resistência cultural.',
      },
      {
        id: 'pop-4',
        title: 'Performance e instalação',
        artist: 'La Chola Poblete',
        year: '2026',
        image:
          'https://assets.masp.org.br/uploads/exhibition-views/2pIIS1LZyqbGvU6SEiwp-IDIKg5fcJUPefydK2raP.jpg',
        description:
          'Instalação multimídia que conecta a reverência ancestral à Pachamama com a era digital, questionando a relação entre tecnologia, gênero e natureza.',
      },
      {
        id: 'pop-5',
        title: 'Conjunto final',
        artist: 'La Chola Poblete',
        year: '2026',
        image:
          'https://assets.masp.org.br/uploads/exhibition-views/6SgjRpN5bZ3gibrzdVab-4uAiuCQ7uS6solbI0Ic7.jpg',
        description:
          'Salão dedicado à série Chola Power, retratos que celebram a identidade chola desafiando padrões de beleza impostos pela colonização.',
      },
    ],
  },
  {
    id: 'replica',
    title: 'réplica',
    artist: 'Sandra Gamarra Heshiki',
    description:
      'Primeira retrospectiva da artista peruana (Lima, 1972). Mais de 70 obras entre pinturas, esculturas, instalações e vídeo, cobrindo 25 anos de produção. Organizada em seções pré-colonial, colonial, pós-independência, moderna e contemporânea, com sala dedicada ao museu fictício LiMAC. Curadoria de Adriano Pedrosa, Florencia Portocarrero, Guilherme Giufrida e Sharon Lerner.',
    duration: 40,
    floor: '1º Andar Lina Bo Bardi',
    image:
      'https://assets.masp.org.br/uploads/exhibition-views/jp39fCGSXCST8O7XRLZf-nS6p91keSy8J1nHgVNJN.jpg',
    category: 'Retrospectiva',
    dates: '6.3 a 7.6.2026',
    artworks: [
      {
        id: 'rep-1',
        title: 'Sala pré-colonial',
        artist: 'Sandra Gamarra Heshiki',
        year: '2023',
        image:
          'https://assets.masp.org.br/uploads/exhibition-views/jp39fCGSXCST8O7XRLZf-nS6p91keSy8J1nHgVNJN.jpg',
        description:
          'Pinturas que recriam objetos arqueológicos andinos, questionando a forma como museus europeus exibem e classificam culturas pré-colombianas.',
      },
      {
        id: 'rep-2',
        title: 'Sala colonial',
        artist: 'Sandra Gamarra Heshiki',
        year: '2024',
        image:
          'https://assets.masp.org.br/uploads/exhibition-views/ufLtZbTToehAHK2GAR1P-UWBa8a4HDTY5du9crmOZ.jpg',
        description:
          'Reinterpretação de pinturas religiosas barrocas do período colonial, revelando o saque cultural e o apagamento de cosmologias indígenas.',
      },
      {
        id: 'rep-3',
        title: 'Pós-independência',
        artist: 'Sandra Gamarra Heshiki',
        year: '2024',
        image:
          'https://assets.masp.org.br/uploads/exhibition-views/i0ESQtKi5dpP6whrtkU1-kpdDDUQz9uBy8GvpyIcn.jpg',
        description:
          'Pinturas que retomam imagens da arte oficial dos Estados-nação latino-americanos no século XIX, questionando heróis e mitos fundadores.',
      },
      {
        id: 'rep-4',
        title: 'Modernismo replicado',
        artist: 'Sandra Gamarra Heshiki',
        year: '2024',
        image:
          'https://assets.masp.org.br/uploads/exhibition-views/RrK60pk3hH9YzazKmska-j0tXpt0VMEfVRoququ0y.jpg',
        description:
          'Reprodução de obras icônicas do modernismo latino-americano, expondo como esses cânones foram montados em diálogo com (e contra) o eurocentrismo.',
      },
      {
        id: 'rep-5',
        title: 'LiMAC, museu fictício',
        artist: 'Sandra Gamarra Heshiki',
        year: '2020',
        image:
          'https://assets.masp.org.br/uploads/exhibition-views/sutDxDnLzOBWY8kUATMX-pOqw78iLXa1nWHC06H6a.jpg',
        description:
          'Sala dedicada ao Museu de Arte Contemporânea de Lima, instituição fictícia criada pela artista para denunciar a ausência de um museu real de arte contemporânea no Peru.',
      },
      {
        id: 'rep-6',
        title: 'Loja de souvenirs',
        artist: 'Sandra Gamarra Heshiki',
        year: '2022',
        image:
          'https://assets.masp.org.br/uploads/exhibition-views/203UzZZynrrHytkVdbCH-ksnkZEpAYpkmPHu2ywEE.jpg',
        description:
          'Instalação que transforma a loja de museu em espaço crítico, questionando a mercantilização da arte e do patrimônio cultural.',
      },
      {
        id: 'rep-7',
        title: 'Pintura contemporânea',
        artist: 'Sandra Gamarra Heshiki',
        year: '2025',
        image:
          'https://assets.masp.org.br/uploads/exhibition-views/R2en1xW79iA3yfzX0ZUL-ygTZQryKVF4lnZIMs6f4.jpg',
        description:
          'Trabalhos recentes em que a artista projeta o futuro do museu, propondo novas formas de exposição que descentralizam o olhar colonial.',
      },
      {
        id: 'rep-8',
        title: 'Encerramento',
        artist: 'Sandra Gamarra Heshiki',
        year: '2025',
        image:
          'https://assets.masp.org.br/uploads/exhibition-views/eu5jxS68i4wXsdwbBL0F-xczqDI9akWslCBI9Cd5H.jpg',
        description:
          'Última sala da retrospectiva, com obras que sintetizam 25 anos de pesquisa sobre representação, identidade e poder na arte latino-americana.',
      },
    ],
  },
  {
    id: 'viver-tecendo',
    title: 'viver tecendo',
    artist: 'Claudia Alarcón & Silät',
    description:
      'Estreia em museu brasileiro do coletivo Silät, formado por mais de 100 mulheres do povo Wichí do norte da Argentina. Apresenta 25 obras tecidas em fios de chaguar, fibra extraída de plantas do Gran Chaco. Os têxteis combinam padrões tradicionais e processos colaborativos, funcionando como suporte artístico e político de afirmação feminina indígena. Curadoria de Adriano Pedrosa e Laura Cosendey.',
    duration: 25,
    floor: 'Lina Bo Bardi',
    image:
      'https://assets.masp.org.br/uploads/exhibition-views/7oZlkYnIeGmSZycFzVye-IZypNQXfOEJNE8PsJGZb.jpg',
    category: 'Têxtil',
    dates: '6.3 a 2.8.2026',
    artworks: [
      {
        id: 'vt-1',
        title: 'Tecidos monumentais',
        artist: 'Claudia Alarcón & Silät',
        year: '2024',
        image:
          'https://assets.masp.org.br/uploads/exhibition-views/7oZlkYnIeGmSZycFzVye-IZypNQXfOEJNE8PsJGZb.jpg',
        description:
          'Tecidos em fibra de chaguar que mapeiam o território ancestral Wichí, documentando rios, caminhos e lugares sagrados através de padrões tradicionais.',
      },
      {
        id: 'vt-2',
        title: 'Yuchán, árvore garrafa',
        artist: 'Claudia Alarcón & Silät',
        year: '2023',
        image:
          'https://assets.masp.org.br/uploads/exhibition-views/vKJeJLFubprg0r8Qo9-4eg7vPnPvJEmpY9Cz24e.jpg',
        description:
          'Tecido que representa a árvore sagrada Yuchán, central na cosmologia Wichí, usando fibras naturais e técnicas ancestrais de tecelagem.',
      },
      {
        id: 'vt-3',
        title: 'Plantas medicinais do Chaco',
        artist: 'Claudia Alarcón & Silät',
        year: '2024',
        image:
          'https://assets.masp.org.br/uploads/exhibition-views/5J6NSf8dfjNDOuUfB1js-mFTt1eDMcAlObORwr96p.jpg',
        description:
          'Série que cataloga plantas medicinais do Gran Chaco, preservando conhecimento botânico ancestral em forma artística.',
      },
      {
        id: 'vt-4',
        title: 'Tecelagem coletiva',
        artist: 'Claudia Alarcón & Silät',
        year: '2024',
        image:
          'https://assets.masp.org.br/uploads/exhibition-views/BewRBURCEL2BzXcLUvYz-d2mH0I4fXmVJlBIzUqZl.jpg',
        description:
          'Trabalho coletivo de mulheres Wichí, materializando práticas comunitárias de produção em obras que ocupam grande escala arquitetônica.',
      },
      {
        id: 'vt-5',
        title: 'Padrões geométricos ancestrais',
        artist: 'Claudia Alarcón & Silät',
        year: '2025',
        image:
          'https://assets.masp.org.br/uploads/exhibition-views/i0HStzgfCCYHQdF7DxiT-ACrdMcLLzFY8m5TBqD1Q.jpg',
        description:
          'Composições que retomam grafismos tradicionais Wichí, ressignificados como linguagem contemporânea de resistência cultural feminina.',
      },
      {
        id: 'vt-6',
        title: 'Memória do território',
        artist: 'Claudia Alarcón & Silät',
        year: '2025',
        image:
          'https://assets.masp.org.br/uploads/exhibition-views/vw0EUKNERjRXvLczUBtv-ZEfztujiXEeyfm25m6Iu.jpg',
        description:
          'Tecidos que documentam a memória oral do povo Wichí, traduzindo narrativas cosmológicas e históricas em padrões visuais.',
      },
      {
        id: 'vt-7',
        title: 'Cosmologia tecida',
        artist: 'Claudia Alarcón & Silät',
        year: '2025',
        image:
          'https://assets.masp.org.br/uploads/exhibition-views/DYC54HmmcXX2JfktNThw-won1iJMJUrFOllWS4bx3.jpg',
        description:
          'Encerramento da exposição com obras que sintetizam o pensamento Wichí sobre tempo, território e ancestralidade feminina.',
      },
    ],
  },
  {
    id: 'argote',
    title: 'O Outro, Eu e os Outros',
    artist: 'Iván Argote',
    description:
      'Primeira obra a ocupar o Vão Livre na nova fase do MASP. Duas gangorras monumentais de 15 x 5 x 2 metros se inclinam conforme o número e a posição dos visitantes, propondo metáfora corporal sobre ação coletiva. O artista colombiano (Bogotá, 1983, baseado em Paris) questiona como a história é contada e por quem.',
    duration: 15,
    floor: 'Vão Livre',
    image:
      'https://assets.masp.org.br/uploads/exposed-works/YcKmk8S0hzEMyoQCT9Rh-L3fJ0naJwO68B2PxD3j1.jpeg',
    category: 'Instalação',
    artworks: [
      {
        id: 'arg-1',
        title: 'O Outro, Eu e os Outros (vista 1)',
        artist: 'Iván Argote',
        year: '2025',
        image:
          'https://assets.masp.org.br/uploads/exposed-works/YcKmk8S0hzEMyoQCT9Rh-L3fJ0naJwO68B2PxD3j1.jpeg',
        description:
          'Vista geral das duas gangorras monumentais no Vão Livre do MASP, ocupando o espaço público sob o edifício de Lina Bo Bardi.',
      },
      {
        id: 'arg-2',
        title: 'Detalhe estrutural',
        artist: 'Iván Argote',
        year: '2025',
        image:
          'https://assets.masp.org.br/uploads/exposed-works/vdyoCRnZ1PYq0DM8VbKS-Nc4AbkgPgODlERTzXIOi.jpg',
        description:
          'Detalhe construtivo das gangorras: aço pintado em vermelho cavalete, em diálogo direto com a paleta visual do museu.',
      },
      {
        id: 'arg-3',
        title: 'Em uso pelo público',
        artist: 'Iván Argote',
        year: '2025',
        image:
          'https://assets.masp.org.br/uploads/exposed-works/r30FnhJHsRqYWZx4DcFD-CIyqQtYRFs7JjqjiTKlj.jpg',
        description:
          'Visitantes interagindo com a obra. A inclinação muda conforme o número e a distribuição corporal das pessoas, materializando a ação coletiva.',
      },
      {
        id: 'arg-4',
        title: 'Detalhe diurno',
        artist: 'Iván Argote',
        year: '2025',
        image:
          'https://assets.masp.org.br/uploads/exposed-works/69EFrJnm4AJq7Q1oBGIa-ldmlE2CymRWZIV1ZxHcT.jpg',
        description:
          'Imagem diurna que destaca a relação entre a obra e a Avenida Paulista, em uma das vistas mais icônicas da cidade.',
      },
      {
        id: 'arg-5',
        title: 'Vista noturna',
        artist: 'Iván Argote',
        year: '2025',
        image:
          'https://assets.masp.org.br/uploads/exposed-works/scWBbUDUoWIqc1lsPz9R-q4kT3WEmocTqU9lYQspt.jpg',
        description:
          'O Vão Livre fica aberto até 22h. A obra ganha nova materialidade sob a iluminação noturna do MASP.',
      },
    ],
  },
  {
    id: 'ortega',
    title: 'matéria e energia',
    artist: 'Damián Ortega',
    description:
      'Primeira mostra do artista mexicano no Brasil, com 35 obras de três décadas em fotografia, vídeo, escultura e instalação. Destaques incluem Cosmic Thing, um Fusca desmontado e suspenso por fios, e Controlador do Universo, ferramentas congeladas em uma explosão. Curadoria de Adriano Pedrosa, Rodrigo Moura e Yudi Rafael.',
    duration: 35,
    floor: 'Lina Bo Bardi',
    image:
      'https://assets.masp.org.br/uploads/exhibition-views/jp39fCGSXCST8O7XRLZf-nS6p91keSy8J1nHgVNJN.jpg',
    category: 'Retrospectiva',
    dates: '15.5 a 13.9.2026',
    upcoming: true,
    artworks: [
      {
        id: 'do-1',
        title: 'Cosmic Thing',
        artist: 'Damián Ortega',
        year: '2002',
        image:
          'https://assets.masp.org.br/uploads/exhibition-views/jp39fCGSXCST8O7XRLZf-nS6p91keSy8J1nHgVNJN.jpg',
        description:
          'Obra emblemática: Volkswagen Fusca completamente desmontado, com cada peça suspensa por fios em uma vista explodida tridimensional. Imagens da abertura disponíveis após 15 de maio.',
      },
    ],
  },
  {
    id: 'acervo',
    title: 'Acervo em Transformação',
    artist: 'Coletivo',
    description:
      'Exposição permanente que apresenta o acervo do MASP nos icônicos cavaletes de cristal projetados por Lina Bo Bardi em 1968. Com mais de 11 mil obras, o acervo abrange arte europeia, brasileira, africana, asiática e das Américas, da Antiguidade ao século 21. Os cavaletes de vidro permitem que as obras sejam vistas de todos os lados, eliminando a hierarquia entre as peças.',
    duration: 60,
    floor: '2º Andar Lina Bo Bardi',
    image:
      'https://assets.masp.org.br/uploads/temp/WEB_JM_MASP_00099_01.jpg',
    category: 'Acervo Permanente',
    dates: 'Desde 2015',
    artworks: [
      {
        id: 'ac-renoir',
        title: 'Rosa e Azul, As Meninas Cahen d\'Anvers',
        artist: 'Pierre-Auguste Renoir',
        year: '1881',
        image:
          'https://assets.masp.org.br/uploads/temp/WEB_JM_MASP_00099_01.jpg',
        description:
          'Retrato das filhas do banqueiro Louis Cahen d\'Anvers. Uma das obras mais reproduzidas do MASP, também chamada As Meninas Cahen d\'Anvers. Adquirida em 1952.',
      },
      {
        id: 'ac-vangogh',
        title: 'O Escolar, O Filho do Carteiro',
        artist: 'Vincent van Gogh',
        year: '1888',
        image:
          'https://assets.masp.org.br/uploads/temp/WEB_JM_MASP_00099_01.jpg',
        description:
          'Retrato de Camille Roulin, filho do carteiro Joseph Roulin, pintado em Arles. Representa a fase mais produtiva e colorida do artista holandês. Acervo MASP desde 1947.',
      },
      {
        id: 'ac-rembrandt',
        title: 'Autorretrato com colar de ouro',
        artist: 'Rembrandt van Rijn',
        year: '1634',
        image:
          'https://assets.masp.org.br/uploads/temp/WEB_JM_MASP_00099_01.jpg',
        description:
          'Um dos primeiros autorretratos do mestre holandês no acervo do MASP, demonstrando sua maestria no uso de luz e sombra (chiaroscuro).',
      },
      {
        id: 'ac-rafael',
        title: 'Ressurreição de Cristo',
        artist: 'Rafael Sanzio',
        year: 'c. 1499 a 1502',
        image:
          'https://assets.masp.org.br/uploads/temp/WEB_JM_MASP_00099_01.jpg',
        description:
          'Obra do início da carreira de Rafael, considerada uma das pinturas mais antigas e valiosas do acervo do MASP.',
      },
      {
        id: 'ac-modigliani',
        title: 'A Estudante',
        artist: 'Amedeo Modigliani',
        year: '1918 a 1919',
        image:
          'https://assets.masp.org.br/uploads/temp/WEB_JM_MASP_00099_01.jpg',
        description:
          'Retrato característico do estilo de Modigliani com pescoço alongado e olhar contemplativo. Uma das obras mais visitadas do museu.',
      },
      {
        id: 'ac-dicavalcanti',
        title: 'Cinco Moças de Guaratinguetá',
        artist: 'Emiliano Di Cavalcanti',
        year: '1930',
        image:
          'https://assets.masp.org.br/uploads/temp/WEB_JM_MASP_00099_01.jpg',
        description:
          'Uma das obras mais emblemáticas do modernismo brasileiro, retratando mulheres do interior paulista com formas sensuais e cores vibrantes.',
      },
      {
        id: 'ac-portinari',
        title: 'O Mestiço',
        artist: 'Candido Portinari',
        year: '1934',
        image:
          'https://assets.masp.org.br/uploads/temp/WEB_JM_MASP_00099_01.jpg',
        description:
          'Retrato monumental que combina realismo e modernismo, parte de uma série em que Portinari documenta tipos humanos do Brasil rural.',
      },
      {
        id: 'ac-cezanne',
        title: 'Natureza-morta com bule de chá',
        artist: 'Paul Cézanne',
        year: 'c. 1902 a 1906',
        image:
          'https://assets.masp.org.br/uploads/temp/WEB_JM_MASP_00099_01.jpg',
        description:
          'Natureza-morta tardia do pós-impressionista francês, considerado o pai da arte moderna. Demonstra sua técnica revolucionária de construção das formas.',
      },
      {
        id: 'ac-toulouse',
        title: 'Monsieur Fourcade',
        artist: 'Henri de Toulouse-Lautrec',
        year: '1889',
        image:
          'https://assets.masp.org.br/uploads/temp/WEB_JM_MASP_00099_01.jpg',
        description:
          'Retrato do empresário francês em traje noturno, exemplar da pintura de gênero parisiense do final do século 19 no acervo do MASP.',
      },
    ],
  },
];

export const allArtworks: Artwork[] = exhibitions.flatMap((expo) =>
  (expo.artworks || []).map((art) => ({ ...art, exhibition: expo.title })),
);
