import React, { useEffect, useRef } from 'react';
import { CalculationResult } from '../types';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, ArrowRight, Flag, Navigation, Activity } from 'lucide-react';

interface MovementSequenceProps {
  result: CalculationResult;
  activeStep: number;
  onStepChange: (step: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export const MovementSequence: React.FC<MovementSequenceProps> = ({
  result,
  activeStep,
  onStepChange,
  isPlaying,
  onTogglePlay,
  speed,
  onSpeedChange,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Scroll active item into view
  useEffect(() => {
    if (activeStep >= 0 && scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector(`[data-step-node="${activeStep}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeStep]);

  const handleStepPrev = () => {
    onStepChange(Math.max(-1, activeStep - 1));
  };

  const handleStepNext = () => {
    onStepChange(Math.min(result.steps.length - 1, activeStep + 1));
  };

  const handleResetPlayback = () => {
    onStepChange(-1);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      {/* Header & Playback Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Navigation className="w-4 h-4 text-indigo-500" />
            Horizontal Head Movement Sequence
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Sequential traversal of disk cylinders from start to finish (Click any node to jump)
          </p>
        </div>

        {/* Step-by-Step Interactive Playback Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={handleResetPlayback}
              title="View full sequence overview"
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleStepPrev}
              disabled={activeStep <= -1}
              title="Previous Step"
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onTogglePlay}
              title={isPlaying ? 'Pause simulation' : 'Play trajectory step animation'}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              type="button"
              onClick={handleStepNext}
              disabled={activeStep >= result.steps.length - 1}
              title="Next Step"
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Speed selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pl-1">
            <span>Speed:</span>
            <select
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="text-xs font-mono bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <option value={1500}>0.5x</option>
              <option value={1000}>1x</option>
              <option value={500}>2x</option>
            </select>
          </div>
        </div>
      </div>

      {/* Step Status Indicator (during playback) */}
      {activeStep >= 0 && (
        <div className="flex items-center justify-between px-3 py-2 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-200/60 dark:border-indigo-900/50 text-xs">
          <span className="font-semibold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            Step {activeStep + 1} of {result.steps.length}: Transitioning from{' '}
            <strong className="font-mono">{result.steps[activeStep].from}</strong> to{' '}
            <strong className="font-mono">{result.steps[activeStep].to}</strong>
          </span>
          <span className="font-mono text-indigo-700 dark:text-indigo-300 font-bold">
            Seek: +{result.steps[activeStep].seekDistance} cyl ({result.steps[activeStep].direction})
          </span>
        </div>
      )}

      {/* Scrollable Horizontal Traversal Chain */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto pb-4 pt-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
      >
        <div className="inline-flex items-center min-w-full gap-2 px-2">
          {/* Initial Head Node */}
          <div
            data-step-node="initial"
            onClick={() => onStepChange(-1)}
            className={`flex flex-col items-center shrink-0 p-3 rounded-2xl border transition-all cursor-pointer ${
              activeStep === -1
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20 ring-2 ring-indigo-500/30 scale-105'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
            }`}
          >
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider opacity-85">
              <Flag className="w-3 h-3" /> Start Head
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono mt-0.5">
              {result.initialHead}
            </div>
            <span className="text-[10px] font-mono opacity-75">Initial Pos</span>
          </div>

          {/* Sequential Step Transitions and Target Nodes */}
          {result.steps.map((step, idx) => {
            const isStepActive = activeStep === idx;
            const isStepVisited = activeStep === -1 || idx <= activeStep;
            const isFinalNode = idx === result.steps.length - 1;

            return (
              <React.Fragment key={step.step}>
                {/* Arrow Connector with Seek Distance badge */}
                <div className={`flex flex-col items-center shrink-0 px-1 transition-opacity ${isStepVisited ? 'opacity-100' : 'opacity-30'}`}>
                  <span
                    className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border mb-1 whitespace-nowrap ${
                      isStepActive
                        ? 'bg-amber-400 text-slate-900 border-amber-500 animate-bounce'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    +{step.seekDistance}
                  </span>
                  <div className="flex items-center text-slate-400 dark:text-slate-600">
                    <div className={`h-0.5 w-6 sm:w-8 ${isStepVisited ? 'bg-indigo-500 dark:bg-indigo-400' : 'bg-slate-300 dark:bg-slate-700'}`} />
                    <ArrowRight className={`w-4 h-4 -ml-1 ${isStepVisited ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-700'}`} />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase mt-0.5">
                    {step.direction}
                  </span>
                </div>

                {/* Target Cylinder Node */}
                <div
                  data-step-node={idx}
                  onClick={() => onStepChange(idx)}
                  className={`flex flex-col items-center shrink-0 p-3 rounded-2xl border transition-all cursor-pointer ${
                    isStepActive
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/30 ring-4 ring-indigo-500/30 scale-105'
                      : isStepVisited
                      ? step.type === 'boundary'
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-800 hover:border-indigo-400'
                        : step.type === 'jump'
                        ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-800 hover:border-indigo-400'
                        : isFinalNode
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800 hover:border-indigo-400'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                      : 'bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 opacity-40 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                    {step.type === 'boundary' ? (
                      <span className={isStepActive ? 'text-amber-200' : 'text-amber-600 dark:text-amber-400'}>Boundary</span>
                    ) : step.type === 'jump' ? (
                      <span className={isStepActive ? 'text-purple-200' : 'text-purple-600 dark:text-purple-400'}>Jump</span>
                    ) : isFinalNode ? (
                      <span className={isStepActive ? 'text-emerald-200' : 'text-emerald-600 dark:text-emerald-400'}>Final End</span>
                    ) : (
                      <span>Step {step.step}</span>
                    )}
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-mono mt-0.5">
                    {step.to}
                  </div>
                  <span className="text-[10px] font-mono opacity-75">
                    Cylinder #{step.to}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Start Head
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600 border border-slate-400" /> Serviced Request
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Physical Boundary (0 or Max)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Circular Jump
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Final Serviced Track
        </span>
      </div>
    </div>
  );
};
