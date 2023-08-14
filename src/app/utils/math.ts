import GSAP from 'gsap';

export function lerp(p1: number, p2: number, t: number): number {
  return p1 + (p2 - p1) * t;
}

export function map(
  num: number,
  min1: number,
  max1: number,
  min2: number,
  max2: number,
  round: boolean = false,
  constrainMin: boolean = true,
  constrainMax: boolean = true,
): number {
  if (constrainMin && num < min1) return min2;
  if (constrainMax && num > max1) return max2;

  const num1 = (num - min1) / (max1 - min1);
  const num2 = num1 * (max2 - min2) + min2;

  if (round) return Math.round(num2);

  return num2;
}

export function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

export function interpolate(start: number, end: number, value: number): number {
  return start * (1.0 - value) + end * value;
}

export function clamp(min: number, max: number, number: number): number {
  return Math.max(min, Math.min(number, max));
}

export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function delay(ms: number): Promise<void> {
  return new Promise(res => GSAP.delayedCall(ms / 1000, res));
}
