import { motion } from 'framer-motion';
import { Shield, Eye, Clock, BarChart3, Trash2, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MaspHeader } from '@/components/MaspHeader';
import { useLanguage } from '@/contexts/LanguageContext';

const dataItems = [
  {
    icon: <Eye className="w-5 h-5" />,
    title: 'Interações com o totem',
    description: 'Registramos quais telas foram acessadas e por quanto tempo, para entender o comportamento dos visitantes.',
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Tempo de sessão',
    description: 'Monitoramos a duração total da sua interação com o totem para otimizar a experiência.',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Preferências de conteúdo',
    description: 'Identificamos quais exposições e obras geram mais interesse para melhorar a curadoria e programação.',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Dados do cupom',
    description: 'Nome e e-mail fornecidos para o cupom de desconto são usados exclusivamente para essa finalidade.',
  },
];

export default function DadosDeUso() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <MaspHeader />

      <div className="px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-foreground mb-2">{t('dados.titulo')}</h1>
          <p className="text-muted-foreground text-sm mb-8">
            {t('dados.subtitulo')}
          </p>
        </motion.div>

        <div className="space-y-4 mb-8">
          {dataItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-4 p-4 border border-border"
            >
              <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-4 bg-masp-light border-l-4 border-primary mb-6">
          <p className="font-bold text-foreground text-sm mb-2">{t('dados.direitos')}</p>
          <ul className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
            <li>Você pode encerrar a sessão a qualquer momento</li>
            <li>Dados de navegação são anonimizados automaticamente</li>
            <li>Dados pessoais (nome/e-mail) são coletados apenas mediante consentimento</li>
            <li>Em conformidade com a LGPD (Lei Geral de Proteção de Dados)</li>
          </ul>
        </div>

        <div className="p-4 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <Trash2 className="w-4 h-4 text-muted-foreground" />
            <p className="font-bold text-foreground text-sm">{t('dados.exclusao')}</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Para solicitar a exclusão dos seus dados, entre em contato pelo e-mail{' '}
            <strong className="text-foreground">privacidade@masp.org.br</strong> ou
            fale com um atendente na recepção do museu.
          </p>
        </div>

        {/* Console Flexmedia, acesso restrito operador. Mostrado aqui porque eh
            a pagina de transparencia de dados, faz sentido conectar com onde os
            dados anonimos sao visualizados. */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/admin')}
          className="mt-6 w-full flex items-stretch border-2 border-foreground bg-foreground text-background hover:bg-primary hover:border-primary transition-colors group/admin"
        >
          <div className="w-14 shrink-0 flex items-center justify-center border-r-2 border-background/20">
            <Lock className="w-5 h-5" />
          </div>
          <div className="flex-1 py-4 px-5 text-left">
            <span className="block text-[10px] font-black uppercase tracking-[0.3em] opacity-80">
              Acesso restrito
            </span>
            <span className="block font-display text-xl uppercase mt-0.5">
              Console Flexmedia
            </span>
            <span className="block text-xs opacity-80 mt-1">
              Dashboard de uso anônimo do totem · operador
            </span>
          </div>
          <div className="w-14 shrink-0 flex items-center justify-center">
            <ArrowRight className="w-5 h-5 group-hover/admin:translate-x-1 transition-transform" />
          </div>
        </motion.button>
      </div>
    </div>
  );
}
