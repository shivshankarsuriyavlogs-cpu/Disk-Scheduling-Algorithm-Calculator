import React from 'react';
import { BookOpen, GraduationCap, Cpu, HardDrive, Compass, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="scroll-mt-20 space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-8">
        {/* Section Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            Computer Science & Engineering Curriculum
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            About Disk Scheduling
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Understanding magnetic storage I/O subsystems and secondary memory management in modern Operating Systems
          </p>
        </div>

        {/* Content Paragraphs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            <p>
              <strong>Disk scheduling algorithms</strong> are Operating System techniques used to determine the exact order in which disk I/O requests are serviced. Because mechanical hard disk drives (HDDs) rely on physical read/write actuator heads moving across spinning magnetic platters, disk access time is dominated by physical mechanical delays rather than electronic transfer speeds.
            </p>
            <p>
              Total disk access time comprises three primary factors:
            </p>
            <ul className="space-y-2 list-none pl-0">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900 dark:text-white">Seek Time:</strong> The time required for the disk actuator arm to physically position the read/write head over the target cylinder track. Seek time accounts for the vast majority of I/O latency.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900 dark:text-white">Rotational Latency:</strong> The delay waiting for the desired disk sector on the spinning platter to rotate under the positioned head.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900 dark:text-white">Transfer Time:</strong> The actual duration taken to stream electromagnetic bits between the platter surface and memory buffer.
                </span>
              </li>
            </ul>
            <p>
              By intelligently ordering requests, the operating system kernel minimizes total head movement, maximizes data throughput, and balances fairness across concurrent processes.
            </p>
          </div>

          {/* Intended Audience Card */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Intended Learning Audience
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This interactive simulator is purpose-built as an educational tool for computer science students and educators worldwide:
            </p>

            <div className="space-y-2.5">
              {[
                { title: 'Diploma in Computer Engineering Students', desc: 'Practical lab demonstrations & homework validation' },
                { title: 'B.Tech / B.E. / BS Computer Science Students', desc: 'Core Operating Systems (OS) syllabus preparation' },
                { title: 'Operating System Learners & Enthusiasts', desc: 'Interactive visual intuition of head seek trajectories' },
                { title: 'GATE / GRE / University Exam Aspirants', desc: 'Quick step-by-step verification of seek distance questions' },
              ].map((aud, i) => (
                <div key={i} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {aud.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {aud.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
