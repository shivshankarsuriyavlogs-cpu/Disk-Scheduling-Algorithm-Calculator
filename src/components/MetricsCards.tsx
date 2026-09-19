import React, { useState } from 'react';
import { CalculationResult } from '../types';
import { Activity, Gauge, CheckSquare, Compass, Copy, Check, Download, Printer } from 'lucide-react';
import { copySummaryToClipboard, downloadCSV } from '../utils/export';

interface MetricsCardsProps {
  result: CalculationResult;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copySummaryToClipboard(result);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Construct mathematical seek formula string
  const formulaSegments = result.steps.map(s => `|${s.to} - ${s.from}|`);
  const valueSegments = result.steps.map(s => s.seekDistance);

  return (
    <div className="space-y-4">
      {/* Top Banner with prominent Total Head Movement display and Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/15 relative overflow-hidden">
        {/* Background glow decoration */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-mono font-bold tracking-wide">
                {result.algorithm} ALGORITHM
              </span>
              {result.direction && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/50 text-indigo-100 text-xs font-mono">
                  Initial Direction: {result.direction}
                </span>
              )}
            </div>
            <p className="text-indigo-100 text-sm font-medium">Computed Performance Metrics</p>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-mono mt-1">
              Total Head Movement: <span className="underline decoration-sky-300 decoration-wavy underline-offset-8">{result.totalHeadMovement}</span> <span className="text-xl sm:text-2xl font-normal text-indigo-200">cylinders</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleCopy}
              id="btn-copy-summary"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/30 text-white text-xs font-semibold backdrop-blur-sm transition-colors cursor-pointer border border-white/20"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied to Clipboard' : 'Copy Summary'}
            </button>
            <button
              onClick={() => downloadCSV(result)}
              id="btn-download-csv"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/30 text-white text-xs font-semibold backdrop-blur-sm transition-colors cursor-pointer border border-white/20"
            >
              <Download className="w-3.5 h-3.5" />
              Download CSV
            </button>
            <button
              onClick={handlePrint}
              id="btn-print-results"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/30 text-white text-xs font-semibold backdrop-blur-sm transition-colors cursor-pointer border border-white/20"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* 4 Detail Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Movement */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Seek
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white">
              {result.totalHeadMovement}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cylinders traversed
            </div>
          </div>
        </div>

        {/* Average Seek Distance */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Average Seek
            </span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white">
              {result.averageSeekDistance}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cylinders per request ({result.totalHeadMovement} / {result.requestCount})
            </div>
          </div>
        </div>

        {/* Serviced Requests */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Requests Serviced
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white">
              {result.requestCount}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {result.steps.length} head transitions executed
            </div>
          </div>
        </div>

        {/* Initial & Final Position */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Head Trajectory
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{result.initialHead}</span>
              <span className="text-slate-400 text-base">→</span>
              <span>{result.serviceOrder[result.serviceOrder.length - 1]}</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Start pos to final serviced track
            </div>
          </div>
        </div>
      </div>

      {/* Formula & Calculation Math Walkthrough */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
        <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
          Mathematical Calculation Breakdown
        </div>
        <div className="space-y-1.5 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 overflow-x-auto pb-1">
          <div className="text-slate-500 dark:text-slate-400">
            Total Head Movement (THM) = <span className="text-indigo-600 dark:text-indigo-400">{formulaSegments.join(' + ')}</span>
          </div>
          <div className="text-slate-600 dark:text-slate-300">
            = {valueSegments.join(' + ')}
          </div>
          <div className="font-bold text-slate-900 dark:text-white pt-1">
            = {result.totalHeadMovement} cylinders
          </div>
        </div>
      </div>
    </div>
  );
};
