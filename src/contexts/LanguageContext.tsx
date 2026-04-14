import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type Lang = 'pt' | 'en';

const translations: Record<Lang, Record<string, string>> = {
  pt: {
    // Menu
    'menu.planejar': 'Planejar Visita',
    'menu.planejar.desc': 'Roteiro personalizado em segundos',
    'menu.assistente': 'Assistente IA',
    'menu.assistente.desc': 'Converse com a KORA sobre arte',
    'menu.mapa': 'Mapa Interativo',
    'menu.mapa.desc': 'Explore cada andar',
    'menu.colecao': 'Minha Coleção',
    'menu.colecao.desc': 'Salve obras e exposições favoritas',
    'menu.quiz': 'Quiz Educativo',
    'menu.quiz.desc': 'Quiz e caça ao tesouro nas exposições',
    'menu.info': 'Informações',
    'menu.info.desc': 'Saiba tudo sobre o MASP',
    'menu.dados': 'Dados de Uso',
    'menu.dados.desc': 'Transparência dos seus dados',
    'menu.parceiros': 'Parceiros Próximos',
    'menu.parceiros.desc': 'Restaurantes e lojas perto do MASP',
    'menu.cupom': '15% OFF no Café do MASP',
    'menu.cupom.desc': 'Toque para ganhar seu cupom',
    // Header
    'header.menu': 'Menu',
    'header.encerrar': 'Encerrar',
    // Welcome
    'welcome.subtitle': 'Totem Interativo Inteligente · Powered by KORA · Flexmedia',
    'welcome.consent': 'Ao continuar, concordo com a coleta e uso dos meus dados de interação conforme a Política de Privacidade do MASP. Os dados serão utilizados para melhorar a experiência do visitante.',
    'welcome.start': 'TOQUE PARA COMEÇAR',
    // Index
    'index.bemvindo': 'Bem-vindo ao MASP!',
    'index.intro': 'Sou a KORA, sua guia interativa. Diga quanto tempo você tem e eu crio um roteiro personalizado só para você.',
    'index.voz': 'Diga "Planejar visita", "Quiz", "Mapa", "Assistente" ou "Informações"',
    // Common
    'common.fechar': 'Fechar',
    'common.voltar': 'Voltar',
    'common.salvar': 'Salvar',
    'common.salvo': 'Salvo',
    'common.falar': 'Falar',
    'common.ouvindo': 'Ouvindo...',
    // Planejar
    'planejar.titulo': 'Planejar Visita',
    'planejar.step1': '1. Tempo disponível',
    'planejar.step2': '2. Quem está visitando',
    'planejar.step3': '3. Temas de interesse',
    'planejar.step4': 'Seu roteiro personalizado',
    'planejar.tempo': 'Quanto tempo você tem disponível para a visita hoje?',
    'planejar.perfil': 'Quem está visitando o MASP com você hoje?',
    'planejar.temas': 'Quais temas mais interessam a vocês? (Selecione um ou mais)',
    'planejar.gerar': 'Gerar Meu Roteiro',
    'planejar.recomecar': 'Recomeçar',
    'planejar.roteiro': 'Seu Roteiro',
    'planejar.principal': 'Principal',
    // Quiz
    'quiz.titulo': 'Quiz Educativo',
    'quiz.escolha': 'Escolha uma categoria para começar',
    'quiz.proxima': 'Próxima pergunta',
    'quiz.resultado': 'Ver resultado',
    'quiz.excelente': 'Excelente!',
    'quiz.muitobem': 'Muito bem!',
    'quiz.continue': 'Continue aprendendo!',
    'quiz.acertou': 'Você acertou',
    'quiz.de': 'de',
    'quiz.perguntas': 'perguntas',
    'quiz.parabens': 'Parabéns! Você ganhou um prêmio',
    'quiz.desconto': '15% de desconto no Café e Loja MASP',
    'quiz.resgatar': 'Resgatar cupom',
    'quiz.novamente': 'Jogar novamente',
    'quiz.outro': 'Escolher outro quiz',
    // Coleção
    'colecao.titulo': 'Minha Coleção',
    'colecao.subtitulo': 'Explore as obras e salve suas favoritas',
    'colecao.explorar': 'Explorar Obras',
    'colecao.salvos': 'Salvos',
    'colecao.nenhuma': 'Nenhuma obra salva',
    'colecao.explore': 'Explore as exposições na aba "Explorar Obras" e toque no coração para salvar.',
    // Mapa
    'mapa.titulo': 'Mapa Interativo',
    'mapa.subtitulo': 'Explore cada andar do MASP',
    'mapa.destaques': 'Destaques',
    'mapa.exposicoes': 'Exposições neste andar',
    // Informações
    'info.titulo': 'Informações',
    'info.subtitulo': 'Tudo sobre o MASP',
    // Dados
    'dados.titulo': 'Dados de Uso',
    'dados.subtitulo': 'Transparência sobre como seus dados são utilizados',
    'dados.direitos': 'Seus direitos',
    'dados.exclusao': 'Exclusão de dados',
    // Parceiros
    'parceiros.titulo': 'Parceiros Próximos',
    'parceiros.subtitulo': 'Descubra restaurantes e lojas perto do MASP',
    // Cupom
    'cupom.titulo': '15% OFF no Café',
    'cupom.subtitulo': 'MASP A Baianeira',
    'cupom.descricao': 'Preencha seus dados e ganhe um cupom de 15% de desconto no café do MASP!',
    'cupom.nome': 'Seu nome',
    'cupom.email': 'Seu e-mail',
    'cupom.ganhar': 'Ganhar cupom',
    'cupom.gerado': 'Cupom gerado!',
    'cupom.codigo': 'Seu código:',
    'cupom.apresente': 'Apresente este código no MASP A Baianeira e ganhe 15% de desconto!',
  },
  en: {
    // Menu
    'menu.planejar': 'Plan Your Visit',
    'menu.planejar.desc': 'Personalized itinerary in seconds',
    'menu.assistente': 'AI Assistant',
    'menu.assistente.desc': 'Chat with KORA about art',
    'menu.mapa': 'Interactive Map',
    'menu.mapa.desc': 'Explore each floor',
    'menu.colecao': 'My Collection',
    'menu.colecao.desc': 'Save your favorite artworks',
    'menu.quiz': 'Educational Quiz',
    'menu.quiz.desc': 'Quiz and treasure hunt in the exhibitions',
    'menu.info': 'Information',
    'menu.info.desc': 'Everything about MASP',
    'menu.dados': 'Data Usage',
    'menu.dados.desc': 'Transparency about your data',
    'menu.parceiros': 'Nearby Partners',
    'menu.parceiros.desc': 'Restaurants and shops near MASP',
    'menu.cupom': '15% OFF at MASP Café',
    'menu.cupom.desc': 'Tap to get your coupon',
    // Header
    'header.menu': 'Menu',
    'header.encerrar': 'End',
    // Welcome
    'welcome.subtitle': 'Smart Interactive Totem · Powered by KORA · Flexmedia',
    'welcome.consent': 'By continuing, I agree to the collection and use of my interaction data in accordance with MASP\'s Privacy Policy. Data will be used to improve the visitor experience.',
    'welcome.start': 'TAP TO START',
    // Index
    'index.bemvindo': 'Welcome to MASP!',
    'index.intro': 'I\'m KORA, your interactive guide. Tell me how much time you have and I\'ll create a personalized itinerary just for you.',
    'index.voz': 'Say "Plan visit", "Quiz", "Map", "Assistant" or "Information"',
    // Common
    'common.fechar': 'Close',
    'common.voltar': 'Back',
    'common.salvar': 'Save',
    'common.salvo': 'Saved',
    'common.falar': 'Speak',
    'common.ouvindo': 'Listening...',
    // Planejar
    'planejar.titulo': 'Plan Your Visit',
    'planejar.step1': '1. Available time',
    'planejar.step2': '2. Who is visiting',
    'planejar.step3': '3. Topics of interest',
    'planejar.step4': 'Your personalized itinerary',
    'planejar.tempo': 'How much time do you have for your visit today?',
    'planejar.perfil': 'Who is visiting MASP with you today?',
    'planejar.temas': 'Which topics interest you most? (Select one or more)',
    'planejar.gerar': 'Generate My Itinerary',
    'planejar.recomecar': 'Start over',
    'planejar.roteiro': 'Your Itinerary',
    'planejar.principal': 'Main',
    // Quiz
    'quiz.titulo': 'Educational Quiz',
    'quiz.escolha': 'Choose a category to start',
    'quiz.proxima': 'Next question',
    'quiz.resultado': 'See results',
    'quiz.excelente': 'Excellent!',
    'quiz.muitobem': 'Well done!',
    'quiz.continue': 'Keep learning!',
    'quiz.acertou': 'You got',
    'quiz.de': 'of',
    'quiz.perguntas': 'questions',
    'quiz.parabens': 'Congratulations! You won a prize',
    'quiz.desconto': '15% off at MASP Café and Store',
    'quiz.resgatar': 'Claim coupon',
    'quiz.novamente': 'Play again',
    'quiz.outro': 'Choose another quiz',
    // Coleção
    'colecao.titulo': 'My Collection',
    'colecao.subtitulo': 'Explore artworks and save your favorites',
    'colecao.explorar': 'Explore Artworks',
    'colecao.salvos': 'Saved',
    'colecao.nenhuma': 'No saved artworks',
    'colecao.explore': 'Explore the exhibitions in the "Explore Artworks" tab and tap the heart to save.',
    // Mapa
    'mapa.titulo': 'Interactive Map',
    'mapa.subtitulo': 'Explore each floor of MASP',
    'mapa.destaques': 'Highlights',
    'mapa.exposicoes': 'Exhibitions on this floor',
    // Informações
    'info.titulo': 'Information',
    'info.subtitulo': 'Everything about MASP',
    // Dados
    'dados.titulo': 'Data Usage',
    'dados.subtitulo': 'Transparency about how your data is used',
    'dados.direitos': 'Your rights',
    'dados.exclusao': 'Data deletion',
    // Parceiros
    'parceiros.titulo': 'Nearby Partners',
    'parceiros.subtitulo': 'Discover restaurants and shops near MASP',
    // Cupom
    'cupom.titulo': '15% OFF at Café',
    'cupom.subtitulo': 'MASP A Baianeira',
    'cupom.descricao': 'Fill in your details and get a 15% discount coupon at MASP café!',
    'cupom.nome': 'Your name',
    'cupom.email': 'Your email',
    'cupom.ganhar': 'Get coupon',
    'cupom.gerado': 'Coupon generated!',
    'cupom.codigo': 'Your code:',
    'cupom.apresente': 'Show this code at MASP A Baianeira and get 15% off!',
  },
};

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'pt',
  setLang: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('pt');

  const t = useCallback(
    (key: string) => translations[lang][key] || translations.pt[key] || key,
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
