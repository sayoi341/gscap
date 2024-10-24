import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge } from "electron";
import { ipcRenderer } from "electron";

// Custom APIs for renderer
const api = {
  window: {
    getAllThumbnail: () => ipcRenderer.invoke("window::get-all-thumbnail"),
    getStream: () => ipcRenderer.invoke("window::get-stream"),
  },
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}
