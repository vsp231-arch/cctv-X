/**
 * StatusBadge – shows a coloured pill for a service status value.
 */

import React from 'react'
import { CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react'

interface StatusBadgeProps {
  status: 'ok' | 'healthy' | 'degraded' | 'error' | 'loading' | string
  label?: string
  size?: 'sm' | 'md'
}

const CONFIG = {
  ok:       { icon: CheckCircle,    color: '#34d399', bg: 'rgba(16,185,129,0.12)', label: 'OK' },
  healthy:  { icon: CheckCircle,    color: '#34d399', bg: 'rgba(16,185,129,0.12)', label: 'Healthy' },
  degraded: { icon: AlertTriangle,  color: '#fbbf24', bg: 'rgba(245,158,11,0.12)', label: 'Degraded' },
  error:    { icon: XCircle,        color: '#f87171', bg: 'rgba(239,68,68,0.12)',  label: 'Error' },
  loading:  { icon: Loader2,        color: '#2a9dff', bg: 'rgba(42,157,255,0.12)', label: 'Checking…' },
} as const

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'md' }) => {
  const cfg = CONFIG[status as keyof typeof CONFIG] ?? CONFIG.degraded
  const Icon = cfg.icon
  const isLoading = status === 'loading'
  const px = size === 'sm' ? '8px 10px' : '6px 14px'
  const fs = size === 'sm' ? '11px' : '12px'
  const iconSize = size === 'sm' ? 12 : 14

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: cfg.bg,
        border: `1px solid ${cfg.color}33`,
        borderRadius: 999,
        padding: px,
        fontSize: fs,
        fontWeight: 600,
        color: cfg.color,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}
    >
      <Icon
        size={iconSize}
        style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }}
      />
      {label ?? cfg.label}
    </span>
  )
}
