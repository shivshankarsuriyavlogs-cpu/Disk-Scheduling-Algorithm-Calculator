import { useState } from 'react';
import { HardDrive, Moon, Sun, Menu, X, History, Cpu } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Navbar = ({ darkMode, onToggleTheme, onOpenHistory, historyCount }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Calculator', href: '#calculator' },
    { name: 'Platter Simulator', href: '#platter-simulator' },
    { name: 'Trajectory Plot', href: '#visualization' },
    { name: 'Comparison', href: '#comparison' },
    { name: 'Algorithms', href: '#algorithms' },
    { name: 'About', href: '#about' },
  ];

  const handleScrollTo = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold tracking-tight hover:opacity-90 transition-opacity cursor-pointer text-left"
            id="brand-logo"
          >
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold leading-none tracking-tight">
                Disk Scheduling
              </span>
              <span className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400">
                Algorithm Calculator
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleScrollTo(link.href)}
                className="px-3.5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg transition-colors"
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Actions: History & Theme Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenHistory}
              title="Recent Calculations History"
              id="btn-nav-history"
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <History className="w-5 h-5" />
              {historyCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              onClick={onToggleTheme}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              id="btn-theme-toggle"
              aria-label="Toggle dark/light theme"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                id="btn-mobile-menu"
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation tray */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleScrollTo(link.href)}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {link.name}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-3">
            <span className="flex items-center gap-1.5 font-mono">
              <Cpu className="w-3.5 h-3.5 text-indigo-500" /> OS Disk Simulator
            </span>
            <span>v2026.1</span>
          </div>
        </div>
      )}
    </header>
  );
};
