import React, { useState } from 'react'
import {
  Flame,
  Zap,
  Volume2,
  VolumeX,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react'
import { ForensicModal, type ForensicEvidenceData } from '@/components/ForensicModal'

interface AlertItem {
  id: string
  title: string
  camera: string
  time: string
  severity: 'High' | 'Medium' | 'Low'
  status: 'Active' | 'Acknowledged' | 'Resolved'
  description: string
  evidence?: ForensicEvidenceData
}

export const AlertsPage: React.FC = () => {
  const [sirenMuted, setSirenMuted] = useState(false)
  const [selectedEvidence, setSelectedEvidence] = useState<ForensicEvidenceData | null>(null)
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: 'ALT-1049',
      title: 'Restricted Zone Intrusion',
      camera: 'Main Gate (CAM-001)',
      time: '14:32:12',
      severity: 'High',
      status: 'Active',
      description: 'Person detected crossing the geofenced perimeter barrier without authorization.',
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
      id: 'ALT-1048',
      title: 'Line Crossing Detected',
      camera: 'Parking Lot (CAM-002)',
      time: '14:28:45',
      severity: 'Medium',
      status: 'Active',
      description: 'Vehicle crossed the directional boundary in the wrong lane.',
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
      id: 'ALT-1047',
      title: 'Camera Stream Disconnected',
      camera: 'Backyard (CAM-004)',
      time: '14:15:02',
      severity: 'High',
      status: 'Active',
      description: 'RTSP connection failed after 3 reconnection retries.',
    },
  ])

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Acknowledged' } : a))
    )
  }

  const resolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Resolved' } : a))
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <ShieldAlert size={22} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-wider">
              Active Security Alerts
            </h2>
            <p className="text-xs text-slate-400">
              Immediate threat notifications and AI detection triggers
            </p>
          </div>
        </div>

        <button
          onClick={() => setSirenMuted(!sirenMuted)}
          className="btn-cyber-secondary px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
        >
          {sirenMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          {sirenMuted ? 'Unmute Audio Siren' : 'Mute Audio Siren'}
        </button>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`cyber-panel p-5 transition-all ${
              alert.status === 'Active'
                ? 'border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                : 'border-slate-800 opacity-80'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    alert.severity === 'High'
                      ? 'bg-red-950/70 border border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                      : 'bg-amber-950/70 border border-amber-500 text-amber-400'
                  }`}
                >
                  {alert.severity === 'High' ? <Flame size={22} /> : <Zap size={22} />}
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {alert.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        alert.severity === 'High'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {alert.severity} Priority
                    </span>
                    <span className="font-mono text-xs text-slate-500">{alert.time}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mt-1">
                    {alert.title}
                  </h3>
                  <div className="text-xs text-cyan-300 font-semibold mt-0.5">
                    {alert.camera}
                  </div>
                  <p className="text-xs text-slate-300 mt-2 max-w-xl">
                    {alert.description}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {alert.evidence && (
                  <button
                    onClick={() => setSelectedEvidence(alert.evidence!)}
                    className="btn-cyber-primary px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink size={14} />
                    View Evidence
                  </button>
                )}

                {alert.status === 'Active' && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="btn-cyber-secondary px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Acknowledge
                  </button>
                )}

                {alert.status !== 'Resolved' && (
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ForensicModal
        evidence={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />
    </div>
  )
}
