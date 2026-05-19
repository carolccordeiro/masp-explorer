# KORA · Totem Interativo Inteligente Flexmedia

> **Projeto desenvolvido para a Sprint Review 4 do Challenge FIAP 2026**
> Equipe KORA · Caso de uso: Museu de Arte de São Paulo (MASP)

🌐 **Site público:** https://carolccordeiro.github.io/masp-explorer/

---

## Sobre o Projeto

O **KORA** é um totem interativo com Inteligência Artificial desenvolvido pela equipe KORA como solução para a **Flexmedia**, empresa especializada em soluções tecnológicas para espaços culturais e educacionais.

A proposta central é transformar a experiência de visitantes em museus, zoológicos e centros culturais através de uma interface intuitiva, acessível e personalizada. Para validar e prototipar a solução, escolhemos o **MASP** como caso de uso estratégico, uma das instituições culturais mais importantes da América Latina.

O totem funciona como um **concierge inteligente**: entende o perfil do visitante, o tempo disponível e seus interesses, e cria em segundos uma jornada de visita sob medida. A identidade visual segue o brutalismo de Lina Bo Bardi e o vermelho cavalete do MASP.

---

## Como acessar

### Site público
Aberto, sem login, hospedado no GitHub Pages:
**https://carolccordeiro.github.io/masp-explorer/**

### Rotas principais

| Rota | O que é |
|---|---|
| `/` | Welcome screen + menu principal (concierge inteligente KORA) |
| `/planejar` | Roteiro personalizado, leva pra Caça ao Tesouro |
| `/assistente` | Chat com IA sobre o MASP |
| `/mapa` | Mapa interativo dos edifícios Lina Bo Bardi e Pietro Maria Bardi |
| `/colecao` | Acervo organizado por exposição, salva favoritos |
| `/quiz` | Quiz educativo com cupom de café como prêmio |
| `/sobre-masp` | Linha do tempo 1947 a 2026 |
| `/selfie` | Selfie spot com filtro vermelho cavalete |
| `/informacoes` | Horários, ingressos, acessibilidade |
| `/dados` | Transparência LGPD |
| `/admin` | Dashboard Flexmedia, métricas de uso (link "Console Flexmedia" no rodapé) |
| `/roteiro?r=...` | Versão mobile do roteiro, abre via QR Code da Caça ao Tesouro |

---

## Diferenciais

- **Caça ao Tesouro gamificada**: o Planejar Visita gera um percurso que o visitante completa achando obras pelo museu, ganhando cupom no fim
- **QR pro celular**: ao fim da visita, o visitante escaneia um QR e leva o roteiro pro celular dele sem login, sem dados pessoais
- **Acessibilidade total**: botão `Acessib.` no header com 3 tamanhos de fonte (A-/A/A+), modo alto contraste e reduzir movimento. Respeita `prefers-reduced-motion` do sistema operacional.
- **Narração por voz**: botão `Ouvir` no header lê o conteúdo da página em português, parando automaticamente ao trocar de rota
- **Dashboard Flexmedia**: heatmap de telas mais tocadas, conversão LGPD, performance de parceiros publicitários
- **Easter egg Lina Bo Bardi**: cinco toques rápidos no logo MASP revelam um dos cinco quotes da arquiteta
- **Brutalismo MASP**: tipografia Inter peso 900, vermelho cavalete #B7252A, off-white de concreto, bordas grossas, sem ornamento decorativo

---

## Como rodar localmente

### Requisitos
- Node 18 ou superior
- npm (vem com o Node)

### Passo a passo

```bash
# 1. Clonar o repositório
git clone https://github.com/carolccordeiro/masp-explorer.git
cd masp-explorer

# 2. Instalar dependências
# (legacy-peer-deps porque uma das libs ainda pin vite < 8)
npm install --legacy-peer-deps

# 3. Subir dev server
npm run dev
```

O Vite vai abrir em `http://localhost:8080`.

### Build de produção

```bash
npm run build
npm run preview
```

### Variáveis de ambiente

O Assistente IA usa o endpoint configurado em `.env`. Já tem default funcionando, mas pra rodar com seu próprio backend ajuste:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

---

## Stack tecnológica

- **Frontend:** React 18 + TypeScript + Vite 8
- **Estilização:** TailwindCSS 3 + variáveis HSL no CSS
- **Animações:** Framer Motion
- **Componentes UI:** Radix UI + shadcn/ui
- **Charts:** Recharts (dashboard admin)
- **QR Code:** qrcode.react
- **Backend / IA:** Supabase Edge Functions
- **Voz:** Web Speech API (reconhecimento e síntese)
- **Câmera:** getUserMedia API (selfie spot)
- **Roteamento:** React Router 6

