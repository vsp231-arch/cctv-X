import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Camera,
  AlertTriangle,
  Users,
  Car,
  ChevronRight,
  Maximize2,
  Flame,
  Zap,
  Clock,
  Info,
  Eye,
  EyeOff,
} from 'lucide-react'
import { ForensicModal, type ForensicEvidenceData } from '@/components/ForensicModal'

// Circular Gauge Helper
const RadialGauge: React.FC<{
  percentage: number
  label: string
  color: string
  glowColor: string
}> = ({ percentage, label, color, glowColor }) => {
  const radius = 28
  const strokeWidth = 5
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 70 70">
          {/* Background circle track */}
          <circle
            cx="35"
            cy="35"
            r={radius}
            fill="transparent"
            stroke="rgba(15, 30, 65, 0.8)"
            strokeWidth={strokeWidth}
          />
          {/* Active progress arc */}
          <circle
            cx="35"
            cy="35"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${glowColor})`,
              transition: 'stroke-dashoffset 1s ease-in-out',
            }}
          />
        </svg>
        <span className="absolute font-mono-numbers text-sm font-extrabold text-white">
          {percentage}%
        </span>
      </div>
      <span className="text-[11px] font-bold tracking-wider text-slate-400 mt-1 uppercase">
        {label}
      </span>
    </div>
  )
}

export const LiveMonitoring: React.FC = () => {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState('14:32:18')
  const [selectedEvidence, setSelectedEvidence] = useState<ForensicEvidenceData | null>(null)
  const [showAiOverlays, setShowAiOverlays] = useState(true)
  const [focusedCamera, setFocusedCamera] = useState<string | null>(null)

  // Live time ticker
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const hh = now.getHours().toString().padStart(2, '0')
      const mm = now.getMinutes().toString().padStart(2, '0')
      const ss = now.getSeconds().toString().padStart(2, '0')
      setCurrentTime(`${hh}:${mm}:${ss}`)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Sample forensic items linked to the recent events list
  const sampleEvents: {
    id: string
    title: string
    camera: string
    time: string
    severity: 'High' | 'Medium' | 'Low' | 'Info'
    icon: React.ReactNode
    evidence: ForensicEvidenceData
  }[] = [
    {
      id: 'EVT-20250426-001',
      title: 'Restricted Zone Intrusion',
      camera: 'Main Gate',
      time: '14:32:12',
      severity: 'High',
      icon: <Flame size={14} className="text-red-400" />,
      evidence: {
        id: 'EVT-20250426-001',
        title: 'Restricted Zone Intrusion',
        camera: 'Main Gate',
        timestamp: '14:32:12',
        date: '26 Apr 2025',
        fileName: 'evidence_001.mp4',
        fileSize: '12.4 MB',
        duration: '00:00:10',
        resolution: '1920 × 1080',
        fps: 25,
        cameraId: 'CAM-001',
        sha256: 'a3f5e2d9c36b0000de06e0018301ec9f4b9a8264901ba32c38df1094ba4b9f4b',
        status: 'Verified',
        imageUrl: '/images/main_gate.jpg',
        hasBoundingBox: true,
      },
    },
    {
      id: 'EVT-20250426-002',
      title: 'Line Crossing',
      camera: 'Parking Lot',
      time: '14:28:45',
      severity: 'Medium',
      icon: <Zap size={14} className="text-amber-400" />,
      evidence: {
        id: 'EVT-20250426-002',
        title: 'Line Crossing',
        camera: 'Parking Lot',
        timestamp: '14:28:45',
        date: '26 Apr 2025',
        fileName: 'evidence_002.mp4',
        fileSize: '9.8 MB',
        duration: '00:00:08',
        resolution: '1920 × 1080',
        fps: 25,
        cameraId: 'CAM-002',
        sha256: '7b82cd59114ac3992b490a07e15d8615438be558c44bb4f5904948a31945f7c1',
        status: 'Verified',
        imageUrl: '/images/parking_lot.jpg',
      },
    },
    {
      id: 'EVT-20250426-003',
      title: 'Loitering',
      camera: 'Building Entrance',
      time: '14:25:30',
      severity: 'Low',
      icon: <Clock size={14} className="text-emerald-400" />,
      evidence: {
        id: 'EVT-20250426-003',
        title: 'Loitering',
        camera: 'Building Entrance',
        timestamp: '14:25:30',
        date: '26 Apr 2025',
        fileName: 'evidence_003.mp4',
        fileSize: '15.1 MB',
        duration: '00:00:15',
        resolution: '1920 × 1080',
        fps: 25,
        cameraId: 'CAM-003',
        sha256: 'd92a4726e63c0a4b7c3d2f9e4a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
        status: 'Verified',
        imageUrl: '/images/building_entrance.jpg',
      },
    },
    {
      id: 'EVT-20250426-004',
      title: 'Person Detected',
      camera: 'Main Gate',
      time: '14:20:14',
      severity: 'Info',
      icon: <Info size={14} className="text-cyan-400" />,
      evidence: {
        id: 'EVT-20250426-004',
        title: 'Person Detected',
        camera: 'Main Gate',
        timestamp: '14:20:14',
        date: '26 Apr 2025',
        fileName: 'evidence_004.mp4',
        fileSize: '8.3 MB',
        duration: '00:00:06',
        resolution: '1920 × 1080',
        fps: 25,
        cameraId: 'CAM-001',
        sha256: 'f4b1c2d3e4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
        status: 'Verified',
        imageUrl: '/images/main_gate.jpg',
      },
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* ── Top 4 KPI Stat Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Connected Cameras */}
        <div
          className="cyber-panel p-4 flex items-center gap-4 relative overflow-hidden"
          style={{
            border: '1px solid rgba(0, 180, 255, 0.22)',
          }}
        >
          {/* Blue Circular Icon Container */}
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: 'rgba(13, 126, 245, 0.18)',
              border: '2px solid #0d7ef5',
              boxShadow: '0 0 16px rgba(13, 126, 245, 0.45)',
            }}
          >
            <Camera size={26} className="text-cyan-400" />
          </div>

          <div className="flex-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              CONNECTED CAMERAS
            </div>
            <div className="text-2xl font-black text-white font-mono-numbers tracking-tight mt-0.5">
              4 / 5
            </div>
            {/* Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-800/80 mt-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                style={{ width: '80%', boxShadow: '0 0 8px #00f0ff' }}
              />
            </div>
          </div>
        </div>

        {/* 2. Active Alerts */}
        <div
          className="cyber-panel p-4 flex items-center gap-4 relative overflow-hidden cursor-pointer"
          style={{
            border: '1px solid rgba(239, 68, 68, 0.35)',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.1)',
          }}
          onClick={() => navigate('/alerts')}
        >
          {/* Red Rounded Square Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: 'rgba(239, 68, 68, 0.18)',
              border: '2px solid #ef4444',
              boxShadow: '0 0 18px rgba(239, 68, 68, 0.5)',
            }}
          >
            <AlertTriangle size={28} className="text-red-400" />
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              ACTIVE ALERTS
            </div>
            <div className="text-2xl font-black text-white font-mono-numbers tracking-tight mt-0.5">
              3
            </div>
            <div className="text-[11px] font-semibold text-red-400 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
              1 High Severity
            </div>
          </div>
        </div>

        {/* 3. Detected People */}
        <div
          className="cyber-panel p-4 flex items-center gap-4 relative overflow-hidden"
          style={{
            border: '1px solid rgba(6, 182, 212, 0.28)',
          }}
        >
          {/* Cyan Circular Icon */}
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: 'rgba(6, 182, 212, 0.18)',
              border: '2px solid #06b6d4',
              boxShadow: '0 0 16px rgba(6, 182, 212, 0.45)',
            }}
          >
            <Users size={26} className="text-cyan-300" />
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              DETECTED PEOPLE
            </div>
            <div className="text-2xl font-black text-white font-mono-numbers tracking-tight mt-0.5">
              12
            </div>
            <div className="text-[11px] font-medium text-cyan-400 mt-1">
              Active across 3 zones
            </div>
          </div>
        </div>

        {/* 4. Detected Vehicles */}
        <div
          className="cyber-panel p-4 flex items-center gap-4 relative overflow-hidden"
          style={{
            border: '1px solid rgba(168, 85, 247, 0.28)',
          }}
        >
          {/* Purple Circular Icon */}
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: 'rgba(168, 85, 247, 0.18)',
              border: '2px solid #a855f7',
              boxShadow: '0 0 16px rgba(168, 85, 247, 0.45)',
            }}
          >
            <Car size={26} className="text-purple-300" />
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              DETECTED VEHICLES
            </div>
            <div className="text-2xl font-black text-white font-mono-numbers tracking-tight mt-0.5">
              4
            </div>
            <div className="text-[11px] font-medium text-purple-400 mt-1">
              Gate & Parking lots
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Layout: 2x2 Feeds Grid (Left) + Side Panels (Right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ── Center Feeds 2x2 Grid ────────────────────── */}
        <div className="lg:col-span-8 2xl:col-span-9 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ── CAMERA 1: Main Gate ─────────────────────────────────────── */}
            <div
              className={`cyber-panel overflow-hidden transition-all duration-300 ${
                focusedCamera === 'main-gate' ? 'ring-2 ring-cyan-400' : ''
              }`}
              style={{
                border: '1px solid rgba(0, 180, 255, 0.24)',
              }}
            >
              {/* Header Bar inside camera card */}
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950/70 border-b border-cyan-500/15">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-wide">
                    Main Gate
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/70 border border-emerald-500/40 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                    RTSP
                  </span>
                  <button
                    onClick={() => setShowAiOverlays(!showAiOverlays)}
                    className="text-slate-400 hover:text-cyan-300 cursor-pointer"
                    title={showAiOverlays ? 'Hide AI bounding boxes' : 'Show AI bounding boxes'}
                  >
                    {showAiOverlays ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                  <button
                    onClick={() =>
                      setFocusedCamera(focusedCamera === 'main-gate' ? null : 'main-gate')
                    }
                    className="text-slate-400 hover:text-cyan-300 cursor-pointer"
                  >
                    <Maximize2 size={13} />
                  </button>
                </div>
              </div>

              {/* Feed Display */}
              <div className="relative aspect-video bg-black overflow-hidden select-none">
                <img
                  src="/images/main_gate.jpg"
                  alt="Main Gate Feed"
                  className="w-full h-full object-cover"
                />

                {showAiOverlays && (
                  <>
                    {/* Red Restricted Zone Polygon Overlay */}
                    <div
                      className="absolute"
                      style={{
                        top: '40%',
                        left: '20%',
                        width: '55%',
                        height: '42%',
                        background:
                          'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.45) 0%, rgba(220, 38, 38, 0.2) 70%)',
                        border: '2px dashed #ef4444',
                        clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                        boxShadow: '0 0 25px rgba(239, 68, 68, 0.5)',
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="px-2.5 py-1 rounded bg-red-600/90 text-white text-[11px] font-bold shadow-lg flex items-center gap-1 border border-white/30 backdrop-blur-sm">
                          ⚠️ Restricted Zone
                        </span>
                      </div>
                    </div>

                    {/* Bounding Box 1: person 0.92 */}
                    <div
                      className="absolute border border-cyan-400 bg-cyan-400/10 rounded-sm"
                      style={{
                        top: '48%',
                        left: '28%',
                        width: '12%',
                        height: '36%',
                        boxShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
                      }}
                    >
                      <span className="absolute -top-4 left-0 px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-500 text-slate-950">
                        person 0.92
                      </span>
                    </div>

                    {/* Bounding Box 2: car 0.82 */}
                    <div
                      className="absolute border border-blue-500 bg-blue-500/10 rounded-sm"
                      style={{
                        top: '44%',
                        left: '52%',
                        width: '26%',
                        height: '32%',
                        boxShadow: '0 0 12px rgba(13, 126, 245, 0.5)',
                      }}
                    >
                      <span className="absolute -top-4 left-0 px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-blue-600 text-white">
                        car 0.82
                      </span>
                    </div>

                    {/* Bounding Box 3: person 0.86 */}
                    <div
                      className="absolute border border-cyan-400 bg-cyan-400/10 rounded-sm"
                      style={{
                        top: '52%',
                        left: '72%',
                        width: '11%',
                        height: '34%',
                        boxShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
                      }}
                    >
                      <span className="absolute -top-4 left-0 px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-500 text-slate-950">
                        person 0.86
                      </span>
                    </div>
                  </>
                )}

                {/* Bottom HUD Bar */}
                <div className="absolute bottom-0 inset-x-0 px-3 py-1 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between font-mono text-[11px] text-cyan-200">
                  <span className="tracking-wider">{currentTime}</span>
                  <span className="font-semibold text-emerald-400">FPS: 24</span>
                </div>
              </div>
            </div>

            {/* ── CAMERA 2: Parking Lot ───────────────────────────────────── */}
            <div
              className={`cyber-panel overflow-hidden transition-all duration-300 ${
                focusedCamera === 'parking-lot' ? 'ring-2 ring-cyan-400' : ''
              }`}
              style={{
                border: '1px solid rgba(0, 180, 255, 0.24)',
              }}
            >
              {/* Header Bar inside camera card */}
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950/70 border-b border-cyan-500/15">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-wide">
                    Parking Lot
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/70 border border-emerald-500/40 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                    RTSP
                  </span>
                  <button
                    onClick={() =>
                      setFocusedCamera(focusedCamera === 'parking-lot' ? null : 'parking-lot')
                    }
                    className="text-slate-400 hover:text-cyan-300 cursor-pointer"
                  >
                    <Maximize2 size={13} />
                  </button>
                </div>
              </div>

              {/* Feed Display */}
              <div className="relative aspect-video bg-black overflow-hidden select-none">
                <img
                  src="/images/parking_lot.jpg"
                  alt="Parking Lot Feed"
                  className="w-full h-full object-cover"
                />

                {showAiOverlays && (
                  <>
                    {/* Bounding Box 1: car 0.91 */}
                    <div
                      className="absolute border border-cyan-400 bg-cyan-400/10 rounded-sm"
                      style={{
                        top: '42%',
                        left: '52%',
                        width: '18%',
                        height: '24%',
                        boxShadow: '0 0 10px rgba(0, 240, 255, 0.4)',
                      }}
                    >
                      <span className="absolute -top-4 left-0 px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-500 text-slate-950">
                        car 0.91
                      </span>
                    </div>

                    {/* Bounding Box 2: car 0.93 */}
                    <div
                      className="absolute border border-blue-500 bg-blue-500/10 rounded-sm"
                      style={{
                        top: '56%',
                        left: '46%',
                        width: '18%',
                        height: '22%',
                        boxShadow: '0 0 10px rgba(13, 126, 245, 0.4)',
                      }}
                    >
                      <span className="absolute -top-4 left-0 px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-blue-600 text-white">
                        car 0.93
                      </span>
                    </div>

                    {/* Bounding Box 3: person 0.78 */}
                    <div
                      className="absolute border border-cyan-400 bg-cyan-400/10 rounded-sm"
                      style={{
                        top: '60%',
                        left: '76%',
                        width: '8%',
                        height: '28%',
                        boxShadow: '0 0 8px rgba(0, 240, 255, 0.5)',
                      }}
                    >
                      <span className="absolute -top-4 left-0 px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-500 text-slate-950">
                        person 0.78
                      </span>
                    </div>
                  </>
                )}

                {/* Bottom HUD Bar */}
                <div className="absolute bottom-0 inset-x-0 px-3 py-1 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between font-mono text-[11px] text-cyan-200">
                  <span className="tracking-wider">{currentTime}</span>
                  <span className="font-semibold text-emerald-400">FPS: 22</span>
                </div>
              </div>
            </div>

            {/* ── CAMERA 3: Building Entrance ─────────────────────────────── */}
            <div
              className={`cyber-panel overflow-hidden transition-all duration-300 ${
                focusedCamera === 'entrance' ? 'ring-2 ring-cyan-400' : ''
              }`}
              style={{
                border: '1px solid rgba(0, 180, 255, 0.24)',
              }}
            >
              {/* Header Bar inside camera card */}
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950/70 border-b border-cyan-500/15">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-wide">
                    Building Entrance
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/70 border border-emerald-500/40 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                    RTSP
                  </span>
                  <button
                    onClick={() =>
                      setFocusedCamera(focusedCamera === 'entrance' ? null : 'entrance')
                    }
                    className="text-slate-400 hover:text-cyan-300 cursor-pointer"
                  >
                    <Maximize2 size={13} />
                  </button>
                </div>
              </div>

              {/* Feed Display */}
              <div className="relative aspect-video bg-black overflow-hidden select-none">
                <img
                  src="/images/building_entrance.jpg"
                  alt="Building Entrance Feed"
                  className="w-full h-full object-cover"
                />

                {showAiOverlays && (
                  <>
                    {/* Bounding Box 1: person 0.88 */}
                    <div
                      className="absolute border border-cyan-400 bg-cyan-400/10 rounded-sm"
                      style={{
                        top: '38%',
                        left: '32%',
                        width: '10%',
                        height: '42%',
                        boxShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
                      }}
                    >
                      <span className="absolute -top-4 left-0 px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-500 text-slate-950">
                        person 0.88
                      </span>
                    </div>

                    {/* Bounding Box 2: person 0.81 */}
                    <div
                      className="absolute border border-emerald-400 bg-emerald-400/10 rounded-sm"
                      style={{
                        top: '42%',
                        left: '48%',
                        width: '11%',
                        height: '40%',
                        boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
                      }}
                    >
                      <span className="absolute -top-4 left-0 px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500 text-slate-950">
                        person 0.81
                      </span>
                    </div>
                  </>
                )}

                {/* Bottom HUD Bar */}
                <div className="absolute bottom-0 inset-x-0 px-3 py-1 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between font-mono text-[11px] text-cyan-200">
                  <span className="tracking-wider">{currentTime}</span>
                  <span className="font-semibold text-emerald-400">FPS: 20</span>
                </div>
              </div>
            </div>

            {/* ── CAMERA 4: Backyard (Disconnected Stream) ────────────────── */}
            <div
              className={`cyber-panel overflow-hidden transition-all duration-300 ${
                focusedCamera === 'backyard' ? 'ring-2 ring-red-400' : ''
              }`}
              style={{
                border: '1px solid rgba(239, 68, 68, 0.28)',
              }}
            >
              {/* Header Bar inside camera card */}
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950/70 border-b border-red-500/20">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-wide">
                    Backyard
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-950/70 border border-red-500/40 text-red-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    Disconnected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 border border-slate-700 text-slate-400">
                    RTSP
                  </span>
                  <button
                    onClick={() =>
                      setFocusedCamera(focusedCamera === 'backyard' ? null : 'backyard')
                    }
                    className="text-slate-400 hover:text-cyan-300 cursor-pointer"
                  >
                    <Maximize2 size={13} />
                  </button>
                </div>
              </div>

              {/* Feed Display - Reconnecting State */}
              <div className="relative aspect-video bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col items-center justify-center select-none overflow-hidden">
                {/* Rotating Cyan Tech Rings */}
                <div className="relative w-16 h-16 mb-3">
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                  <div
                    className="absolute inset-2 rounded-full border-2 border-b-cyan-300 border-t-transparent border-l-transparent border-r-transparent animate-spin"
                    style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
                  />
                </div>

                <div className="text-sm font-bold text-slate-200 tracking-wider">
                  Reconnecting...
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">
                  Stream not available
                </div>

                {/* Bottom HUD Bar */}
                <div className="absolute bottom-0 inset-x-0 px-3 py-1 bg-black/60 flex items-center justify-between font-mono text-[11px] text-slate-400">
                  <span className="tracking-wider">{currentTime}</span>
                  <span className="text-red-400 font-semibold">FPS: 0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Panels (Recent Events + System Status) ─────────────────── */}
        <div className="lg:col-span-4 2xl:col-span-3 space-y-4">
          {/* Panel 1: Recent Events */}
          <div className="cyber-panel p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white tracking-wider flex items-center gap-2">
                Recent Events
              </h3>
              <button
                onClick={() => navigate('/events')}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                View All <ChevronRight size={14} />
              </button>
            </div>

            {/* List of Recent Events */}
            <div className="space-y-2.5">
              {sampleEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvidence(evt.evidence)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-800/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Event Mini Thumbnail / Icon */}
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        evt.severity === 'High'
                          ? 'bg-red-950/60 border border-red-500/50'
                          : evt.severity === 'Medium'
                          ? 'bg-amber-950/60 border border-amber-500/50'
                          : evt.severity === 'Low'
                          ? 'bg-emerald-950/60 border border-emerald-500/50'
                          : 'bg-cyan-950/60 border border-cyan-500/50'
                      }`}
                    >
                      {evt.icon}
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {evt.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {evt.camera}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {evt.time}
                      </div>
                    </div>
                  </div>

                  {/* Severity Badge */}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      evt.severity === 'High'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : evt.severity === 'Medium'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : evt.severity === 'Low'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    }`}
                  >
                    {evt.severity === 'High' && '🔥 High'}
                    {evt.severity === 'Medium' && '⚡ Medium'}
                    {evt.severity === 'Low' && '🕒 Low'}
                    {evt.severity === 'Info' && 'ℹ️ Info'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Panel 2: System Status */}
          <div className="cyber-panel p-4 space-y-4">
            <div
              onClick={() => navigate('/reports')}
              className="flex items-center justify-between cursor-pointer group"
            >
              <h3 className="text-sm font-extrabold text-white tracking-wider flex items-center gap-2">
                System Status
              </h3>
              <ChevronRight
                size={16}
                className="text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all"
              />
            </div>

            {/* 3 Circular Radial Donut Gauges */}
            <div className="grid grid-cols-3 gap-2 py-1 border-y border-slate-800/80">
              <RadialGauge
                percentage={32}
                label="CPU"
                color="#00f0ff"
                glowColor="rgba(0, 240, 255, 0.5)"
              />
              <RadialGauge
                percentage={48}
                label="Memory"
                color="#22d3ee"
                glowColor="rgba(34, 211, 238, 0.5)"
              />
              <RadialGauge
                percentage={67}
                label="Storage"
                color="#38bdf8"
                glowColor="rgba(56, 189, 248, 0.5)"
              />
            </div>

            {/* Bottom AI Status Banner */}
            <div className="flex items-center justify-between text-xs font-mono font-medium px-2 py-1.5 rounded-lg bg-slate-900/50 border border-slate-800 text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                AI Model: <strong className="text-cyan-300 font-bold">YOLOv8n</strong>
              </span>
              <span className="text-slate-400">FPS: 22.4</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Forensic Details Modal (Opened on event or verify click) ────────── */}
      <ForensicModal
        evidence={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />
    </div>
  )
}
