import React, { useState } from 'react';
import { CalculationResult } from '../types';
import { LineChart, Eye, Info } from 'lucide-react';

interface DiskChartProps {
  result: CalculationResult;
  activeStep?: number;
  onSelectStep?: (step: number) => void;
}

export const DiskChart: React.FC<DiskChartProps> = ({ result, activeStep = -1, onSelectStep }) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    index: number;
    cylinder: number;
    seekDistance?: number;
    step?: number;
    type: string;
    note?: string;
  } | null>(null);

  const diskSize = result.diskSize || 200;
  const maxCylinder = diskSize - 1;

  // Chart dimensions inside SVG viewBox
  const width = 800;
  const height = 400;
  const paddingLeft = 55;
  const paddingRight = 45;
  const paddingTop = 40;
  const paddingBottom = 45;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const totalSteps = result.serviceOrder.length; // e.g. 9 or 10 points
  const yStepSize = totalSteps > 1 ? chartHeight / (totalSteps - 1) : chartHeight / 2;

  // Coordinate mapper
  const getX = (cylinder: number) => {
    return paddingLeft + (cylinder / maxCylinder) * chartWidth;
  };

  const getY = (stepIndex: number) => {
    return paddingTop + stepIndex * yStepSize;
  };

  // Cylinder axis ticks
  const tickCount = 6;
  const ticks = Array.from({ length: tickCount }, (_, i) => Math.round((i * maxCylinder) / (tickCount - 1)));

  // Points list
  const points = result.serviceOrder.map((cyl, idx) => {
    const stepInfo = idx === 0 ? null : result.steps[idx - 1];
    return {
      index: idx,
      cylinder: cyl,
      x: getX(cyl),
      y: getY(idx),
      step: idx === 0 ? 0 : stepInfo?.step,
      seekDistance: stepInfo?.seekDistance,
      direction: stepInfo?.direction,
      type: idx === 0 ? 'initial' : stepInfo?.type || 'request',
      note: idx === 0 ? 'Initial Head Position' : stepInfo?.note,
    };
  });

  // Determine active point index
  const activePointIndex = activeStep === -1 ? null : activeStep === -2 ? 0 : activeStep + 1;

  return (
    <div id="visualization" className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <LineChart className="w-4 h-4 text-indigo-500" />
            Textbook Head Trajectory Plot (0 → {maxCylinder})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Standard Operating Systems cylinder trajectory diagram (Cylinder axis vs. Step time sequence)
          </p>
        </div>

        {/* Hover info / current selection status */}
        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 self-start sm:self-auto">
          <Eye className="w-3.5 h-3.5 text-indigo-500" />
          {hoveredPoint ? (
            <span>
              {hoveredPoint.index === 0 ? 'Start Head' : `Step ${hoveredPoint.step}`}: Cylinder{' '}
              <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{hoveredPoint.cylinder}</strong>
              {hoveredPoint.seekDistance !== undefined && ` (+${hoveredPoint.seekDistance} cyl)`}
            </span>
          ) : activePointIndex !== null && points[activePointIndex] ? (
            <span>
              Active Track: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{points[activePointIndex].cylinder}</strong>
              {points[activePointIndex].index === 0 ? ' (Start)' : ` (Step ${points[activePointIndex].step})`}
            </span>
          ) : (
            <span>Click any trajectory point or hover to inspect details</span>
          )}
        </div>
      </div>

      {/* SVG Interactive Trajectory Chart */}
      <div className="relative w-full overflow-hidden rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/60 p-2 sm:p-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          style={{ maxHeight: '460px' }}
        >
          <defs>
            <linearGradient id="pathGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#4f46e5" floodOpacity="0.4" />
            </filter>
            <filter id="activeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#38bdf8" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Vertical cylinder grid lines */}
          {ticks.map((tickVal) => {
            const xPos = getX(tickVal);
            return (
              <g key={tickVal}>
                <line
                  x1={xPos}
                  y1={paddingTop - 10}
                  x2={xPos}
                  y2={height - paddingBottom}
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={xPos}
                  y={paddingTop - 16}
                  textAnchor="middle"
                  className="fill-slate-500 dark:fill-slate-400 font-mono text-[11px] font-medium"
                >
                  {tickVal}
                </text>
              </g>
            );
          })}

          {/* Top cylinder axis line */}
          <line
            x1={paddingLeft}
            y1={paddingTop - 10}
            x2={width - paddingRight}
            y2={paddingTop - 10}
            className="stroke-slate-300 dark:stroke-slate-700"
            strokeWidth="1.5"
          />

          {/* Horizontal Step sequence grid lines */}
          {points.map((pt) => (
            <g key={`y-${pt.index}`}>
              <line
                x1={paddingLeft}
                y1={pt.y}
                x2={width - paddingRight}
                y2={pt.y}
                className="stroke-slate-200/60 dark:stroke-slate-800/40"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 12}
                y={pt.y + 3.5}
                textAnchor="end"
                className="fill-slate-400 dark:fill-slate-500 font-mono text-[10px]"
              >
                {pt.index === 0 ? 'Start' : `T${pt.index}`}
              </text>
            </g>
          ))}

          {/* Path segments connecting consecutive cylinders */}
          {points.map((pt, i) => {
            if (i === points.length - 1) return null;
            const nextPt = points[i + 1];
            const isJump = nextPt.type === 'jump';
            const isStepActive = activePointIndex !== null && i < activePointIndex;

            return (
              <g key={`seg-${i}`}>
                <line
                  x1={pt.x}
                  y1={pt.y}
                  x2={nextPt.x}
                  y2={nextPt.y}
                  stroke={isJump ? '#a855f7' : isStepActive ? '#06b6d4' : 'url(#pathGradient)'}
                  strokeWidth={isJump ? '2' : isStepActive ? '3.5' : '3'}
                  strokeDasharray={isJump ? '4 4' : 'none'}
                  strokeLinecap="round"
                  filter={isJump ? undefined : 'url(#glow)'}
                />
              </g>
            );
          })}

          {/* Trajectory Points */}
          {points.map((pt) => {
            const isHovered = hoveredPoint?.index === pt.index;
            const isInitial = pt.index === 0;
            const isFinal = pt.index === points.length - 1;
            const isBoundary = pt.type === 'boundary';
            const isJump = pt.type === 'jump';
            const isActive = activePointIndex === pt.index;

            let fillColor = '#4f46e5'; // Indigo default
            if (isInitial) fillColor = '#6366f1';
            else if (isBoundary) fillColor = '#f59e0b'; // Amber
            else if (isJump) fillColor = '#a855f7'; // Purple
            else if (isFinal) fillColor = '#10b981'; // Emerald

            return (
              <g
                key={`pt-${pt.index}`}
                className="cursor-pointer transition-transform"
                onClick={() => {
                  if (onSelectStep) {
                    onSelectStep(pt.index === 0 ? -1 : pt.index - 1);
                  }
                }}
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Active pulsating beacon ring */}
                {isActive && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="15"
                    fill="#38bdf8"
                    fillOpacity="0.35"
                    filter="url(#activeGlow)"
                    className="animate-ping"
                  />
                )}

                {/* Outer ring for hover, key points, or active */}
                {(isHovered || isInitial || isFinal || isActive) && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isActive ? 14 : isHovered ? 12 : 9}
                    fill={isActive ? '#38bdf8' : fillColor}
                    fillOpacity={isActive ? '0.3' : '0.25'}
                    className="transition-all duration-150"
                  />
                )}

                {/* Point dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isActive ? 7 : isHovered ? 6 : isInitial || isFinal || isBoundary ? 5 : 4}
                  fill={isActive ? '#0284c7' : fillColor}
                  stroke="#ffffff"
                  strokeWidth={isActive ? 3 : isHovered ? 2.5 : 1.5}
                />

                {/* Cylinder label right above/below point */}
                <text
                  x={pt.x}
                  y={pt.y + (pt.index % 2 === 0 ? -10 : 16)}
                  textAnchor="middle"
                  className={`font-mono text-[10px] font-bold ${
                    isActive ? 'fill-sky-600 dark:fill-sky-300 font-extrabold text-[11px]' : 'fill-slate-800 dark:fill-slate-100'
                  }`}
                >
                  {pt.cylinder}
                </text>
              </g>
            );
          })}

          {/* Bottom axis label */}
          <text
            x={width / 2}
            y={height - 12}
            textAnchor="middle"
            className="fill-slate-500 dark:fill-slate-400 text-xs font-semibold"
          >
            Disk Cylinder Track Number (Range: 0 to {maxCylinder})
          </text>

          {/* Left axis label */}
          <text
            x={-(height / 2)}
            y="16"
            transform="rotate(-90)"
            textAnchor="middle"
            className="fill-slate-400 dark:fill-slate-500 text-[11px] font-medium"
          >
            Time / Service Sequence Progression ↓
          </text>
        </svg>
      </div>

      {/* Interactive Helper Banner */}
      <div className="flex items-center gap-2 p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-300">
        <Info className="w-4 h-4 text-indigo-500 shrink-0" />
        <span>
          <strong>How to read this chart:</strong> Cylinders are plotted horizontally from track 0 to {maxCylinder}. The line tracks the head movement downwards over time. Click any point on the trajectory line to inspect or jump the actuator arm directly there.
        </span>
      </div>
    </div>
  );
};
