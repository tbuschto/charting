export function yearOf(date: string): number {
  return new Date(date).getFullYear()
}

export function inRange(value: number, range: [number, number]) {
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    return false
  }
  return value <= range[1] && value >= range[0];
}
