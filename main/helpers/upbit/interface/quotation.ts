import { Utype } from "@shared/types/quotation";

export default interface QuotationInterface {
  /**
   * 마켓 코드 조회
   */
  getMarketAllInfo: () => Promise<Utype.IMarketAllInfoProps>;

  /******************************************************************************
   * 시세 캔들 조회
   ******************************************************************************/
  /**
   * 분 캔들 조회
   * @param minutes: "1" | "3" | "5" | "10" | "15" | "30" | "60" | "240";
   * @param marketCoin: string;
   * @param count: number;
   * @param to?: string;
   */
  getMinutesCandles: (
    param: Utype.ICandlesMinutesProps,
  ) => Promise<Utype.ICandleReturnProps[]>;

  /**
   * 일 캔들 조회
   */
  getDayCandles: (
    param: Utype.ICandlesDayProps,
  ) => Promise<Utype.ICandleDayReturnProps[]>;

  /**
   * 주 캔들 조회
   */
  getWeekCandles: (
    param: Utype.ICandlesWeekProps,
  ) => Promise<Utype.ICandleWeekReturnProps[]>;
  /**
   * 월 캔들 조회
   */
  getMonthCandles: (
    param: Utype.ICandlesMonthProps,
  ) => Promise<Utype.ICandlesMonthReturnProps[]>;
  /******************************************************************************
   * 시세 Ticker 조회
   ******************************************************************************/
  /**
   *  현재가 정보 조회
   * @desc 요청 당시 종목의 스냅샷을 반환한다.
   * @param marketCoinCode: string  => KRW-BTC  or   KRW-BTC,BTC-IOST
   * @return Promise<ITickerProps[]>
   */
  getTicker(param: string[]): Promise<Utype.ITickerProps[]>;

  /******************************************************************************
   * 시세 호가 정보(Orderbook) 조회
   ******************************************************************************/
  /**
   *  호가 정보 조회
   * @param marketCoinCode: string  => KRW-BTC  or   KRW-BTC,BTC-IOST
   * @return Promise<IOrderbookProps[]>
   */
  getOrderbook: (param: string[]) => Promise<Utype.IOrderbookProps[]>;
}
