import { motion } from 'framer-motion';
import { MaspHeader } from '@/components/MaspHeader';

/**
 * Página /sobre-masp, linha do tempo brutalista da história do museu
 * de 1947 a 2026. Pensada como conteúdo educativo profundo, complementa
 * a página Informações com narrativa cronológica.
 */

interface TimelineEvent {
  year: string;
  title: string;
  body: string;
  highlight?: boolean;
}

const TIMELINE: TimelineEvent[] = [
  {
    year: '1947',
    title: 'Fundação',
    body:
      'O empresário Assis Chateaubriand e o crítico italiano Pietro Maria Bardi fundam o MASP no centro de São Paulo, na rua Sete de Abril, com a missão de criar o primeiro museu de arte moderna do hemisfério sul.',
    highlight: true,
  },
  {
    year: '1947 a 1952',
    title: 'Formação do acervo',
    body:
      'Pietro Maria Bardi atravessa a Europa em ruínas no pós-guerra adquirindo obras de Rafael, Botticelli, Rembrandt, Van Gogh, Renoir, Cézanne e Modigliani. Em poucos anos o MASP forma a coleção de arte europeia mais importante da América Latina.',
  },
  {
    year: '1957',
    title: 'Cavaletes de cristal',
    body:
      'Lina Bo Bardi cria os icônicos cavaletes de cristal: placas de vidro fixadas em blocos de concreto, suspendendo as pinturas no ar. As obras passam a ser vistas sem hierarquia, com a parede de trás visível. Foi um gesto radical pra época.',
    highlight: true,
  },
  {
    year: '1968',
    title: 'Edifício na Paulista',
    body:
      'Inauguração do edifício projetado por Lina Bo Bardi na avenida Paulista. Quatro pilares vermelhos sustentam o volume superior, criando um vão livre de 74 metros, hoje o maior vão livre estrutural do mundo. O prédio se torna símbolo da arquitetura brutalista brasileira.',
    highlight: true,
  },
  {
    year: '1970 a 1990',
    title: 'Décadas de pesquisa',
    body:
      'Sob diversas gestões, o MASP consolida programa expositivo internacional e expande o acervo com obras de modernistas brasileiros como Anita Malfatti, Di Cavalcanti, Portinari e Tarsila do Amaral.',
  },
  {
    year: '1996',
    title: 'Restauro Lina',
    body:
      'Cavaletes de cristal são temporariamente removidos do segundo andar pra dar lugar a um modelo museológico mais convencional. Décadas depois, os cavaletes serão reinstalados como gesto curatorial de retomada do projeto original.',
  },
  {
    year: '2015',
    title: 'Acervo em Transformação',
    body:
      'Adriano Pedrosa assume a direção artística. Os cavaletes de cristal são reinstalados no segundo andar como exposição permanente "Acervo em Transformação". O programa expositivo passa a privilegiar histórias antes invisibilizadas: arte indígena, afro-brasileira, mulheres e dissidências.',
    highlight: true,
  },
  {
    year: '2024',
    title: 'Edifício Pietro Maria Bardi',
    body:
      'Inauguração do segundo edifício do MASP, ao lado do prédio histórico, homenageando Pietro Maria Bardi. Projeto do escritório Metro Arquitetos amplia o museu em 7.000 m² e abriga novas galerias, restaurante, loja e auditório.',
    highlight: true,
  },
  {
    year: '2026',
    title: 'KORA',
    body:
      'O totem interativo KORA estreia como concierge digital do museu, oferecendo roteiro personalizado, assistente de IA, mapa interativo e caça ao tesouro. Desenvolvido pela equipe KORA pra Flexmedia, como parte do Challenge FIAP.',
    highlight: true,
  },
];

const QUOTE = {
  text:
    'O dever do artista é a vida. A criação artística é apenas instrumento. O homem é o que importa.',
  by: 'Lina Bo Bardi (1914 a 1992)',
};

export default function SobreMASP() {
  return (
    <div className="min-h-screen bg-background">
      <MaspHeader />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
            <span className="block w-12 h-[2px] bg-primary" />
            1947 a 2026
          </span>
          <h1 className="font-display text-5xl md:text-7xl text-foreground uppercase mt-3 leading-[0.9]">
            79 anos<br />de MASP
          </h1>
          <div className="brutalist-rule-red mt-6 w-24" />
          <p className="text-muted-foreground text-base md:text-lg mt-6 max-w-2xl leading-relaxed">
            Uma linha do tempo do museu fundado em 1947 ao totem KORA em 2026, passando
            pelos cavaletes de cristal de Lina Bo Bardi e o novo edifício Pietro Maria Bardi.
          </p>
        </motion.section>

        {/* Lina quote, before the timeline */}
        <motion.figure
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="border-y-2 border-foreground my-12 py-10 grid grid-cols-1 md:grid-cols-[1fr_180px] gap-6 items-center"
        >
          <blockquote>
            <p className="font-display text-3xl md:text-4xl text-foreground leading-[1.05]">
              "{QUOTE.text}"
            </p>
            <figcaption className="mt-5 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              {QUOTE.by}
            </figcaption>
          </blockquote>
          <div className="hidden md:block">
            <div className="aspect-square bg-foreground flex items-center justify-center text-background">
              <span className="font-display text-7xl">LBB</span>
            </div>
          </div>
        </motion.figure>

        {/* Timeline */}
        <ol className="relative border-l-2 border-foreground pl-8 space-y-12">
          {TIMELINE.map((event, i) => (
            <motion.li
              key={event.year + event.title}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              className="relative"
            >
              {/* Marker */}
              <span
                className={`absolute -left-[41px] top-1 w-5 h-5 ${
                  event.highlight ? 'bg-primary' : 'bg-foreground'
                }`}
                aria-hidden
              />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary tnum">
                {event.year}
              </span>
              <h2 className="font-display text-3xl md:text-4xl text-foreground uppercase mt-1 leading-[1.05]">
                {event.title}
              </h2>
              <p className="text-base text-foreground leading-relaxed mt-3 max-w-2xl">
                {event.body}
              </p>
            </motion.li>
          ))}
        </ol>

        <footer className="mt-16 border-t-2 border-foreground pt-6 pb-12 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>MASP · Av. Paulista, 1578</span>
          <span>Linha do tempo · 2026</span>
        </footer>
      </div>
    </div>
  );
}
