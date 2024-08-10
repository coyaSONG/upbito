import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Utype } from '@shared/types/quotation'

interface Props {
  market: string
  name: string
}

const RealTimeMarketData: React.FC<Props> = ({ market, name }) => {
  const [marketData, setMarketData] = useState<Utype.ITickerSimpleProps | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const handleMarketData = (data: Utype.ITickerSimpleProps) => {
      console.log(`Received market data for ${market}:`, data)
      setMarketData(data)
      setIsLoading(false)
    }

    if (typeof window !== 'undefined' && window.ipc) {
      unsubscribe = window.ipc.on(`marketData_${market}`, handleMarketData)
      window.ipc.send('subscribe-market', market)
    } else {
      setError('IPC is not available. Using fallback logic.')
      setIsLoading(false)
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
      if (window.ipc) {
        window.ipc.send('unsubscribe-market', market)
      }
    }
  }, [market])

  const safeFormatNumber = (value: number | undefined | null) => {
    return value != null ? value.toLocaleString() : 'N/A'
  }

  if (isLoading)
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent>Loading market data...</CardContent>
      </Card>
    )
  if (error)
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="text-destructive">Error: {error}</CardContent>
      </Card>
    )
  if (!marketData)
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent>No market data available</CardContent>
      </Card>
    )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex justify-between items-center gap-4">
          <span>{name || 'Unknown'}</span>
          <Badge
            variant={
              marketData.c === 'RISE'
                ? 'default'
                : marketData.c === 'FALL'
                ? 'destructive'
                : 'secondary'
            }
          >
            {marketData.c === 'RISE'
              ? '▲'
              : marketData.c === 'FALL'
              ? '▼'
              : '-'}{' '}
            {safeFormatNumber(marketData.cp)} (
            {((marketData.cr || 0) * 100).toFixed(2)}%)
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold mb-4">
          ₩{safeFormatNumber(marketData.tp)}
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            Today Volume:{' '}
            <span className="font-medium">
              {safeFormatNumber(marketData.atv)}
            </span>
          </div>
          <div>
            24h Volume:{' '}
            <span className="font-medium">
              {safeFormatNumber(marketData.atv24h)}
            </span>
          </div>
          <div>
            High:{' '}
            <span className="font-medium">
              ₩{safeFormatNumber(marketData.hp)}
            </span>
          </div>
          <div>
            Low:{' '}
            <span className="font-medium">
              ₩{safeFormatNumber(marketData.lp)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RealTimeMarketData
