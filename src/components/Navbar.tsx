/**
 * Navbar – top navigation bar for CCTV-X.
 * Updated Sprint 2: added nav links for Dashboard and Cameras.
 */

import React from 'react'
import { Shield, Wifi, LayoutDashboard, Camera } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface NavbarProps {
  backendOnline: boolean | null
}

const NAV_LINKS = [
  { to: '/',        label: 'Dashboard', icon: LayoutDashboard },
  { to: '/cameras', label: 'Cameras',   icon: Camera          },
]

export const Navbar: React.FC<NavbarProps> = ({ backendOnline }) => {
  const { pathname } = useLocation()

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(5, 8, 16, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(42, 157, 255, 0.12)',
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #0d7ef5, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(13,126,245,0.4)',
              flexShrink: 0,
            }}
          >
            <Shield size={18} color="white" />
          </div>
          <div>
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(90deg, #2a9dff, #22d3ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              CCTV-X
            </span>
            <span
              style={{
                display: 'block',
                fontSize: 10,
                color: '#64748b',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 500,
                lineHeight: 1,
              }}
            >
              AI Surveillance Platform
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
          {NAV_LINKS.map(({ to, label, icon: Icon }) => {
            const isActive = pathname === to
            return (
              <Link
                key={to}
                to={to}
                id={`nav-${label.toLowerCase()}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#60a5fa' : '#64748b',
                  background: isActive ? 'rgba(42,157,255,0.1)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(42,157,255,0.2)' : 'transparent'}`,
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8' }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = '#64748b' }}
              >
                <Icon size={14} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Status indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Wifi
            size={14}
            color={
              backendOnline === null ? '#64748b' :
              backendOnline ? '#34d399' : '#f87171'
            }
          />
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, whiteSpace: 'nowrap' }}>
            {backendOnline === null ? 'Connecting…' :
             backendOnline ? 'Backend Online' : 'Backend Offline'}
          </span>
          <div style={{ position: 'relative', width: 8, height: 8 }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background:
                  backendOnline === null ? '#64748b' :
                  backendOnline ? '#34d399' : '#f87171',
              }}
            />
            {backendOnline && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: '#34d399',
                  animation: 'ping-dot 2s cubic-bezier(0,0,0.2,1) infinite',
                }}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
