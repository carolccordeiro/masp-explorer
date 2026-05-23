import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Camera, Cpu, Users, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import { MaspHeader } from '@/components/MaspHeader';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Pagina /detector, demo da integracao Visao Computacional + KORA.
 * Mostra a pipeline YOLO + DeepFace + classificacao etaria + recomendacao,
 * com QR Code pra abrir o notebook Colab e ver/rodar o codigo de verdade.
 *
 * Sprint 4 Redes Neurais Artificiais, Deep Learning e Algoritmos Geneticos.
 */

// Link publico do notebook hospedado no GitHub (acessivel via Colab)
const COLAB_URL =
  'https://colab.research.google.com/github/carolccordeiro/masp-explorer/blob/main/colab/Totem_FaixaEtaria.ipynb';

const FAIXAS_DEMO = [
  {
    nome: 'Criança',
    nameEn: 'Child',
    idade: '0 a 12',
    roteiro: 'Quiz Educativo + Caça ao Tesouro no Acervo',
    roteiroEn: 'Educational Quiz + Treasure Hunt in the Collection',
    tempo: '45 min',
  },
  {
    nome: 'Adolescente',
    nameEn: 'Teen',
    idade: '12 a 18',
    roteiro: 'Exposições contemporâneas + cupom no Café',
    roteiroEn: 'Contemporary exhibitions + Cafe coupon',
    tempo: '1h',
  },
  {
    nome: 'Jovem',
    nameEn: 'Young Adult',
    idade: '18 a 30',
    roteiro: 'Histórias Latino-Americanas + Assistente IA',
    roteiroEn: 'Latin American Stories + AI Assistant',
    tempo: '1h30',
  },
  {
    nome: 'Adulto',
    nameEn: 'Adult',
    idade: '30 a 60',
    roteiro: 'Roteiro completo + Linha do Tempo MASP',
    roteiroEn: 'Full itinerary + MASP Timeline',
    tempo: '2h',
  },
  {
    nome: 'Idoso',
    nameEn: 'Senior',
    idade: '60+',
    roteiro: 'Acervo Permanente em ritmo tranquilo',
    roteiroEn: 'Permanent Collection at a calm pace',
    tempo: '1h30 com pausa',
  },
];

