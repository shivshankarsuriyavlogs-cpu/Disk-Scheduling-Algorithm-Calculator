import { AlgorithmType, Direction, StepDetail, CalculationResult, ComparisonItem, ValidationResult } from '../types';

/**
 * Validates the calculator inputs
 */
export function validateInput(
  queueStr: string,
  headStr: string,
  diskSizeStr: string,
  algorithm: AlgorithmType,
  direction: Direction
): ValidationResult {
  const errors: ValidationResult['errors'] = {};

  // 1. Disk Size Validation
  const diskSize = Number(diskSizeStr.trim());
  if (!diskSizeStr.trim() || isNaN(diskSize) || !Number.isInteger(diskSize) || diskSize <= 0) {
    errors.diskSize = 'Disk size must be a positive integer (e.g., 200).';
  } else if (diskSize > 100000) {
    errors.diskSize = 'Disk size cannot exceed 100,000 for realistic simulation.';
  }

  const maxCylinder = diskSize > 0 ? diskSize - 1 : 0;

  // 2. Initial Head Position Validation
  const initialHead = Number(headStr.trim());
  if (!headStr.trim() || isNaN(initialHead) || !Number.isInteger(initialHead)) {
    errors.initialHead = 'Initial head position must be an integer.';
  } else if (initialHead < 0) {
    errors.initialHead = 'Initial head cannot be negative (must be ≥ 0).';
  } else if (!errors.diskSize && initialHead > maxCylinder) {
    errors.initialHead = `Initial head position (${initialHead}) must be within 0 to ${maxCylinder}.`;
  }

  // 3. Request Queue Validation
  if (!queueStr.trim()) {
    errors.requestQueue = 'Request queue cannot be empty.';
  }

  let parsedQueue: number[] = [];
  if (queueStr.trim()) {
    const tokens = queueStr
      .split(/[\s,]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (tokens.length === 0) {
      errors.requestQueue = 'Please enter at least one valid cylinder request.';
    } else {
      const invalidTokens: string[] = [];
      const outOfRangeTokens: number[] = [];
      const negativeTokens: number[] = [];

      for (const token of tokens) {
        const num = Number(token);
        if (isNaN(num) || !Number.isInteger(num)) {
          invalidTokens.push(token);
        } else if (num < 0) {
          negativeTokens.push(num);
        } else if (!errors.diskSize && num > maxCylinder) {
          outOfRangeTokens.push(num);
        } else {
          parsedQueue.push(num);
        }
      }

      if (invalidTokens.length > 0) {
        errors.requestQueue = `Invalid cylinder entries: "${invalidTokens.join(', ')}". Only integers allowed.`;
      } else if (negativeTokens.length > 0) {
        errors.requestQueue = `Negative cylinders not allowed: ${negativeTokens.join(', ')}.`;
      } else if (outOfRangeTokens.length > 0) {
        errors.requestQueue = `Cylinders exceed disk range (0 - ${maxCylinder}): ${outOfRangeTokens.join(', ')}.`;
      } else if (parsedQueue.length === 0) {
        errors.requestQueue = 'No valid cylinder requests provided.';
      }
    }
  }

  // 4. Direction validation for directional algorithms
  const isDirectional = ['SCAN', 'C-SCAN', 'LOOK', 'C-LOOK'].includes(algorithm);
  if (isDirectional && (!direction || !['Left', 'Right'].includes(direction))) {
    errors.direction = 'Direction (Left or Right) is required for this algorithm.';
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    parsedQueue: isValid ? parsedQueue : undefined,
    parsedHead: isValid ? initialHead : undefined,
    parsedDiskSize: isValid ? diskSize : undefined,
  };
}

/**
 * Generates detailed step transitions from a visited cylinder path
 */
export function buildStepDetails(
  path: Array<{ cylinder: number; type: 'initial' | 'request' | 'boundary' | 'jump'; note?: string }>,
  requestCount: number
): { steps: StepDetail[]; totalHeadMovement: number; averageSeekDistance: number } {
  const steps: StepDetail[] = [];
  let totalHeadMovement = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const fromItem = path[i];
    const toItem = path[i + 1];
    const diff = toItem.cylinder - fromItem.cylinder;
    const seekDistance = Math.abs(diff);
    const dir: Direction = diff >= 0 ? 'Right' : 'Left';

    totalHeadMovement += seekDistance;

    steps.push({
      step: i + 1,
      from: fromItem.cylinder,
      to: toItem.cylinder,
      seekDistance,
      direction: dir,
      cumulativeMovement: totalHeadMovement,
      type: toItem.type,
      note: toItem.note,
    });
  }

  const averageSeekDistance = requestCount > 0 ? Number((totalHeadMovement / requestCount).toFixed(2)) : 0;

  return {
    steps,
    totalHeadMovement,
    averageSeekDistance,
  };
}

