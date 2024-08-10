'use client'
import React, { useState, useEffect } from 'react'
import RealTimeMarketData from '@/components/realtime-market-data'
import { Utype } from '@shared/types/quotation'

interface MarketInfo {
  market: string
  korean_name: string
  acc_trade_price_24h: number
}

export const TrendList: React.FC = () => {
  const [marketList, setMarketList] = useState<MarketInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const TOP_N_COINS = 4

  useEffect(() => {
    const fetchTopTradePriceTickers = () => {
      window.ipc.send('getTopTradePriceTickers', TOP_N_COINS)
    }

    const handleTopTradePriceTickers = (response: any) => {
      console.log('test', response)
      if (!response.success) {
        setError(response.error)
        setIsLoading(false)
        return
      }

      const topTickers = response.data as (Utype.ITickerProps & {
        korean_name: string
      })[]
      const marketsWithTradePrice: MarketInfo[] = topTickers.map((ticker) => ({
        market: ticker.market,
        korean_name: ticker.korean_name,
        acc_trade_price_24h: ticker.acc_trade_price_24h,
      }))

      setMarketList(marketsWithTradePrice)
      setIsLoading(false)
    }

    const unsubscribe = window.ipc.on(
      'getTopTradePriceTickersReply',
      handleTopTradePriceTickers
    )

    fetchTopTradePriceTickers()

    return () => {
      unsubscribe()
    }
  }, [])

  if (isLoading) return <div>Loading market data...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {marketList.map((market) => (
          <RealTimeMarketData
            key={market.market}
            market={market.market}
            name={market.korean_name}
          />
        ))}
      </div>
    </>
  )
}
