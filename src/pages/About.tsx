import { motion } from "framer-motion";
import {
  Accessibility,
  ArrowRight,
  BarChart3,
  Building2,
  Cloud,
  Ear,
  Globe2,
  Landmark,
  Layers,
  LayoutDashboard,
  Mail,
  Megaphone,
  MessageSquareText,
  Network,
  Palette,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tag,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { KoraWordmark } from "@/components/KoraMark";
import { Header } from "@/components/Shell";
import { Page } from "@/components/ui";
import { useSettings } from "@/context/Settings";
import type { I18n } from "@/data/types";
import { MUSEUMS } from "@/data/museums";
import { tr } from "@/lib/utils";

/** E-mail comercial exibido no botão de contato (configurável por variável de ambiente). */
const CONTACT = ((import.meta.env.VITE_CONTACT_EMAIL as string | undefined) || "carolinafc.scs@gmail.com").trim();

type T = Required<I18n>;
type Card = { icon: ReactNode; title: T; text: T };

const C = {
  eyebrow: { pt: "Sobre a KORA", en: "About KORA", es: "Acerca de KORA" },
  title: {
    pt: "Tecnologia que aproxima pessoas e acervos",
    en: "Technology that brings people and collections together",
    es: "Tecnología que acerca personas y colecciones",
  },
  lead: {
    pt: "A KORA é uma plataforma white label que transforma qualquer museu em uma experiência guiada por inteligência artificial. O visitante abre no navegador, sem baixar nada. O museu ganha dados reais sobre o que o público vive lá dentro.",
    en: "KORA is a white label platform that turns any museum into an experience guided by artificial intelligence. Visitors open it in the browser, with nothing to install. The museum gets real data on what the public experiences inside.",
    es: "KORA es una plataforma white label que convierte cualquier museo en una experiencia guiada por inteligencia artificial. El visitante la abre en el navegador, sin descargar nada. El museo obtiene datos reales sobre lo que el público vive adentro.",
  },
  demo: { pt: "Ver a demonstração", en: "See the demo", es: "Ver la demostración" },
  panel: { pt: "Ver o painel do museu", en: "See the museum dashboard", es: "Ver el panel del museo" },
  contact: { pt: "Falar com a equipe", en: "Talk to the team", es: "Hablar con el equipo" },

  stats: [
    { value: "+3.700", label: { pt: "museus mapeados no Brasil¹", en: "museums mapped in Brazil¹", es: "museos registrados en Brasil¹" } },
    { value: "0", label: { pt: "downloads para o visitante", en: "downloads for the visitor", es: "descargas para el visitante" } },
    { value: "3+", label: { pt: "idiomas, com Libras", en: "languages, plus Libras", es: "idiomas, con Libras" } },
    { value: "0", label: { pt: "dados faciais coletados", en: "facial data collected", es: "datos faciales recopilados" } },
  ] as { value: string; label: T }[],
  statsNote: {
    pt: "¹ Ibram, Cadastro Nacional de Museus.",
    en: "¹ Ibram (Brazilian Institute of Museums), National Museum Registry.",
    es: "¹ Ibram (Instituto Brasileño de Museos), Registro Nacional de Museos.",
  },

  challenge: {
    eyebrow: { pt: "O desafio", en: "The challenge", es: "El desafío" },
    title: {
      pt: "O visitante sai do museu sabendo pouco sobre o que viu",
      en: "Visitors leave the museum knowing little about what they saw",
      es: "El visitante sale del museo sabiendo poco de lo que vio",
    },
    text: {
      pt: "Museus guardam histórias incríveis, mas a experiência da visita quase sempre depende de uma etiqueta na parede. Quem quer ir além esbarra em barreiras de idioma, de acesso e de tempo. E quem administra o museu não enxerga o que acontece nas salas.",
      en: "Museums hold incredible stories, but the visit usually depends on a label on the wall. Those who want more run into language, access and time barriers. And those who run the museum cannot see what happens in the galleries.",
      es: "Los museos guardan historias increíbles, pero la visita casi siempre depende de una etiqueta en la pared. Quien quiere ir más allá choca con barreras de idioma, acceso y tiempo. Y quien gestiona el museo no ve lo que ocurre en las salas.",
    },
    cards: [
      {
        icon: <Tag size={20} />,
        title: { pt: "Contexto que não cabe na etiqueta", en: "Context that doesn't fit on a label", es: "Contexto que no cabe en la etiqueta" },
        text: {
          pt: "A etiqueta traz nome, data e técnica. A história por trás da obra, que é o que emociona, fica de fora.",
          en: "The label shows name, date and medium. The story behind the work, the part that moves people, is left out.",
          es: "La etiqueta trae nombre, fecha y técnica. La historia detrás de la obra, que es lo que emociona, queda fuera.",
        },
      },
      {
        icon: <Ear size={20} />,
        title: { pt: "Barreiras de idioma e acesso", en: "Language and access barriers", es: "Barreras de idioma y acceso" },
        text: {
          pt: "Turistas, pessoas surdas, crianças e pessoas com baixa visão precisam de caminhos diferentes para chegar à mesma obra.",
          en: "Tourists, deaf people, children and people with low vision need different paths to reach the same work.",
          es: "Turistas, personas sordas, niños y personas con baja visión necesitan caminos distintos para llegar a la misma obra.",
        },
      },
      {
        icon: <Smartphone size={20} />,
        title: { pt: "Apps que ninguém baixa", en: "Apps nobody downloads", es: "Apps que nadie descarga" },
        text: {
          pt: "Pedir para instalar um aplicativo na porta do museu, com pouca bateria e internet instável, afasta boa parte do público.",
          en: "Asking people to install an app at the museum door, with low battery and patchy internet, drives much of the audience away.",
          es: "Pedir que instalen una app en la puerta del museo, con poca batería e internet inestable, aleja a buena parte del público.",
        },
      },
      {
        icon: <BarChart3 size={20} />,
        title: { pt: "Gestão no escuro", en: "Managing in the dark", es: "Gestión a ciegas" },
        text: {
          pt: "O museu sabe quantos ingressos vendeu, mas não sabe quais obras prendem a atenção nem o que o público quer saber.",
          en: "The museum knows how many tickets it sold, but not which works hold attention or what visitors want to know.",
          es: "El museo sabe cuántas entradas vendió, pero no qué obras atrapan la atención ni qué quiere saber el público.",
        },
      },
    ] as Card[],
  },

  idea: {
    eyebrow: { pt: "O que pensamos", en: "Our idea", es: "Lo que pensamos" },
    title: {
      pt: "O melhor guia já está no bolso do visitante",
      en: "The best guide is already in the visitor's pocket",
      es: "La mejor guía ya está en el bolsillo del visitante",
    },
    text: {
      pt: "O celular é a porta de entrada. Faltava um guia que abrisse em um toque, falasse a língua de cada pessoa, conhecesse o acervo de verdade e respeitasse a privacidade. A KORA nasceu de quatro princípios.",
      en: "The phone is the way in. What was missing was a guide that opens in one tap, speaks each person's language, truly knows the collection and respects privacy. KORA was built on four principles.",
      es: "El celular es la puerta de entrada. Faltaba una guía que se abriera con un toque, hablara el idioma de cada persona, conociera de verdad la colección y respetara la privacidad. KORA nació de cuatro principios.",
    },
    principles: [
      {
        icon: <Smartphone size={20} />,
        title: { pt: "Sem atrito", en: "Frictionless", es: "Sin fricción" },
        text: { pt: "Abre por QR code, direto no navegador.", en: "Opens from a QR code, right in the browser.", es: "Se abre con un código QR, directo en el navegador." },
      },
      {
        icon: <MessageSquareText size={20} />,
        title: { pt: "Conhecimento curado", en: "Curated knowledge", es: "Conocimiento curado" },
        text: { pt: "A IA responde a partir dos dados do próprio museu.", en: "The AI answers from the museum's own data.", es: "La IA responde con los datos del propio museo." },
      },
      {
        icon: <ShieldCheck size={20} />,
        title: { pt: "Privacidade por padrão", en: "Privacy by default", es: "Privacidad por defecto" },
        text: { pt: "Sem cadastro, sem rosto, sem dado pessoal.", en: "No sign up, no faces, no personal data.", es: "Sin registro, sin rostros, sin datos personales." },
      },
      {
        icon: <Layers size={20} />,
        title: { pt: "Uma plataforma, muitos museus", en: "One platform, many museums", es: "Una plataforma, muchos museos" },
        text: { pt: "Cada instituição com a sua própria identidade.", en: "Each institution with its own identity.", es: "Cada institución con su propia identidad." },
      },
    ] as Card[],
  },

  process: {
    eyebrow: { pt: "Como pensamos", en: "How we got here", es: "Cómo lo pensamos" },
    title: { pt: "Do totem ao ecossistema", en: "From kiosk to ecosystem", es: "Del tótem al ecosistema" },
    steps: [
      {
        title: { pt: "Escutar", en: "Listen", es: "Escuchar" },
        text: {
          pt: "Mapeamos a jornada do visitante antes, durante e depois da visita, e as dores das equipes educativas e de gestão.",
          en: "We mapped the visitor journey before, during and after the visit, and the pain points of education and management teams.",
          es: "Mapeamos el recorrido del visitante antes, durante y después de la visita, y los problemas de los equipos educativos y de gestión.",
        },
      },
      {
        title: { pt: "Prototipar", en: "Prototype", es: "Prototipar" },
        text: {
          pt: "A primeira versão nasceu como um totem interativo para o MASP, com assistente, quiz e mapa.",
          en: "The first version was an interactive kiosk for MASP, with an assistant, a quiz and a map.",
          es: "La primera versión nació como un tótem interactivo para el MASP, con asistente, quiz y mapa.",
        },
      },
      {
        title: { pt: "Validar com dados reais", en: "Validate with real data", es: "Validar con datos reales" },
        text: {
          pt: "Levamos a experiência para o celular e testamos com 150 obras reais de três acervos públicos de São Paulo.",
          en: "We brought the experience to the phone and tested it with 150 real works from three public collections in São Paulo.",
          es: "Llevamos la experiencia al celular y la probamos con 150 obras reales de tres colecciones públicas de São Paulo.",
        },
      },
      {
        title: { pt: "Escalar", en: "Scale", es: "Escalar" },
        text: {
          pt: "Viramos plataforma: um novo museu entra com seu acervo e sua identidade, sem reescrever o sistema.",
          en: "We became a platform: a new museum joins with its collection and identity, without rewriting the system.",
          es: "Nos convertimos en plataforma: un museo nuevo entra con su colección y su identidad, sin reescribir el sistema.",
        },
      },
    ] as { title: T; text: T }[],
  },

  how: {
    eyebrow: { pt: "Como funciona", en: "How it works", es: "Cómo funciona" },
    title: { pt: "Inteligência onde ela faz mais sentido", en: "Intelligence where it makes the most sense", es: "Inteligencia donde tiene más sentido" },
    layers: [
      {
        icon: <Smartphone size={22} />,
        title: { pt: "No aparelho do visitante", en: "On the visitor's device", es: "En el dispositivo del visitante" },
        text: {
          pt: "O scanner de obras e o contador de público rodam com IA no próprio dispositivo. A imagem da câmera nunca sai do celular.",
          en: "The artwork scanner and the people counter run with AI on the device itself. Camera images never leave the phone.",
          es: "El escáner de obras y el contador de público funcionan con IA en el propio dispositivo. La imagen de la cámara nunca sale del celular.",
        },
      },
      {
        icon: <Cloud size={22} />,
        title: { pt: "Na nuvem", en: "In the cloud", es: "En la nube" },
        text: {
          pt: "O assistente com IA generativa é alimentado pelo acervo e pelas informações do museu. As métricas chegam anônimas e em tempo real.",
          en: "The generative AI assistant is fed by the museum's collection and information. Metrics arrive anonymously and in real time.",
          es: "El asistente con IA generativa se alimenta de la colección y la información del museo. Las métricas llegan anónimas y en tiempo real.",
        },
      },
      {
        icon: <LayoutDashboard size={22} />,
        title: { pt: "No painel do museu", en: "On the museum dashboard", es: "En el panel del museo" },
        text: {
          pt: "Obras mais vistas, perguntas do público, uso de cada recurso e fluxo de pessoas, ao vivo.",
          en: "Most viewed works, visitor questions, feature usage and people flow, live.",
          es: "Obras más vistas, preguntas del público, uso de cada función y flujo de personas, en vivo.",
        },
      },
    ] as Card[],
  },

  diff: {
    eyebrow: { pt: "Diferenciais", en: "What sets us apart", es: "Diferenciales" },
    title: { pt: "Por que a KORA", en: "Why KORA", es: "Por qué KORA" },
    cards: [
      {
        icon: <ScanLine size={20} />,
        title: { pt: "Scanner que reconhece a obra", en: "A scanner that recognizes the work", es: "Escáner que reconoce la obra" },
        text: {
          pt: "Aponte a câmera e a KORA mostra artista, data, técnica e a história da obra, em segundos.",
          en: "Point the camera and KORA shows the artist, date, medium and the story of the work, in seconds.",
          es: "Apunta la cámara y KORA muestra artista, fecha, técnica e historia de la obra, en segundos.",
        },
      },
      {
        icon: <Globe2 size={20} />,
        title: { pt: "Zero download", en: "Zero download", es: "Cero descargas" },
        text: {
          pt: "Um QR code e pronto. Funciona em qualquer celular, no totem ou no computador.",
          en: "One QR code and you are in. Works on any phone, kiosk or computer.",
          es: "Un código QR y listo. Funciona en cualquier celular, tótem o computadora.",
        },
      },
      {
        icon: <Sparkles size={20} />,
        title: { pt: "IA que conhece o acervo", en: "AI that knows the collection", es: "IA que conoce la colección" },
        text: {
          pt: "Respostas instantâneas para as dúvidas frequentes e um plano B que responde pelo acervo mesmo sem conexão com a IA.",
          en: "Instant answers to common questions and a fallback that answers from the collection even without the AI.",
          es: "Respuestas instantáneas a las dudas frecuentes y un plan B que responde con la colección incluso sin la IA.",
        },
      },
      {
        icon: <Accessibility size={20} />,
        title: { pt: "Acessibilidade de verdade", en: "Real accessibility", es: "Accesibilidad real" },
        text: {
          pt: "VLibras, português, inglês e espanhol, audioguia, alto contraste, fonte ajustável e modo família.",
          en: "VLibras sign language, Portuguese, English and Spanish, audio guide, high contrast, adjustable text and family mode.",
          es: "VLibras, portugués, inglés y español, audioguía, alto contraste, letra ajustable y modo familia.",
        },
      },
      {
        icon: <Network size={20} />,
        title: { pt: "Rede de museus", en: "A network of museums", es: "Red de museos" },
        text: {
          pt: "Obras parecidas entre acervos diferentes e roteiros que conectam instituições da cidade.",
          en: "Similar works across different collections and routes that connect institutions across the city.",
          es: "Obras parecidas entre colecciones distintas y recorridos que conectan instituciones de la ciudad.",
        },
      },
      {
        icon: <BarChart3 size={20} />,
        title: { pt: "Dados para decidir", en: "Data to decide", es: "Datos para decidir" },
        text: {
          pt: "Painel em tempo real para curadoria, educativo e captação de patrocínio.",
          en: "Real time dashboard for curators, education teams and sponsorship.",
          es: "Panel en tiempo real para curaduría, educación y captación de patrocinio.",
        },
      },
      {
        icon: <ShieldCheck size={20} />,
        title: { pt: "Privacidade e LGPD", en: "Privacy and LGPD", es: "Privacidad y LGPD" },
        text: {
          pt: "Sem cadastro e sem reconhecimento facial. A contagem de público é anônima.",
          en: "No sign up and no facial recognition. Audience counting is anonymous.",
          es: "Sin registro y sin reconocimiento facial. El conteo de público es anónimo.",
        },
      },
      {
        icon: <Palette size={20} />,
        title: { pt: "White label", en: "White label", es: "White label" },
        text: {
          pt: "Cada museu com a sua cor, o seu acervo e a sua voz, dentro da mesma plataforma.",
          en: "Each museum with its own color, collection and voice, on the same platform.",
          es: "Cada museo con su color, su colección y su voz, en la misma plataforma.",
        },
      },
    ] as Card[],
  },

  business: {
    eyebrow: { pt: "Para quem", en: "Who it's for", es: "Para quién" },
    title: { pt: "Feita para museus de todos os tamanhos", en: "Built for museums of every size", es: "Hecha para museos de todos los tamaños" },
    who: [
      {
        icon: <Landmark size={20} />,
        title: { pt: "Museus e centros culturais", en: "Museums and cultural centers", es: "Museos y centros culturales" },
        text: {
          pt: "Uma experiência digital completa sem equipe de tecnologia própria.",
          en: "A complete digital experience without an in-house tech team.",
          es: "Una experiencia digital completa sin equipo de tecnología propio.",
        },
      },
      {
        icon: <Building2 size={20} />,
        title: { pt: "Redes e secretarias de cultura", en: "Networks and culture departments", es: "Redes y secretarías de cultura" },
        text: {
          pt: "Vários equipamentos culturais em uma só plataforma, com dados consolidados.",
          en: "Many cultural venues on one platform, with consolidated data.",
          es: "Varios espacios culturales en una sola plataforma, con datos consolidados.",
        },
      },
      {
        icon: <Users size={20} />,
        title: { pt: "Patrocinadores", en: "Sponsors", es: "Patrocinadores" },
        text: {
          pt: "Marca associada a acesso, educação e inovação, com resultados mensuráveis.",
          en: "A brand tied to access, education and innovation, with measurable results.",
          es: "Una marca asociada al acceso, la educación y la innovación, con resultados medibles.",
        },
      },
    ] as Card[],
    plansTitle: { pt: "Planos", en: "Plans", es: "Planes" },
    plans: [
      {
        name: { pt: "Essencial", en: "Essential", es: "Esencial" },
        for: { pt: "Para um museu", en: "For one museum", es: "Para un museo" },
        items: {
          pt: "Acervo digital · Assistente KORA · Scanner de obras · Audioguia · Quiz e caça ao tesouro · Painel em tempo real",
          en: "Digital collection · KORA assistant · Artwork scanner · Audio guide · Quiz and treasure hunt · Live dashboard",
          es: "Colección digital · Asistente KORA · Escáner de obras · Audioguía · Quiz y búsqueda del tesoro · Panel en vivo",
        },
      },
      {
        name: { pt: "Rede", en: "Network", es: "Red" },
        for: { pt: "Para vários museus ou unidades", en: "For several museums or venues", es: "Para varios museos o sedes" },
        items: {
          pt: "Tudo do Essencial · Roteiros entre museus · Obras conectadas entre acervos · Painel consolidado da rede",
          en: "Everything in Essential · Routes between museums · Works connected across collections · Network wide dashboard",
          es: "Todo lo del Esencial · Recorridos entre museos · Obras conectadas entre colecciones · Panel consolidado de la red",
        },
        featured: true,
      },
      {
        name: { pt: "Totem", en: "Kiosk", es: "Tótem" },
        for: { pt: "Complemento para o espaço físico", en: "Add-on for the physical space", es: "Complemento para el espacio físico" },
        items: {
          pt: "Modo totem · Tela de descanso · Contador de público anônimo · Implantação no local",
          en: "Kiosk mode · Welcome screen · Anonymous people counter · On site setup",
          es: "Modo tótem · Pantalla de bienvenida · Contador de público anónimo · Instalación en el lugar",
        },
      },
    ] as { name: T; for: T; items: T; featured?: boolean }[],
    price: { pt: "Sob consulta", en: "On request", es: "A consultar" },
    revenueTitle: { pt: "Como a KORA gera receita", en: "How KORA makes money", es: "Cómo KORA genera ingresos" },
    revenue: [
      {
        icon: <Layers size={20} />,
        title: { pt: "Assinatura", en: "Subscription", es: "Suscripción" },
        text: {
          pt: "Mensalidade por museu, com implantação inicial do acervo e da identidade visual.",
          en: "Monthly fee per museum, with initial setup of the collection and visual identity.",
          es: "Mensualidad por museo, con implementación inicial de la colección y la identidad visual.",
        },
      },
      {
        icon: <Megaphone size={20} />,
        title: { pt: "Mídia e parceiros", en: "Media and partners", es: "Medios y socios" },
        text: {
          pt: "Anúncios de cafés, restaurantes e lojas do entorno, com cupom de desconto. O museu ganha uma nova receita e recebe o relatório de impressões e cupons.",
          en: "Ads from nearby cafés, restaurants and shops, with a discount coupon. The museum gains new revenue and gets a report of impressions and coupons.",
          es: "Anuncios de cafés, restaurantes y tiendas cercanas, con cupón de descuento. El museo gana un nuevo ingreso y recibe el informe de impresiones y cupones.",
        },
      },
      {
        icon: <Sparkles size={20} />,
        title: { pt: "Patrocínio de experiências", en: "Sponsored experiences", es: "Patrocinio de experiencias" },
        text: {
          pt: "Marcas podem assinar roteiros, o audioguia, o quiz ou a caça ao tesouro, com métricas reais de alcance.",
          en: "Brands can sponsor routes, the audio guide, the quiz or the treasure hunt, with real reach metrics.",
          es: "Las marcas pueden patrocinar recorridos, la audioguía, el quiz o la búsqueda del tesoro, con métricas reales de alcance.",
        },
      },
    ] as Card[],
    model: {
      pt: "Assinatura mensal por museu mais implantação. O museu não precisa comprar equipamento: a experiência roda no celular do visitante.",
      en: "Monthly subscription per museum plus setup. No hardware purchase needed: the experience runs on the visitor's phone.",
      es: "Suscripción mensual por museo más implementación. El museo no necesita comprar equipos: la experiencia funciona en el celular del visitante.",
    },
  },

  final: {
    title: { pt: "Vamos levar a KORA para o seu museu?", en: "Shall we bring KORA to your museum?", es: "¿Llevamos KORA a tu museo?" },
    text: {
      pt: "Mostramos a plataforma funcionando com o seu acervo em uma conversa rápida.",
      en: "We will show the platform running with your collection in a quick call.",
      es: "Te mostramos la plataforma funcionando con tu colección en una charla rápida.",
    },
    credit: {
      pt: "Criada pela equipe KORA, estudantes de Inteligência Artificial da FIAP. Demonstração com dados públicos do MASP, do IMS e do MAM São Paulo.",
      en: "Created by the KORA team, Artificial Intelligence students at FIAP. Demo built with public data from MASP, IMS and MAM São Paulo.",
      es: "Creada por el equipo KORA, estudiantes de Inteligencia Artificial de FIAP. Demostración con datos públicos del MASP, el IMS y el MAM São Paulo.",
    },
  },
};

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] },
};

