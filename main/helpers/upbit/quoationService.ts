import { Utype } from "@shared/types/quotation";
import Constants from "./constant";
import QuotationInterface from "./interface/quotation";
import CustomAxios from "./customAxios";

export default class QuoationService
  extends CustomAxios
  implements QuotationInterface
{
  /**
   * constructor
   */
  constructor() {
    super();
  }

  /******************************************************************************
   * 시세 종목 조회
   ******************************************************************************/
  /**
   * 마켓 코드 조회 (access key 필요없음)
   */
  async getMarketAllInfo(): Promise<Utype.IMarketAllInfoProps> {
    try {
      const { data } = await super.getData<Utype.IMarketCoinProps[]>({
        method: "GET",
        url: Constants.MARKET_ALL_URL,
      });

      let returnObj: Utype.IMarketAllInfoProps = { KRW: [], BTC: [], USDT: [] };
      data.forEach((item) => {
        const marketPlace = item.market.split("-")[0];
        if (marketPlace === "KRW") {
          returnObj["KRW"].push(item);
        } else if (marketPlace === "BTC") {
          returnObj["BTC"].push(item);
        } else {
          returnObj["USDT"].push(item);
        }
      });
      return returnObj;
    } catch (err) {
      const {
        //@ts-ignore
        response: { data },
      } = err;
      throw data;
    }
  }

  /******************************************************************************
   * 시세 캔들 조회
   ******************************************************************************/
  /**
   * 분 캔들 조회 (access key 필요없음)
   */
  async getMinutesCandles({
    minutes,
    marketCoin,
    count,
    to,
  }: Utype.ICandlesMinutesProps): Promise<Utype.ICandleReturnProps[]> {
    try {
      const { data } = await super.getData<Utype.ICandleReturnProps[]>({
        method: "GET",
        url: `${
          Constants.CANDLES_MINUTES_URL
        }/${minutes}?market=${marketCoin}&count=${count}${
          to ? `&to=${to}` : ""
        }`,
      });

      return data.reverse();
    } catch (err) {
      const {
        //@ts-ignore
        response: { data },
      } = err;
      throw data;
    }
  }

  /**
   * 일 캔들 조회 (access key 필요없음)
   * @param marketCoin string: 마켓 코드 (ex. KRW-BTC)
   * @param count number: 캔들 개수
   * @param to string: 마지막 캔들 시각
   */
  async getDayCandles({
    marketCoin,
    count,
    to,
  }: Utype.ICandlesDayProps): Promise<Utype.ICandleDayReturnProps[]> {
    try {
      const { data } = await super.getData<Utype.ICandleDayReturnProps[]>({
        method: "GET",
        url: `${
          Constants.CANDLES_DAY_URL
        }/?market=${marketCoin}&count=${count}${to ? `&to=${to}` : ""}`,
      });

      return data.reverse();
    } catch (err) {
      const {
        //@ts-ignore
        response: { data },
      } = err;
      throw data;
    }
  }

  /**
   * 주 캔들 조회 (access key 필요없음)
   */
  async getWeekCandles({
    marketCoin,
    count,
    to,
  }: Utype.ICandlesWeekProps): Promise<Utype.ICandleWeekReturnProps[]> {
    try {
      const { data } = await super.getData<Utype.ICandleWeekReturnProps[]>({
        method: "GET",
        url: `${
          Constants.CANDLES_WEEK_URL
        }/?market=${marketCoin}&count=${count}${to ? `&to=${to}` : ""}`,
      });

      return data.reverse();
    } catch (err) {
      const {
        //@ts-ignore
        response: { data },
      } = err;
      throw data;
    }
  }
  /**
   * 월 캔들 조회 (access key 필요없음)
   */
  async getMonthCandles({
    marketCoin,
    count,
    to,
  }: Utype.ICandlesMonthProps): Promise<Utype.ICandlesMonthReturnProps[]> {
    try {
      const { data } = await super.getData<Utype.ICandlesMonthReturnProps[]>({
        method: "GET",
        url: `${
          Constants.CANDLES_MONTH_URL
        }/?market=${marketCoin}&count=${count}${to ? `&to=${to}` : ""}`,
      });

      return data.reverse();
    } catch (err) {
      const {
        //@ts-ignore
        response: { data },
      } = err;
      throw data;
    }
  }
  /******************************************************************************
   * 시세 Ticker 조회
   ******************************************************************************/
  /**
   *  현재가 정보 조회 (access key 필요없음)
   * @desc 요청 당시 종목의 스냅샷을 반환한다.
   * @param marketCoinCode: string[]  => KRW-BTC  or   KRW-BTC,BTC-IOST
   * @return Promise<ITickerProps[]>
   */
  async getTicker(marketCoinCode: string[]): Promise<Utype.ITickerProps[]> {
    try {
      const { data } = await super.getData<Utype.ITickerProps[]>({
        method: "GET",
        url: `${Constants.TICKER_URL}?markets=${marketCoinCode.join(",")}`,
      });

      return data;
    } catch (err) {
      const {
        //@ts-ignore
        response: { data },
      } = err;
      throw data;
    }
  }

  /******************************************************************************
   * 시세 호가 정보(Orderbook) 조회
   ******************************************************************************/
  /**
   *  호가 정보 조회 (access key 필요없음)
   * @param marketCoinCode: string  => KRW-BTC  or   KRW-BTC,BTC-IOST
   * @return Promise<IOrderbookProps[]>
   */
  async getOrderbook(marketCoinCode: string[]) {
    try {
      const { data } = await super.getData<Utype.IOrderbookProps[]>({
        method: "GET",
        url: `${Constants.ORDER_BOOK_URL}?markets=${marketCoinCode.join(",")}`,
      });

      return data;
    } catch (err) {
      const {
        //@ts-ignore
        response: { data },
      } = err;
      throw data;
    }
  }
}
