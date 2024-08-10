import { Utype } from "@shared/types/quotation";
import WebSocket from "ws";

class UpbitWebSocketService {
  private ws: WebSocket | null = null;
  private reconnectInterval: NodeJS.Timeout | null = null;
  private subscribedMarkets: Set<string> = new Set();
  private marketDataHandlers: Map<
    string,
    Set<(data: Utype.ITickerSimpleProps) => void>
  > = new Map();

  constructor(private sendToRenderer: (channel: string, data: any) => void) {}

  connect(): void {
    this.ws = new WebSocket("wss://api.upbit.com/websocket/v1");

    this.ws.on("open", this.handleOpen);
    this.ws.on("message", this.handleMessage);
    this.ws.on("error", this.handleError);
    this.ws.on("close", this.handleClose);
  }

  private handleOpen = (): void => {
    console.log("Connected to UPBIT WEBSOCKET");
    this.sendSubscriptionMessage();
    this.clearReconnectInterval();
  };

  private handleMessage = (data: WebSocket.Data): void => {
    try {
      const parsedData: Utype.ITickerSimpleProps = JSON.parse(data.toString());
      const market = parsedData.cd;
      this.sendToRenderer(`marketData_${market}`, parsedData);

      const handlers = this.marketDataHandlers.get(market);
      if (handlers) {
        handlers.forEach((handler) => handler(parsedData));
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  };

  private handleError = (err: Error): void => {
    console.error("UPBIT WEBSOCKET ERROR:", err);
  };

  private handleClose = (): void => {
    console.log("Disconnected from UPBIT WEBSOCKET");
    this.attemptReconnect();
  };

  private clearReconnectInterval(): void {
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
  }

  private attemptReconnect(): void {
    if (!this.reconnectInterval) {
      this.reconnectInterval = setInterval(() => {
        console.log("Attempting to reconnect...");
        this.connect();
      }, 5000);
    }
  }

  subscribe(
    market: string,
    handler: (data: UWS.SimpleMarketData) => void,
  ): void {
    this.subscribedMarkets.add(market);
    if (!this.marketDataHandlers.has(market)) {
      this.marketDataHandlers.set(market, new Set());
    }
    this.marketDataHandlers.get(market)!.add(handler);
    this.sendSubscriptionMessage();
  }

  unsubscribe(
    market: string,
    handler: (data: UWS.SimpleMarketData) => void,
  ): void {
    const handlers = this.marketDataHandlers.get(market);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.marketDataHandlers.delete(market);
        this.subscribedMarkets.delete(market);
        this.sendSubscriptionMessage();
      }
    }
  }

  private sendSubscriptionMessage(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const subscribeMsg = JSON.stringify([
        { ticket: "UNIQUE_TICKET" },
        { type: "ticker", codes: Array.from(this.subscribedMarkets) },
        { format: "SIMPLE" },
      ]);
      this.ws.send(subscribeMsg);
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.clearReconnectInterval();
    this.subscribedMarkets.clear();
    this.marketDataHandlers.clear();
  }
}

export default UpbitWebSocketService;
