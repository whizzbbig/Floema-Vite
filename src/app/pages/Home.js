import GSAP from 'gsap';

import Page from '@/classes/Page';

import { split } from '@/utils/text';

export default class HomePage extends Page {
  constructor() {
    super({
      element: '.home',
      elements: {
        introTitle: '.home__intro__title',
        highlightTitle: '.home__highlight__title',
      },
    });
  }

  beforeShow() {
    super.beforeShow();

    this.elements.introTitleSpans = split({
      element: this.elements.introTitle,
      expression: '<br>',
    });

    this.elements.highlightTitleSpans = split({
      element: this.elements.highlightTitle,
      expression: '<br>',
    });
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

    this.timelineIn.fromTo(
      [this.elements.introTitle, this.elements.highlightTitle],
      {
        autoAlpha: 0,
        opacity: 0,
        y: '-50%',
      },
      {
        opacity: 1,
        autoAlpha: 1,
        duration: 0.4,
        y: '0%',
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
