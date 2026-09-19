import React, { useState, useEffect } from 'react';
import { CalculationResult } from '../types';
import { Disc, Cpu, Compass, Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react';

interface DiskPlatterVisualizerProps {
  result: CalculationResult;
  activeStep: number;
  onStepChange: (step: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const DiskPlatterVisualizer: React.FC<DiskPlatterVisualizerProps> = ({
  result,
  activeStep,
  onStepChange,
  isPlaying,
  onTogglePlay,
}) => {
  const [rpmSpeed, setRpmSpeed] = useState<'normal' | 'fast' | 'slow'>('normal');

  const diskSize = result.diskSize || 200;
  const maxCylinder = diskSize - 1;

  // Determine current active cylinder
  let currentCylinder = result.initialHead;
  let currentStatus = 'Initial Head Position';

  if (activeStep >= 0 && activeStep < result.steps.length) {
    const stepObj = result.steps[activeStep];
    currentCylinder = stepObj.to;
    currentStatus = `Step ${stepObj.step}: Seeking to cylinder ${stepObj.to} (${stepObj.direction})`;
  } else if (activeStep >= result.steps.length) {
    const lastStep = result.steps[result.steps.length - 1];
    currentCylinder = lastStep?.to ?? result.initialHead;
    currentStatus = 'Completed all cylinder requests';
  }

  // Calculate arm angle based on cylinder (e.g. from 24 deg to 52 deg)
  // Outer track (0) to inner track (maxCylinder)
  const minAngle = 18;
  const maxAngle = 48;
  const normalizedPos = maxCylinder > 0 ? Math.min(Math.max(currentCylinder / maxCylinder, 0), 1) : 0;
  const armAngle = minAngle + normalizedPos * (maxAngle - minAngle);

  // Platter track radius calculation
  // Platter radius is 120px in SVG, center at (170, 170)
  // Tracks span from r=45 (inner) to r=115 (outer)
  const trackRadius = 115 - normalizedPos * (115 - 48);

  const rpmAnimationClass =
    rpmSpeed === 'fast' ? 'animate-spin-fast' : rpmSpeed === 'slow' ? 'animate-spin-slow' : 'animate-spin-normal';

  return (
    <div id="platter-simulator" className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Disc className="w-4 h-4 text-indigo-500" />
            Physical Platter & Actuator Arm Simulator
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Mechanical visualization of spinning magnetic platter and actuator head tracking cylinders
          </p>
        </div>

        {/* Live Head Readout Badge */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Head Track:</span>
            <strong className="text-indigo-600 dark:text-indigo-400 text-sm font-bold">
              {currentCylinder}
            </strong>
            <span className="text-slate-400">/ {maxCylinder}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[11px] font-medium text-slate-600 dark:text-slate-400">
            <button
              onClick={() => setRpmSpeed('slow')}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                rpmSpeed === 'slow' ? 'bg-white dark:bg-slate-700 font-bold text-indigo-600 dark:text-indigo-300 shadow-xs' : ''
              }`}
            >
              5,400 RPM
            </button>
            <button
              onClick={() => setRpmSpeed('normal')}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                rpmSpeed === 'normal' ? 'bg-white dark:bg-slate-700 font-bold text-indigo-600 dark:text-indigo-300 shadow-xs' : ''
              }`}
            >
              7,200 RPM
            </button>
            <button
              onClick={() => setRpmSpeed('fast')}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                rpmSpeed === 'fast' ? 'bg-white dark:bg-slate-700 font-bold text-indigo-600 dark:text-indigo-300 shadow-xs' : ''
              }`}
            >
              10,000 RPM
            </button>
          </div>
        </div>
      </div>

      {/* Main Platter Display & Status HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Platter Chassis */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="relative w-full max-w-[360px] aspect-square rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-4 shadow-xl border border-slate-700/60 overflow-hidden select-none">
            {/* Corner screws */}
            <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 rounded-full bg-slate-600 border border-slate-400 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-slate-400 transform rotate-45" />
            </div>
            <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-slate-600 border border-slate-400 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-slate-400 transform -rotate-45" />
            </div>
            <div className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 rounded-full bg-slate-600 border border-slate-400 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-slate-400 transform rotate-12" />
            </div>
            <div className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-slate-600 border border-slate-400 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-slate-400 transform rotate-75" />
            </div>

            <svg viewBox="0 0 340 340" className="w-full h-full">
              <defs>
                {/* Platter Brushed Aluminum Radial Gradient */}
                <radialGradient id="platterGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="35%" stopColor="#1e293b" />
                  <stop offset="65%" stopColor="#475569" />
                  <stop offset="85%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </radialGradient>

                {/* Spindle gradient */}
                <radialGradient id="spindleGrad" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#e2e8f0" />
                  <stop offset="50%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#475569" />
                </radialGradient>

                {/* Actuator arm gradient */}
                <linearGradient id="armGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#cbd5e1" />
                  <stop offset="60%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>

                {/* Platter glow filter */}
                <filter id="headGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 1. Base Disk Platter (Circular Aluminum Platter) */}
              <g transform="translate(170, 170)">
                {/* Outer disk edge */}
                <circle r="128" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                <circle r="124" fill="url(#platterGrad)" stroke="#334155" strokeWidth="1" />

                {/* Spinning group with sector reflection rings */}
                <g className={rpmAnimationClass} style={{ transformOrigin: '0px 0px' }}>
                  {/* Concentric Cylinder Tracks */}
                  <circle r="115" fill="none" stroke="#64748b" strokeWidth="0.75" strokeDasharray="3 4" opacity="0.3" />
                  <circle r="100" fill="none" stroke="#64748b" strokeWidth="0.75" strokeDasharray="3 4" opacity="0.35" />
                  <circle r="85" fill="none" stroke="#64748b" strokeWidth="0.75" strokeDasharray="3 4" opacity="0.4" />
                  <circle r="70" fill="none" stroke="#64748b" strokeWidth="0.75" strokeDasharray="3 4" opacity="0.45" />
                  <circle r="55" fill="none" stroke="#64748b" strokeWidth="0.75" strokeDasharray="3 4" opacity="0.5" />
                  <circle r="42" fill="none" stroke="#64748b" strokeWidth="0.75" strokeDasharray="3 4" opacity="0.5" />

                  {/* Surface specular light sweeps */}
                  <path d="M -120 0 L 120 0" stroke="#ffffff" strokeWidth="0.7" opacity="0.12" />
                  <path d="M 0 -120 L 0 120" stroke="#ffffff" strokeWidth="0.7" opacity="0.12" />
                  <path d="M -85 -85 L 85 85" stroke="#ffffff" strokeWidth="0.7" opacity="0.1" />
                  <path d="M -85 85 L 85 -85" stroke="#ffffff" strokeWidth="0.7" opacity="0.1" />
                </g>

                {/* Active Cylinder Track Ring Highlight */}
                <circle
                  r={trackRadius}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  opacity="0.85"
                  filter="url(#headGlow)"
                  className="transition-all duration-300"
                />

                {/* Spindle Hub Center */}
                <circle r="34" fill="url(#spindleGrad)" stroke="#334155" strokeWidth="2" />
                <circle r="22" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
                <circle r="8" fill="#0f172a" />
                {/* Spindle mounting screws */}
                <circle cx="0" cy="-14" r="2.5" fill="#cbd5e1" />
                <circle cx="12" cy="7" r="2.5" fill="#cbd5e1" />
                <circle cx="-12" cy="7" r="2.5" fill="#cbd5e1" />
              </g>

              {/* 2. Actuator Axis Pivot Base (Mounted in bottom-left corner at 50, 290) */}
              <g transform="translate(50, 290)">
                {/* Voice coil magnet housing */}
                <path
                  d="M -30 -30 Q -10 -60 30 -60 Q 50 -30 30 0 Z"
                  fill="#1e293b"
                  stroke="#475569"
                  strokeWidth="1.5"
                />
                <circle r="22" fill="#334155" stroke="#64748b" strokeWidth="2" />
                <circle r="14" fill="url(#spindleGrad)" />
                <circle r="6" fill="#1e293b" />

                {/* Actuator Arm rotating around pivot */}
                <g
                  transform={`rotate(${-armAngle})`}
                  className="transition-transform duration-300 ease-out"
                  style={{ transformOrigin: '0px 0px' }}
                >
                  {/* Rear counterweight & voice coil wires */}
                  <path d="M -12 12 L -28 32 L -8 38 L 4 14 Z" fill="#475569" opacity="0.8" />

                  {/* Primary Arm Shaft tapering toward head */}
                  <polygon
                    points="-6,-10 6,-10 2,-165 -2,-165"
                    fill="url(#armGrad)"
                    stroke="#475569"
                    strokeWidth="1"
                  />

                  {/* Flexure and Gimbal Spring Suspension */}
                  <polygon
                    points="-3,-165 3,-165 1.5,-188 -1.5,-188"
                    fill="#94a3b8"
                    stroke="#64748b"
                    strokeWidth="0.5"
                  />

                  {/* Magnetic Read/Write Slider Head */}
                  <rect
                    x="-4"
                    y="-198"
                    width="8"
                    height="10"
                    rx="1.5"
                    fill="#0f172a"
                    stroke="#38bdf8"
                    strokeWidth="1.2"
                  />

                  {/* Laser/Optical Head Light indicator on platter */}
                  <circle
                    cx="0"
                    cy="-193"
                    r="3"
                    fill="#38bdf8"
                    filter="url(#headGlow)"
                    className="animate-pulse"
                  />
                </g>
              </g>

              {/* Platter track markers */}
              <text x="290" y="60" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                Outer Track 0
              </text>
              <text x="290" y="145" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                Inner Track {maxCylinder}
              </text>
            </svg>
          </div>
        </div>

        {/* Status HUD & Playback Stepper */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                Actuator Position HUD
              </span>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {result.algorithm}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Current Cylinder</span>
                <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                  {currentCylinder}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Arm Deflection</span>
                <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                  {armAngle.toFixed(1)}°
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold block mb-0.5">Execution Status:</span>
              <p className="text-[12px] font-mono text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 p-2 rounded-lg border border-indigo-100 dark:border-indigo-900/60">
                {currentStatus}
              </p>
            </div>
          </div>

          {/* Stepper scrubber controls */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Step Progression</span>
              <span className="font-mono text-slate-500">
                {activeStep === -1 ? 'Full View' : `Step ${activeStep + 1} of ${result.steps.length}`}
              </span>
            </div>

            {/* Slider to drag through steps */}
            <input
              type="range"
              min="-1"
              max={result.steps.length - 1}
              value={activeStep}
              onChange={(e) => onStepChange(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />

            {/* Playback action buttons */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => onStepChange(-1)}
                title="Reset to overview"
                className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onStepChange(Math.max(-1, activeStep - 1))}
                disabled={activeStep <= -1}
                title="Previous cylinder step"
                className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onTogglePlay}
                id="btn-platter-play"
                className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'Pause Simulator' : 'Play Trajectory'}</span>
              </button>

              <button
                type="button"
                onClick={() => onStepChange(Math.min(result.steps.length - 1, activeStep + 1))}
                disabled={activeStep >= result.steps.length - 1}
                title="Next cylinder step"
                className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
