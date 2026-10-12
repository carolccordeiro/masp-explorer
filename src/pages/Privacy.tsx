import { Camera, Database, EyeOff, Lock, Sparkles, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { Header } from "@/components/Shell";
import { Page } from "@/components/ui";
import { useSettings } from "@/context/Settings";
import { useFavorites } from "@/lib/favorites";

function Item({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="card flex gap-4 p-5">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-ink text-bg">{icon}</span>
      <div>
        <p className="text-[17px] font-extrabold">{title}</p>
        <p className="body-copy mt-1">{children}</p>
      </div>
    </div>
  );
}

export default function Privacy() {
  const { t } = useSettings();
  const { clear } = useFavorites();
  return (
    <>
      <Header back="/" title={t("privacy.title")} />
      <Page className="max-w-3xl">
        <h1 className="text-[34px] font-extrabold tracking-tight">{t("privacy.title")}</h1>
        <p className="mt-2 text-[17px] text-muted">{t("privacy.intro")}</p>
        <div className="mt-6 grid gap-3">
          <Item icon={<EyeOff size={20} />} title="Sem cadastro, sem dados pessoais">
            Não pedimos nome, e-mail, telefone ou CPF. Cada visita recebe um identificador aleatório que some quando o navegador é fechado.
          </Item>
          <Item icon={<Camera size={20} />} title="Scanner e sensor no seu aparelho">
            O reconhecimento de obras e a contagem de pessoas rodam no próprio aparelho. As imagens não são gravadas nem enviadas. Só se você tocar em "Perguntar à IA" a foto da obra é enviada uma única vez para identificação, sem ser armazenada.
          </Item>
          <Item icon={<Sparkles size={20} />} title="Assistente de IA">
            As perguntas são enviadas ao modelo de IA apenas para gerar a resposta. A conversa fica só nesta aba e é apagada ao fechar ou após inatividade no totem.
          </Item>
          <Item icon={<Database size={20} />} title="Métricas anônimas para o museu">
            Registramos só o tipo de ação (por exemplo, "obra aberta" ou "roteiro criado"), a tela e o horário. Isso ajuda o museu a entender o que o público mais gosta, em conformidade com a LGPD (Lei 13.709/2018), sem dados pessoais.
          </Item>
          <Item icon={<Lock size={20} />} title="Favoritos ficam com você">
            Suas obras salvas ficam apenas neste aparelho.
          </Item>
        </div>
        <button onClick={clear} className="tap mt-6 inline-flex items-center gap-2 rounded-full bg-danger/10 px-5 py-3 text-[15px] font-bold text-danger">
          <Trash2 size={17} /> Apagar minhas obras salvas
        </button>
      </Page>
    </>
  );
}
