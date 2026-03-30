#!/bin/bash

# ==============================================================================
# Script de Instalação e Configuração - MASP Explorer Totem (Raspberry Pi)
# ==============================================================================
# Este script configura o Raspberry Pi OS para rodar o MASP Explorer em
# modo quiosque (tela cheia, sem cursor, inicialização automática).
# ==============================================================================

echo "Iniciando configuração do Totem MASP Explorer..."

# 1. Atualizar o sistema
echo "[1/6] Atualizando pacotes do sistema..."
sudo apt-get update && sudo apt-get upgrade -y

# 2. Instalar dependências necessárias
echo "[2/6] Instalando dependências (Chromium, Unclutter, Node.js)..."
sudo apt-get install -y chromium-browser unclutter curl git

# Instalar Node.js (versão 20.x LTS)
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# 3. Preparar o projeto
echo "[3/6] Instalando dependências do projeto e gerando build..."
npm install
npm run build

# Instalar um servidor web estático globalmente
sudo npm install -g serve

# 4. Configurar serviço Systemd para o servidor web
echo "[4/6] Configurando serviço do servidor web..."
SERVICE_FILE="/etc/systemd/system/masp-totem.service"
sudo bash -c "cat > $SERVICE_FILE" << EOL
[Unit]
Description=MASP Explorer Web Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/serve -s dist -l 8080
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOL

sudo systemctl daemon-reload
sudo systemctl enable masp-totem.service
sudo systemctl start masp-totem.service

# 5. Configurar o Modo Quiosque (Autostart do Wayland/X11)
echo "[5/6] Configurando inicialização automática do navegador em modo quiosque..."

# Verifica se está usando Wayland (padrão nas versões mais novas do Raspberry Pi OS) ou X11
WAYFIRE_DIR="$HOME/.config/wayfire.ini"
AUTOSTART_DIR="$HOME/.config/autostart"

if [ -d "$HOME/.config/wayfire" ] || command -v wayfire &> /dev/null; then
    # Configuração para Wayland (Raspberry Pi OS Bookworm)
    echo "Detectado ambiente Wayland."
    if ! grep -q "\[autostart\]" "$WAYFIRE_DIR" 2>/dev/null; then
        echo -e "\n[autostart]\nchromium = chromium-browser --kiosk --noerrdialogs --disable-infobars --incognito http://localhost:8080" >> "$WAYFIRE_DIR"
    fi
else
    # Configuração para X11 (Raspberry Pi OS Bullseye ou anterior)
    echo "Detectado ambiente X11."
    mkdir -p "$AUTOSTART_DIR"
    cat > "$AUTOSTART_DIR/kiosk.desktop" << EOL
[Desktop Entry]
Type=Application
Name=Kiosk
Exec=bash -c "unclutter -idle 0.5 -root & sed -i 's/\"exited_cleanly\":false/\"exited_cleanly\":true/' ~/.config/chromium/Default/Preferences; sed -i 's/\"exit_type\":\"Crashed\"/\"exit_type\":\"Normal\"/' ~/.config/chromium/Default/Preferences; chromium-browser --noerrdialogs --disable-infobars --kiosk --incognito http://localhost:8080"
X-GNOME-Autostart-Phase=Application
EOL
fi

# 6. Otimizações de energia e tela
echo "[6/6] Aplicando otimizações de tela (evitar que a tela apague)..."
sudo raspi-config nonint do_blanking 1 # Desativa o screen blanking

echo "=============================================================================="
echo "Instalação concluída com sucesso!"
echo "O projeto foi compilado e o serviço web está rodando na porta 8080."
echo "O navegador abrirá automaticamente em tela cheia na próxima inicialização."
echo "Por favor, REINICIE o Raspberry Pi agora executando: sudo reboot"
echo "=============================================================================="
