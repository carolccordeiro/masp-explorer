import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell,
} from 'recharts';
import {
  Eye, MousePointerClick, Clock, ShieldCheck, Ticket, Users, ArrowDownRight, ArrowUpRight,
  Calendar, Map, Heart, Sparkles, Info, Shield, HelpCircle,
} from 'lucide-react';

/**
 * Dashboard admin do totem MASP, rota /admin.
 *
 * Os dados aqui sao simulados pra demonstracao. Em producao, viriam de um
 * pipeline de analytics anonimos, sem PII, ja em conformidade com a LGPD
 * declarada no consentimento da WelcomeScreen.
 *
 * Em producao essa rota seria protegida por autenticacao (operacao Flexmedia).
 */

// Dados simulados de uma semana de operacao
const SESSIONS_BY_DAY = [
  { day: 'Seg', sessions: 412, conversoes: 268 },
  { day: 'Ter', sessions: 538, conversoes: 359 }, // dia "terca gratis Nubank"
  { day: 'Qua', sessions: 401, conversoes: 248 },
  { day: 'Qui', sessions: 446, conversoes: 281 },
  { day: 'Sex', sessions: 612, conversoes: 414 }, // sexta B3 horario estendido
  { day: 'Sab', sessions: 728, conversoes: 502 },
  { day: 'Dom', sessions: 689, conversoes: 471 },
];

const SCREEN_HEAT = [
  { screen: 'Menu Principal', tocks: 3826, pct: 100, icon: 'menu' },
  { screen: 'Planejar Visita', tocks: 2418, pct: 63, icon: Calendar },
  { screen: 'Assistente IA', tocks: 1872, pct: 49, icon: Sparkles },
  { screen: 'Mapa Interativo', tocks: 1543, pct: 40, icon: Map },
  { screen: 'Quiz Educativo', tocks: 1284, pct: 34, icon: HelpCircle },
  { screen: 'Minha Coleção', tocks: 982, pct: 26, icon: Heart },
  { screen: 'Informações', tocks: 723, pct: 19, icon: Info },
  { screen: 'Dados de Uso', tocks: 184, pct: 5, icon: Shield },
];

const TOP_EXPOS = [
  { nome: 'Pop andino', artista: 'La Chola Poblete', views: 1842 },
  { nome: 'réplica', artista: 'Sandra Gamarra Heshiki', views: 1217 },
  { nome: 'viver tecendo', artista: 'Claudia Alarcón & Silät', views: 894 },
  { nome: 'O Outro, Eu e os Outros', artista: 'Iván Argote', views: 612 },
  { nome: 'Acervo em Transformação', artista: 'Coletivo', views: 533 },
];

const PARTNERS = [
  { nome: 'Restaurante Balaio', cupons: 184, impressoes: 3826 },
  { nome: 'Livraria da Vila', cupons: 92, impressoes: 3826 },
];

const stat = (label: string, value: string, delta: string, deltaUp: boolean, Icon: any) => ({
  label, value, delta, deltaUp, Icon,
});

const STATS = [
  stat('Sessões na semana', '3.826', '+12,4% vs semana anterior', true, Users),
  stat('Conversão LGPD', '64,2%', '+1,8 pts vs media histórica', true, ShieldCheck),
  stat('Tempo médio na sessão', '4:17', '-0:22 vs semana anterior', false, Clock),
  stat('Cupons resgatados', '276', '+19,6% vs semana anterior', true, Ticket),
];

const tickFormat = (n: number) => n.toLocaleString('pt-BR');

