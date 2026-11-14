import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Eye,
  Camera,
  Activity,
  Bell,
  FileCheck,
  BarChart3,
  Settings,
  ChevronRight,
  Crosshair,
} from 'lucide-react'

interface SidebarProps {
  activeAlertsCount?: number
}

interface NavItem {
  to: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
  badge?: number
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/', label: 'Live Monitoring', icon: Eye },
  { to: '/cameras', label: 'Cameras', icon: Camera },
  { to: '/events', label: 'Events', icon: Activity },
  { to: '/alerts', label: 'Alerts', icon: Bell, badge: 3 },
  { to: '/evidence', label: 'Evidence', icon: FileCheck },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export const Sidebar: React.FC<SidebarProps> = ({ activeAlertsCount = 3 }) => {
  const navigate = useNavigate()

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-64 z-40 flex flex-col justify-between"
      style={{
        background: 'linear-gradient(180deg, #050a18 0%, #03060f 100%)',
        borderRight: '1px solid rgba(0, 180, 255, 0.16)',
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* ── Brand Header ─────────────────────────────────────────────────── */}
      <div className="pt-6 px-5 pb-5">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* Futuristic Hex/Shield Logo */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #0d7ef5 0%, #00f0ff 100%)',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.4)',
            }}
          >
            <Crosshair size={22} className="text-white animate-spin-slow" />
            <div
              className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ mixBlendMode: 'overlay' }}
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span
                className="text-xl font-black tracking-wider"
                style={{
                  background: 'linear-gradient(90deg, #ffffff 0%, #38bdf8 50%, #00f0ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.4))',
                }}
              >
                CCTV-X
              </span>
            </div>
            <div
              className="text-[9px] font-bold tracking-[0.24em] uppercase"
              style={{
                color: '#38bdf8',
                textShadow: '0 0 8px rgba(56, 189, 248, 0.6)',
              }}
            >
              SEE • DETECT • PROTECT
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation Links ─────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const badgeCount = item.label === 'Alerts' ? activeAlertsCount : item.badge

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 select-none ${
                  isActive
                    ? 'text-white shadow-lg'
                    : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/40'
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background:
                        'linear-gradient(90deg, rgba(13, 126, 245, 0.9) 0%, rgba(6, 182, 212, 0.7) 100%)',
                      boxShadow: '0 0 20px rgba(13, 126, 245, 0.45)',
                      border: '1px solid rgba(0, 240, 255, 0.4)',
                    }
                  : {
                      border: '1px solid transparent',
                    }
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400'
                      }
                      style={
                        isActive
                          ? { filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.6))' }
                          : undefined
                      }
                    />
                    <span className={isActive ? 'font-semibold tracking-wide' : 'tracking-normal'}>
                      {item.label}
                    </span>
                  </div>

                  {badgeCount !== undefined && badgeCount > 0 && (
                    <span
                      className="px-2 py-0.5 text-xs font-bold rounded-full text-white"
                      style={{
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        boxShadow: '0 0 10px rgba(239, 68, 68, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                      }}
                    >
                      {badgeCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* ── User Profile Widget ──────────────────────────────────────────── */}
      <div className="p-3">
        <div
          onClick={() => navigate('/settings')}
          className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-200 group"
          style={{
            background: 'rgba(12, 22, 46, 0.7)',
            border: '1px solid rgba(0, 180, 255, 0.22)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.5)'
            e.currentTarget.style.boxShadow = '0 0 18px rgba(0, 240, 255, 0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 180, 255, 0.22)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/images/avatar_vsp.jpg"
                alt="VSP Avatar"
                className="w-10 h-10 rounded-full object-cover border border-cyan-400"
                style={{
                  boxShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
                }}
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.style.display = 'none'
                }}
              />
              <div
                className="w-2.5 h-2.5 rounded-full absolute -bottom-0.5 -right-0.5 border border-slate-900"
                style={{
                  background: '#10b981',
                  boxShadow: '0 0 8px #10b981',
                }}
              />
            </div>

            <div className="text-left">
              <div className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                VSP
              </div>
              <div className="text-[11px] text-slate-400 font-medium tracking-wider">
                Administrator
              </div>
            </div>
          </div>

          <ChevronRight
            size={16}
            className="text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all"
          />
        </div>
      </div>
    </aside>
  )
}