function Section({ n, eyebrow, title, children }: { n: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <motion.section {...fade} className="border-t hairline py-14 md:py-20">
      <div className="grid gap-6 md:grid-cols-[160px_1fr] md:gap-10">
        <div>
          <p className="num text-[44px] leading-none text-ink/15 md:text-[64px]">{n}</p>
          <p className="eyebrow mt-2">{eyebrow}</p>
        </div>
        <div>
          <h2 className="max-w-3xl text-[30px] font-extrabold leading-[1.05] tracking-[-0.03em] md:text-[44px]">{title}</h2>
          {children}
        </div>
      </div>
    </motion.section>
  );
}

function IconCard({ c, lang, i = 0 }: { c: Card; lang: "pt" | "en" | "es"; i?: number }) {
  return (
    <motion.div {...fade} transition={{ ...fade.transition, delay: i * 0.05 }} className="card p-5">
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-bg">{c.icon}</span>
      <p className="mt-4 text-[17px] font-bold leading-snug">{tr(c.title, lang)}</p>
      <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{tr(c.text, lang)}</p>
    </motion.div>
  );
}

function Ctas({ lang, invert }: { lang: "pt" | "en" | "es"; invert?: boolean }) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Link
        to="/museus"
        className={
          invert
            ? "tap inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-bold text-black"
            : "tap inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-bold text-bg"
        }
      >
        {tr(C.demo, lang)} <ArrowRight size={17} />
      </Link>
      <Link
        to="/painel"
        className={
          invert
            ? "tap inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-[15px] font-bold text-white"
            : "tap inline-flex h-12 items-center gap-2 rounded-full border hairline bg-surface px-6 text-[15px] font-bold"
        }
      >
        <BarChart3 size={17} /> {tr(C.panel, lang)}
      </Link>
      {CONTACT && (
        <a
          href={`mailto:${CONTACT}?subject=${encodeURIComponent("KORA para o meu museu")}`}
          className={
            invert
              ? "tap inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-[15px] font-bold text-white"
              : "tap inline-flex h-12 items-center gap-2 rounded-full border hairline bg-surface px-6 text-[15px] font-bold"
          }
        >
          <Mail size={17} /> {tr(C.contact, lang)}
        </a>
      )}
    </div>
  );
}

