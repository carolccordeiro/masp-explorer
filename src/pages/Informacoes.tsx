import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Ticket, Phone, ChevronDown, ChevronUp, ExternalLink, Train, Car, Accessibility, Baby } from 'lucide-react';
import { MaspHeader } from '@/components/MaspHeader';
import { exhibitions } from '@/data/exhibitions';

interface InfoSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function Informacoes() {
  const [openSection, setOpenSection] = useState<string | null>('sobre');
  const [selectedExpoId, setSelectedExpoId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenSection(openSection === id ? null : id);

  const sections: InfoSection[] = [
    {
      id: 'sobre',
      title: 'Sobre o MASP',
      icon: <MapPin className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-sm text-foreground leading-relaxed">
          <p>
            O <strong>MASP – Museu de Arte de São Paulo Assis Chateaubriand</strong> é uma instituição privada
            sem fins lucrativos fundada em <strong>1947</strong>. O museu, composto por dois prédios e um vão livre,
            é reconhecido como um dos principais centros culturais do país.
          </p>
          <p>
            O edifício original (1968), ícone da arquitetura moderna, leva o nome de sua arquiteta,
            <strong> Lina Bo Bardi</strong> (1914–1992), enquanto o mais recente, inaugurado em 2024,
            homenageia o primeiro diretor artístico do museu, <strong>Pietro Maria Bardi</strong> (1900–1999).
          </p>
          <p>
            A coleção do MASP é considerada a mais importante de arte europeia no hemisfério sul.
            Com <strong>mais de 11 mil obras</strong>, abrange diferentes períodos históricos, origens e linguagens artísticas.
          </p>
          <div className="p-4 bg-masp-light border-l-4 border-primary">
            <p className="font-bold text-foreground mb-1">Missão</p>
            <p className="text-muted-foreground text-xs">
              Museu diverso, inclusivo e plural, com a missão de estabelecer, de maneira crítica e criativa,
              diálogos entre passado e presente, culturas e territórios, a partir das artes visuais.
            </p>
          </div>
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>Av. Paulista, 1578 – CEP 01310-200 – São Paulo, SP, Brasil</span>
          </div>
        </div>
      ),
    },
    {
      id: 'horarios',
      title: 'Horários e Ingressos',
      icon: <Clock className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="font-bold text-primary">TERÇA GRÁTIS NUBANK</span>
              <span className="text-foreground">10h às 20h</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="font-bold text-foreground">QUARTA A DOMINGO</span>
              <span className="text-foreground">10h às 18h</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="font-bold text-primary">SEXTA B3</span>
              <span className="text-foreground">10h às 21h</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="font-bold text-muted-foreground">SEGUNDA</span>
              <span className="text-muted-foreground">Fechado</span>
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <p className="font-bold text-foreground">Ingressos</p>
            <div className="flex justify-between">
              <span className="text-foreground">Inteira</span>
              <span className="font-bold text-foreground">R$ 85,00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground">Meia-entrada</span>
              <span className="font-bold text-foreground">R$ 42,00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground">Gratuito</span>
              <span className="text-xs text-muted-foreground">Amigo MASP, crianças até 10 anos, PcD</span>
            </div>
          </div>
          <div className="p-3 bg-primary/5 border border-primary/20">
            <p className="text-xs text-muted-foreground">
              <strong className="text-primary">Terça Gratuita Nubank:</strong> entrada gratuita para todos, sem necessidade de ser cliente Nubank.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              <strong className="text-primary">Sexta B3:</strong> gratuidade a partir das 18h.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'ingressos',
      title: 'Acervo',
      icon: <Ticket className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-sm text-foreground leading-relaxed">
          <p>
            O acervo do MASP conta com mais de <strong>11 mil obras</strong>, abrangendo arte africana,
            das Américas, asiática, brasileira e europeia, desde a Antiguidade até o século 21.
          </p>
          <p>
            Inclui obras de <strong>Rafael, Van Gogh, Cézanne, Renoir, Monet, Picasso</strong>, além de artistas
            brasileiros como <strong>Anita Malfatti, Di Cavalcanti, Candido Portinari</strong> e artistas autodidatas
            como <strong>Maria Auxiliadora</strong>.
          </p>
          <p>O acervo é tombado pelo <strong>IPHAN</strong> e vem sendo enriquecido por meio de doações.</p>
          <a
            href="https://masp.org.br/acervo/busca"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary font-bold text-xs"
          >
            Pesquisar no acervo online <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      ),
    },
    {
      id: 'exposicoes',
      title: 'Exposições em Cartaz',
      icon: <Ticket className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          {exhibitions.map((expo) => (
            <button
              key={expo.id}
              onClick={() => setSelectedExpoId(selectedExpoId === expo.id ? null : expo.id)}
              className="w-full text-left border border-border hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-3 p-3">
                <img src={expo.image} alt={expo.title} className="w-16 h-16 object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-foreground truncate">{expo.artist}</p>
                  <p className="text-xs text-muted-foreground truncate">{expo.title}</p>
                  <p className="text-xs text-primary">{expo.floor}</p>
                </div>
              </div>
              <AnimatePresence>
                {selectedExpoId === expo.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-3 pb-3 text-xs text-muted-foreground leading-relaxed">{expo.description}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
      ),
    },
    {
      id: 'servicos',
      title: 'Serviços e Contato',
      icon: <Phone className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-bold text-foreground mb-2">Restaurante - MASP A Baianeira</p>
            <div className="text-muted-foreground space-y-1 text-xs">
              <p>Terca a Sexta: 11h30 as 15h</p>
              <p>Sabado e Domingo: 11h30 as 16h</p>
              <p>Segunda: Fechado</p>
              <div className="flex items-start gap-1.5 mt-1">
                <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                <span>Av. Paulista, 1500 - Ed. Pietro Maria Bardi (Piso Terreo)</span>
              </div>
              <p className="mt-1">Ha delivery via iFood. Cardapio completo em @abaianeira</p>
            </div>
          </div>
          <div>
            <p className="font-bold text-foreground mb-2">Cafe MASP</p>
            <div className="text-muted-foreground space-y-1 text-xs">
              <p>Inaugurado em 2022, parceria entre MASP e A Baianeira, sob direcao da chef Manuelle Ferraz.</p>
              <p>Terca, Sexta e Sabado: 10h as 22h</p>
              <p>Quarta, Quinta e Domingo: 10h as 18h</p>
              <p>Fechado as segundas-feiras</p>
              <p>Edificio Lina: 1o andar e 1o subsolo | Edificio Pietro: Terreo</p>
            </div>
          </div>
          <div>
            <p className="font-bold text-foreground mb-2">Como chegar</p>
            <div className="text-muted-foreground space-y-1.5 text-xs">
              <div className="flex items-start gap-1.5">
                <Train className="w-3 h-3 shrink-0 mt-0.5" />
                <span><strong>Metro:</strong> Linha Verde, estacao Trianon-MASP</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Car className="w-3 h-3 shrink-0 mt-0.5" />
                <span><strong>Estacionamento conveniado:</strong> Car Park - Al. Casa Branca, 41 - R$25 (ate 12h com carimbo na recepcao do MASP). Funcionamento 24h.</span>
              </div>
              <p><strong>Outros estacionamentos:</strong> Progress Park Paulista (Av. Paulista, 1636) | Multipark Wall Street (Rua Itapeva, 636)</p>
            </div>
          </div>
          <div>
            <p className="font-bold text-foreground mb-2">Contato</p>
            <p className="text-xs text-muted-foreground">Tel: +55 11 3149 5959</p>
            <p className="text-xs text-muted-foreground">E-mail: bilheteria@masp.org.br</p>
          </div>
          <div>
            <p className="font-bold text-foreground mb-2">Acessibilidade</p>
            <div className="text-xs text-muted-foreground space-y-1.5">
              <div className="flex items-start gap-1.5">
                <Accessibility className="w-3 h-3 shrink-0 mt-0.5" />
                <span>Entrada gratuita para pessoas com deficiencia e acompanhante</span>
              </div>
              <p>Caes-guia permitidos (Lei 11.126/2005)</p>
              <div className="flex items-start gap-1.5">
                <Baby className="w-3 h-3 shrink-0 mt-0.5" />
                <span>Menores de 14 anos: entrada acompanhados</span>
              </div>
            </div>
          </div>
          <div>
            <p className="font-bold text-foreground mb-2">Informacoes adicionais</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>O ingresso da direito a visitar todas as exposicoes em cartaz no dia da visita.</p>
              <p>O MASP aceita Pix e todos os cartoes de credito e debito.</p>
              <p>Agendamento online obrigatorio, inclusive para dias gratuitos.</p>
              <p>Bilheteria fisica: Terca 10h-19h | Sexta 10h-20h | Quarta a Domingo 10h-17h</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MaspHeader />

      <div className="px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-foreground mb-2">Informações</h1>
          <p className="text-muted-foreground text-sm mb-8">Tudo sobre o MASP</p>
        </motion.div>

        <div className="space-y-2">
          {sections.map((section, i) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border border-border"
            >
              <button
                onClick={() => toggle(section.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-masp-light transition-colors"
              >
                <div className="text-primary">{section.icon}</div>
                <span className="flex-1 font-bold text-foreground">{section.title}</span>
                {openSection === section.id ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              <AnimatePresence>
                {openSection === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">{section.content}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