/**
 * 1. FCFS (First Come First Serve)
 * Services requests strictly in the order they arrive.
 */
export function fcfs(initialHead: number, requests: number[], diskSize: number): CalculationResult {
  const path: Array<{ cylinder: number; type: 'initial' | 'request' | 'boundary' | 'jump'; note?: string }> = [
    { cylinder: initialHead, type: 'initial', note: 'Initial Head Position' },
  ];

  for (const req of requests) {
    path.push({ cylinder: req, type: 'request', note: `Service Request ${req}` });
  }

  const { steps, totalHeadMovement, averageSeekDistance } = buildStepDetails(path, requests.length);

  return {
    algorithm: 'FCFS',
    initialHead,
    diskSize,
    requestQueue: [...requests],
    serviceOrder: path.map(p => p.cylinder),
    steps,
    totalHeadMovement,
    requestCount: requests.length,
    averageSeekDistance,
    timestamp: Date.now(),
  };
}

/**
 * 2. SSTF (Shortest Seek Time First)
 * At each step, picks the unvisited request closest to the current head position.
 */
export function sstf(initialHead: number, requests: number[], diskSize: number): CalculationResult {
  const path: Array<{ cylinder: number; type: 'initial' | 'request' | 'boundary' | 'jump'; note?: string }> = [
    { cylinder: initialHead, type: 'initial', note: 'Initial Head Position' },
  ];

  const pending = [...requests];
  let currentHead = initialHead;

  while (pending.length > 0) {
    let minDistance = Infinity;
    let bestIndex = -1;

    for (let i = 0; i < pending.length; i++) {
      const distance = Math.abs(pending[i] - currentHead);
      if (distance < minDistance) {
        minDistance = distance;
        bestIndex = i;
      }
    }

    if (bestIndex !== -1) {
      const chosen = pending[bestIndex];
      pending.splice(bestIndex, 1);
      currentHead = chosen;
      path.push({
        cylinder: chosen,
        type: 'request',
        note: `Shortest seek from previous (${minDistance} cylinders)`,
      });
    }
  }

  const { steps, totalHeadMovement, averageSeekDistance } = buildStepDetails(path, requests.length);

  return {
    algorithm: 'SSTF',
    initialHead,
    diskSize,
    requestQueue: [...requests],
    serviceOrder: path.map(p => p.cylinder),
    steps,
    totalHeadMovement,
    requestCount: requests.length,
    averageSeekDistance,
    timestamp: Date.now(),
  };
}

/**
 * 3. SCAN (Elevator Algorithm)
 * Moves in chosen direction servicing requests, reaches the disk physical boundary,
 * then reverses direction to service pending requests.
 */
