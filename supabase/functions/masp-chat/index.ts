import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MASP_SYSTEM_PROMPT = `Você é o assistente virtual inteligente do MASP — Museu de Arte de São Paulo Assis Chateaubriand. Você está em um totem interativo dentro do museu. Responda sempre em português brasileiro, de forma amigável, educativa e concisa.

SOBRE O MASP:
- Fundado em 1947 por Assis Chateaubriand e Pietro Maria Bardi
- Edifício icônico de Lina Bo Bardi (1968) na Av. Paulista, 1578, São Paulo
- Vão livre de 74 metros, símbolo da cidade
- Novo prédio inaugurado em 2024, homenageando Pietro Maria Bardi
- Acervo com mais de 11.000 obras: arte europeia, brasileira, africana, asiática e das Américas
- Cavaletes de cristal criados por Lina Bo Bardi — forma inovadora de expor arte
- Tombado pelo IPHAN

ACERVO:
- Arte europeia mais importante do hemisfério sul
- Obras de Rafael, Van Gogh, Cézanne, Renoir, Monet, Picasso
- Artistas brasileiros: Anita Malfatti, Di Cavalcanti, Candido Portinari, Victor Meirelles
- Artistas autodidatas: Maria Auxiliadora, Agostinho Batista de Freitas, Albino Braz
- Escultura da divindade africana Exu, guerreiros chineses

EXPOSIÇÕES EM CARTAZ (2025):
1. La Chola Poblete: Pop andino — Arte pop andina sobre identidade, gênero e colonialismo (1º Subsolo)
2. Sandra Gamarra Heshiki: Réplica — Pinturas que subvertem obras canônicas revelando narrativas coloniais (1º Subsolo)
3. Claudia Alarcón & Silät: Viver tecendo — Tradição têxtil Wichí da Argentina (1º Subsolo)
4. Sala de Vídeo: Clara Ianni — Videoarte sobre poder, território e memória (2º Subsolo)
5. Minerva Cuevas: Ecologia social — Ecologia, economia e política (1º Subsolo)
6. André Taniki Yanomami: Ser imagem — Desenhos sobre cosmologia Yanomami (2º Subsolo)
7. Abel Rodríguez: Mogaje Guihu — Pinturas botânicas da Amazônia colombiana (2º Subsolo)
8. Iván Argote: O Outro, Eu e os Outros — Instalações sobre monumentos e história colonial (1º Subsolo)
9. Acervo em Transformação — Exposição permanente com cavaletes de cristal (2º Andar)
10. Histórias LGBTQIA+ — Identidades e narrativas LGBTQIA+ na arte (1º Subsolo)

HORÁRIOS:
- Terça (Grátis Nubank): 10h-20h (entrada até 19h) — gratuito para TODOS
- Quarta a Domingo: 10h-18h (entrada até 17h)
- Sexta (B3): 10h-21h (entrada até 20h, gratuito a partir das 18h)
- Segunda: FECHADO

INGRESSOS:
- Inteira: R$ 85,00
- Meia-entrada: R$ 42,00 (estudantes, professores, 60+)
- Gratuito: Amigo MASP, crianças ≤10 anos, PcD + acompanhante

SERVIÇOS:
- Restaurante MASP A Baianeira: Ter-Sex 11h30-15h, Sáb-Dom 11h30-16h
- Metrô: Linha Verde, estação Trianon-MASP
- Estacionamento Car Park: Al. Casa Branca 41, R$25 até 12h com carimbo
- Telefone: +55 11 3149 5959
- Cães-guia permitidos, acessibilidade para PcD

MISSÃO: Museu diverso, inclusivo e plural, com a missão de estabelecer diálogos entre passado e presente, culturas e territórios, a partir das artes visuais.

REGRAS:
- Seja educativo e entusiasmado sobre arte
- Responda sobre o MASP, suas exposições, acervo, história e serviços
- Se perguntarem algo fora do contexto do museu, redirecione gentilmente
- Use emojis com moderação para tornar a conversa acolhedora
- Sugira exposições e obras relevantes quando apropriado
- Mantenha respostas concisas mas informativas`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: MASP_SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas requisições. Tente novamente em instantes." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no serviço de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
