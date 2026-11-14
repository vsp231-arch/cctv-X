import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  Bell,
  Shield,
  Maximize2,
  Minimize2,
} from 'lucide-react'

interface TopHeaderProps {
  backendOnline?: boolean | null
  activeAlerts?: number
}

const PAGE_TITLES: Record<string, string> = {
  '/': 'LIVE MONITORING',
  '/dashboard': 'DASHBOARD OVERVIEW',
  '/cameras': 'CAMERAS',
  '/events': 'EVENTS & EVIDENCE',
  '/alerts': 'ACTIVE ALERTS',
  '/evidence': 'DIGITAL FORENSIC EVIDENCE',
  '/reports': 'ANALYTICS & REPORTS',
  '/settings': 'SYSTEM SETTINGS',
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  backendOnline = true,
  activeAlerts = 3,
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [timeStr, setTimeStr] = useState<string>('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showNotificationToast, setShowNotificationToast] = useState(false)

  // Real-time ticking clock formatted identically to the design (e.g. 26 Apr 2025 14:32:18)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      // format: DD MMM YYYY  HH:mm:ss
      const day = now.getDate().toString().padStart(2, '0')
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const month = months[now.getMonth()]
      const year = now.getFullYear()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      const seconds = now.getSeconds().toString().padStart(2, '0')
      setTimeStr(`${day} ${month} ${year}  ${hours}:${minutes}:${seconds}`)
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const currentTitle = PAGE_TITLES[location.pathname] || 'CCTV-X SURVEILLANCE'

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }

  return (
    <header
      className="sticky top-0 z-30 h-16 px-6 flex items-center justify-between"
      style={{
        background: 'linear-gradient(180deg, rgba(6, 12, 28, 0.94) 0%, rgba(4, 8, 20, 0.88) 100%)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0, 180, 255, 0.16)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* ── Left Breadcrumb & Status ──────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-200 transition-colors group cursor-pointer"
          title="Go back"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-cyan-950/40 border border-cyan-500/30 group-hover:border-cyan-400 group-hover:bg-cyan-900/40 transition-all">
            <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span
            className="text-base font-extrabold tracking-wider text-slate-100 flex items-center gap-1.5"
            style={{
              letterSpacing: '0.08em',
              textShadow: '0 0 12px rgba(0, 240, 255, 0.3)',
            }}
          >
            {currentTitle}
          </span>
        </button>

        {/* System Online Status Pill */}
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            boxShadow: '0 0 12px rgba(16, 185, 129, 0.2)',
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: '#10b981',
              boxShadow: '0 0 8px #10b981',
              animation: 'ping-dot 2s infinite',
            }}
          />
          <span className="tracking-wide">
            {backendOnline === false ? 'System Offline (Mock)' : 'System Online'}
          </span>
        </div>
      </div>

      {/* ── Right Date & Controls ─────────────────────────────────────────── */}
      <div className="flex items-center gap-5">
        {/* Real-time Clock */}
        <div
          className="font-mono-numbers text-sm font-semibold tracking-wider px-3.5 py-1.5 rounded-lg text-slate-300"
          style={{
            background: 'rgba(14, 25, 54, 0.7)',
            border: '1px solid rgba(0, 180, 255, 0.2)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            letterSpacing: '0.08em',
          }}
        >
          {timeStr || '26 Apr 2025  14:32:18'}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Notifications Bell */}
          <button
            onClick={() => {
              setShowNotificationToast(true)
              setTimeout(() => setShowNotificationToast(false), 3000)
            }}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
            style={{
              background: 'rgba(14, 25, 54, 0.8)',
              border: '1px solid rgba(0, 180, 255, 0.25)',
            }}
            title="Notifications"
          >
            <Bell size={17} />
            {activeAlerts > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                style={{
                  background: '#ef4444',
                  boxShadow: '0 0 8px #ef4444',
                }}
              >
                {activeAlerts}
              </span>
            )}
          </button>

          {/* Security Shield */}
          <button
            onClick={() => navigate('/evidence')}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-cyan-400 hover:text-white transition-all cursor-pointer"
            style={{
              background: 'rgba(14, 25, 54, 0.8)',
              border: '1px solid rgba(0, 180, 255, 0.25)',
            }}
            title="Forensic Integrity"
          >
            <Shield size={17} />
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
            style={{
              background: 'rgba(14, 25, 54, 0.8)',
              border: '1px solid rgba(0, 180, 255, 0.25)',
            }}
            title="Toggle Fullscreen HUD"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Popover Notification toast */}
      {showNotificationToast && (
        <div
          className="fixed top-20 right-8 z-50 p-4 rounded-xl cyber-panel-glow animate-fade-up max-w-sm"
          style={{
            border: '1px solid rgba(239, 68, 68, 0.5)',
            boxShadow: '0 0 25px rgba(239, 68, 68, 0.35)',
          }}
        >
          <div className="flex items-start gap-3">
            <span className="p-2 rounded-lg bg-red-500/20 text-red-400">
              <Bell size={18} />
            </span>
            <div>
              <div className="text-sm font-bold text-white">Active Alert Triggered</div>
              <div className="text-xs text-slate-300 mt-1">
                Restricted Zone Intrusion detected at Main Gate (CAM-001).
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
