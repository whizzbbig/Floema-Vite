import Animation from '@classes/Animation';
import gsap from 'gsap';

export default class Highlight extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
  }

  animateIn() {
    this.timeline = gsap.timeline({
      delay: 0.5,
    });
    this.timeline.set(this.element, {
      autoAlpha: 1,
    });

    this.timeline.fromTo(
      this.element,
      {
        autoAlpha: 0,
        scale: 1.2,
      },
      {
        autoAlpha: 1,
        duration: 1.5,
        ease: 'expo.out',
        scale: 1,
      },
      0,
    );
  }

  animateOut() {
    gsap.set(this.element, {
      autoAlpha: 0,
    });
  }
}
