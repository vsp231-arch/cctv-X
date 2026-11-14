import React, { useState } from 'react'
import {
  X,
  ShieldCheck,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
} from 'lucide-react'

export interface ForensicEvidenceData {
  id: string
  title: string
  camera: string
  timestamp: string
  date: string
  fileName: string
  fileSize: string
  duration: string
  resolution: string
  fps: number
  cameraId: string
  sha256: string
  status: 'Verified' | 'Pending'
  imageUrl: string
  hasBoundingBox?: boolean
}

interface ForensicModalProps {
  evidence: ForensicEvidenceData | null
  onClose: () => void
}

export const ForensicModal: React.FC<ForensicModalProps> = ({ evidence, onClose }) => {
  const [activeTab, setActiveTab] = useState<'metadata' | 'audit' | 'event'>('metadata')
  const [isVerifying, setIsVerifying] = useState(false)
  const [copiedHash, setCopiedHash] = useState(false)

  if (!evidence) return null

  const handleCopyHash = () => {
    navigator.clipboard.writeText(evidence.sha256)
    setCopiedHash(true)
    setTimeout(() => setCopiedHash(false), 2000)
  }

  const handleReverify = () => {
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className="relative w-full max-w-4xl cyber-panel-glow overflow-hidden animate-fade-up"
        style={{
          border: '1px solid rgba(0, 240, 255, 0.35)',
          boxShadow: '0 0 50px rgba(0, 180, 255, 0.25)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* ── Modal Header ──────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{
            borderColor: 'rgba(0, 180, 255, 0.18)',
            background: 'rgba(10, 18, 42, 0.95)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wider flex items-center gap-3">
                Digital Forensic Evidence
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                  {evidence.id}
                </span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Scrollable Body ────────────────────────────────────────────── */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Split: Evidence Viewer + Integrity Verification */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Video / Snapshot Viewer */}
            <div className="md:col-span-7 flex flex-col gap-3">
              <div className="relative rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-950 aspect-video group">
                <img
                  src={evidence.imageUrl}
                  alt={evidence.title}
                  className="w-full h-full object-cover"
                />

                {/* Simulated Bounding Box for Intrusion */}
                <div
                  className="absolute border-2 border-red-500 bg-red-500/20 rounded"
                  style={{
                    top: '32%',
                    left: '42%',
                    width: '18%',
                    height: '42%',
                    boxShadow: '0 0 15px rgba(239, 68, 68, 0.6)',
                  }}
                >
                  <span className="absolute -top-6 left-0 px-1.5 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded">
                    person 0.92
                  </span>
                </div>

                {/* Top Badge overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-500/80 text-white backdrop-blur-sm flex items-center gap-1">
                    <AlertTriangle size={12} /> {evidence.title}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-black/60 text-slate-200 backdrop-blur-sm">
                    {evidence.camera}
                  </span>
                </div>

                {/* Bottom Timestamp overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-cyan-300 bg-black/70 px-3 py-1 rounded backdrop-blur-sm">
                  <span>{evidence.date} {evidence.timestamp}</span>
                  <span>SHA-256 MATCHED</span>
                </div>
              </div>

              {/* Quick file stats */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
                  <span className="text-slate-500 block text-[10px]">FILE NAME</span>
                  <span className="truncate block font-semibold">{evidence.fileName}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
                  <span className="text-slate-500 block text-[10px]">RESOLUTION</span>
                  <span className="font-semibold">{evidence.resolution}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
                  <span className="text-slate-500 block text-[10px]">SIZE / FPS</span>
                  <span className="font-semibold">{evidence.fileSize} | {evidence.fps} FPS</span>
                </div>
              </div>
            </div>

            {/* Right: Integrity Verification Box */}
            <div className="md:col-span-5 flex flex-col justify-between p-5 rounded-xl border border-cyan-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950/90">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Integrity Verification
                </div>

                {/* Big Green Shield Verified */}
                <div className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center flex flex-col items-center justify-center gap-2 mb-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '2px solid #10b981',
                      boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
                    }}
                  >
                    <CheckCircle2 size={30} className="text-emerald-400" />
                  </div>
                  <div className="text-base font-extrabold text-emerald-300 tracking-wider">
                    VERIFIED
                  </div>
                  <div className="text-xs text-emerald-400/80 font-medium">
                    Hash match confirmed • Tamper-proof
                  </div>
                </div>

                {/* Hash Display */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>SHA-256 HASH</span>
                    <button
                      onClick={handleCopyHash}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[10px] cursor-pointer"
                    >
                      {copiedHash ? <Check size={12} /> : <Copy size={12} />}
                      {copiedHash ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 font-mono text-[11px] text-cyan-300 break-all select-all">
                    {evidence.sha256}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReverify}
                  disabled={isVerifying}
                  className="flex-1 py-2 px-3 rounded-lg btn-cyber-secondary flex items-center justify-center gap-2 text-xs"
                >
                  <RefreshCw size={14} className={isVerifying ? 'animate-spin' : ''} />
                  {isVerifying ? 'Verifying...' : 'Re-verify'}
                </button>
                <button
                  onClick={() => alert(`Downloading forensic package for ${evidence.id}...`)}
                  className="flex-1 py-2 px-3 rounded-lg btn-cyber-primary flex items-center justify-center gap-2 text-xs"
                >
                  <Download size={14} />
                  Download
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Tabs: Metadata | Audit Log | Related Event */}
          <div className="border-t border-slate-800 pt-4">
            <div className="flex items-center gap-4 mb-4 border-b border-slate-800">
              <button
                onClick={() => setActiveTab('metadata')}
                className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'metadata'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Metadata
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'audit'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Audit Log
              </button>
              <button
                onClick={() => setActiveTab('event')}
                className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'event'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Related Event
              </button>
            </div>

            {/* Tab 1: Metadata */}
            {activeTab === 'metadata' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">ACQUISITION TIME</span>
                  <span className="text-slate-200 font-semibold">{evidence.date} {evidence.timestamp}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">ACQUIRED BY</span>
                  <span className="text-slate-200 font-semibold">CCTV-X Core AI Engine</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">STORAGE LOCATION</span>
                  <span className="text-slate-200 font-semibold">/evidence/20250426/</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">FILE FORMAT</span>
                  <span className="text-slate-200 font-semibold">MP4 (H.264 / AAC)</span>
                </div>
              </div>
            )}

            {/* Tab 2: Audit Log Timeline */}
            {activeTab === 'audit' && (
              <div className="space-y-3 font-mono text-xs">
                {[
                  { time: '26 Apr 2025 14:32:12', action: 'Evidence Created', actor: 'System' },
                  { time: '26 Apr 2025 14:32:22', action: 'Hash Generated', actor: 'System' },
                  { time: '26 Apr 2025 14:35:10', action: 'Verification Check', actor: 'Investigator (VSP)' },
                  { time: '26 Apr 2025 14:40:03', action: 'Evidence Viewed', actor: 'Investigator (VSP)' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
                      <span className="text-slate-400">{item.time}</span>
                      <span className="text-slate-200 font-semibold">{item.action}</span>
                    </div>
                    <span className="text-cyan-400 font-medium">{item.actor}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Related Event */}
            {activeTab === 'event' && (
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs space-y-2">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-400" />
                  Primary Event: {evidence.title}
                </div>
                <div className="text-slate-300">
                  Detected by optical flow and YOLOv8n object classification on camera{' '}
                  <span className="font-semibold text-cyan-300">{evidence.camera}</span>. Person crossed the designated
                  geo-fenced restricted polygon with confidence 0.92.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
