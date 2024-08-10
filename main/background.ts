import path from "path";
import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import QuoationService from "./helpers/upbit/quoationService";
import UpbitWebSocketService from "./services/UpbitWebSocketService";

const quoationService = new QuoationService();
const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

let upbitWebSocketService: UpbitWebSocketService | null = null;

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

  upbitWebSocketService = new UpbitWebSocketService((channel, data) => {
    mainWindow.webContents.send(channel, data);
  });
  upbitWebSocketService.connect();

  ipcMain.on("subscribe-market", (event, market) => {
    upbitWebSocketService?.subscribe(market, (data) => {
      event.reply(`marketData_${market}`, data);
    });
  });

  ipcMain.on("unsubscribe-market", (event, market) => {
    upbitWebSocketService?.unsubscribe(market, () => {});
  });

  ipcMain.on("getTopTradePriceTickers", async (event, count = 10) => {
    try {
      // 1. 모든 마켓 정보 가져오기
      const allMarkets = await quoationService.getMarketAllInfo();
      const krwMarkets = allMarkets.KRW;

      // 2. 티커 정보 가져오기
      const tickers = await quoationService.getTicker(
        krwMarkets.map((market) => market.market),
      );

      // 3. 마켓 정보와 티커 정보 결합
      const combinedData = tickers.map((ticker) => {
        const marketInfo = krwMarkets.find(
          (market) => market.market === ticker.market,
        );
        return {
          ...ticker,
          korean_name: marketInfo?.korean_name || "Unknown",
        };
      });

      // 4. 거래대금으로 정렬하고 상위 N개 선택
      const topTradePriceTickers = combinedData
        .sort((a, b) => b.acc_trade_price_24h - a.acc_trade_price_24h)
        .slice(0, count);

      event.reply("getTopTradePriceTickersReply", {
        success: true,
        data: topTradePriceTickers,
      });
    } catch (err) {
      console.error("Error fetching top trade price tickers:", err);
      event.reply("getTopTradePriceTickersReply", {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      });
    }
  });
})();

app.on("window-all-closed", () => {
  app.quit();
});

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
