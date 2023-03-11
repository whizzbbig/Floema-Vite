import Lenis from '@studio-freight/lenis';

export default class Scrolling {
  constructor() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      direction: 'vertical', // vertical, horizontal
      gestureDirection: 'vertical', // vertical, horizontal, both
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    //get scroll value
    this.lenis.on(
      'scroll',
      ({ scroll, limit, velocity, direction, progress }) => {
        return;
      }
    );

    requestAnimationFrame(e => this.update(e));
  }

  update(e) {
    this.lenis.raf(e);
    requestAnimationFrame(e => this.update(e));
  }
}
