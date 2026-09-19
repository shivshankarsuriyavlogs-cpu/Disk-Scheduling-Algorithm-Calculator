export type AlgorithmType = 'FCFS' | 'SSTF' | 'SCAN' | 'C-SCAN' | 'LOOK' | 'C-LOOK';

export type Direction = 'Left' | 'Right';

export interface StepDetail {
  step: number;
  from: number;
  to: number;
  seekDistance: number;
  direction: Direction;
  cumulativeMovement: number;
  type: 'initial' | 'request' | 'boundary' | 'jump';
  note?: string;
}

export interface CalculationResult {
  algorithm: AlgorithmType;
  initialHead: number;
  diskSize: number;
  direction?: Direction;
  requestQueue: number[];
  serviceOrder: number[]; // Sequence of cylinders visited (including boundaries if any)
  steps: StepDetail[];
  totalHeadMovement: number;
  requestCount: number;
  averageSeekDistance: number;
  timestamp: number;
}

export interface ComparisonItem {
  algorithm: AlgorithmType;
  name: string;
  totalMovement: number;
  averageSeek: number;
  serviceOrder: number[];
  stepsCount: number;
  directionUsed?: Direction;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  algorithm: AlgorithmType;
  requestQueue: number[];
  initialHead: number;
  diskSize: number;
  direction: Direction;
  totalHeadMovement: number;
  averageSeekDistance: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: {
    requestQueue?: string;
    initialHead?: string;
    diskSize?: string;
    direction?: string;
  };
  parsedQueue?: number[];
  parsedHead?: number;
  parsedDiskSize?: number;
}
