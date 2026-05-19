import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, RefreshCw, Download, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MaspHeader } from '@/components/MaspHeader';

/**
 * Selfie spot. Acessa a câmera frontal via getUserMedia, sobrepõe o passepartout
 * brutalista do MASP, e ao capturar gera uma imagem composta no canvas pronta pra
 * baixar. Nenhuma imagem sai do dispositivo: tudo é processado localmente.
 */
export default function Selfie() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);

  // Inicia a câmera assim que a página monta. Pede preferencialmente a frontal.
  useEffect(() => {
    let active = true;
    const start = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setError('Este navegador não suporta acesso à câmera.');
          return;
        }
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 1280 } },
          audio: false,
        });
        if (!active) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          await videoRef.current.play();
        }
      } catch (e) {
        const err = e as Error;
        if (err.name === 'NotAllowedError') {
          setError('Permissão de câmera negada. Toque em "Permitir" no aviso do navegador.');
        } else if (err.name === 'NotFoundError') {
          setError('Câmera não encontrada neste dispositivo.');
        } else {
          setError(`Não foi possível acessar a câmera (${err.message || err.name}).`);
        }
      }
    };
    start();
    return () => {
      active = false;
      setStream((s) => {
        s?.getTracks().forEach((t) => t.stop());
        return null;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) return;

    const size = Math.min(video.videoWidth, video.videoHeight);
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;
    const outSize = 1080;

    canvas.width = outSize;
    canvas.height = outSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Espelha horizontalmente pra ficar como o usuário se vê na câmera frontal.
    ctx.save();
    ctx.translate(outSize, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, size, size, 0, 0, outSize, outSize);
    ctx.restore();

    // Frame brutalista MASP
    const red = '#B7252A';
    const black = '#0F0F0F';
    const border = 36;
    ctx.fillStyle = red;
    ctx.fillRect(0, 0, outSize, border);
    ctx.fillRect(0, outSize - border, outSize, border);
    ctx.fillRect(0, 0, border, outSize);
    ctx.fillRect(outSize - border, 0, border, outSize);

    // Top label "MASP"
    ctx.fillStyle = '#F3F1EE';
    ctx.font = 'bold 56px Inter, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText('MASP', border + 28, border / 2 + outSize - border + 18);

    // Bottom label "TOTEM KORA · MMXXVI"
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillText('TOTEM KORA · MMXXVI', border + 28, outSize - border / 2 - 18);

    // Vertical rule on the right edge
    ctx.fillStyle = black;
    ctx.fillRect(outSize - border - 6, border, 6, outSize - border * 2);

    setCaptured(canvas.toDataURL('image/png'));
  };

  const download = () => {
    if (!captured) return;
    const a = document.createElement('a');
    a.href = captured;
    a.download = `masp-selfie-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const retake = () => setCaptured(null);

  return (
    <div className="min-h-screen bg-background">
      <MaspHeader />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <section>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
            <span className="block w-12 h-[2px] bg-primary" />
            Selfie spot
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-foreground uppercase mt-3 leading-[0.95]">
            Você no MASP
          </h1>
          <div className="brutalist-rule-red mt-5 w-24" />
          <p className="text-muted-foreground text-base mt-5 max-w-xl leading-relaxed">
            Posicione o rosto no quadro vermelho cavalete e toque em capturar.
            A foto fica no seu dispositivo, nada é enviado pra fora.
          </p>
        </section>

        {error ? (
          <div className="mt-10 border-2 border-foreground p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-foreground">Não foi possível abrir a câmera</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
              <button
                onClick={() => navigate(-1)}
                className="mt-4 inline-flex items-center gap-2 border-2 border-foreground px-4 py-2 text-xs font-black uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Voltar
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-10">
            <div className="relative border-[12px] border-primary bg-foreground aspect-square overflow-hidden mx-auto max-w-md">
              {captured ? (
                <img src={captured} alt="Selfie capturada" className="w-full h-full object-cover" />
              ) : (
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
              )}
              {!captured && (
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3">
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary-foreground/90 bg-primary px-2 py-1 self-start">
                    MASP · Live
                  </span>
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary-foreground/90 self-end">
                    Av. Paulista 1578
                  </span>
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-3 justify-center">
              {captured ? (
                <>
                  <button
                    onClick={retake}
                    className="px-6 py-4 border-2 border-foreground text-foreground font-black text-xs uppercase tracking-[0.3em] flex items-center gap-2 hover:bg-foreground hover:text-background transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" /> Refazer
                  </button>
                  <button
                    onClick={download}
                    className="px-6 py-4 bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.3em] flex items-center gap-2 hover:bg-primary/90 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Baixar foto
                  </button>
                </>
              ) : (
                <button
                  onClick={capture}
                  disabled={!stream}
                  className="px-10 py-5 bg-foreground text-background font-black text-xs uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Camera className="w-5 h-5" />
                  Capturar
                </button>
              )}
            </div>

            <p className="mt-6 text-[10px] text-center uppercase tracking-[0.2em] text-muted-foreground">
              Imagem processada localmente, nenhum dado pessoal coletado
            </p>
          </div>
        )}

        {/* Canvas oculto usado pra compor a foto final */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