export function scan(initialHead: number, requests: number[], diskSize: number, direction: Direction): CalculationResult {
  const path: Array<{ cylinder: number; type: 'initial' | 'request' | 'boundary' | 'jump'; note?: string }> = [
    { cylinder: initialHead, type: 'initial', note: 'Initial Head Position' },
  ];

  const maxCylinder = diskSize - 1;
  const left = requests.filter(r => r < initialHead).sort((a, b) => a - b);
  const right = requests.filter(r => r > initialHead).sort((a, b) => a - b);
  const exact = requests.filter(r => r === initialHead);

  if (direction === 'Right') {
    // Service exact matches first
    for (const req of exact) {
      path.push({ cylinder: req, type: 'request', note: `Service Request ${req}` });
    }
    // Sweep Right
    for (const req of right) {
      path.push({ cylinder: req, type: 'request', note: `Service Request ${req}` });
    }

    // If there are pending requests to the left, must go to the right boundary then reverse
    if (left.length > 0) {
      // Reaches physical boundary (diskSize - 1)
      path.push({
        cylinder: maxCylinder,
        type: 'boundary',
        note: `Disk Upper Boundary (${maxCylinder}) reached, reversing direction to Left`,
      });
      // Sweep Left (descending)
      for (let i = left.length - 1; i >= 0; i--) {
        path.push({ cylinder: left[i], type: 'request', note: `Service Request ${left[i]}` });
      }
    }
  } else {
    // Direction is 'Left'
    for (const req of exact) {
      path.push({ cylinder: req, type: 'request', note: `Service Request ${req}` });
    }
    // Sweep Left (descending)
    for (let i = left.length - 1; i >= 0; i--) {
      path.push({ cylinder: left[i], type: 'request', note: `Service Request ${left[i]}` });
    }

    // If there are pending requests to the right, must hit 0 boundary then reverse
    if (right.length > 0) {
      path.push({
        cylinder: 0,
        type: 'boundary',
        note: 'Disk Lower Boundary (0) reached, reversing direction to Right',
      });
      // Sweep Right (ascending)
      for (const req of right) {
        path.push({ cylinder: req, type: 'request', note: `Service Request ${req}` });
      }
    }
  }

  const { steps, totalHeadMovement, averageSeekDistance } = buildStepDetails(path, requests.length);

  return {
    algorithm: 'SCAN',
    initialHead,
    diskSize,
    direction,
    requestQueue: [...requests],
    serviceOrder: path.map(p => p.cylinder),
    steps,
    totalHeadMovement,
    requestCount: requests.length,
    averageSeekDistance,
    timestamp: Date.now(),
  };
}

/**
 * 4. C-SCAN (Circular SCAN)
 * Head moves in one direction only. When it reaches the end boundary,
 * it returns directly to the opposite boundary and resumes in the original direction.
 */
export function cscan(initialHead: number, requests: number[], diskSize: number, direction: Direction): CalculationResult {
  const path: Array<{ cylinder: number; type: 'initial' | 'request' | 'boundary' | 'jump'; note?: string }> = [
    { cylinder: initialHead, type: 'initial', note: 'Initial Head Position' },
  ];

  const maxCylinder = diskSize - 1;
  const left = requests.filter(r => r < initialHead).sort((a, b) => a - b);
  const right = requests.filter(r => r > initialHead).sort((a, b) => a - b);
  const exact = requests.filter(r => r === initialHead);

  if (direction === 'Right') {
    for (const req of exact) {
      path.push({ cylinder: req, type: 'request', note: `Service Request ${req}` });
    }
    for (const req of right) {
      path.push({ cylinder: req, type: 'request', note: `Service Request ${req}` });
    }

    if (left.length > 0) {
      // Go to upper boundary
      path.push({
        cylinder: maxCylinder,
        type: 'boundary',
        note: `Disk Upper Boundary (${maxCylinder}) reached`,
      });
      // Circular jump to 0
      path.push({
        cylinder: 0,
        type: 'jump',
        note: 'Circular jump to cylinder 0 (no service during return seek)',
      });
      // Continue Right from 0
      for (const req of left) {
        path.push({ cylinder: req, type: 'request', note: `Service Request ${req}` });
      }
    }
  } else {
    // Direction is 'Left'
    for (const req of exact) {
      path.push({ cylinder: req, type: 'request', note: `Service Request ${req}` });
    }
    for (let i = left.length - 1; i >= 0; i--) {
      path.push({ cylinder: left[i], type: 'request', note: `Service Request ${left[i]}` });
    }

    if (right.length > 0) {
      // Go to lower boundary 0
      path.push({
        cylinder: 0,
        type: 'boundary',
        note: 'Disk Lower Boundary (0) reached',
      });
      // Circular jump to maxCylinder
      path.push({
        cylinder: maxCylinder,
        type: 'jump',
        note: `Circular jump to cylinder ${maxCylinder} (no service during return seek)`,
      });
      // Continue Left (descending)
      for (let i = right.length - 1; i >= 0; i--) {
        path.push({ cylinder: right[i], type: 'request', note: `Service Request ${right[i]}` });
      }
    }
  }

  const { steps, totalHeadMovement, averageSeekDistance } = buildStepDetails(path, requests.length);

  return {
    algorithm: 'C-SCAN',
    initialHead,
    diskSize,
    direction,
    requestQueue: [...requests],
    serviceOrder: path.map(p => p.cylinder),
    steps,
    totalHeadMovement,
    requestCount: requests.length,
    averageSeekDistance,
    timestamp: Date.now(),
  };
}

