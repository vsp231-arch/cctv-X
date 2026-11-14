import React, { useState } from 'react'
import {
  Cpu,
  Shield,
  Bell,
  Save,
  CheckCircle2,
} from 'lucide-react'

export const SettingsPage: React.FC = () => {
  const [model, setModel] = useState('YOLOv8n')
  const [device, setDevice] = useState('cuda')
  const [confidence, setConfidence] = useState(0.75)
  const [iou, setIou] = useState(0.45)
  const [autoHash, setAutoHash] = useState(true)
  const [retentionDays, setRetentionDays] = useState(90)
  const [soundAlerts, setSoundAlerts] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2500)
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="pb-2 border-b border-cyan-500/20">
        <h2 className="text-lg font-black text-white tracking-wider flex items-center gap-2">
          System Configuration & AI Model Parameters
        </h2>
        <p className="text-xs text-slate-400">
          Tune deep learning models, RTSP ingestion, and digital evidence retention
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: AI Model Configuration */}
        <div className="cyber-panel p-5 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-cyan-500/15">
            <Cpu size={18} className="text-cyan-400" />
            <h3 className="text-sm font-extrabold text-white tracking-wider">
              AI Detection Engine (YOLOv8)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Model Variant
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-cyan-500/25 text-white text-xs outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="YOLOv8n">YOLOv8n (Nano - Ultra Low Latency)</option>
                <option value="YOLOv8s">YOLOv8s (Small - Balanced)</option>
                <option value="YOLOv8m">YOLOv8m (Medium - High Accuracy)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Inference Acceleration
              </label>
              <select
                value={device}
                onChange={(e) => setDevice(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-cyan-500/25 text-white text-xs outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="cuda">NVIDIA CUDA / TensorRT (GPU)</option>
                <option value="directml">DirectML (Windows Acceleration)</option>
                <option value="cpu">CPU (OpenVINO / ONNX)</option>
              </select>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Confidence Threshold</span>
                <span className="font-mono text-cyan-400">{confidence}</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="0.95"
                step="0.05"
                value={confidence}
                onChange={(e) => setConfidence(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>NMS IoU Threshold</span>
                <span className="font-mono text-cyan-400">{iou}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="0.8"
                step="0.05"
                value={iou}
                onChange={(e) => setIou(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Forensic Evidence & Cryptography */}
        <div className="cyber-panel p-5 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-cyan-500/15">
            <Shield size={18} className="text-cyan-400" />
            <h3 className="text-sm font-extrabold text-white tracking-wider">
              Forensic Integrity & Evidence Vault
            </h3>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <div className="text-xs font-bold text-white tracking-wide">
                Automatic SHA-256 Hash Sealing
              </div>
              <div className="text-[11px] text-slate-400">
                Cryptographically seal every recorded incident video clip at time of creation
              </div>
            </div>
            <div
              onClick={() => setAutoHash(!autoHash)}
              className={`cyber-switch ${autoHash ? 'active' : ''}`}
            >
              <div className="cyber-switch-thumb" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Evidence Retention Period (Days)
            </label>
            <input
              type="number"
              value={retentionDays}
              onChange={(e) => setRetentionDays(parseInt(e.target.value) || 30)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-cyan-500/25 text-white text-xs outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>

        {/* Section 3: Audio & Siren Alerts */}
        <div className="cyber-panel p-5 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-cyan-500/15">
            <Bell size={18} className="text-cyan-400" />
            <h3 className="text-sm font-extrabold text-white tracking-wider">
              Notifications & Audio
            </h3>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <div className="text-xs font-bold text-white tracking-wide">
                Sound Siren on High Priority Intrusion
              </div>
              <div className="text-[11px] text-slate-400">
                Play acoustic alert through control room audio system
              </div>
            </div>
            <div
              onClick={() => setSoundAlerts(!soundAlerts)}
              className={`cyber-switch ${soundAlerts ? 'active' : ''}`}
            >
              <div className="cyber-switch-thumb" />
            </div>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 size={16} />
            System parameters updated successfully!
          </div>
        )}

        <button
          type="submit"
          className="btn-cyber-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <Save size={15} />
          Save Configurations
        </button>
      </form>
    </div>
  )
}
