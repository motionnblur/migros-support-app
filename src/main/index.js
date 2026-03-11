import { app, BrowserWindow } from "electron";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1100,
    height: 720,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js")
    },
      autoHideMenuBar: true,
  });

  const devServerUrl = process.env.ELECTRON_RENDERER_URL || process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    win.loadURL(devServerUrl);
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  }
};

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
