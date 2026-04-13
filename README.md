# KORA – Totem Interativo Inteligente Flexmedia

> **Projeto desenvolvido para a disciplina de AI Challenges – FIAP 2025**  
> Equipe KORA | Caso de uso: Museu de Arte de São Paulo (MASP)

---

## Sobre o Projeto

O **KORA** é um totem interativo com Inteligência Artificial desenvolvido pela equipe KORA como solução para a Flexmedia, empresa especializada em soluções tecnológicas para espaços culturais e educacionais.

A proposta central é transformar a experiência de visitantes em museus, zoológicos e centros culturais por meio de uma interface intuitiva, acessível e personalizada. Para validar e prototipar a solução, o time escolheu o **MASP (Museu de Arte de São Paulo)** como caso de uso estratégico — uma das instituições culturais mais importantes da América Latina.

O totem funciona como um **concierge inteligente**: entende o perfil do visitante, o tempo disponível e seus interesses, e cria em segundos uma jornada de visita sob medida. A tecnologia é invisível para o usuário — ele só precisa saber o que gosta.

---

## Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| **Planejar Visita** | Roteiro personalizado com base no tempo disponível, perfil do visitante e temas de interesse |
| **Assistente IA** | Chat inteligente para perguntas sobre obras, exposições e o museu |
| **Quiz Educativo** | Jogos e quizzes sobre as exposições para tornar a visita mais divertida |
| **Mapa Interativo** | Navegação visual pelos andares e espaços do MASP |
| **Minha Coleção** | Salvar obras e exposições favoritas durante a visita |
| **Informações** | Horários, ingressos, acessibilidade e tudo sobre o MASP |
| **Dados de Uso** | Transparência total sobre coleta de dados (conformidade LGPD) |

---

## Diferenciais do KORA

- **Interação por Voz**: O visitante pode falar naturalmente com o totem — sem precisar digitar
- **Acessibilidade Total**: Toda a interface possui versão narrada em áudio para visitantes com deficiência visual
- **Gamificação**: Quiz de Caça ao Tesouro durante o roteiro transforma a visita em brincadeira educativa
- **Dados Anônimos**: Coleta de métricas de uso de forma anônima, respeitando a LGPD
- **White Label**: Arquitetura preparada para ser replicada em outros museus e espaços culturais

---

## Stack Tecnológica

- **Frontend**: React + TypeScript + Vite
- **Estilização**: TailwindCSS + identidade visual do MASP
- **Animações**: Framer Motion
- **Backend/IA**: Supabase + Edge Functions
- **Voz**: Web Speech API (reconhecimento e síntese de voz)
- **Dados**: Supabase (PostgreSQL)

---

## Equipe KORA

| Nome | RM | Responsabilidade Principal |
|---|---|---|
| Carolina Cordeiro Silva | 564234 | Machine Learning & Redes Neurais |
| Gabriel Henrique Pioli | 567724 | Cybersecurity & Data Science |
| João Victor Tozzatti Matiro | 567510 | Cloud Computing & Sensores |
| Pedro Diagro Lopes | 568393 | Python & Statistical Computing (R) |

---

## Estrutura do Projeto

```
masp-explorer/
├── src/
│   ├── components/        # Componentes reutilizáveis (Header, VoiceButton, etc.)
│   ├── data/              # Dados de exposições e quizzes
│   ├── hooks/             # Hooks customizados (voz, coleção, idle timer)
│   ├── integrations/      # Integração com Supabase
│   ├── pages/             # Páginas principais do totem
│   │   ├── Index.tsx          # Menu principal
│   │   ├── PlanejarVisita.tsx # Roteiro personalizado
│   │   ├── QuizEducativo.tsx  # Quiz sobre exposições
│   │   ├── AssistenteIA.tsx   # Chat com IA
│   │   ├── MapaInterativo.tsx # Mapa do museu
│   │   ├── MinhaColecao.tsx   # Coleção do visitante
│   │   ├── Informacoes.tsx    # Informações do MASP
│   │   └── DadosDeUso.tsx     # Transparência de dados
│   └── supabase/          # Edge Functions (chat IA)
└── public/                # Assets estáticos
```

---

## Como Executar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

---

## Contexto Acadêmico

Este projeto foi desenvolvido no âmbito do **Challenge FIAP 2025**, integrando as disciplinas:

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

## Identidade KORA

O nome **KORA** remete a conceitos de origem, essência e núcleo criativo. Representa a integração entre tecnologia, empatia e design centrado no usuário — princípios que guiam o desenvolvimento do Totem Interativo Flexmedia.

> *"A tecnologia mais avançada é aquela que parece mágica. Com o KORA, tiramos a complexidade da frente do usuário e deixamos apenas a magia da descoberta."*

---

**FIAP 2025 · Equipe KORA · Projeto Flexmedia – Caso de Uso MASP**


https://lovable.dev/projects/0f6364eb-b1fd-4dcc-87c6-91a14cb82685?magic_link=mc_e7fc206c-decb-4eca-a358-1063bf836666
