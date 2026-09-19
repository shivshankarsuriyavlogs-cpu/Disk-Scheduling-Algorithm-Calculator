import React, { useState } from 'react';
import { CalculationResult } from '../types';
import { Table, ArrowRight, Download, Copy, Check, Filter } from 'lucide-react';
import { downloadCSV, copySummaryToClipboard } from '../utils/export';

interface ResultsTableProps {
  result: CalculationResult;
  activeStep?: number;
  onSelectStep?: (step: number) => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ result, activeStep = -1, onSelectStep }) => {
  const [copied, setCopied] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const handleCopy = async () => {
    const ok = await copySummaryToClipboard(result);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredSteps = result.steps.filter((s) => {
    if (filterType === 'all') return true;
    return s.type === filterType;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Table Header with Actions */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-950/30">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Table className="w-4 h-4 text-indigo-500" />
            Detailed Head Movement Breakdown Table
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Step-by-step cylinder transitions, individual seek distances, and cumulative movement
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent border-none text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Steps ({result.steps.length})</option>
              <option value="request">Requests Only</option>
              <option value="boundary">Boundaries</option>
              <option value="jump">Jumps</option>
            </select>
          </div>

          <button
            onClick={handleCopy}
            id="btn-table-copy"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button
            onClick={() => downloadCSV(result)}
            id="btn-table-download-csv"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-xs uppercase font-mono tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 px-4 font-semibold">Step</th>
              <th className="py-3 px-4 font-semibold">Current Pos</th>
              <th className="py-3 px-4 font-semibold">Next Request</th>
              <th className="py-3 px-4 font-semibold text-right">Movement</th>
              <th className="py-3 px-4 font-semibold text-center">Direction</th>
              <th className="py-3 px-4 font-semibold text-right">Cumulative</th>
              <th className="py-3 px-4 font-semibold">Step Category</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono text-xs sm:text-sm">
            {filteredSteps.map((step) => {
              const isBoundary = step.type === 'boundary';
              const isJump = step.type === 'jump';
              const isRowActive = activeStep === step.step - 1;

              return (
                <tr
                  key={step.step}
                  onClick={() => onSelectStep && onSelectStep(step.step - 1)}
                  className={`cursor-pointer transition-colors ${
                    isRowActive
                      ? 'bg-indigo-100/90 dark:bg-indigo-950/80 font-bold ring-2 ring-indigo-500/80'
                      : isBoundary
                      ? 'bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                      : isJump
                      ? 'bg-purple-50/40 dark:bg-purple-950/20 hover:bg-purple-50 dark:hover:bg-purple-950/40'
                      : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    {isRowActive && <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse shrink-0" />}
                    #{step.step}
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                    {step.from}
                  </td>
                  <td className="py-3 px-4 text-slate-900 dark:text-white font-bold">
                    <span className="inline-flex items-center gap-1.5">
                      {step.to}
                      {step.step === result.steps.length && (
                        <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                          Final
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-indigo-600 dark:text-indigo-400">
                    +{step.seekDistance}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        step.direction === 'Right'
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {step.direction}
                      <ArrowRight className={`w-3 h-3 ${step.direction === 'Left' ? 'rotate-180' : ''}`} />
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-800 dark:text-slate-200">
                    {step.cumulativeMovement}
                  </td>
                  <td className="py-3 px-4 font-sans text-xs">
                    {isBoundary ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 font-medium">
                        Disk Boundary
                      </span>
                    ) : isJump ? (
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:purple-900/60 text-purple-800 dark:text-purple-200 font-medium">
                        Circular Jump
                      </span>
                    ) : (
                      <span className="text-slate-600 dark:text-slate-400">
                        Request Serviced
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Table Summary Footer */}
          <tfoot className="bg-slate-50 dark:bg-slate-950/80 border-t-2 border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-mono">
            <tr>
              <td colSpan={3} className="py-3.5 px-4 font-bold text-slate-900 dark:text-white font-sans">
                Total Head Movement
              </td>
              <td className="py-3.5 px-4 text-right font-extrabold text-base text-indigo-600 dark:text-indigo-400">
                {result.totalHeadMovement} cylinders
              </td>
              <td colSpan={3} className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-sans text-xs">
                Across {result.steps.length} sequential transitions
              </td>
            </tr>
            <tr className="border-t border-slate-200 dark:border-slate-800">
              <td colSpan={3} className="py-3.5 px-4 font-bold text-slate-900 dark:text-white font-sans">
                Average Seek Distance
              </td>
              <td className="py-3.5 px-4 text-right font-extrabold text-base text-sky-600 dark:text-sky-400">
                {result.averageSeekDistance} cylinders
              </td>
              <td colSpan={3} className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-sans text-xs">
                Formula: {result.totalHeadMovement} / {result.requestCount} requests
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
