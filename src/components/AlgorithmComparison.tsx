import React, { useState } from 'react';
import { ComparisonItem, AlgorithmType } from '../types';
import { BarChart3, ArrowRight, Copy, Check, Info } from 'lucide-react';
import { copyComparisonToClipboard } from '../utils/export';

interface AlgorithmComparisonProps {
  comparisonItems: ComparisonItem[];
  initialHead: number;
  requestQueue: number[];
  onSelectAlgorithm: (algo: AlgorithmType) => void;
  currentSelectedAlgo: AlgorithmType;
}

export const AlgorithmComparison: React.FC<AlgorithmComparisonProps> = ({
  comparisonItems,
  initialHead,
  requestQueue,
  onSelectAlgorithm,
  currentSelectedAlgo,
}) => {
  const [copied, setCopied] = useState(false);

  // Maximum movement for relative bar scaling
  const maxMovement = Math.max(...comparisonItems.map(i => i.totalMovement), 1);

  const handleCopy = async () => {
    const ok = await copyComparisonToClipboard(comparisonItems, initialHead, requestQueue);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="comparison" className="scroll-mt-20 space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-950/30">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              Compare Algorithms
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Side-by-side performance evaluation for the current queue across all 6 disk scheduling strategies
            </p>
          </div>

          <button
            onClick={handleCopy}
            id="btn-copy-comparison"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer self-start sm:self-auto"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Comparison Copied' : 'Copy Comparison'}
          </button>
        </div>

        {/* Visual Bar Comparison Chart */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-4">
            Total Head Movement (Cylinders) Comparison Chart
          </div>
          <div className="space-y-3">
            {comparisonItems.map((item) => {
              const percentage = Math.max(8, (item.totalMovement / maxMovement) * 100);
              const isSelected = item.algorithm === currentSelectedAlgo;

              return (
                <div key={item.algorithm} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <button
                      onClick={() => onSelectAlgorithm(item.algorithm)}
                      className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                    >
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-indigo-600' : 'bg-slate-400'}`} />
                      {item.algorithm} ({item.name})
                    </button>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.totalMovement} cyl
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="w-full h-3.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-600 to-sky-500'
                          : 'bg-slate-400 dark:bg-slate-600 hover:bg-indigo-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-xs uppercase font-mono tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Algorithm</th>
                <th className="py-3 px-4 font-semibold text-right">Total Movement</th>
                <th className="py-3 px-4 font-semibold text-right">Average Seek</th>
                <th className="py-3 px-4 font-semibold">Service Sequence</th>
                <th className="py-3 px-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono text-xs sm:text-sm">
              {comparisonItems.map((item) => {
                const isSelected = item.algorithm === currentSelectedAlgo;

                return (
                  <tr
                    key={item.algorithm}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                      isSelected ? 'bg-indigo-50/60 dark:bg-indigo-950/30' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white font-sans">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {item.algorithm}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-normal text-slate-500 dark:text-slate-400 font-sans">
                        {item.name}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 dark:text-white text-base">
                      {item.totalMovement}
                      <span className="text-xs font-normal text-slate-500 ml-1">cyl</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-sky-600 dark:text-sky-400">
                      {item.averageSeek}
                      <span className="text-xs font-normal text-slate-500 ml-1">cyl</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate text-xs" title={item.serviceOrder.join(' → ')}>
                      {item.serviceOrder.join(' → ')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onSelectAlgorithm(item.algorithm)}
                        id={`btn-view-${item.algorithm.toLowerCase()}`}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {isSelected ? 'Viewing' : 'Inspect'}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* User Interpretation Guide Notice */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
          <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <strong>Interpreting the Results:</strong> While algorithms like SSTF, LOOK, or C-LOOK often reduce total cylinder movement for specific queues, each algorithm has distinct trade-offs in real operating systems. For example, SSTF can lead to starvation for requests far from the current head position; FCFS is completely starvation-free and fair despite higher seek latency; C-SCAN and C-LOOK provide much more uniform waiting times across all cylinders.
          </div>
        </div>
      </div>
    </section>
  );
};
