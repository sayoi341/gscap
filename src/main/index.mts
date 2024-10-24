import { fileURLToPath } from "node:url";
import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import {
  BrowserWindow,
  app,
  desktopCapturer,
  ipcMain,
  session,
  shell,
} from "electron";
import icon from "../../resources/icon.png?asset";

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: fileURLToPath(new URL("../preload/index.mjs", import.meta.url)),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(
      fileURLToPath(new URL("../renderer/index.html", import.meta.url)),
    );
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  session.defaultSession.setDisplayMediaRequestHandler((_, callback) => {
    desktopCapturer.getSources({ types: ["window"] }).then((sources) => {
      console.table(sources);
      callback({ video: sources[0], audio: "loopback" });
    });
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("window::get-stream", async () => {
  session.defaultSession.setDisplayMediaRequestHandler(async (_, callback) => {
    const sources = await desktopCapturer.getSources({ types: ["window"] });
    callback({ video: sources[1], audio: "loopback" });
  });
});

ipcMain.handle("window::get-all-thumbnail", async () => {
  const sources = await desktopCapturer.getSources({ types: ["window"] });
  return sources.map((source) => source.thumbnail.toDataURL());
});
