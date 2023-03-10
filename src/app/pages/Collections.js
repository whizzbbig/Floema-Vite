import GSAP from 'gsap';

import Page from '@/classes/Page';

import { split } from '@/utils/text';

export default class CollectionsPage extends Page {
  constructor() {
    super({
      element: '.collections',
      elements: {},
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
