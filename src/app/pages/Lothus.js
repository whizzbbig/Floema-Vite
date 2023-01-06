import GSAP from 'gsap';

import Page from '@/classes/Page';

export default class LothusPage extends Page {
  constructor() {
    super({
      element: '.lothus',
      elements: {
        media: '.lothus__media__image',
      },
    });
  }

  beforeShow() {
    super.beforeShow();
  }

  show() {
    this.timelineIn = GSAP.timeline();
    this.timelineIn.fromTo(
      this.element,
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
        duration: 0.4,
      }
    );

    return super.show(this.timelineIn);
  }

  hide() {
    this.timelineOut = GSAP.timeline();
    this.timelineOut.to(this.element, {
      autoAlpha: 0,
      duration: 0.4,
    });

    return super.hide(this.timelineOut);
  }
}
