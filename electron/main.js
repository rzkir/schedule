import { app, BrowserWindow } from "electron";

import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === "development";

let mainWindow;

function createWindow() {
  const appIcon =
    process.platform === "win32"
      ? path.join(__dirname, "../public/logo.ico")
      : path.join(__dirname, "../public/logo.png");

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
      webSecurity: true,
      allowRunningInsecureContent: false,
      webviewTag: false,
    },
    autoHideMenuBar: true,
    icon: appIcon,
    show: false,
  });

  if (isDev) {
    mainWindow.loadURL(process.env.NEXT_PUBLIC_URL);
    if (process.env.ENABLE_DEVTOOLS === "1") {
      mainWindow.webContents.openDevTools({ mode: "detach" });
    }
  } else {
    mainWindow
      .loadURL(process.env.NEXT_PUBLIC_URL)
      .catch(() => {
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Schedule - Server Not Running</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              background: #1a1a1a; 
              color: white; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              height: 100vh; 
              margin: 0; 
            }
            .container { 
              text-align: center; 
              padding: 2rem; 
              background: #2a2a2a; 
              border-radius: 10px; 
              max-width: 500px; 
            }
            .error-icon { 
              font-size: 4rem; 
              color: #ff6b6b; 
              margin-bottom: 1rem; 
            }
            h1 { color: #ff6b6b; }
            .steps { 
              text-align: left; 
              background: #333; 
              padding: 1rem; 
              border-radius: 5px; 
              margin: 1rem 0; 
            }
            code { 
              background: #444; 
              padding: 0.2rem 0.4rem; 
              border-radius: 3px; 
              font-family: monospace; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error-icon">⚠️</div>
            <h1>Server Not Running</h1>
            <p>Next.js production server is not running. Please start it manually:</p>
            
            <div class="steps">
              <p><strong>Step 1:</strong> Open a new terminal and run:</p>
              <code>npm start</code>
              
              <p><strong>Step 2:</strong> Wait for server to start (you'll see "Ready" message)</p>
              
              <p><strong>Step 3:</strong> Refresh this window or restart Electron</p>
            </div>
            
            <p><strong>Alternative:</strong> Use development mode instead:</p>
            <code>npm run desktop</code>
          </div>
        </body>
        </html>
      `;

        mainWindow.loadURL(
          `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`
        );
      });
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});