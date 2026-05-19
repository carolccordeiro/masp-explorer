import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Coffee, ArrowLeft } from 'lucide-react';
import { exhibitions } from '@/data/exhibitions';

/**
 * Página acessada quando o visitante escaneia o QR Code gerado pelo TreasureHunt.
 * Lê os ids do roteiro da query string e mostra o resumo da visita em formato
 * mobile-friendly, junto do cupom de café quando ganhou o prêmio.
 *
 * Não recebe nenhum dado pessoal, só ids públicos das exposições.
 */
export default function Roteiro() {
  const [params] = useSearchParams();
  const roteiroIds = params.get('r')?.split(',').filter(Boolean) ?? [];
  const totalDuration = Number(params.get('t') ?? '0');

  const list = useMemo(
    () => roteiroIds.map((id) => exhibitions.find((e) => e.id === id)).filter(Boolean),
    [roteiroIds],
  ) as typeof exhibitions;

  const hasCoupon = roteiroIds.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b-2 border-foreground">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <a href="https://masp.org.br" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-black tracking-[0.3em] uppercase">MASP</span>
          </a>
          <span className="text-primary font-black text-2xl tracking-tighter">MASP</span>
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground">
            KORA
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-8">
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
            <span className="block w-8 h-[2px] bg-primary" />
            Sua visita ao MASP
          </span>
          <h1 className="font-display text-4xl text-foreground uppercase mt-3 leading-[0.95]">
            Roteiro salvo
          </h1>
          <div className="brutalist-rule-red mt-4 w-20" />
          <p className="text-muted-foreground text-sm mt-5 leading-relaxed">
            Esta é a versão do seu roteiro feita no totem do museu. Sem dados pessoais,
            apenas as exposições que você escolheu visitar.
          </p>
        </motion.section>

        {/* Resumo */}
        <div className="grid grid-cols-2 border-y-2 border-foreground my-8">
          <div className="py-4 px-4 border-r-2 border-foreground">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
              Exposições
            </span>
            <p className="font-display text-3xl text-foreground mt-1 tnum">
              {String(list.length).padStart(2, '0')}
            </p>
          </div>
          <div className="py-4 px-4">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
              Tempo total
            </span>
            <p className="font-display text-3xl text-foreground mt-1 tnum">
              {totalDuration || list.reduce((s, e) => s + e.duration, 0)} min
            </p>
          </div>
        </div>

        {/* Cupom */}
        {hasCoupon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="border-2 border-primary bg-primary text-primary-foreground p-6 mb-10 flex items-center gap-4"
          >
            <Coffee className="w-8 h-8 shrink-0" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Cupom ativo
              </span>
              <h3 className="font-display text-2xl uppercase mt-0.5">15% no Café do MASP</h3>
              <p className="text-xs opacity-90 mt-1">
                Mostre esta tela no caixa do café. Válido hoje, no museu.
              </p>
            </div>
          </motion.div>
        )}

        {/* Lista de obras */}
        {list.length > 0 ? (
          <ol className="space-y-4">
            {list.map((expo, i) => (
              <motion.li
                key={expo.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="border-2 border-foreground"
              >
                <div className="aspect-[3/2] overflow-hidden bg-muted">
                  <img src={expo.image} alt={expo.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-primary flex items-center gap-1.5">
                    <span className="tnum">{String(i + 1).padStart(2, '0')}</span>
                    <span className="block w-4 h-[2px] bg-primary" />
                    <MapPin className="w-3 h-3" />
                    {expo.floor}
                  </span>
                  <h2 className="font-display text-2xl text-foreground mt-2 leading-tight">
                    {expo.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">{expo.artist}</p>
                  <p className="text-sm text-foreground leading-relaxed mt-4">{expo.description}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground mt-4 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    Tempo sugerido {expo.duration} min
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        ) : (
          <p className="text-muted-foreground text-sm">
            Roteiro vazio. Volte ao totem do MASP para gerar um novo.
          </p>
        )}

        <footer className="mt-12 border-t-2 border-foreground pt-6 pb-12 text-[10px] uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-between">
          <span>MASP · Av. Paulista, 1578</span>
          <span>Powered by KORA · Flexmedia</span>
        </footer>
      </main>
    </div>
  );
}
