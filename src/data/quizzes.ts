import { Landmark, Palette, Frame, Scissors, BookOpen } from 'lucide-react';

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
  iconName: 'landmark' | 'palette' | 'frame' | 'scissors' | 'book-open';
  questions: QuizQuestion[];
}

// Quiz reescrito para a Sprint Review 4, todas as perguntas refeitas para
// serem factuais e verificaveis. As perguntas subjetivas anteriores foram
// removidas com base no feedback dos visitantes da Sprint 3.

export const quizCategories: QuizCategory[] = [
  {
    id: 'masp',
    title: 'Sobre o MASP',
    description: 'Datas, fundadores e fatos verificáveis sobre o museu',
    iconName: 'landmark',
    questions: [
      {
        question: 'Em que ano o MASP foi fundado?',
        options: ['1922', '1947', '1960', '1968'],
        correctIndex: 1,
        explanation: 'O MASP foi fundado em 2 de outubro de 1947, no centro de São Paulo, por Assis Chateaubriand e Pietro Maria Bardi.',
      },
      {
        question: 'Qual arquiteta projetou o edifício do MASP na Avenida Paulista?',
        options: ['Lina Bo Bardi', 'Janete Costa', 'Carmen Portinho', 'Niomar Moniz Sodré'],
        correctIndex: 0,
        explanation: 'Lina Bo Bardi (1914 a 1992), arquiteta ítalo-brasileira, projetou o edifício inaugurado em 1968.',
      },
      {
        question: 'Quantos metros tem o vão livre do edifício de Lina Bo Bardi?',
        options: ['54 metros', '64 metros', '74 metros', '84 metros'],
        correctIndex: 2,
        explanation: 'O vão livre tem 74 metros, sustentado por quatro pilares vermelhos. É o maior vão livre estrutural do mundo dessa categoria.',
      },
      {
        question: 'Quantas obras compõem o acervo do MASP?',
        options: ['Cerca de 1 mil', 'Cerca de 5 mil', 'Mais de 11 mil', 'Mais de 50 mil'],
        correctIndex: 2,
        explanation: 'O acervo conta com mais de 11 mil obras, abrangendo arte europeia, brasileira, africana, asiática e das Américas.',
      },
      {
        question: 'Em que ano foi inaugurado o novo edifício Pietro Maria Bardi?',
        options: ['1968', '2015', '2022', '2024'],
        correctIndex: 3,
        explanation: 'O edifício Pietro Maria Bardi foi inaugurado em 2024 ao lado do prédio histórico, ampliando o museu em 7 mil m².',
      },
    ],
  },
  {
    id: 'expo-chola',
    title: 'La Chola Poblete',
    description: 'Pop andino, exposição em cartaz no 2º Andar Pietro Maria Bardi',
    iconName: 'palette',
    questions: [
      {
        question: 'De qual país é a artista La Chola Poblete?',
        options: ['Bolívia', 'Argentina', 'Peru', 'Chile'],
        correctIndex: 1,
        explanation: 'La Chola Poblete nasceu em Guaymallén, Mendoza, Argentina, em 1989.',
      },
      {
        question: 'Em qual bienal internacional a série "Chola Virgins" foi apresentada antes de chegar ao MASP?',
        options: ['Bienal de São Paulo', 'Bienal de Veneza', 'Bienal de Berlim', 'Bienal de Istambul'],
        correctIndex: 1,
        explanation: 'As aquarelas foram apresentadas na 60ª Bienal de Veneza em 2024 e agora estão no MASP.',
      },
      {
        question: 'Quantas obras compõem a exposição Pop andino?',
        options: ['11', '21', '31', '51'],
        correctIndex: 2,
        explanation: 'A exposição reúne 31 obras que tensionam identidade, gênero e os efeitos do colonialismo na América Latina.',
      },
    ],
  },
  {
    id: 'expo-gamarra',
    title: 'Sandra Gamarra Heshiki',
    description: 'Réplica, primeira retrospectiva da artista no MASP',
    iconName: 'frame',
    questions: [
      {
        question: 'Qual é a nacionalidade da artista Sandra Gamarra Heshiki?',
        options: ['Boliviana', 'Equatoriana', 'Peruana', 'Mexicana'],
        correctIndex: 2,
        explanation: 'Sandra Gamarra Heshiki nasceu em Lima, Peru, em 1972.',
      },
      {
        question: 'Quantos anos de produção a retrospectiva cobre?',
        options: ['10 anos', '15 anos', '25 anos', '40 anos'],
        correctIndex: 2,
        explanation: 'A exposição cobre 25 anos de produção da artista, com mais de 70 obras entre pinturas, esculturas, instalações e vídeo.',
      },
      {
        question: 'Como se chama o museu fictício criado pela artista?',
        options: ['LiMAC', 'MALI', 'MUNAL', 'MARCO'],
        correctIndex: 0,
        explanation: 'LiMAC é o "Museu de Arte Contemporânea de Lima", instituição fictícia criada por Gamarra para denunciar a ausência de um museu real de arte contemporânea no Peru.',
      },
    ],
  },
  {
    id: 'expo-alarcon',
    title: 'Claudia Alarcón & Silät',
    description: 'Viver tecendo, têxtil Wichí do Gran Chaco',
    iconName: 'scissors',
    questions: [
      {
        question: 'O coletivo Silät reúne mulheres de qual povo indígena?',
        options: ['Guarani', 'Mapuche', 'Wichí', 'Aimará'],
        correctIndex: 2,
        explanation: 'O Silät é formado por mais de 100 mulheres do povo Wichí do norte da Argentina.',
      },
      {
        question: 'Qual fibra natural é usada nos tecidos da exposição?',
        options: ['Algodão', 'Linho', 'Chaguar', 'Seda'],
        correctIndex: 2,
        explanation: 'Os tecidos são feitos em fios de chaguar, fibra extraída de plantas nativas do Gran Chaco.',
      },
      {
        question: 'Quantas obras compõem a exposição Viver tecendo?',
        options: ['15', '25', '35', '50'],
        correctIndex: 1,
        explanation: 'A exposição reúne 25 obras tecidas em chaguar, combinando padrões tradicionais e processos colaborativos.',
      },
    ],
  },
  {
    id: 'acervo',
    title: 'Sobre o Acervo',
    description: 'Grandes obras do acervo do MASP, fatos verificáveis',
    iconName: 'book-open',
    questions: [
      {
        question: 'Qual artista brasileira autodidata faz parte do acervo do MASP?',
        options: ['Tarsila do Amaral', 'Maria Auxiliadora', 'Lygia Clark', 'Adriana Varejão'],
        correctIndex: 1,
        explanation: 'Maria Auxiliadora da Silva (1935 a 1974), artista autodidata mineira, é uma das brasileiras representadas no acervo do MASP.',
      },
      {
        question: 'Em que área o acervo do MASP é considerado o mais importante do hemisfério sul?',
        options: ['Arte asiática', 'Arte africana', 'Arte europeia', 'Arte contemporânea'],
        correctIndex: 2,
        explanation: 'A coleção de arte europeia do MASP é considerada a mais importante do hemisfério sul, formada por Pietro Maria Bardi entre 1947 e 1952.',
      },
      {
        question: 'A pintura "Rosa e Azul" pertence ao acervo do MASP. Quem é o autor?',
        options: ['Edgar Degas', 'Pierre-Auguste Renoir', 'Henri Matisse', 'Paul Cézanne'],
        correctIndex: 1,
        explanation: '"Rosa e Azul" (1881) é de Pierre-Auguste Renoir, retrato das filhas do banqueiro Louis Cahen d\'Anvers. Adquirida pelo MASP em 1952.',
      },
      {
        question: 'Por qual órgão federal o acervo do MASP é tombado?',
        options: ['UNESCO', 'IPHAN', 'IBRAM', 'IBGE'],
        correctIndex: 1,
        explanation: 'O acervo é tombado pelo IPHAN, Instituto do Patrimônio Histórico e Artístico Nacional, desde 1969.',
      },
      {
        question: 'Quem foi o primeiro diretor artístico do MASP?',
        options: ['Assis Chateaubriand', 'Pietro Maria Bardi', 'Lina Bo Bardi', 'Adriano Pedrosa'],
        correctIndex: 1,
        explanation: 'Pietro Maria Bardi (1900 a 1999), crítico italiano, foi o primeiro diretor artístico, cargo que ocupou de 1947 a 1996.',
      },
      {
        question: 'Quem é o atual diretor artístico do MASP?',
        options: ['Pietro Maria Bardi', 'Walter Zanini', 'Adriano Pedrosa', 'Tadeu Chiarelli'],
        correctIndex: 2,
        explanation: 'Adriano Pedrosa assumiu a direção artística em 2014 e foi curador do Pavilhão Brasil na Bienal de Veneza 2024.',
      },
    ],
  },
];
