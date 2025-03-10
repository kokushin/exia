// Native
import { join } from "path";
import { format } from "url";
import { writeFile } from "fs/promises";

// Packages
import { BrowserWindow, app, ipcMain } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");

  const mainWindow = new BrowserWindow({
    // width: 390,
    // height: 844,
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, "preload.js"),
    },
  });

  const url = isDev
    ? "http://localhost:8000/"
    : format({
        pathname: join(__dirname, "../renderer/out/index.html"),
        protocol: "file:",
        slashes: true,
      });

  mainWindow.loadURL(url);
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }

  // シナリオ保存とリロードのハンドラー
  ipcMain.handle("save-scenario", async (_event, content: string) => {
    try {
      // 現在のシナリオIDを取得
      const scenario = JSON.parse(content);
      const scenarioPath = join(__dirname, `../renderer/src/scenarios/${scenario.id}.json`);

      // ファイルに保存
      await writeFile(scenarioPath, content, "utf-8");
      console.log("Scenario saved successfully");

      // ファイルシステムの変更が反映されるのを待ってからリロード
      setTimeout(async () => {
        console.log("Reloading main window...");
        try {
          // 現在のURLを取得
          const currentURL = mainWindow.webContents.getURL();

          // 一度URLを再読み込み
          await mainWindow.loadURL(currentURL);
          console.log("Main window reloaded successfully");

          // DevToolsを再表示（開発モードの場合）
          if (process.env.NODE_ENV === "development") {
            mainWindow.webContents.openDevTools();
          }
        } catch (reloadError) {
          console.error("Failed to reload:", reloadError);
        }
      }, 500);

      return { success: true };
    } catch (error) {
      console.error("Failed to save scenario:", error);
      throw error;
    }
  });
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);
