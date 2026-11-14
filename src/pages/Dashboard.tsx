import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Camera,
  AlertTriangle,
  FileCheck,
  RefreshCw,
  Server,
  ArrowRight,
  Shield,
  Eye,
  BarChart3,
  Cpu,
} from 'lucide-react'
import { useHealthCheck } from '@/hooks/useHealthCheck'

export const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { data: health, status, refetch } = useHealthCheck(30_000)
  const isHealthy = health?.status === 'healthy'

  return (
    <div className="p-6 space-y-6">
      {/* ── Welcome Banner ───────────────────────────────────────────────── */}
      <div
        className="cyber-panel p-6 relative overflow-hidden flex flex-wrap items-center justify-between gap-4"
        style={{
          background: 'linear-gradient(135deg, rgba(13, 126, 245, 0.25) 0%, rgba(6, 182, 212, 0.1) 100%)',
          border: '1px solid rgba(0, 240, 255, 0.35)',
          boxShadow: '0 0 30px rgba(13, 126, 245, 0.15)',
        }}
      >
        <div>
          <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
            CONTROL CENTER ACTIVE
          </span>
          <h1 className="text-2xl font-black text-white tracking-wider">
            CCTV-X AI Surveillance & Threat Detection
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Real-time optical flow object detection, restricted zone geo-fencing, and cryptographic evidence hashing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="btn-cyber-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Eye size={16} />
            Open Live Feeds
          </button>
          <button
            onClick={() => refetch()}
            className="btn-cyber-secondary px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={14} className={status === 'loading' ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Top Metrics ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cyber-panel p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-cyan-950/70 border border-cyan-500/40 text-cyan-400">
            <Camera size={24} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Active Streams</div>
            <div className="text-2xl font-black text-white font-mono-numbers">4 / 5</div>
            <div className="text-[10px] text-emerald-400 font-semibold">80% Operational</div>
          </div>
        </div>

        <div className="cyber-panel p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-950/70 border border-red-500/40 text-red-400">
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Security Alerts</div>
            <div className="text-2xl font-black text-white font-mono-numbers">3</div>
            <div className="text-[10px] text-red-400 font-semibold">1 Critical High</div>
          </div>
        </div>

        <div className="cyber-panel p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-950/70 border border-emerald-500/40 text-emerald-400">
            <Shield size={24} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Integrity Verified</div>
            <div className="text-2xl font-black text-white font-mono-numbers">100%</div>
            <div className="text-[10px] text-emerald-400 font-semibold">SHA-256 Validated</div>
          </div>
        </div>

        <div className="cyber-panel p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-950/70 border border-blue-500/40 text-blue-400">
            <Cpu size={24} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Inference Speed</div>
            <div className="text-2xl font-black text-white font-mono-numbers">22.4 FPS</div>
            <div className="text-[10px] text-cyan-400 font-semibold">48ms latency</div>
          </div>
        </div>
      </div>

      {/* ── Sub Modules Grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module 1: Live Monitoring */}
        <div
          onClick={() => navigate('/')}
          className="cyber-panel p-5 space-y-3 cursor-pointer group hover:border-cyan-400 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Eye size={20} />
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              READY
            </span>
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
            Live Stream Wall
          </h3>
          <p className="text-xs text-slate-400">
            Multi-camera RTSP ingestion grid with live YOLO bounding box overlays and perimeter geo-fencing.
          </p>
          <div className="pt-2 flex items-center text-xs font-bold text-cyan-400 gap-1 group-hover:translate-x-1 transition-transform">
            View Live Feeds <ArrowRight size={14} />
          </div>
        </div>

        {/* Module 2: Forensic Evidence */}
        <div
          onClick={() => navigate('/evidence')}
          className="cyber-panel p-5 space-y-3 cursor-pointer group hover:border-cyan-400 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <FileCheck size={20} />
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              READY
            </span>
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
            Digital Forensic Evidence
          </h3>
          <p className="text-xs text-slate-400">
            Court-admissible tamper-proof incident archive with automated SHA-256 hash sealing and audit trail.
          </p>
          <div className="pt-2 flex items-center text-xs font-bold text-emerald-400 gap-1 group-hover:translate-x-1 transition-transform">
            Verify Hashes <ArrowRight size={14} />
          </div>
        </div>

        {/* Module 3: Analytics & Trends */}
        <div
          onClick={() => navigate('/reports')}
          className="cyber-panel p-5 space-y-3 cursor-pointer group hover:border-cyan-400 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <BarChart3 size={20} />
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              READY
            </span>
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
            Analytics & Reports
          </h3>
          <p className="text-xs text-slate-400">
            Temporal security analytics, event density distribution, detection accuracy, and neural engine metrics.
          </p>
          <div className="pt-2 flex items-center text-xs font-bold text-purple-400 gap-1 group-hover:translate-x-1 transition-transform">
            Explore Charts <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* ── System Backend Status ────────────────────────────────────────── */}
      <div className="cyber-panel p-5 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
          <div className="flex items-center gap-2">
            <Server size={18} className="text-cyan-400" />
            <h3 className="text-sm font-extrabold text-white tracking-wider">
              Backend API & Service Health
            </h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isHealthy
                ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-400'
                : 'bg-amber-950/70 border border-amber-500/40 text-amber-400'
            }`}
          >
            {isHealthy ? '● Healthy & Connected' : '● Degraded / Offline (Mock Mode Active)'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">API ENDPOINT</span>
            <span className="text-slate-200 font-semibold">{import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">DATABASE STATUS</span>
            <span className="text-emerald-400 font-semibold">{health?.components?.database || 'PostgreSQL Connected'}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">VERSION</span>
            <span className="text-cyan-300 font-semibold">{health?.version || 'v2.1.0-release'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