/**
 * 5. LOOK
 * Like SCAN, but only goes as far as the final request in each direction
 * instead of going all the way to the physical disk boundaries.
 */
export function look(initialHead: number, requests: number[], diskSize: number, direction: Direction): CalculationResult {
  const path: Array<{ cylinder: number; type: 'initial' | 'request' | 'boundary' | 'jump'; note?: string }> = [
    { cylinder: initialHead, type: 'initial', note: 'Initial Head Position' },
  ];

  const left = requests.filter(r => r < initialHead).sort((a, b) => a - b);
  const right = requests.filter(r => r > initialHead).sort((a, b) => a - b);
  const exact = requests.filter(r => r === initialHead);

  if (direction === 'Right') {
    for (const req of exact) {
      path.push({ cylinder: req, type: 'request', note: `Service Request ${req}` });
    }
    for (const req of right) {
      path.push({ cylinder: req, type: 'request', note: `Service Request ${req}` });
    }

    // Reverse direction to Left at the last right request
    if (left.length > 0) {
      for (let i = left.length - 1; i >= 0; i--) {
        path.push({ cylinder: left[i], type: 'request', note: `Service Request ${left[i]}` });
      }
    }
  } else {
    // Direction is 'Left'
    for (const req of exact) {
      path.push({ cylinder: req, type: 'request', note: `Service Request ${req}` });
    }
    for (let i = left.length - 1; i >= 0; i--) {
      path.push({ cylinder: left[i], type: 'request', note: `Service Request ${left[i]}` });
    }

    // Reverse direction to Right at the lowest request
    if (right.length > 0) {
      for (const req of right) {
        path.push({ cylinder: req, type: 'request', note: `Service Request ${req}` });
      }
    }
  }

  const { steps, totalHeadMovement, averageSeekDistance } = buildStepDetails(path, requests.length);

  return {
    algorithm: 'LOOK',
    initialHead,
    diskSize,
    direction,
    requestQueue: [...requests],
    serviceOrder: path.map(p => p.cylinder),
    steps,
    totalHeadMovement,
    requestCount: requests.length,
    averageSeekDistance,
    timestamp: Date.now(),
  };
}

/**
 * 6. C-LOOK (Circular LOOK)
 * Like C-SCAN, but only jumps between the extreme requests rather than disk boundaries.
 */
