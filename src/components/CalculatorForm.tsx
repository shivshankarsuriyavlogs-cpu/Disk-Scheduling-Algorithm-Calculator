import React from 'react';
import { AlgorithmType, Direction, ValidationResult } from '../types';
import { Play, RotateCcw, Sparkles, ArrowLeft, ArrowRight, Dices, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CalculatorFormProps {
  queueInput: string;
  headInput: string;
  diskSizeInput: string;
  direction: Direction;
  selectedAlgorithm: AlgorithmType;
  validation: ValidationResult;
  onQueueChange: (val: string) => void;
  onHeadChange: (val: string) => void;
  onDiskSizeChange: (val: string) => void;
  onDirectionChange: (dir: Direction) => void;
  onAlgorithmChange: (algo: AlgorithmType) => void;
  onCalculate: () => void;
  onReset: () => void;
  onLoadExample: () => void;
  onGenerateRandom: () => void;
}

const ALGORITHMS: { type: AlgorithmType; label: string; desc: string; needsDirection: boolean }[] = [
  { type: 'FCFS', label: 'FCFS', desc: 'First Come First Serve', needsDirection: false },
  { type: 'SSTF', label: 'SSTF', desc: 'Shortest Seek Time First', needsDirection: false },
  { type: 'SCAN', label: 'SCAN', desc: 'Elevator Algorithm (reaches boundary)', needsDirection: true },
  { type: 'C-SCAN', label: 'C-SCAN', desc: 'Circular SCAN (unidirectional)', needsDirection: true },
  { type: 'LOOK', label: 'LOOK', desc: 'LOOK (reverses at extremes)', needsDirection: true },
  { type: 'C-LOOK', label: 'C-LOOK', desc: 'Circular LOOK (jumps between requests)', needsDirection: true },
];

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  queueInput,
  headInput,
  diskSizeInput,
  direction,
  selectedAlgorithm,
  validation,
  onQueueChange,
  onHeadChange,
  onDiskSizeChange,
  onDirectionChange,
  onAlgorithmChange,
  onCalculate,
  onReset,
  onLoadExample,
  onGenerateRandom,
}) => {
  const currentAlgoConfig = ALGORITHMS.find(a => a.type === selectedAlgorithm);
  const requiresDirection = currentAlgoConfig?.needsDirection ?? false;

  const diskSizeNum = Number(diskSizeInput) || 200;
  const maxCylinder = Math.max(0, diskSizeNum - 1);

  // Form submit handler on Enter key
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate();
  };

  return (
    <div id="calculator" className="scroll-mt-20">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-200">
        {/* Card Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              Configure Simulation Parameters
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Enter track requests or load textbook standard datasets.
            </p>
          </div>

          {/* Quick presets buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onLoadExample}
              id="btn-load-example"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Load Example
            </button>
            <button
              type="button"
              onClick={onGenerateRandom}
              title="Generate random cylinder requests"
              id="btn-random-queue"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Dices className="w-3.5 h-3.5" />
              Random
            </button>
          </div>
        </div>

        {/* Card Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Algorithm Selector Cards */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
              Select Disk Scheduling Algorithm
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {ALGORITHMS.map((algo) => {
                const isSelected = selectedAlgorithm === algo.type;
                return (
                  <button
                    key={algo.type}
                    type="button"
                    onClick={() => onAlgorithmChange(algo.type)}
                    id={`btn-algo-${algo.type.toLowerCase()}`}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/50 dark:border-indigo-500 shadow-sm ring-2 ring-indigo-600/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className={`text-base font-bold font-mono ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {algo.label}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      {algo.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Request Queue */}
            <div className="md:col-span-12">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="request-queue-input" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Request Queue (Cylinder Track Numbers)
                </label>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Comma or space separated (e.g. 98, 183, 37, 122, 14, 124, 65, 67)
                </span>
              </div>
              <div className="relative">
                <input
                  id="request-queue-input"
                  type="text"
                  value={queueInput}
                  onChange={(e) => onQueueChange(e.target.value)}
                  placeholder="e.g. 98, 183, 37, 122, 14, 124, 65, 67"
                  className={`w-full px-4 py-3 rounded-xl border font-mono text-sm sm:text-base bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2 ${
                    validation.errors.requestQueue
                      ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {validation.errors.requestQueue ? (
                <p className="mt-1.5 text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {validation.errors.requestQueue}
                </p>
              ) : (
                <div className="mt-1.5 flex flex-wrap items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <span>Parsed Requests:</span>
                  {validation.parsedQueue && validation.parsedQueue.length > 0 ? (
                    <span className="font-mono font-medium text-indigo-600 dark:text-indigo-400">
                      {validation.parsedQueue.length} cylinders [{validation.parsedQueue.join(', ')}]
                    </span>
                  ) : (
                    <span>None</span>
                  )}
                </div>
              )}
            </div>

            {/* Initial Head Position */}
            <div className="md:col-span-4">
              <label htmlFor="initial-head-input" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                Initial Head Position
              </label>
              <div className="relative">
                <input
                  id="initial-head-input"
                  type="number"
                  min="0"
                  max={maxCylinder}
                  value={headInput}
                  onChange={(e) => onHeadChange(e.target.value)}
                  placeholder="e.g. 53"
                  className={`w-full px-4 py-2.5 rounded-xl border font-mono text-sm sm:text-base bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2 ${
                    validation.errors.initialHead
                      ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {validation.errors.initialHead ? (
                <p className="mt-1 text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {validation.errors.initialHead}
                </p>
              ) : (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Starting cylinder track (0 - {maxCylinder})
                </p>
              )}
            </div>

            {/* Disk Size */}
            <div className="md:col-span-4">
              <label htmlFor="disk-size-input" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                Total Disk Cylinders
              </label>
              <div className="relative">
                <input
                  id="disk-size-input"
                  type="number"
                  min="2"
                  max="100000"
                  value={diskSizeInput}
                  onChange={(e) => onDiskSizeChange(e.target.value)}
                  placeholder="e.g. 200"
                  className={`w-full px-4 py-2.5 rounded-xl border font-mono text-sm sm:text-base bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2 ${
                    validation.errors.diskSize
                      ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {validation.errors.diskSize ? (
                <p className="mt-1 text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {validation.errors.diskSize}
                </p>
              ) : (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Range: 0 to {maxCylinder}
                </p>
              )}
            </div>

            {/* Direction Selector */}
            <div className="md:col-span-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Initial Direction
                </label>
                {!requiresDirection && (
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    Not needed for {selectedAlgorithm}
                  </span>
                )}
              </div>

              {requiresDirection ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onDirectionChange('Left')}
                    id="btn-dir-left"
                    className={`py-2.5 px-3 rounded-xl border font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      direction === 'Left'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/20'
                        : 'bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Left (Towards 0)
                  </button>
                  <button
                    type="button"
                    onClick={() => onDirectionChange('Right')}
                    id="btn-dir-right"
                    className={`py-2.5 px-3 rounded-xl border font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      direction === 'Right'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/20'
                        : 'bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    Right (Towards {maxCylinder})
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="py-2.5 px-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-800/30 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 select-none">
                  Direction is not used by {selectedAlgorithm}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onReset}
              id="btn-calc-reset"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              Reset
            </button>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                id="btn-calc-submit"
                disabled={!validation.isValid}
                className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all cursor-pointer ${
                  validation.isValid
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                    : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                Calculate {selectedAlgorithm}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
