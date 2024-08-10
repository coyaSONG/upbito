import { Method } from "axios";

declare namespace Utype {
  interface IMarketCoinProps {
    market: string;
    korean_name: string;
    english_name: string;
  }

  interface IMarketAllInfoProps {
    KRW: IMarketCoinProps[];
    BTC: IMarketCoinProps[];
    USDT: IMarketCoinProps[];
  }

  interface IMarketCoinProps {
    market: string;
    korean_name: string;
    english_name: string;
  }

  interface ICandlesMinutesProps {
    minutes: "1" | "3" | "5" | "10" | "15" | "30" | "60" | "240";
    marketCoin: string;
    count: number;
    to?: string;
  }

  interface ICandleReturnProps {
    market: string;
    candle_date_time_utc: string;
    candle_date_time_kst: string;
    opening_price: number;
    high_price: number;
    low_price: number;
    trade_price: number;
    timestamp: number;
    candle_acc_trade_price: number;
    candle_acc_trade_volume: number;
    unit: number;
  }

  interface ICandlesDayProps {
    marketCoin: string;
    count: number;
    to?: string;
    convertingPriceUnit?: string;
  }

  interface ICandleDayReturnProps {
    market: string;
    candle_date_time_utc: string;
    candle_date_time_kst: string;
    opening_price: number;
    high_price: number;
    low_price: number;
    trade_price: number;
    timestamp: number;
    candle_acc_trade_price: number;
    candle_acc_trade_volume: number;
    prev_closing_price: number;
    change_price: number;
    change_rate: number;
  }

  export interface ICandlesWeekProps {
    marketCoin: string;
    count: number;
    to?: string;
  }
  export interface ICandleWeekReturnProps {
    market: string; // 마켓명 String
    candle_date_time_utc: string; // 캔들 기준 시각(UTC 기준)
    candle_date_time_kst: string; // 캔들 기준 시각(KST 기준)
    opening_price: number; // 시가 Double
    high_price: number; // 고가 Double
    low_price: number; // 저가 Double
    trade_price: number; // 종가 Double
    timestamp: number; // 마지막 틱이 저장된 시각 Long
    candle_acc_trade_price: number; // 누적 거래 금액 Double
    candle_acc_trade_volume: number; // 누적 거래량 Double
    first_day_of_period: string; // 캔들 기간의 가장 첫 날 String
  }
  export interface ICandlesMonthProps {
    marketCoin: string;
    count: number;
    to?: string;
  }
  export interface ICandlesMonthReturnProps {
    market: string; // 마켓명	String
    candle_date_time_utc: string; // 캔들 기준 시각(UTC 기준)
    candle_date_time_kst: string; // 캔들 기준 시각(KST 기준)
    opening_price: number; // 시가 Double
    high_price: snumbertring; // 고가 Double
    low_price: number; // 저가 Double
    trade_price: number; // 종가 Double
    timestamp: number; // 마지막 틱이 저장된 시각 Long
    candle_acc_trade_price: number; // 누적 거래 금액 Double
    candle_acc_trade_volume: number; // 누적 거래량 Double
    first_day_of_period: string; // 캔들 기간의 가장 첫 날 String
  }

  interface ITickerSimpleProps {
    ty: "ticker"; // 타입
    cd: string; // 마켓 코드 (예: KRW-BTC)
    op: number; // 시가 (opening price)
    hp: number; // 고가 (high price)
    lp: number; // 저가 (low price)
    tp: number; // 현재가 (trade price)
    pcp: number; // 전일 종가 (prev closing price)
    c: "RISE" | "EVEN" | "FALL"; // 전일 대비
    cp: number; // 부호 없는 전일 대비 값
    scp: number; // 전일 대비 값 (부호 있음)
    cr: number; // 부호 없는 전일 대비 등락율
    scr: number; // 전일 대비 등락율 (부호 있음)
    tv: number; // 가장 최근 거래량
    atv: number; // 누적 거래량 (UTC 0시 기준)
    atv24h: number; // 24시간 누적 거래량
    atp: number; // 누적 거래대금 (UTC 0시 기준)
    atp24h: number; // 24시간 누적 거래대금
    tdt: string; // 최근 거래 일자 (UTC) (형식: yyyyMMdd)
    ttm: string; // 최근 거래 시각 (UTC) (형식: HHmmss)
    ttms: number; // 체결 타임스탬프 (milliseconds)
    ab: "ASK" | "BID"; // 매수/매도 구분
    aav: number; // 누적 매도량
    abv: number; // 누적 매수량
    h52wp: number; // 52주 최고가
    h52wdt: string; // 52주 최고가 달성일 (형식: yyyy-MM-dd)
    l52wp: number; // 52주 최저가
    l52wdt: string; // 52주 최저가 달성일 (형식: yyyy-MM-dd)
    ms: "PREVIEW" | "ACTIVE" | "DELISTED"; // 거래상태
    its: boolean; // 거래 정지 여부
    dd: string; // 상장폐지일 (Date 형식)
    mw: "NONE" | "CAUTION"; // 유의 종목 여부
    tms: number; // 타임스탬프 (millisecond)
    st: "SNAPSHOT" | "REALTIME"; // 스트림 타입
  }

  interface ITickerProps {
    market: string;
    trade_date: string;
    trade_time: string;
    trade_date_kst: string;
    trade_time_kst: string;
    trade_timestamp: number;
    opening_price: number;
    high_price: number;
    low_price: number;
    trade_price: number;
    prev_closing_price: number;
    change: string;
    change_price: number;
    change_rate: number;
    signed_change_price: number;
    signed_change_rate: number;
    trade_volume: number;
    acc_trade_price: number;
    acc_trade_price_24h: number;
    acc_trade_volume: number;
    acc_trade_volume_24h: number;
    highest_52_week_price: number;
    highest_52_week_date: string;
    lowest_52_week_price: number;
    lowest_52_week_date: string;
    timestamp: number;
  }

  export interface IOrderbookProps {
    market: string;
    timestamp: number;
    total_ask_size: number;
    total_bid_size: number;
    orderbook_units: IOrderbook_unitsProps[];
  }

  export interface IAxiosProps {
    method: Method;
    url: string;
    params?: {};
  }

  export interface IOhlcavProps {
    market: string;
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    accPrice: number;
    volume: number;
  }
  export interface IOhlcavOption {
    maAvg?: number; // ma이평선값
    bollingerHigh?: number; // 볼린저밴드 high
    bollingerLow?: number; // 볼린저밴드 low
    rsi?: number; // rsi지표
    rs?: number;
    rsiU?: number;
    rsiD?: number;
    rsiAU?: number;
    rsiDU?: number;
  }

  export type IOhlcavExtend = IOhlcavProps & IOhlcavOption;
  export type TMinutes = "1" | "3" | "5" | "10" | "15" | "30" | "60" | "240";
  export type TCandle = TMinutes | "day";
}
