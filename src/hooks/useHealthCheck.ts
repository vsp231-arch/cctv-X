/**
 * useHealthCheck – React hook that polls the backend health endpoint.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { healthApi, type HealthResponse } from '@/api/client'

export type CheckStatus = 'idle' | 'loading' | 'success' | 'error'

export interface UseHealthCheckResult {
  data: HealthResponse | null
  status: CheckStatus
  error: string | null
  lastChecked: Date | null
  refetch: () => void
}

export function useHealthCheck(pollingIntervalMs = 30_000): UseHealthCheckResult {
  const [data, setData] = useState<HealthResponse | null>(null)
  const [status, setStatus] = useState<CheckStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetch = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const result = await healthApi.check()
      setData(result)
      setStatus('success')
      setLastChecked(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed')
      setStatus('error')
      setLastChecked(new Date())
    }
  }, [])

  useEffect(() => {
    fetch()
    timerRef.current = setInterval(fetch, pollingIntervalMs)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [fetch, pollingIntervalMs])

  return { data, status, error, lastChecked, refetch: fetch }
}
