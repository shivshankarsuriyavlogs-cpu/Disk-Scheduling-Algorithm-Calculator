import { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { AlgorithmType, Direction, CalculationResult, ComparisonItem, HistoryEntry } from './types';
import { validateInput, calculateAlgorithm, compareAlgorithms } from './utils/algorithms';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CalculatorForm } from './components/CalculatorForm';
import { MetricsCards } from './components/MetricsCards';
import { MovementSequence } from './components/MovementSequence';
import { DiskChart } from './components/DiskChart';
import { DiskPlatterVisualizer } from './components/DiskPlatterVisualizer';
import { ResultsTable } from './components/ResultsTable';
import { AlgorithmComparison } from './components/AlgorithmComparison';
import { AlgorithmCards } from './components/AlgorithmCards';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { HistoryDrawer } from './components/HistoryDrawer';

const STORAGE_KEY_THEME = 'disk_calc_theme';
const STORAGE_KEY_HISTORY = 'disk_calc_history';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved !== null) {
      return saved === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // History state
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);

  // Form Inputs
  const [queueInput, setQueueInput] = useState<string>('98, 183, 37, 122, 14, 124, 65, 67');
  const [headInput, setHeadInput] = useState<string>('53');
  const [diskSizeInput, setDiskSizeInput] = useState<string>('200');
  const [direction, setDirection] = useState<Direction>('Right');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('FCFS');

  // Calculation Results
  const [currentResult, setCurrentResult] = useState<CalculationResult | null>(null);
  const [comparisonItems, setComparisonItems] = useState<ComparisonItem[]>([]);

  // Interactive Playback State
  const [activeStep, setActiveStep] = useState<number>(-1); // -1 = overview
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000);

  // Apply dark mode class to document element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [darkMode]);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history.slice(0, 30)));
    } catch {
      // ignore storage quota errors
    }
  }, [history]);

  // Real-time validation
  const validation = useMemo(() => {
    return validateInput(queueInput, headInput, diskSizeInput, selectedAlgorithm, direction);
  }, [queueInput, headInput, diskSizeInput, selectedAlgorithm, direction]);

  // Automatic Real-Time Recalculation on every parameter change
  useEffect(() => {
    const valid = validateInput(queueInput, headInput, diskSizeInput, selectedAlgorithm, direction);
    if (valid.isValid && valid.parsedQueue && valid.parsedHead !== undefined && valid.parsedDiskSize) {
      const result = calculateAlgorithm(
        selectedAlgorithm,
        valid.parsedHead,
        valid.parsedQueue,
        valid.parsedDiskSize,
        direction
      );
      const comp = compareAlgorithms(
        valid.parsedHead,
        valid.parsedQueue,
        valid.parsedDiskSize,
        direction
      );
      setCurrentResult(result);
      setComparisonItems(comp);
      setActiveStep(-1);
      setIsPlaying(false);
    }
  }, [queueInput, headInput, diskSizeInput, selectedAlgorithm, direction]);

  // Synchronized Playback Loop
  useEffect(() => {
    if (!isPlaying || !currentResult) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (!currentResult || prev >= currentResult.steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, playbackSpeed);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, currentResult]);

  // Execution function (triggered by Calculate button)
  const runCalculation = useCallback((triggerConfetti = false) => {
    const valid = validateInput(queueInput, headInput, diskSizeInput, selectedAlgorithm, direction);
    if (!valid.isValid || !valid.parsedQueue || valid.parsedHead === undefined || !valid.parsedDiskSize) {
      return;
    }

    const result = calculateAlgorithm(
      selectedAlgorithm,
      valid.parsedHead,
      valid.parsedQueue,
      valid.parsedDiskSize,
      direction
    );

    const comp = compareAlgorithms(
      valid.parsedHead,
      valid.parsedQueue,
      valid.parsedDiskSize,
      direction
    );

    setCurrentResult(result);
    setComparisonItems(comp);
    setActiveStep(-1);
    setIsPlaying(false);

    // Save to history
    const historyItem: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
      algorithm: selectedAlgorithm,
      requestQueue: valid.parsedQueue,
      initialHead: valid.parsedHead,
      diskSize: valid.parsedDiskSize,
      direction,
      totalHeadMovement: result.totalHeadMovement,
      averageSeekDistance: result.averageSeekDistance,
    };

    setHistory((prev) => [historyItem, ...prev.filter(h => !(h.algorithm === historyItem.algorithm && h.initialHead === historyItem.initialHead && h.requestQueue.join(',') === historyItem.requestQueue.join(',')))].slice(0, 30));

    if (triggerConfetti) {
      try {
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#4f46e5', '#0284c7', '#10b981', '#f59e0b']
        });
      } catch {
        // ignore confetti errors in iframe
      }

      // Smooth scroll to results
      const resEl = document.getElementById('results-section');
      if (resEl) {
        resEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [queueInput, headInput, diskSizeInput, selectedAlgorithm, direction]);

  // Playback toggle handler
  const handleTogglePlay = () => {
    if (!currentResult) return;
    if (activeStep >= currentResult.steps.length - 1) {
      setActiveStep(0);
      setIsPlaying(true);
    } else {
      if (activeStep === -1) setActiveStep(0);
      setIsPlaying(!isPlaying);
    }
  };

  const handleStepChange = (step: number) => {
    setIsPlaying(false);
    setActiveStep(step);
  };

  // Handler to switch algorithm and recalculate
  const handleAlgorithmChange = (algo: AlgorithmType) => {
    setSelectedAlgorithm(algo);
  };

  // Load standard example dataset
  const handleLoadExample = () => {
    setQueueInput('98, 183, 37, 122, 14, 124, 65, 67');
    setHeadInput('53');
    setDiskSizeInput('200');
    setDirection('Right');
  };

  // Generate random realistic dataset
  const handleGenerateRandom = () => {
    const size = Number(diskSizeInput) || 200;
    const count = 8;
    const randoms: number[] = [];
    while (randoms.length < count) {
      const val = Math.floor(Math.random() * size);
      if (!randoms.includes(val)) randoms.push(val);
    }
    const randHead = Math.floor(Math.random() * size);
    setQueueInput(randoms.join(', '));
    setHeadInput(randHead.toString());
  };

  // Reset form
  const handleReset = () => {
    setQueueInput('98, 183, 37, 122, 14, 124, 65, 67');
    setHeadInput('53');
    setDiskSizeInput('200');
    setDirection('Right');
    setSelectedAlgorithm('FCFS');
  };

  // Restore history entry
  const handleRestoreHistory = (entry: HistoryEntry) => {
    setQueueInput(entry.requestQueue.join(', '));
    setHeadInput(entry.initialHead.toString());
    setDiskSizeInput(entry.diskSize.toString());
    setDirection(entry.direction);
    setSelectedAlgorithm(entry.algorithm);
  };

  // Scroll helpers
  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onOpenHistory={() => setHistoryDrawerOpen(true)}
        historyCount={history.length}
      />

      {/* Main Content Sections */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
        {/* Hero Section */}
        <Hero
          onStartCalculating={() => scrollToSection('#calculator')}
          onExploreAlgorithms={() => scrollToSection('#algorithms')}
        />

        {/* Calculator Configuration Form */}
        <CalculatorForm
          queueInput={queueInput}
          headInput={headInput}
          diskSizeInput={diskSizeInput}
          direction={direction}
          selectedAlgorithm={selectedAlgorithm}
          validation={validation}
          onQueueChange={setQueueInput}
          onHeadChange={setHeadInput}
          onDiskSizeChange={setDiskSizeInput}
          onDirectionChange={setDirection}
          onAlgorithmChange={handleAlgorithmChange}
          onCalculate={() => runCalculation(true)}
          onReset={handleReset}
          onLoadExample={handleLoadExample}
          onGenerateRandom={handleGenerateRandom}
        />

        {/* Dynamic Calculation Results Display */}
        {currentResult && (
          <div id="results-section" className="space-y-8 animate-fadeIn scroll-mt-20">
            {/* Top Metrics Cards & Mathematical Formula Breakdown */}
            <MetricsCards result={currentResult} />

            {/* Interactive Mechanical Disk Platter & Actuator Arm Simulator */}
            <DiskPlatterVisualizer
              result={currentResult}
              activeStep={activeStep}
              onStepChange={handleStepChange}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
            />

            {/* Horizontal Movement Sequence (Gantt-style) with Step Playback */}
            <MovementSequence
              result={currentResult}
              activeStep={activeStep}
              onStepChange={handleStepChange}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              speed={playbackSpeed}
              onSpeedChange={setPlaybackSpeed}
            />

            {/* Visual Cylinder Trajectory Disk Chart */}
            <DiskChart
              result={currentResult}
              activeStep={activeStep}
              onSelectStep={handleStepChange}
            />

            {/* Detailed Step-by-Step Transition Table */}
            <ResultsTable
              result={currentResult}
              activeStep={activeStep}
              onSelectStep={handleStepChange}
            />
          </div>
        )}

        {/* Algorithm Comparison (runs all 6 algorithms concurrently on the same queue) */}
        {comparisonItems.length > 0 && currentResult && (
          <AlgorithmComparison
            comparisonItems={comparisonItems}
            initialHead={currentResult.initialHead}
            requestQueue={currentResult.requestQueue}
            onSelectAlgorithm={(algo) => {
              handleAlgorithmChange(algo);
              scrollToSection('#results-section');
            }}
            currentSelectedAlgo={selectedAlgorithm}
          />
        )}

        {/* Algorithm Information Cards (Educational knowledge base for all 6) */}
        <AlgorithmCards onSelectAlgorithm={(algo) => {
          handleAlgorithmChange(algo);
          scrollToSection('#calculator');
        }} />

        {/* About Section */}
        <AboutSection />
      </main>

      {/* History Drawer Modal */}
      <HistoryDrawer
        isOpen={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
        history={history}
        onSelectEntry={handleRestoreHistory}
        onClearHistory={() => setHistory([])}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
