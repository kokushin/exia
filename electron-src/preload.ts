/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { contextBridge, ipcRenderer } from "electron";
import { IpcRendererEvent } from "electron/main";

declare global {
  interface Window {
    electron: {
      sayHello: () => void;
      receiveHello: (handler: (event: IpcRendererEvent, ...args: any[]) => void) => void;
      stopReceivingHello: (handler: (event: IpcRendererEvent, ...args: any[]) => void) => void;
      saveScenario: (content: string) => Promise<{ success: boolean }>;
      reloadMainWindow: () => Promise<void>;
    };
  }
}

// We are using the context bridge to securely expose NodeAPIs.
// Please note that many Node APIs grant access to local system resources.
// Be very cautious about which globals and APIs you expose to untrusted remote content.
contextBridge.exposeInMainWorld("electron", {
  sayHello: () => ipcRenderer.send("message", "hi from next"),
  receiveHello: (handler: (event: IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on("message", handler),
  stopReceivingHello: (handler: (event: IpcRendererEvent, ...args: any[]) => void) =>
    ipcRenderer.removeListener("message", handler),
  saveScenario: (content: string) => ipcRenderer.invoke("save-scenario", content),
  reloadMainWindow: () => ipcRenderer.invoke("reload-main-window"),
});

// TypeScriptの型定義を拡張
declare global {
  interface ElectronAPI {
    saveScenario: (content: string) => Promise<{ success: boolean }>;
  }
}
