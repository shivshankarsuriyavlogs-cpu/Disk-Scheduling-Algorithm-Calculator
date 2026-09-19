import { ArrowRight, BookOpen, Layers, Disc, Play } from 'lucide-react';

interface HeroProps {
  onStartCalculating: () => void;
  onExploreAlgorithms: () => void;
}

export const Hero = ({ onStartCalculating, onExploreAlgorithms }: HeroProps) => {
  return (
    <section id="home" className="relative pt-12 pb-16 md:pt-16 md:pb-20 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/60 dark:border-indigo-800/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Operating Systems Courseware & Simulator
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Disk Scheduling <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 dark:from-indigo-400 dark:via-sky-400 dark:to-blue-400">
                Algorithm Calculator
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Analyze disk scheduling algorithms, calculate total head movement, and visualize disk-head operations in real time.
            </p>

            {/* Quick Algorithm Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              {['FCFS', 'SSTF', 'SCAN', 'C-SCAN', 'LOOK', 'C-LOOK'].map((algo) => (
                <span
                  key={algo}
                  className="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  {algo}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onStartCalculating}
                id="btn-hero-start"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-base shadow-lg shadow-indigo-600/25 transition-all cursor-pointer group"
              >
                <Play className="w-4 h-4 fill-current" />
                Start Calculating
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreAlgorithms}
                id="btn-hero-explore"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-base border border-slate-300 dark:border-slate-700 transition-colors shadow-sm cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-indigo-500" />
                Explore Algorithms
              </button>
            </div>

            {/* Educational stats */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-800/80 text-center lg:text-left">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">6</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Core Algorithms</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">100%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Accurate Seek Math</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">Real-Time</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Gantt & Disk Charts</div>
              </div>
            </div>
          </div>

          {/* Hero Right Visual: Interactive Hard Disk Platter & Actuator Arm Simulator */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 sm:w-80 h-72 sm:h-80 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-2xl border border-slate-800 flex flex-col justify-between text-slate-200">
              {/* Hard Drive Chassis Frame */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5">
                  <Disc className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} />
                  HDD_SPINDLE // 7200 RPM
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[10px]">
                  ACTIVE SEEK
                </span>
              </div>

              {/* Disk Platter Graphics */}
              <div className="relative flex-1 flex items-center justify-center my-2">
                {/* Concentric cylinder tracks */}
                <div className="relative w-48 h-48 sm:w-52 sm:h-52 rounded-full border-4 border-slate-700/60 bg-gradient-to-tr from-slate-800/70 via-slate-900 to-slate-800/40 flex items-center justify-center shadow-inner">
                  {/* Track 3 */}
                  <div className="w-40 h-40 rounded-full border border-dashed border-indigo-500/40 flex items-center justify-center">
                    {/* Track 2 */}
                    <div className="w-28 h-28 rounded-full border border-slate-600/60 flex items-center justify-center">
                      {/* Track 1 (Inner) */}
                      <div className="w-16 h-16 rounded-full border border-dashed border-sky-400/40 flex items-center justify-center">
                        {/* Spindle Hub */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-700 shadow-md flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-slate-950" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actuator Arm */}
                  <div
                    className="absolute top-1/2 left-1/2 w-32 h-2 origin-left -translate-y-1/2 bg-gradient-to-r from-slate-400 via-slate-300 to-amber-400 shadow-lg rounded-full pointer-events-none transition-transform duration-700 ease-out"
                    style={{ transform: 'rotate(-25deg)' }}
                  >
                    {/* Read/Write Head Tip with laser glow */}
                    <div className="absolute -right-1 -top-1.5 w-4 h-5 bg-amber-400 rounded-sm shadow-[0_0_12px_rgba(251,191,36,0.9)] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    </div>
                  </div>
                </div>

                {/* Cylinder Track Labels */}
                <span className="absolute top-2 left-6 text-[10px] font-mono text-slate-500">Cyl 0</span>
                <span className="absolute bottom-2 right-6 text-[10px] font-mono text-slate-500">Cyl 199</span>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between text-[11px] font-mono bg-slate-900/90 rounded-xl px-3 py-2 border border-slate-800 text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" /> Track: <strong className="text-white">53 → 65</strong>
                </span>
                <span className="text-indigo-400">Head Seek Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
