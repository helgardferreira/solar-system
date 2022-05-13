export function normalize(val: number, max: number, min: number) {
  return (val - min) / (max - min);
}
