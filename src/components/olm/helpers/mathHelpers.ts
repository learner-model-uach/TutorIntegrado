export function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function clampPercent(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.min(100, Math.max(0, n));
}

export function roundTo(n: number, decimals = 0): number {
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
}
