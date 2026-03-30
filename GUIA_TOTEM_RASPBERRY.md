# Guia de Configuração: Totem MASP Explorer no Raspberry Pi 3

Este guia detalha como configurar um Raspberry Pi 3 para rodar o aplicativo **MASP Explorer** como um totem interativo touchscreen em modo quiosque (kiosk mode).

Neste modo, o aplicativo roda em tela cheia, sem barras de navegação, sem cursor do mouse e bloqueia o acesso do usuário ao sistema operacional. Além disso, o sistema foi modificado para resetar automaticamente a sessão após 90 segundos de inatividade.

---

## 1. Requisitos de Hardware

- **Raspberry Pi 3** (Modelo B ou B+) com fonte de alimentação original (5V 2.5A).
- **Cartão MicroSD** (mínimo 16GB, classe 10).
- **Monitor Touchscreen** compatível com Raspberry Pi (via HDMI e USB para o touch).
- Conexão com a internet (Wi-Fi ou Cabo) para acesso ao banco de dados (Supabase) e IA.

---

## 2. Preparação do Sistema Operacional

1. Baixe e instale o [Raspberry Pi Imager](https://www.raspberrypi.com/software/) no seu computador.
2. Insira o cartão MicroSD no computador.
3. No Raspberry Pi Imager:
   - **OS:** Escolha `Raspberry Pi OS (32-bit)` (versão com Desktop, não a versão Lite).
   - **Storage:** Selecione o seu cartão MicroSD.
   - Clique na engrenagem (Configurações Avançadas) antes de gravar:
     - Ative o **SSH**.
     - Configure o **Wi-Fi** (SSID e Senha da rede do museu).
     - Defina o usuário padrão (recomendado: `pi` ou `masp`).
     - Defina o locale e timezone (`America/Sao_Paulo`, teclado `br`).
4. Clique em **Write** e aguarde a gravação.
5. Insira o MicroSD no Raspberry Pi, conecte o monitor touchscreen e ligue-o.

---

## 3. Instalação Automatizada do MASP Explorer

Preparamos um script que automatiza 90% do trabalho. Ele instala o Node.js, compila o projeto, configura um servidor web como serviço do sistema e ajusta o navegador para abrir em tela cheia automaticamente.

Abra o terminal no Raspberry Pi (ou acesse via SSH) e execute os seguintes comandos:

```bash
# 1. Clone o repositório (substitua pela URL correta se necessário)
git clone https://github.com/SEU_USUARIO/masp-explorer.git
cd masp-explorer

# 2. Dê permissão de execução ao script
chmod +x install_totem.sh

# 3. Execute o script de instalação
./install_totem.sh
```

O script fará o seguinte:
- Atualizará o sistema.
- Instalará o Node.js 20.x, Chromium e Unclutter (para esconder o cursor).
- Instalará as dependências do projeto (`npm install`) e fará o build (`npm run build`).
- Criará um serviço `systemd` para rodar o app na porta 8080.
- Configurará o autostart do Chromium em modo Kiosk.
- Desativará o descanso de tela (screen blanking).

Ao final da execução, o script pedirá para você reiniciar o Raspberry Pi:
```bash
sudo reboot
```

---

## 4. O que mudou no código para o Totem?

Para adaptar a aplicação web padrão para um ambiente de totem público, as seguintes alterações foram implementadas no código:

1. **Bloqueio de Seleção e Zoom (`src/totem.css`)**
   - Desativamos a seleção de texto (`user-select: none`).
   - Removemos o highlight de toque em botões.
   - Escondemos a barra de rolagem visual, mantendo o scroll funcional via touch.
   - Bloqueamos o zoom por pinça (pinch-to-zoom).

2. **Reset por Inatividade (`src/hooks/useIdleTimer.ts` e `App.tsx`)**
   - Implementamos um timer que monitora toques na tela.
   - Se o totem ficar **90 segundos sem interação**, a sessão atual é encerrada (limpando dados do usuário anterior).
   - Uma tela de descanso (`IdleOverlay.tsx`) é exibida com a mensagem "Toque para começar".

---

## 5. Resolução de Problemas Comuns (Troubleshooting)

### A tela está apagando após alguns minutos
O script já tenta desativar isso, mas se continuar ocorrendo, abra o terminal e digite `sudo raspi-config`. Vá em `Display Options` > `Screen Blanking` e selecione `No`.

### O Touchscreen está invertido ou descalibrado
Dependendo da marca do monitor, pode ser necessário calibrar o touch.
Se for um monitor genérico, edite o arquivo de configuração:
```bash
sudo nano /boot/config.txt
```
Adicione ou modifique a linha `lcd_rotate=2` ou `display_rotate=2` dependendo da orientação física da tela.

### Como sair do modo tela cheia (Kiosk)?
Como não há teclado físico conectado normalmente, a melhor forma é acessar o Raspberry Pi via SSH por outro computador e matar o processo do navegador:
```bash
killall chromium-browser
```
Se tiver um teclado conectado ao Raspberry Pi, pressione `Alt + F4` ou `Ctrl + W`.

### Como atualizar o app no futuro?
Acesse o Raspberry Pi via SSH, vá até a pasta do projeto, puxe as atualizações e refaça o build:
```bash
cd ~/masp-explorer
git pull
npm install
npm run build
sudo systemctl restart masp-totem.service
```

---

## 6. Manutenção do Serviço

O servidor web roda como um serviço em background. Você pode gerenciá-lo com os comandos:

- **Ver status:** `sudo systemctl status masp-totem.service`
- **Reiniciar:** `sudo systemctl restart masp-totem.service`
- **Parar:** `sudo systemctl stop masp-totem.service`
- **Ver logs de erro:** `journalctl -u masp-totem.service -f`