---

## Equipe KORA

| Nome | RM | Responsabilidade Principal |
|---|---|---|
| Carolina Cordeiro Silva | 564234 | Machine Learning & Redes Neurais |
| Gabriel Henrique Pioli | 567724 | Cybersecurity & Data Science |
| João Victor Tozzatti Matiro | 567510 | Cloud Computing & Sensores |
| Pedro Diagro Lopes | 568393 | Python & Statistical Computing (R) |

---

## Estrutura do código

```
masp-explorer/
├── src/
│   ├── components/
│   │   ├── MaspHeader.tsx        Header brutalista, narração, easter egg Lina
│   │   ├── A11yMenu.tsx          Toggle de acessibilidade
│   │   ├── WelcomeScreen.tsx     Cinematográfica de entrada com consent LGPD
│   │   ├── TreasureHunt.tsx      Caça ao Tesouro com QR pro celular
│   │   ├── AdBanner.tsx          Carrossel de anúncio Flexmedia
│   │   ├── EditorialHighlights.tsx Cards de exposições em cartaz
│   │   ├── StatsStrip.tsx        Stats 11K+ obras, 1947, 74m, 2
│   │   ├── CouponModal.tsx       Modal de cupom
│   │   └── VoiceButton.tsx       Botão de reconhecimento de voz
│   ├── contexts/
│   │   ├── LanguageContext.tsx   PT / EN
│   │   └── AccessibilityContext.tsx Fonte + contraste + reduce motion
│   ├── data/
│   │   ├── exhibitions.ts        9 exposições com obras individuais
│   │   └── quizzes.ts            Categorias e perguntas do Quiz
│   ├── hooks/
│   │   ├── useVoice.ts           speak / stopSpeaking / startListening
│   │   ├── useIdleTimer.ts       Reset por inatividade (90s)
│   │   └── useCollection.ts      Salva obras favoritas em sessionStorage
│   ├── pages/
│   │   ├── Index.tsx             Menu principal
│   │   ├── PlanejarVisita.tsx    Roteiro + Caça ao Tesouro
│   │   ├── QuizEducativo.tsx     Quiz com cupom
│   │   ├── AssistenteIA.tsx      Chat IA streaming
│   │   ├── MapaInterativo.tsx    SVG dos edifícios
│   │   ├── MinhaColecao.tsx      Coleção em cards
│   │   ├── Informacoes.tsx       Accordion sobre o MASP
│   │   ├── DadosDeUso.tsx        Transparência LGPD
│   │   ├── SobreMASP.tsx         Linha do tempo 1947-2026
│   │   ├── Selfie.tsx            Selfie spot
│   │   ├── Admin.tsx             Dashboard Flexmedia
│   │   └── Roteiro.tsx           Versão mobile do roteiro (QR target)
│   └── integrations/supabase/    Cliente Supabase
├── supabase/
│   └── functions/masp-chat/      Edge Function do chat IA
├── public/                       Assets estáticos
├── .github/workflows/deploy.yml  Deploy automático no GitHub Pages
├── index.html
├── package.json
└── README.md
```

---

## Deploy

O deploy é automático via GitHub Actions. Cada push na branch `main` dispara:
1. Build do Vite com `base: "/masp-explorer/"`
2. Upload do `dist/` como artifact de Pages
3. Publicação em https://carolccordeiro.github.io/masp-explorer/

O workflow está em `.github/workflows/deploy.yml`. Em GitHub → Settings → Pages, a origem precisa estar configurada como **GitHub Actions**.

---

## Identidade KORA

O nome **KORA** remete a origem, essência e núcleo criativo. Representa a integração entre tecnologia, empatia e design centrado no usuário, princípios que guiam o desenvolvimento do Totem Interativo Flexmedia.

> *"A arquitetura nasce da vida do povo."*
> Lina Bo Bardi (1914 a 1992)

---

## Contexto acadêmico

Projeto desenvolvido no âmbito do **Challenge FIAP 2026**, integrando as disciplinas:

- AI Challenges
- AI Computer Systems & Sensors
- Cognitive Cybersecurity
- Cognitive Data Science
- Computational Thinking with Python
- Machine Learning & Modelling
- Plataformas, Serviços Cognitivos & Cloud Computing
- Redes Neurais Artificiais, Deep Learning e Algoritmos Genéticos
- Statistical Computing with R

---

**FIAP 2026 · Equipe KORA · Projeto Flexmedia · Caso de Uso MASP**
