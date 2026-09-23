# KORA

Plataforma white-label de experiência para museus. Um app web (PWA) que o visitante abre pelo navegador, sem instalar nada. Versão atual com três museus de São Paulo: **MASP**, **IMS Paulista** e **MAM São Paulo**, com 50 obras reais de cada acervo.

## Funcionalidades

- **Scanner de obras**: aponte a câmera e o app reconhece a obra no próprio aparelho (MobileCLIP, sem enviar a foto). Se não reconhecer, a IA tenta identificar.
- **Assistente KORA**: respostas instantâneas (horários, ingressos, endereço, acessibilidade) + IA em streaming + plano B local pelo acervo.
- **Acervo** com busca, filtros por tema e favoritos.
- **Ficha da obra** com audioguia (voz do navegador), modo família, obras parecidas em toda a rede.
- **Planejador de visita** por tempo e interesses, **mapa** dos espaços, **quiz**, **caça ao tesouro com QR**.
- **Rotas entre museus** e conexões entre acervos.
- **Painel** com métricas reais em tempo real (Supabase Realtime), protegido por senha.
- **Contador de público** anônimo no próprio aparelho (sem reconhecimento facial).
- Acessibilidade: PT, EN e ES, VLibras, alto contraste, tamanho de fonte, redução de movimento, modo totem.

## Stack

React 18 · TypeScript · Vite · Tailwind · framer-motion · Transformers.js (ONNX no navegador) · Supabase (Postgres, Realtime, Edge Functions) · Gemini (via Edge Function).

## Rodar localmente

```bash
npm install
cp .env.example .env.local   # preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
npm run dev                  # http://localhost:8080
npm test                     # testes
npm run build                # build de produção em dist/
```

Sem as variáveis do Supabase o app funciona normalmente, mas sem IA e sem métricas.

## Publicar

Recomendado: **Vercel** ou **Netlify** (importe o repositório, framework Vite, saída `dist`). Configure no painel da hospedagem:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Observação: o servidor precisa aceitar requisições com `Range` (Vercel, Netlify e `npx serve -s dist` aceitam; `vite preview` não). Para testar a build localmente: `npx serve -s dist`.

## Backend (Supabase)

- `supabase/migrations/`: tabela `events` (métricas anônimas) com RLS e Realtime.
- `supabase/functions/kora-ai/`: chat e identificação de obras com Gemini. A chave do Gemini fica **só** como secret da função (`GEMINI_API_KEY`), nunca no front.
- Deploy: `SUPABASE_ACCESS_TOKEN=... SUPABASE_PROJECT_REF=... GEMINI_API_KEY=... npm run supabase:deploy`

## Dados

- `data-src/<museu>/`: textos curados (museu, obras, exposições, quiz) e `data-src/i18n/` traduções.
- `python3 scripts/build_data.py`: gera `src/data/generated/*.json` e as imagens em `public/museums/`.
- `npm run data:embeddings`: recalcula os vetores do scanner (`public/museums/embeddings.json`).

## Créditos e limites

- Imagens de domínio público ou divulgadas pelos museus via Wikimedia Commons e Google Arts & Culture, usadas para demonstração. Uso comercial requer licenciamento com cada instituição.
- Horários, ingressos e exposições coletados dos sites oficiais em setembro de 2026.
- A IA no plano gratuito do Gemini tem cota e latência variáveis; o app tem plano B local.

© KORA
