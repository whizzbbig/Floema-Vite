import GSAP from 'gsap';

export const lerp = GSAP.utils.interpolate;

export const round = (x, d) => {
  return Number(x.toFixed(d));
};

export const interpolate = (start, end, value) => {
  return start * (1.0 - value) + end * value;
};

export const clamp = (min, max, number) => {
  return Math.max(min, Math.min(number, max));
};

export const random = (min, max) => {
  return Math.random() * (max - min) + min;
};

export const delay = ms => {
  return new Promise(res => gsap.delayedCall(ms / 1000, res));
};
