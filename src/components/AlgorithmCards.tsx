import React from 'react';
import { AlgorithmType } from '../types';
import { BookOpen, Layers, Clock, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface AlgorithmCardsProps {
  onSelectAlgorithm: (algo: AlgorithmType) => void;
}

interface AlgorithmCardData {
  type: AlgorithmType;
  title: string;
  subtitle: string;
  explanation: string;
  workingPrinciple: string;
  mainCharacteristic: string;
  starvationRisk: 'None' | 'Possible' | 'High';
  pros: string;
  cons: string;
}

const ALGORITHM_INFO: AlgorithmCardData[] = [
  {
    type: 'FCFS',
    title: 'First Come First Serve',
    subtitle: 'Simplest FIFO Request Servicing',
    explanation:
      'Services disk I/O requests in the strict chronological order of their arrival in the queue, without reordering tracks for positional proximity.',
    workingPrinciple:
      'The disk arm moves directly from its current cylinder to the target cylinder of the next pending request in the queue, regardless of whether closer requests exist.',
    mainCharacteristic:
      'Completely fair with zero risk of starvation, but typically exhibits the highest total head movement and wild arm swings across disk platters.',
    starvationRisk: 'None',
    pros: 'Simple to program, completely fair to all processes, no starvation.',
    cons: 'High average seek time, inefficient for heavily loaded multi-process systems.',
  },
  {
    type: 'SSTF',
    title: 'Shortest Seek Time First',
    subtitle: 'Greedy Proximity Optimization',
    explanation:
      'Selects the pending request with the minimum seek distance from the current disk head position before servicing further requests.',
    workingPrinciple:
      'At each step, the scheduler evaluates all remaining cylinder requests in the pending queue and selects min(|target - current_head|).',
    mainCharacteristic:
      'Substantially reduces total seek movement compared to FCFS, but introduces severe starvation risk for peripheral or isolated disk requests.',
    starvationRisk: 'High',
    pros: 'Greatly minimizes overall seek latency and maximizes disk throughput.',
    cons: 'Can cause starvation for cylinders located far away from dense request clusters.',
  },
  {
    type: 'SCAN',
    title: 'SCAN (Elevator Algorithm)',
    subtitle: 'Bidirectional Cylinder Sweep to Boundaries',
    explanation:
      'The disk arm behaves like a building elevator, traveling from one physical end of the disk to the other, servicing requests on its way.',
    workingPrinciple:
      'Moves in a chosen direction servicing all requests encountered until it reaches the physical boundary (cylinder 0 or max), then reverses direction and services requests on the return sweep.',
    mainCharacteristic:
      'Guarantees upper bound on waiting time while reducing seek distance compared to FCFS by ordering requests along monotonic sweeps.',
    starvationRisk: 'None',
    pros: 'High throughput, low seek latency, eliminates starvation completely.',
    cons: 'Forces head to travel all the way to disk physical boundaries even when no requests exist there.',
  },
  {
    type: 'C-SCAN',
    title: 'Circular SCAN (C-SCAN)',
    subtitle: 'Unidirectional Sweep with Instant Return',
    explanation:
      'A variation of SCAN designed to provide a more uniform waiting time across all disk cylinders by servicing requests in only one direction.',
    workingPrinciple:
      'Moves in one designated direction servicing requests until it hits the end boundary, then immediately jumps back to the opposite boundary (0) without servicing requests on the return trip.',
    mainCharacteristic:
      'Treats cylinders as a circular list where the last cylinder is adjacent to the first. Ensures cylinders near the boundaries experience identical waiting times to middle cylinders.',
    starvationRisk: 'None',
    pros: 'Provides uniform, predictable waiting times and fair latency distribution.',
    cons: 'Incurs seek overhead during the return boundary jump (from end to 0).',
  },
  {
    type: 'LOOK',
    title: 'LOOK',
    subtitle: 'Practical Elevator Reversing at Extremes',
    explanation:
      'An enhanced version of the SCAN algorithm that looks ahead to verify whether further requests exist in the current direction before traveling further.',
    workingPrinciple:
      'The arm sweeps in one direction servicing requests, but reverses direction as soon as the last pending request in that direction is fulfilled, rather than traveling to the physical disk boundary.',
    mainCharacteristic:
      'Avoids the unnecessary seek waste of visiting unused disk edges (0 or max disk cylinder), yielding lower total head movements than pure SCAN.',
    starvationRisk: 'None',
    pros: 'Avoids redundant sweeps to cylinder 0 and max cylinder, lower head movement than SCAN.',
    cons: 'Requires scanning pending queue to identify the furthest pending request in the current direction.',
  },
  {
    type: 'C-LOOK',
    title: 'Circular LOOK (C-LOOK)',
    subtitle: 'Circular Sweeping Between Request Boundaries',
    explanation:
      'Combines the circular unidirectional fairness of C-SCAN with the edge-optimization of the LOOK algorithm.',
    workingPrinciple:
      'Services requests in only one direction. When the highest requested cylinder is serviced, it jumps directly to the lowest requested cylinder (without touching 0 or disk end) and resumes.',
    mainCharacteristic:
      'Eliminates boundary waste on both sides of the disk, making it one of the most efficient algorithms for sustained sequential and random workloads in real disks.',
    starvationRisk: 'None',
    pros: 'Uniform wait times without the seek overhead of traveling to physical platter boundaries.',
    cons: 'Requires lookahead tracking of both lowest and highest requested cylinders.',
  },
];

export const AlgorithmCards: React.FC<AlgorithmCardsProps> = ({ onSelectAlgorithm }) => {
  const handleLoadAndScroll = (algo: AlgorithmType) => {
    onSelectAlgorithm(algo);
    const calcEl = document.querySelector('#calculator');
    if (calcEl) {
      calcEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="algorithms" className="scroll-mt-20 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            Operating System Algorithm Knowledge Base
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Theoretical fundamentals, working principles, and architectural trade-offs of all six disk scheduling strategies
          </p>
        </div>
      </div>

      {/* 6 Educational Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALGORITHM_INFO.map((item) => (
          <div
            key={item.type}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
                      {item.type}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                        item.starvationRisk === 'High'
                          ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                          : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      }`}
                    >
                      {item.starvationRisk === 'High' ? 'Starvation Risk' : 'Starvation-Free'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {item.title}
                  </h3>
                  <div className="text-xs text-indigo-600/80 dark:text-indigo-400/80 font-medium">
                    {item.subtitle}
                  </div>
                </div>
              </div>

              {/* Short Explanation */}
              <div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Overview
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.explanation}
                </p>
              </div>

              {/* Working Principle */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                  Working Principle:
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.workingPrinciple}
                </p>
              </div>

              {/* Main Characteristic */}
              <div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Key Characteristic
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {item.mainCharacteristic}
                </p>
              </div>

              {/* Pros / Cons */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-0.5">
                    Advantages:
                  </span>
                  <p className="text-slate-500 dark:text-slate-400">{item.pros}</p>
                </div>
                <div>
                  <span className="font-semibold text-rose-500 dark:text-rose-400 block mb-0.5">
                    Trade-offs:
                  </span>
                  <p className="text-slate-500 dark:text-slate-400">{item.cons}</p>
                </div>
              </div>
            </div>

            {/* Card Action */}
            <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleLoadAndScroll(item.type)}
                id={`btn-card-select-${item.type.toLowerCase()}`}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Calculate with {item.type}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
