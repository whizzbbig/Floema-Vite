import GSAP from 'gsap';

import Component from '@classes/Component';

import { mapEach } from '@utils/dom';
import { DEFAULT as ease } from '@utils/easings';
import { calculate, split } from '@utils/text';

export default class MediaDOM extends Component {
  constructor({ element }) {
    super({
      classes: {
        active: 'detail--active',
      },
      element,
      elements: {
        media: '.detail__media',

        collection: '.detail__information__collection__text',

        title: '.detail__information__title',
        titleSpans: [],

        size: '.detail__information__highlight:first-of-type .detail__information__highlight__text',
        sizeIcon: '.detail__information__highlight__icon--arrow',
        sizeIconPaths:
          '.detail__information__highlight__icon--arrow path:nth-child(2), .detail__information__highlight__icon--arrow path:nth-child(3)',
        sizeIconLine:
          '.detail__information__highlight__icon--arrow path:nth-child(1)',
        sizeSpans: [],

        star: '.detail__information__highlight:last-of-type .detail__information__highlight__text',
        starIcon: '.detail__information__highlight__icon--star',
        starIconPath:
          '.detail__information__highlight__icon--star path:first-child',
        starSpans: [],

        info: '.detail__information__item:first-of-type .detail__information__item__description',
        infoLabel:
          '.detail__information__item:first-of-type .detail__information__item__title__text',
        infoSpans: [],

        disclaimer:
          '.detail__information__item:last-of-type .detail__information__item__description',
        disclaimerLabel:
          '.detail__information__item:last-of-type .detail__information__item__title__text',
        disclaimerSpans: [],

        link: '.detail__information__link',

        close: '.detail__button',
      },
    });

    this.createTitle();
    this.createSize();
    this.createStar();
    this.createInfo();
    this.createDisclaimer();

    this.onResize();
  }

  createTitle() {
    this.elements.titleSpans = split({
      append: true,
      element: this.elements.title,
      expression: '<br>',
    });

    mapEach(this.elements.titleSpans, element => {
      split({
        append: false,
        element,
        expression: '',
      });
    });
  }

  createSize() {
    split({
      append: true,
      element: this.elements.size,
      expression: ' ',
    });

    split({
      append: false,
      element: this.elements.size,
      expression: ' ',
    });

    this.elements.sizeSpans = this.elements.size.querySelectorAll('span span');
  }

  createStar() {
    split({
      append: true,
      element: this.elements.star,
      expression: ' ',
    });

    split({
      append: false,
      element: this.elements.star,
      expression: ' ',
    });

    this.elements.starSpans = this.elements.star.querySelectorAll('span span');
  }

  createInfo() {
    split({
      append: true,
      element: this.elements.info,
      expression: ' ',
    });

    split({
      append: false,
      element: this.elements.info,
      expression: ' ',
    });

    this.elements.infoSpans = this.elements.info.querySelectorAll('span span');
  }

  createDisclaimer() {
    split({
      append: true,
      element: this.elements.disclaimer,
      expression: ' ',
    });

    split({
      append: false,
      element: this.elements.disclaimer,
      expression: ' ',
    });

    this.elements.disclaimerSpans =
      this.elements.disclaimer.querySelectorAll('span span');
  }

