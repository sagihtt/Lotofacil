import { FilterRules, GameMetrics, GameResult } from '../types';

export const TOTAL_LOTOFACIL_NUMBERS = 25;
export const REQUIRED_SELECTION_COUNT = 20;
export const GAME_NUMBERS_COUNT = 15;

// Números da Moldura (Bordas do volante 5x5)
export const FRAME_NUMBERS = new Set<number>([
  1, 2, 3, 4, 5,
  6,          10,
  11,         15,
  16,         20,
  21, 22, 23, 24, 25,
]);

// Números Primos de 1 a 25 (o 1 não é primo)
export const PRIME_NUMBERS = new Set<number>([
  2, 3, 5, 7, 11, 13, 17, 19, 23,
]);

// Regras padrão de filtros estatísticos
export const DEFAULT_FILTER_RULES: FilterRules = {
  minOdds: 7,
  maxOdds: 8,
  minSum: 170,
  maxSum: 220,
  minFrame: 9,
  maxFrame: 11,
  minPrimes: 4,
  maxPrimes: 6,
};

/**
 * Formata um número com 2 dígitos (ex: 1 -> "01", 15 -> "15")
 */
export function formatBallNumber(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

/**
 * Calcula as métricas estatísticas de um jogo de 15 números
 */
export function calculateMetrics(numbers: number[]): GameMetrics {
  let sum = 0;
  let oddCount = 0;
  let frameCount = 0;
  let primeCount = 0;

  for (let i = 0; i < numbers.length; i++) {
    const n = numbers[i];
    sum += n;
    if (n % 2 !== 0) oddCount++;
    if (FRAME_NUMBERS.has(n)) frameCount++;
    if (PRIME_NUMBERS.has(n)) primeCount++;
  }

  return {
    sum,
    oddCount,
    evenCount: numbers.length - oddCount,
    frameCount,
    primeCount,
  };
}

/**
 * Gera todas as combinações de C(n, k).
 * Para C(20, 15), são 15.504 combinações.
 */
export function generateCombinations(elements: number[], k: number = GAME_NUMBERS_COUNT): number[][] {
  const sorted = [...elements].sort((a, b) => a - b);
  const results: number[][] = [];
  const combo: number[] = new Array(k);

  function backtrack(startIndex: number, depth: number) {
    if (depth === k) {
      results.push([...combo]);
      return;
    }

    const needed = k - depth;
    const remaining = sorted.length - startIndex;
    if (remaining < needed) return;

    for (let i = startIndex; i <= sorted.length - needed; i++) {
      combo[depth] = sorted[i];
      backtrack(i + 1, depth + 1);
    }
  }

  backtrack(0, 0);
  return results;
}

/**
 * Gera as combinações a partir das 20 dezenas e aplica os 4 filtros estatísticos:
 * - Ímpares: 7 a 8
 * - Soma total: 170 a 220
 * - Moldura: 9 a 11
 * - Primos: 4 a 6
 */
export function generateFilteredGames(
  chosenNumbers: number[],
  filters: FilterRules = DEFAULT_FILTER_RULES
): { approvedGames: GameResult[]; totalCombinations: number } {
  if (chosenNumbers.length !== REQUIRED_SELECTION_COUNT) {
    return { approvedGames: [], totalCombinations: 0 };
  }

  const combinations = generateCombinations(chosenNumbers, GAME_NUMBERS_COUNT);
  const approvedGames: GameResult[] = [];
  let gameIndex = 1;

  for (let i = 0; i < combinations.length; i++) {
    const combo = combinations[i];
    const metrics = calculateMetrics(combo);

    const passesOdds = metrics.oddCount >= filters.minOdds && metrics.oddCount <= filters.maxOdds;
    const passesSum = metrics.sum >= filters.minSum && metrics.sum <= filters.maxSum;
    const passesFrame = metrics.frameCount >= filters.minFrame && metrics.frameCount <= filters.maxFrame;
    const passesPrimes = metrics.primeCount >= filters.minPrimes && metrics.primeCount <= filters.maxPrimes;

    if (passesOdds && passesSum && passesFrame && passesPrimes) {
      approvedGames.push({
        id: `game-${gameIndex}-${combo.join('-')}`,
        index: gameIndex,
        numbers: combo,
        metrics,
      });
      gameIndex++;
    }
  }

  return {
    approvedGames,
    totalCombinations: combinations.length,
  };
}

/**
 * Sorteia aleatoriamente N dezenas sem repetição entre 1 e 25
 */
export function getRandomSelection(count: number = REQUIRED_SELECTION_COUNT): number[] {
  const pool = Array.from({ length: TOTAL_LOTOFACIL_NUMBERS }, (_, i) => i + 1);
  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count).sort((a, b) => a - b);
}

function centerLine(text: string, width: number = 49): string {
  if (text.length >= width) return text;
  const leftPadding = Math.floor((width - text.length) / 2);
  return ' '.repeat(leftPadding) + text;
}

/**
 * Exporta os jogos formatados em texto puro
 */
export function exportToTxt(games: GameResult[], chosenNumbers?: number[]): string {
  const timestamp = new Date().toLocaleString('pt-BR');
  const width = 49;
  const divider = '='.repeat(width);

  let output = `${divider}\n`;
  output += `${centerLine('- LOTOFÁCIL -', width)}\n`;
  output += `${centerLine(`Gerado em: ${timestamp}`, width)}\n`;
  if (chosenNumbers && chosenNumbers.length > 0) {
    output += `${centerLine('20 Dezenas Base:', width)}\n`;
    const sorted = [...chosenNumbers].sort((a, b) => a - b).map(formatBallNumber).join(' ');
    output += `${centerLine(sorted, width)}\n`;
  }
  output += `${centerLine(`Total de Jogos: ${games.length}`, width)}\n`;
  output += `${divider}\n\n`;

  output += games
    .map((game, idx) => {
      const nums = game.numbers.map(formatBallNumber).join(' ');
      return `Jogo ${String(idx + 1).padStart(2, '0')}: ${nums}`;
    })
    .join('\n');

  return output;
}

/**
 * Exporta os jogos em formato CSV (compatível com Excel / Google Planilhas)
 */
export function exportToCsv(games: GameResult[]): string {
  let csv = `Jogo;Dezenas;Soma;Impares;Pares;Moldura;Primos\n`;

  games.forEach((game, idx) => {
    const nums = game.numbers.map(formatBallNumber).join(' ');
    csv += `${idx + 1};"${nums}";${game.metrics.sum};${game.metrics.oddCount};${game.metrics.evenCount};${game.metrics.frameCount};${game.metrics.primeCount}\n`;
  });

  return csv;
}
