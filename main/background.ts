import path from "path";
import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
// import UpbitApi from "./helpers/upbitApi";
import QuoationService from "./helpers/upbit/quoationService";

// const upbitApi = new UpbitApi(
//   process.env.UPBIT_ACCESS_KEY ?? "",
//   process.env.UPBIT_SECRET_KEY ?? "",
// );
//

const quoationService = new QuoationService();

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isProd) {
    await mainWindow.loadURL("app://./");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});

// ipcMain.on("getMarketAllInfo", async (event) => {
//   try {
//     const marketData = await quoationService.getMarketAllInfo();
//     event.reply("getMarketAllInfoReply", marketData);
//   } catch (err) {
//     event.reply("getMarketAllInfoReply", { error: err });
//   }
// });

ipcMain.on("getMarketAllInfo", async (event) => {
  try {
    const marketData = await quoationService.getMarketAllInfo();
    event.reply("getMarketAllInfoReply", { success: true, data: marketData });
  } catch (err) {
    console.error("Error fetching market data:", err);
    event.reply("getMarketAllInfoReply", {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    });
  }
});