  /**
   * Animations.
   */
  animateIn() {
    this.timelineIn = GSAP.timeline({
      delay: 0.5,
    });

    this.timelineIn.call(_ => {
      this.element.classList.add(this.classes.active);
    });

    this.timelineIn.fromTo(
      this.elements.collection,
      {
        y: '100%',
      },
      {
        duration: 1,
        ease,
        y: '0%',
      },
      'start',
    );

    mapEach(this.elements.titleSpans, (line, index) => {
      const letters = line.querySelectorAll('span');

      const onStart = _ => {
        GSAP.fromTo(
          letters,
          {
            autoAlpha: 0,
            display: 'inline-block',
            y: '100%',
          },
          {
            autoAlpha: 1,
            delay: 0.2,
            display: 'inline-block',
            duration: 1,
            ease: 'back.inOut',
            stagger: 0.015,
            y: '0%',
          },
        );
      };

      this.timelineIn.fromTo(
        line,
        {
          autoAlpha: 0,
          y: '100%',
        },
        {
          autoAlpha: 1,
          delay: 0.2 * index,
          duration: 1.5,
          onStart,
          ease: 'expo.inOut',
          y: '0%',
        },
        'start',
      );
    });

    mapEach(this.elements.sizeLines, (element, index) => {
      this.timelineIn.fromTo(
        element,
        {
          y: '100%',
        },
        {
          delay: 0.05 * index,
          duration: 1,
          ease,
          y: '0%',
        },
        '-=0.9',
      );
    });

    this.timelineIn.fromTo(
      this.elements.sizeIcon,
      {
        autoAlpha: 0,
        rotation: 45,
      },
      {
        autoAlpha: 1,
        duration: 1,
        ease,
        rotation: 0,
      },
      '-=0.9',
    );

    this.timelineIn.fromTo(
      this.elements.sizeIconPaths[0],
      {
        autoAlpha: 0,
        transformOrigin: '50% 50%',
        x: '-50%',
      },
      {
        autoAlpha: 1,
        duration: 1.5,
        ease,
        transformOrigin: '50% 50%',
        x: '0%',
      },
      '-=0.9',
    );

    this.timelineIn.fromTo(
      this.elements.sizeIconPaths[1],
      {
        autoAlpha: 0,
        transformOrigin: '50% 50%',
        x: '50%',
      },
      {
        autoAlpha: 1,
        duration: 1.5,
        ease,
        transformOrigin: '50% 50%',
        x: '0%',
      },
      '-=1.5',
    );

    this.timelineIn.fromTo(
      this.elements.sizeIconLine,
      {
        autoAlpha: 0,
        scale: 0,
        transformOrigin: '50% 50%',
      },
      {
        autoAlpha: 1,
        duration: 1.5,
        ease,
        scale: 1,
        transformOrigin: '50% 50%',
      },
      '-=1.5',
    );

    mapEach(this.elements.starLines, (element, index) => {
      this.timelineIn.fromTo(
        element,
        {
          y: '100%',
        },
        {
          delay: 0.05 * index,
          duration: 1,
          ease,
          y: '0%',
        },
        '-=0.9',
      );
    });

    this.timelineIn.fromTo(
      this.elements.starIcon,
      {
        autoAlpha: 0,
        rotation: 360,
      },
      {
        autoAlpha: 1,
        duration: 1,
        ease,
        rotation: 0,
      },
      '-=0.9',
    );

    this.timelineIn.fromTo(
      this.elements.starIconPath,
      {
        autoAlpha: 0,
        scale: 0.5,
        transformOrigin: '50% 50%',
      },
      {
        autoAlpha: 1,
        duration: 1,
        ease,
        scale: 1,
        transformOrigin: '50% 50%',
      },
      '-=0.9',
    );

    this.timelineIn.fromTo(
      this.elements.infoLabel,
      {
        y: '100%',
      },
      {
        duration: 1,
        ease,
        y: '0%',
      },
      '-=1.4',
    );

    mapEach(this.elements.infoLines, (element, index) => {
      this.timelineIn.fromTo(
        element,
        {
          y: '100%',
        },
        {
          delay: 0.05 * index,
          duration: 1,
          ease,
          y: '0%',
        },
        '-=1',
      );
    });

    this.timelineIn.fromTo(
      this.elements.disclaimerLabel,
      {
        y: '100%',
      },
      {
        duration: 1,
        ease,
        y: '0%',
      },
      '-=0.95',
    );

    mapEach(this.elements.disclaimerLines, (element, index) => {
      this.timelineIn.fromTo(
        element,
        {
          y: '100%',
        },
        {
          delay: 0.05 * index,
          duration: 1,
          ease,
          y: '0%',
        },
        '-=1',
      );
    });

    this.timelineIn.fromTo(
      this.elements.link,
      {
        y: '100%',
      },
      {
        duration: 1,
        ease,
        y: '0%',
      },
      '-=0.95',
    );
  }

  animateOut() {
    this.element.classList.remove(this.classes.active);
  }

  /**
   * Listeners.
   */
  onClose() {
    this.emit('close');
  }

  /**
   * Events.
   */
  onResize() {
    this.bounds = this.elements.media.getBoundingClientRect();

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        this.elements.sizeLines = calculate(this.elements.sizeSpans);
        this.elements.starLines = calculate(this.elements.starSpans);
        this.elements.infoLines = calculate(this.elements.infoSpans);
        this.elements.disclaimerLines = calculate(
          this.elements.disclaimerSpans,
        );
      });
    });
  }

  /**
   * Listeners.
   */
  addEventListeners() {
    this.elements.close.addEventListener('click', this.onClose);
  }
}
