const { app, BrowserWindow } = require('electron');
const path = require('path');
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(
    `file://${path.join(__dirname, 'build', 'index.html')}`
  );

  mainWindow.webContents.openDevTools();

  mainWindow.webContents.on("devtools-opened", () => {
      mainWindow.webContents.closeDevTools();
  }); 
}

app.whenReady().then(createWindow);
