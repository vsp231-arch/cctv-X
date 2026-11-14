import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('Last 7 Days')

  // Sample data points for Event Trend chart (Apr 20 - Apr 26)
  const days = ['Apr 20', 'Apr 21', 'Apr 22', 'Apr 23', 'Apr 24', 'Apr 25', 'Apr 26']
  const intrusionData = [12, 18, 14, 25, 20, 28, 35]
  const lineCrossingData = [15, 12, 19, 14, 22, 18, 26]
  const loiteringData = [8, 10, 12, 9, 15, 12, 18]
  const personDetectedData = [24, 28, 30, 26, 32, 29, 38]

  // Normalization for SVG height 160
  const maxVal = 45
  const getPoints = (arr: number[]) =>
    arr
      .map((val, idx) => {
        const x = 30 + idx * 75
        const y = 140 - (val / maxVal) * 110
        return `${x},${y}`
      })
      .join(' ')

  return (
    <div className="p-6 space-y-6">
      {/* ── Top Header Bar ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
        <div>
          <h2 className="text-lg font-black text-white tracking-wider flex items-center gap-2">
            Analytics & System Insights
          </h2>
          <p className="text-xs text-slate-400">
            Real-time inference metrics, event telemetry, and distribution trends
          </p>
        </div>

        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none px-4 py-2 pr-9 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs font-semibold outline-none focus:border-cyan-400 cursor-pointer shadow-lg"
          >
            <option value="Last 24 Hours">Last 24 Hours</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none"
          />
        </div>
      </div>

      {/* ── Top Row: Event Trend (Left) + Event Distribution (Right) ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Event Trend (7 cols) ────────────────────────────────────────── */}
        <div className="lg:col-span-7 cyber-panel p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-extrabold text-white tracking-wider">
              Event Trend
            </h3>

            {/* Series Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold">
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
                Intrusion
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                Line Crossing
              </span>
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc]" />
                Loitering
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
                Person Detected
              </span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="relative w-full h-52 bg-slate-950/60 rounded-xl border border-slate-800/80 p-2 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 520 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="glowRed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="glowCyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[30, 65, 100, 135].map((y) => (
                <line
                  key={y}
                  x1="20"
                  y1={y}
                  x2="500"
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Person Detected series (Cyan) */}
              <polyline
                fill="none"
                stroke="#00f0ff"
                strokeWidth="2.5"
                points={getPoints(personDetectedData)}
                style={{ filter: 'drop-shadow(0 0 6px rgba(0, 240, 255, 0.7))' }}
              />

              {/* Intrusion series (Red) */}
              <polyline
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
                points={getPoints(intrusionData)}
                style={{ filter: 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.8))' }}
              />

              {/* Line Crossing series (Amber) */}
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                points={getPoints(lineCrossingData)}
              />

              {/* Loitering series (Purple) */}
              <polyline
                fill="none"
                stroke="#a855f7"
                strokeWidth="2"
                points={getPoints(loiteringData)}
              />

              {/* Data Dots for Intrusion */}
              {intrusionData.map((val, idx) => {
                const x = 30 + idx * 75
                const y = 140 - (val / maxVal) * 110
                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#ef4444"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                )
              })}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between px-6 pt-1 text-[10px] font-mono text-slate-400">
              {days.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Event Distribution Donut (5 cols) ───────────────────────────── */}
        <div className="lg:col-span-5 cyber-panel p-5 space-y-4">
          <h3 className="text-sm font-extrabold text-white tracking-wider">
            Event Distribution
          </h3>

          <div className="flex items-center justify-center gap-6 py-2">
            {/* SVG Donut Chart with center label */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Segment 1: Intrusion 35% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#ef4444"
                  strokeWidth="12"
                  strokeDasharray="83.5 238.7"
                  strokeDashoffset="0"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(239,68,68,0.6))' }}
                />
                {/* Segment 2: Line Crossing 26% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="12"
                  strokeDasharray="62.0 238.7"
                  strokeDashoffset="-83.5"
                />
                {/* Segment 3: Loitering 18% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#a855f7"
                  strokeWidth="12"
                  strokeDasharray="43.0 238.7"
                  strokeDashoffset="-145.5"
                />
                {/* Segment 4: Person Detected 21% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#00f0ff"
                  strokeWidth="12"
                  strokeDasharray="50.2 238.7"
                  strokeDashoffset="-188.5"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(0,240,255,0.6))' }}
                />
              </svg>

              {/* Center text */}
              <div className="absolute text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">Total Events</div>
                <div className="text-xl font-black text-white font-mono-numbers">124</div>
              </div>
            </div>

            {/* Legend List with Percentages */}
            <div className="space-y-2 text-xs font-semibold">
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Intrusion
                </span>
                <span className="font-mono text-red-400 font-bold">35%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Line Crossing
                </span>
                <span className="font-mono text-amber-400 font-bold">26%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  Loitering
                </span>
                <span className="font-mono text-purple-400 font-bold">18%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Person Detected
                </span>
                <span className="font-mono text-cyan-400 font-bold">21%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Detection Accuracy (Left) + System Performance (Right) ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Detection Accuracy (6 cols) ─────────────────────────────────── */}
        <div className="lg:col-span-6 cyber-panel p-5 space-y-4">
          <h3 className="text-sm font-extrabold text-white tracking-wider">
            Detection Accuracy
          </h3>

          <div className="flex items-center gap-8 py-2">
            {/* Accuracy Radial Arc */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="rgba(15, 30, 65, 0.8)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#00f0ff"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset="19.3"
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.7))' }}
                />
              </svg>
              <span className="absolute font-mono-numbers text-xl font-black text-white">
                92.3%
              </span>
            </div>

            {/* Precision & Recall */}
            <div className="space-y-3 font-medium text-xs">
              <div className="flex items-center justify-between gap-8">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Precision
                </span>
                <span className="font-mono font-bold text-cyan-300 text-sm">91.7%</span>
              </div>

              <div className="flex items-center justify-between gap-8">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Recall
                </span>
                <span className="font-mono font-bold text-emerald-300 text-sm">92.9%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── System Performance (6 cols) ─────────────────────────────────── */}
        <div className="lg:col-span-6 cyber-panel p-5 space-y-4">
          <h3 className="text-sm font-extrabold text-white tracking-wider">
            System Performance
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-1 font-mono">
            {/* FPS */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-bold">FPS</div>
              <div className="text-2xl font-black text-cyan-400 mt-1">22.4</div>
            </div>

            {/* Inference Latency */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Latency</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">48ms</div>
            </div>

            {/* CPU Usage */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-bold">CPU Usage</div>
              <div className="text-2xl font-black text-white mt-1">32%</div>
            </div>

            {/* Memory Usage */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Memory</div>
              <div className="text-2xl font-black text-white mt-1">48%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
