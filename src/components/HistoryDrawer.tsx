import React from 'react';
import { HistoryEntry } from '../types';
import { X, Trash2, Clock, RotateCcw, ArrowRight } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onSelectEntry: (entry: HistoryEntry) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectEntry,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Calculation History
              </h2>
            </div>
            <button
              onClick={onClose}
              id="btn-close-history"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400 space-y-3">
                <Clock className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 stroke-1" />
                <p className="text-sm font-medium">No previous calculations recorded yet.</p>
                <p className="text-xs text-slate-400">
                  Run any calculation in the calculator and it will be saved here automatically.
                </p>
              </div>
            ) : (
              history.map((entry) => {
                const dateStr = new Date(entry.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                });

                return (
                  <div
                    key={entry.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {entry.algorithm}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{dateStr}</span>
                    </div>

                    <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                      <div>
                        Queue: <strong className="font-mono">[{entry.requestQueue.join(', ')}]</strong>
                      </div>
                      <div className="flex items-center gap-3">
                        <span>Head: <strong className="font-mono">{entry.initialHead}</strong></span>
                        <span>Size: <strong className="font-mono">{entry.diskSize}</strong></span>
                        {entry.direction && <span>Dir: <strong className="font-mono">{entry.direction}</strong></span>}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        Total Seek: <strong className="font-mono text-indigo-600 dark:text-indigo-400">{entry.totalHeadMovement}</strong> cyl
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectEntry(entry);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        Restore
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          {history.length > 0 && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
              <button
                type="button"
                onClick={onClearHistory}
                id="btn-clear-history"
                className="w-full py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Calculation History
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
