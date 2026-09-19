import React from 'react';
import { HardDrive, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 dark:text-white">
                Disk Scheduling Algorithm Calculator
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                “An interactive Operating Systems learning tool.”
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <button
              onClick={() => scrollToSection('#calculator')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Calculator
            </button>
            <button
              onClick={() => scrollToSection('#visualization')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Visualization
            </button>
            <button
              onClick={() => scrollToSection('#comparison')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Comparison
            </button>
            <button
              onClick={() => scrollToSection('#algorithms')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Algorithms
            </button>
            <button
              onClick={() => scrollToSection('#about')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={scrollToTop}
              title="Back to top"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer ml-2"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
          <div>
            © 2026 Disk Scheduling Algorithm Calculator. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>FCFS • SSTF • SCAN • C-SCAN • LOOK • C-LOOK</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
