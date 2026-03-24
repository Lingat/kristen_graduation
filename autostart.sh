# auto start script for raspberry pi
cd kristen_graduation
nvm use 20
git pull
node server.js &
chromium-browser http://localhost:3000 --start-fullscreen