export default function Admin() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b-2 border-foreground sticky top-0 z-50 bg-background">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-primary font-black text-2xl tracking-tighter">MASP</span>
            <span className="block w-px h-6 bg-foreground/20" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                Console Flexmedia
              </p>
              <p className="text-sm font-bold text-foreground">Dashboard de uso do totem</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Periodo
            </span>
            <span className="border-2 border-foreground px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">
              7 dias · 12 a 18 mai 2026
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
            <span className="block w-12 h-[2px] bg-primary" />
            Visão geral
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-foreground uppercase mt-3">
            Como o totem performou
          </h1>
          <div className="brutalist-rule-red mt-5 w-24" />
          <p className="text-muted-foreground text-base mt-5 max-w-2xl leading-relaxed">
            Métricas anônimas de uso do totem KORA, sem dados pessoais, em conformidade
            com a LGPD declarada no consentimento de cada sessão.
          </p>
        </motion.section>

        {/* 4 stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-2 border-foreground mt-10">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`p-6 ${i < STATS.length - 1 ? 'border-b-2 md:border-b-0 md:border-r-2 border-foreground' : ''}`}
            >
              <div className="flex items-center justify-between mb-4">
                <s.Icon className="w-5 h-5 text-primary" strokeWidth={2} />
                <span className={`text-[10px] font-black uppercase tracking-[0.18em] flex items-center gap-1 ${s.deltaUp ? 'text-primary' : 'text-muted-foreground'}`}>
                  {s.deltaUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                </span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground mb-1">
                {s.label}
              </p>
              <p className="font-display text-4xl text-foreground tnum leading-none">{s.value}</p>
              <p className={`text-[10px] mt-3 font-bold tracking-tight ${s.deltaUp ? 'text-primary' : 'text-muted-foreground'}`}>
                {s.delta}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Sessions by day */}
        <section className="mt-12">
          <div className="flex items-end justify-between mb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
                <span className="block w-10 h-[2px] bg-primary" /> Engajamento
              </span>
              <h2 className="font-display text-3xl text-foreground uppercase mt-2">
                Sessões por dia
              </h2>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
              Sessoes vs. Conversoes LGPD
            </span>
          </div>
          <div className="border-2 border-foreground p-4 bg-background">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={SESSIONS_BY_DAY} margin={{ top: 12, right: 24, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fontWeight: 700, fill: 'hsl(var(--foreground))', letterSpacing: 2 }}
                  axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                  tickFormatter={tickFormat}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--foreground))',
                    color: 'hsl(var(--background))',
                    border: '0',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                  labelStyle={{ color: 'hsl(var(--background))' }}
                  cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="hsl(var(--foreground))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--foreground))', r: 5, strokeWidth: 0 }}
                  activeDot={{ r: 7 }}
                  name="Sessões"
                />
                <Line
                  type="monotone"
                  dataKey="conversoes"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', r: 5, strokeWidth: 0 }}
                  activeDot={{ r: 7 }}
                  name="LGPD aceitas"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Two column: heatmap + partners */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
          <section className="lg:col-span-2">
            <div className="flex items-end justify-between mb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
                  <span className="block w-10 h-[2px] bg-primary" /> Mapa de calor
                </span>
                <h2 className="font-display text-3xl text-foreground uppercase mt-2">
                  Telas mais tocadas
                </h2>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                Top 8 da semana
              </span>
            </div>

            <ol className="border-2 border-foreground">
              {SCREEN_HEAT.map((row, i) => {
                const Icon = typeof row.icon === 'string' ? null : row.icon;
                return (
                  <li
                    key={row.screen}
                    className={`flex items-stretch gap-4 ${i < SCREEN_HEAT.length - 1 ? 'border-b-2 border-foreground' : ''}`}
                  >
                    <div className="w-14 shrink-0 bg-foreground text-background flex flex-col items-center justify-center py-4">
                      <span className="font-display text-2xl tnum">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="w-12 flex items-center justify-center">
                      {Icon && <Icon className="w-5 h-5 text-primary" strokeWidth={2} />}
                    </div>
                    <div className="flex-1 py-4 pr-4 flex flex-col justify-center">
                      <p className="font-bold text-foreground text-sm">{row.screen}</p>
                      <div className="mt-2 h-2 bg-muted relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${row.pct}%` }}
                          transition={{ delay: 0.2 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute inset-y-0 left-0 bg-primary"
                        />
                      </div>
                    </div>
                    <div className="w-32 shrink-0 flex flex-col items-end justify-center pr-5 text-right">
                      <span className="font-display text-2xl text-foreground tnum">{row.pct}%</span>
                      <span className="text-[10px] text-muted-foreground tnum">{tickFormat(row.tocks)} toques</span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          <section>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3 mb-4">
              <span className="block w-10 h-[2px] bg-primary" /> Receita Flexmedia
            </span>
            <h2 className="font-display text-3xl text-foreground uppercase mb-4">
              Parceiros ativos
            </h2>

            <div className="border-2 border-foreground">
              {PARTNERS.map((p, i) => (
                <div
                  key={p.nome}
                  className={`p-5 ${i < PARTNERS.length - 1 ? 'border-b-2 border-foreground' : ''}`}
                >
                  <p className="font-bold text-foreground text-sm">{p.nome}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                        Impressões
                      </p>
                      <p className="font-display text-2xl text-foreground tnum">{tickFormat(p.impressoes)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                        Cupons
                      </p>
                      <p className="font-display text-2xl text-primary tnum">{p.cupons}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-2 border-foreground mt-4 p-5 bg-foreground text-background">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">
                Em produção
              </p>
              <p className="font-bold text-sm mt-2 leading-snug">
                Espaço comercial novo: bandeja de anúncio rotativo de 6s no menu, com
                geolocalização ao redor da Av. Paulista.
              </p>
              <p className="text-[10px] mt-3 opacity-70">
                Disponivel a partir de junho/2026.
              </p>
            </div>
          </section>
        </div>

        {/* Top expos chart */}
        <section className="mt-12">
          <div className="flex items-end justify-between mb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
                <span className="block w-10 h-[2px] bg-primary" /> Curadoria
              </span>
              <h2 className="font-display text-3xl text-foreground uppercase mt-2">
                Exposições mais vistas
              </h2>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
              Por sessão única
            </span>
          </div>
          <div className="border-2 border-foreground p-4 bg-background">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={TOP_EXPOS} margin={{ top: 12, right: 16, left: -16, bottom: 4 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="nome"
                  tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }}
                  tickLine={false}
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={tickFormat}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--foreground))',
                    color: 'hsl(var(--background))',
                    border: '0',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                  cursor={{ fill: 'hsl(var(--primary) / 0.08)' }}
                />
                <Bar dataKey="views" fill="hsl(var(--primary))">
                  {TOP_EXPOS.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? 'hsl(var(--foreground))' : 'hsl(var(--primary))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <footer className="mt-16 border-t-2 border-foreground pt-6 pb-12 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>Console Flexmedia · KORA × MASP</span>
          <span>Dados agregados anonimos · LGPD</span>
        </footer>
      </main>
    </div>
  );
}