export function clook(initialHead: number, requests: number[], diskSize: number, direction: Direction): CalculationResult {
  const path: Array<{ cylinder: number; type: 'initial' | 'request' | 'boundary' | 'jump'; note?: string }> = [
    { cylinder: initialHead, type: 'initial', note: 'Initial Head Position' },
  ];

  const left = requests.filter(r => r < initialHead).sort((a, b) => a - b);
  const right = requests.filter(r => r > initialHead).sort((a, b) => a - b);
  const exact = requests.filter(r => r === initialHead);

  if (direction === 'Right') {
    for (const req of exact) {
      path.push({ cylinder: req, type: 'request', note: `Service Request ${req}` });
    }
    for (const req of right) {
      path.push({ cylinder: req, type: 'request', note: `Service Request ${req}` });
    }

    if (left.length > 0) {
      // Circular jump directly to lowest pending request
      const lowestReq = left[0];
      path.push({
        cylinder: lowestReq,
        type: 'jump',
        note: `Circular jump directly to lowest request (${lowestReq}) without touching boundary`,
      });
      // Continue servicing remaining left requests in increasing order
      for (let i = 1; i < left.length; i++) {
        path.push({ cylinder: left[i], type: 'request', note: `Service Request ${left[i]}` });
      }
    }
  } else {
    // Direction is 'Left'
    for (const req of exact) {
      path.push({ cylinder: req, type: 'request', note: `Service Request ${req}` });
    }
    for (let i = left.length - 1; i >= 0; i--) {
      path.push({ cylinder: left[i], type: 'request', note: `Service Request ${left[i]}` });
    }

    if (right.length > 0) {
      // Circular jump directly to highest pending request
      const highestReq = right[right.length - 1];
      path.push({
        cylinder: highestReq,
        type: 'jump',
        note: `Circular jump directly to highest request (${highestReq}) without touching boundary`,
      });
      // Continue servicing remaining right requests in decreasing order
      for (let i = right.length - 2; i >= 0; i--) {
        path.push({ cylinder: right[i], type: 'request', note: `Service Request ${right[i]}` });
      }
    }
  }

  const { steps, totalHeadMovement, averageSeekDistance } = buildStepDetails(path, requests.length);

  return {
    algorithm: 'C-LOOK',
    initialHead,
    diskSize,
    direction,
    requestQueue: [...requests],
    serviceOrder: path.map(p => p.cylinder),
    steps,
    totalHeadMovement,
    requestCount: requests.length,
    averageSeekDistance,
    timestamp: Date.now(),
  };
}

/**
 * Executes a chosen algorithm dispatcher
 */
export function calculateAlgorithm(
  algorithm: AlgorithmType,
  initialHead: number,
  requests: number[],
  diskSize: number,
  direction: Direction = 'Right'
): CalculationResult {
  switch (algorithm) {
    case 'FCFS':
      return fcfs(initialHead, requests, diskSize);
    case 'SSTF':
      return sstf(initialHead, requests, diskSize);
    case 'SCAN':
      return scan(initialHead, requests, diskSize, direction);
    case 'C-SCAN':
      return cscan(initialHead, requests, diskSize, direction);
    case 'LOOK':
      return look(initialHead, requests, diskSize, direction);
    case 'C-LOOK':
      return clook(initialHead, requests, diskSize, direction);
    default:
      return fcfs(initialHead, requests, diskSize);
  }
}

/**
 * Runs all 6 algorithms simultaneously on identical input parameters for comparative analysis
 */
export function compareAlgorithms(
  initialHead: number,
  requests: number[],
  diskSize: number,
  direction: Direction = 'Right'
): ComparisonItem[] {
  const allAlgorithms: { type: AlgorithmType; name: string }[] = [
    { type: 'FCFS', name: 'First Come First Serve' },
    { type: 'SSTF', name: 'Shortest Seek Time First' },
    { type: 'SCAN', name: 'SCAN (Elevator)' },
    { type: 'C-SCAN', name: 'Circular SCAN' },
    { type: 'LOOK', name: 'LOOK' },
    { type: 'C-LOOK', name: 'Circular LOOK' },
  ];

  return allAlgorithms.map(algo => {
    const res = calculateAlgorithm(algo.type, initialHead, requests, diskSize, direction);
    return {
      algorithm: algo.type,
      name: algo.name,
      totalMovement: res.totalHeadMovement,
      averageSeek: res.averageSeekDistance,
      serviceOrder: res.serviceOrder,
      stepsCount: res.steps.length,
      directionUsed: ['SCAN', 'C-SCAN', 'LOOK', 'C-LOOK'].includes(algo.type) ? direction : undefined,
    };
  });
}