export default function Detector() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <MaspHeader />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
            <span className="block w-12 h-[2px] bg-primary" />
            {lang === 'en' ? 'Beta · Computer Vision' : 'Beta · Visão Computacional'}
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-foreground uppercase mt-3 leading-[0.95]">
            {lang === 'en' ? 'Smart Detector' : 'Detector Inteligente'}
          </h1>
          <div className="brutalist-rule-red mt-5 w-24" />
          <p className="text-muted-foreground text-base mt-5 max-w-2xl leading-relaxed">
            {lang === 'en'
              ? 'A camera-based pipeline that detects a person, estimates their age and triggers a personalized itinerary in the KORA totem. Below: how it works, and a QR to run the code yourself.'
              : 'Pipeline com câmera que detecta a pessoa, estima a faixa etária e dispara um roteiro personalizado no totem KORA. Abaixo: como funciona e um QR para rodar o código você mesma.'}
          </p>
        </motion.section>

        {/* Pipeline visual */}
        <section className="mt-12">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3 mb-4">
            <span className="block w-10 h-[2px] bg-primary" />
            {lang === 'en' ? 'Pipeline' : 'Pipeline'}
          </span>
          <h2 className="font-display text-3xl text-foreground uppercase mb-6">
            {lang === 'en' ? 'How it works' : 'Como funciona'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              {
                icon: Camera,
                label: lang === 'en' ? '1. Camera' : '1. Câmera',
                desc: lang === 'en' ? 'Captures image / video frame' : 'Captura imagem / frame de vídeo',
              },
              {
                icon: Users,
                label: lang === 'en' ? '2. YOLOv8' : '2. YOLOv8',
                desc: lang === 'en' ? 'Detects person, returns bounding box' : 'Detecta pessoa, retorna bounding box',
              },
              {
                icon: Cpu,
                label: lang === 'en' ? '3. DeepFace' : '3. DeepFace',
                desc: lang === 'en' ? 'Estimates age from face crop' : 'Estima idade a partir do recorte do rosto',
              },
              {
                icon: Sparkles,
                label: lang === 'en' ? '4. KORA' : '4. KORA',
                desc: lang === 'en' ? 'Classifies age group and triggers itinerary' : 'Classifica faixa etária e dispara roteiro',
              },
            ].map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="border-2 border-foreground p-5 bg-background"
              >
                <step.icon className="w-6 h-6 text-primary mb-3" strokeWidth={2} />
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary mb-1">
                  {step.label}
                </p>
                <p className="text-sm text-foreground leading-snug">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tabela de faixas e recomendações */}
        <section className="mt-12">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3 mb-4">
            <span className="block w-10 h-[2px] bg-primary" />
            {lang === 'en' ? 'Mapping' : 'Mapeamento'}
          </span>
          <h2 className="font-display text-3xl text-foreground uppercase mb-6">
            {lang === 'en' ? 'Age groups → KORA itinerary' : 'Faixas → roteiro KORA'}
          </h2>

          <ol className="border-2 border-foreground">
            {FAIXAS_DEMO.map((f, i) => (
              <motion.li
                key={f.nome}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-stretch ${i < FAIXAS_DEMO.length - 1 ? 'border-b-2 border-foreground' : ''}`}
              >
                <div className="w-20 shrink-0 bg-foreground text-background flex flex-col items-center justify-center py-4 px-2">
                  <span className="font-display text-2xl tnum">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="flex-1 py-4 px-5 flex flex-col sm:flex-row sm:items-center sm:gap-6">
                  <div className="sm:w-44 shrink-0">
                    <p className="font-display text-xl text-foreground uppercase leading-tight">
                      {lang === 'en' ? f.nameEn : f.nome}
                    </p>
                    <p className="text-xs text-muted-foreground tnum mt-1">
                      {f.idade} {lang === 'en' ? 'years' : 'anos'}
                    </p>
                  </div>
                  <div className="flex-1 mt-2 sm:mt-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-1">
                      {lang === 'en' ? 'Suggested itinerary' : 'Roteiro sugerido'}
                    </p>
                    <p className="text-sm text-foreground leading-snug">
                      {lang === 'en' ? f.roteiroEn : f.roteiro}
                    </p>
                  </div>
                  <div className="sm:w-28 shrink-0 mt-3 sm:mt-0 text-right">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1">
                      {lang === 'en' ? 'Time' : 'Tempo'}
                    </p>
                    <p className="font-display text-lg text-foreground tnum">{f.tempo}</p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </section>

        {/* QR code pro Colab + chamada pra ação */}
        <section className="mt-12 border-2 border-foreground bg-foreground text-background p-6 sm:p-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
              <ExternalLink className="w-3 h-3" />
              {lang === 'en' ? 'Run it yourself' : 'Rode você mesma'}
            </span>
            <h2 className="font-display text-3xl md:text-4xl uppercase mt-3 leading-[1.05]">
              {lang === 'en'
                ? 'Open the notebook in Colab'
                : 'Abra o notebook no Colab'}
            </h2>
            <p className="text-sm opacity-90 mt-4 leading-relaxed max-w-md">
              {lang === 'en'
                ? 'Point your phone camera at the QR code to open the Python notebook in Google Colab. Test with a sample image or your own photo, and see the full pipeline running step by step.'
                : 'Aponte a câmera do celular para o QR Code para abrir o notebook Python no Google Colab. Teste com uma imagem de exemplo ou com a sua própria foto, e veja a pipeline completa rodando passo a passo.'}
            </p>
            <a
              href={COLAB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.3em] hover:opacity-90 transition-opacity"
            >
              {lang === 'en' ? 'Open in Colab' : 'Abrir no Colab'}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="bg-background p-4 border-2 border-background shrink-0 mx-auto">
            <QRCodeSVG
              value={COLAB_URL}
              size={180}
              fgColor="hsl(var(--foreground))"
              bgColor="hsl(var(--background))"
              level="M"
              marginSize={2}
            />
          </div>
        </section>

        {/* Detalhes técnicos */}
        <section className="mt-12 border-2 border-border p-6 sm:p-8">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3 block">
            {lang === 'en' ? 'Tech stack' : 'Stack técnica'}
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">YOLOv8</p>
              <p className="text-foreground mt-1">{lang === 'en' ? 'Person detection' : 'Detecção de pessoa'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">DeepFace</p>
              <p className="text-foreground mt-1">{lang === 'en' ? 'Age estimation (VGGFace2)' : 'Estimativa de idade (VGGFace2)'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">OpenCV</p>
              <p className="text-foreground mt-1">{lang === 'en' ? 'Image processing' : 'Processamento de imagem'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Python</p>
              <p className="text-foreground mt-1">Jupyter / Colab</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-6 leading-relaxed border-t border-border pt-4">
            {lang === 'en'
              ? 'In production this pipeline runs on the totem hardware itself, with no images sent to a server. The KORA frontend would receive only the age group classification and trigger the personalized itinerary.'
              : 'Em produção, a pipeline roda no próprio hardware do totem, sem enviar imagens para servidor. O front KORA receberia apenas a classificação da faixa etária e dispararia o roteiro personalizado.'}
          </p>
        </section>

        <footer className="mt-16 border-t border-border pt-6 pb-12 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>{lang === 'en' ? 'Sprint 4 · Neural Networks' : 'Sprint 4 · Redes Neurais'}</span>
          <span>KORA × MASP · FIAP 2026</span>
        </footer>
      </div>
    </div>
  );
}
