export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: QuizQuestion[];
}

export const quizCategories: QuizCategory[] = [
  {
    id: 'masp',
    title: 'Sobre o MASP',
    description: 'Teste seus conhecimentos sobre a história do museu',
    icon: '🏛️',
    questions: [
      {
        question: 'Em que ano o MASP foi fundado?',
        options: ['1922', '1947', '1960', '1968'],
        correctIndex: 1,
        explanation: 'O MASP foi fundado em 1947 por Assis Chateaubriand e Pietro Maria Bardi.',
      },
      {
        question: 'Quem projetou o edifício icônico do MASP na Avenida Paulista?',
        options: ['Oscar Niemeyer', 'Paulo Mendes da Rocha', 'Lina Bo Bardi', 'Rino Levi'],
        correctIndex: 2,
        explanation: 'O edifício foi projetado pela arquiteta ítalo-brasileira Lina Bo Bardi e inaugurado em 1968.',
      },
      {
        question: 'Qual é a característica mais marcante do edifício do MASP?',
        options: ['A cúpula de vidro', 'O vão livre de 74 metros', 'A torre de observação', 'Os jardins suspensos'],
        correctIndex: 1,
        explanation: 'O vão livre de 74 metros é considerado um dos maiores do mundo e tornou-se símbolo da cidade.',
      },
      {
        question: 'Quantas obras compõem aproximadamente o acervo do MASP?',
        options: ['Cerca de 1.000', 'Cerca de 5.000', 'Mais de 11.000', 'Mais de 20.000'],
        correctIndex: 2,
        explanation: 'O acervo do MASP conta com mais de 11.000 obras de diferentes períodos e origens.',
      },
      {
        question: 'Os famosos "cavaletes de cristal" do MASP foram criados por quem?',
        options: ['Pietro Maria Bardi', 'Lina Bo Bardi', 'Tomie Ohtake', 'Cândido Portinari'],
        correctIndex: 1,
        explanation: 'Lina Bo Bardi criou os cavaletes de cristal como forma revolucionária de expor obras de arte.',
      },
    ],
  },
  {
    id: 'expo-chola',
    title: 'La Chola Poblete',
    description: 'Pop andino - Arte e identidade',
    icon: '🎨',
    questions: [
      {
        question: 'De qual região é a cultura andina explorada por La Chola Poblete?',
        options: ['América Central', 'Região dos Andes na América do Sul', 'Caribe', 'Patagônia'],
        correctIndex: 1,
        explanation: 'La Chola Poblete explora a cultura dos Andes, uma cadeia montanhosa da América do Sul.',
      },
      {
        question: 'Qual tema NÃO é central na obra de La Chola Poblete?',
        options: ['Identidade', 'Gênero', 'Paisagens marinhas', 'Colonialismo'],
        correctIndex: 2,
        explanation: 'La Chola Poblete trabalha com temas de identidade, gênero e colonialismo na perspectiva andina.',
      },
      {
        question: 'O termo "Pop andino" sugere uma mistura de:',
        options: ['Música clássica e folclore', 'Cultura popular e tradição andina', 'Tecnologia e natureza', 'Ciência e arte'],
        correctIndex: 1,
        explanation: 'O "Pop andino" mistura referências da cultura popular com elementos tradicionais dos Andes.',
      },
    ],
  },
  {
    id: 'expo-gamarra',
    title: 'Sandra Gamarra Heshiki',
    description: 'Réplica - Questionando a história da arte',
    icon: '🖼️',
    questions: [
      {
        question: 'Qual é a técnica principal utilizada por Sandra Gamarra Heshiki?',
        options: ['Escultura', 'Fotografia', 'Pintura', 'Gravura'],
        correctIndex: 2,
        explanation: 'Sandra Gamarra Heshiki utiliza a pintura para replicar e subverter obras canônicas.',
      },
      {
        question: 'O que Sandra Gamarra questiona em suas réplicas?',
        options: ['A técnica dos mestres', 'As narrativas coloniais e relações de poder', 'O mercado de arte', 'A preservação de obras'],
        correctIndex: 1,
        explanation: 'Suas réplicas revelam narrativas ocultas e relações de poder colonial na história da arte.',
      },
    ],
  },
  {
    id: 'expo-alarcon',
    title: 'Claudia Alarcón & Silät',
    description: 'Viver tecendo - Tradição têxtil Wichí',
    icon: '🧶',
    questions: [
      {
        question: 'O coletivo Silät pertence a qual povo indígena?',
        options: ['Guarani', 'Mapuche', 'Wichí', 'Quechua'],
        correctIndex: 2,
        explanation: 'As tecelãs do coletivo Silät pertencem ao povo Wichí do norte da Argentina.',
      },
      {
        question: 'Qual é a principal linguagem artística da exposição?',
        options: ['Cerâmica', 'Tecelagem', 'Pintura corporal', 'Música'],
        correctIndex: 1,
        explanation: 'A exposição apresenta a tradição têxtil como forma de arte, resistência e conhecimento ancestral.',
      },
    ],
  },
  {
    id: 'acervo',
    title: 'Sobre o Acervo',
    description: 'Grandes obras e artistas do MASP',
    icon: '🎭',
    questions: [
      {
        question: 'Qual destes artistas europeus tem obra no acervo do MASP?',
        options: ['Dalí', 'Rafael', 'Frida Kahlo', 'Andy Warhol'],
        correctIndex: 1,
        explanation: 'O MASP possui obras de Rafael, além de Van Gogh, Cézanne, Renoir, Monet e Picasso.',
      },
      {
        question: 'O acervo do MASP é considerado o mais importante do hemisfério sul em qual área?',
        options: ['Arte asiática', 'Arte africana', 'Arte europeia', 'Arte contemporânea'],
        correctIndex: 2,
        explanation: 'A coleção de arte europeia do MASP é considerada a mais importante do hemisfério sul.',
      },
      {
        question: 'Qual artista brasileira autodidata faz parte do acervo?',
        options: ['Tarsila do Amaral', 'Maria Auxiliadora', 'Lygia Clark', 'Adriana Varejão'],
        correctIndex: 1,
        explanation: 'Maria Auxiliadora é uma das artistas autodidatas que integram o acervo diverso do MASP.',
      },
      {
        question: 'O acervo do MASP é tombado por qual órgão?',
        options: ['UNESCO', 'IPHAN', 'IBRAM', 'Secretaria de Cultura'],
        correctIndex: 1,
        explanation: 'O acervo é tombado pelo Patrimônio Histórico e Artístico Nacional – IPHAN.',
      },
      {
        question: 'Quem foi o primeiro diretor artístico do MASP?',
        options: ['Assis Chateaubriand', 'Pietro Maria Bardi', 'Lina Bo Bardi', 'Adriano Pedrosa'],
        correctIndex: 1,
        explanation: 'Pietro Maria Bardi (1900–1999) foi o primeiro diretor artístico do MASP.',
      },
    ],
  },
];
