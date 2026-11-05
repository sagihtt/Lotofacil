export interface GameMetrics {
  sum: number;
  oddCount: number;
  evenCount: number;
  frameCount: number;
  primeCount: number;
}

export interface GameResult {
  id: string;
  index: number;
  numbers: number[];
  metrics: GameMetrics;
}

export interface FilterRules {
  minOdds: number;
  maxOdds: number;
  minSum: number;
  maxSum: number;
  minFrame: number;
  maxFrame: number;
  minPrimes: number;
  maxPrimes: number;
}

export type QuantityOption = 5 | 10 | 15 | 20 | 50 | 'all';