export default function About() {
  const { lang } = useSettings();

  return (
    <>
      <Header />
      <Page className="pt-2">
        {/* abertura */}
        <section className="pb-12 pt-6 md:pb-16 md:pt-12">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-5 flex gap-1.5">
            {MUSEUMS.map((m) => (
              <span key={m.id} className="h-1.5 w-8 rounded-full" style={{ backgroundColor: m.accent }} />
            ))}
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="eyebrow mb-3">
            {tr(C.eyebrow, lang)}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="max-w-4xl text-[40px] font-extrabold leading-[1.02] tracking-[-0.035em] md:text-[68px]"
          >
            {tr(C.title, lang)}
            <span className="text-muted">.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }} className="body-copy mt-5 max-w-2xl text-[18px] text-muted">
            {tr(C.lead, lang)}
          </motion.p>
          <Ctas lang={lang} />

          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 border-t hairline pt-8 md:grid-cols-4">
            {C.stats.map((s) => (
              <div key={tr(s.label, lang)}>
                <div className="num text-[44px] leading-none md:text-[60px]">{s.value}</div>
                <div className="mt-2 max-w-[180px] text-[12px] font-semibold uppercase leading-snug tracking-wider text-muted">{tr(s.label, lang)}</div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[12px] text-muted">{tr(C.statsNote, lang)}</p>
        </section>

        <Section n="01" eyebrow={tr(C.challenge.eyebrow, lang)} title={tr(C.challenge.title, lang)}>
          <p className="body-copy mt-5 max-w-2xl text-[17px]">{tr(C.challenge.text, lang)}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {C.challenge.cards.map((c, i) => (
              <IconCard key={i} c={c} lang={lang} i={i} />
            ))}
          </div>
        </Section>

        <Section n="02" eyebrow={tr(C.idea.eyebrow, lang)} title={tr(C.idea.title, lang)}>
          <p className="body-copy mt-5 max-w-2xl text-[17px]">{tr(C.idea.text, lang)}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {C.idea.principles.map((c, i) => (
              <IconCard key={i} c={c} lang={lang} i={i} />
            ))}
          </div>
        </Section>

        <Section n="03" eyebrow={tr(C.process.eyebrow, lang)} title={tr(C.process.title, lang)}>
          <ol className="relative mt-10 grid gap-8 md:grid-cols-4 md:gap-5">
            <span className="absolute left-[19px] top-2 h-[calc(100%-16px)] w-px bg-ink/10 md:left-0 md:top-[19px] md:h-px md:w-full" aria-hidden />
            {C.process.steps.map((s, i) => (
              <motion.li key={i} {...fade} transition={{ ...fade.transition, delay: i * 0.08 }} className="relative flex gap-4 md:block">
                <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-[15px] font-extrabold text-bg">{i + 1}</span>
                <div className="md:mt-5">
                  <p className="text-[18px] font-bold">{tr(s.title, lang)}</p>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{tr(s.text, lang)}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </Section>

        <Section n="04" eyebrow={tr(C.how.eyebrow, lang)} title={tr(C.how.title, lang)}>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {C.how.layers.map((c, i) => (
              <motion.div key={i} {...fade} transition={{ ...fade.transition, delay: i * 0.08 }} className="relative">
                <div className="card h-full p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink/[0.06]">{c.icon}</span>
                  <p className="mt-5 text-[19px] font-extrabold">{tr(c.title, lang)}</p>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{tr(c.text, lang)}</p>
                </div>
                {i < 2 && (
                  <span className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 place-items-center rounded-full border hairline bg-bg md:grid">
                    <ArrowRight size={13} />
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </Section>

        <Section n="05" eyebrow={tr(C.diff.eyebrow, lang)} title={tr(C.diff.title, lang)}>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {C.diff.cards.map((c, i) => (
              <IconCard key={i} c={c} lang={lang} i={i % 4} />
            ))}
          </div>
        </Section>

        <Section n="06" eyebrow={tr(C.business.eyebrow, lang)} title={tr(C.business.title, lang)}>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {C.business.who.map((c, i) => (
              <IconCard key={i} c={c} lang={lang} i={i} />
            ))}
          </div>

          <h3 className="mt-14 text-[22px] font-extrabold">{tr(C.business.plansTitle, lang)}</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {C.business.plans.map((p, i) => (
              <motion.div
                key={i}
                {...fade}
                transition={{ ...fade.transition, delay: i * 0.08 }}
                className={p.featured ? "rounded-3xl bg-ink p-6 text-bg shadow-lift" : "card p-6"}
              >
                <p className={p.featured ? "eyebrow text-bg/60" : "eyebrow"}>{tr(p.for, lang)}</p>
                <p className="mt-2 text-[28px] font-extrabold tracking-tight">{tr(p.name, lang)}</p>
                <ul className="mt-4 space-y-2">
                  {tr(p.items, lang)
                    .split(" · ")
                    .map((it) => (
                      <li key={it} className="flex items-start gap-2 text-[14.5px] leading-snug">
                        <span className={p.featured ? "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-bg" : "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-ink"} />
                        {it}
                      </li>
                    ))}
                </ul>
                <p className={p.featured ? "mt-6 text-[14px] font-bold text-bg/70" : "mt-6 text-[14px] font-bold text-muted"}>{tr(C.business.price, lang)}</p>
              </motion.div>
            ))}
          </div>
          <p className="body-copy mt-6 max-w-2xl text-[15px] text-muted">{tr(C.business.model, lang)}</p>

          <h3 className="mt-14 text-[22px] font-extrabold">{tr(C.business.revenueTitle, lang)}</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {C.business.revenue.map((c, i) => (
              <IconCard key={i} c={c} lang={lang} i={i} />
            ))}
          </div>
        </Section>

        {/* chamada final */}
        <motion.section {...fade} className="dark mt-6 overflow-hidden rounded-4xl bg-black p-8 text-white md:p-14">
          <KoraWordmark size="md" className="text-white" />
          <h2 className="mt-8 max-w-2xl text-[34px] font-extrabold leading-[1.05] tracking-[-0.03em] md:text-[52px]">{tr(C.final.title, lang)}</h2>
          <p className="mt-4 max-w-xl text-[17px] text-white/70">{tr(C.final.text, lang)}</p>
          <Ctas lang={lang} invert />
        </motion.section>
        <p className="mt-6 text-[12.5px] leading-relaxed text-muted">{tr(C.final.credit, lang)}</p>
      </Page>
    </>
  );
}
