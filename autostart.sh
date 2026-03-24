#!/bin/bash
# 1. Load NVM environment (Crucial for autostart)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 2. Move to project folder
cd ~/kristen_graduation || exit

# 3. Update and Start Node
git pull
nvm use 20
node server.js &

# 4. Wait a few seconds for the server to actually breathe
sleep 5

# 5. Launch Chrome
chromium-browser http://localhost:3000 --start-fullscreen