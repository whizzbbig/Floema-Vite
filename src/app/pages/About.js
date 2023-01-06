import GSAP from 'gsap';

import Page from '@/classes/Page';

import { split } from '@/utils/text';

export default class AboutPage extends Page {
  constructor() {
    super({
      element: '.about',
      elements: {
        title: '.about__title',
        description: '.about__description',
        content: '.about__content',
      },
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
      [this.elements.title, this.elements.description, this.elements.content],
      {
        autoAlpha: 0,
        opacity: 0,
        y: '-50%',
        skewY: '-10deg',
      },
      {
        opacity: 1,
        autoAlpha: 1,
        duration: 0.4,
        y: '0%',
        skewY: '0deg',
        stagger: {
          amount: 0.1,
        },
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
