import { Texture } from 'ogl';
import GSAP from 'gsap';

import each from 'lodash/each';

import Component from '@classes/Component';

import { DEFAULT as ease } from '@utils/easings';
import { split } from '@utils/text';

export default class Preloader extends Component {
  constructor({ canvas }) {
    super({
      element: '.preloader',
      elements: {
        title: '.preloader__text',
        number: '.preloader__number',
        numberText: '.preloader__number__text',
      },
    });

    this.canvas = canvas;

    window.TEXTURES = {};

    this.elements.titleSpans = split({
      append: true,
      element: this.elements.title,
      expression: '<br>',
    });

    each(this.elements.titleSpans, element => {
      split({
        append: false,
        element,
        expression: ' ',
      });
    });

    this.length = 0;

    this.createLoader();
  }

  createLoader() {
    this.animateIn = GSAP.timeline();

    this.animateIn.set(this.elements.title, {
      autoAlpha: 1,
    });

    each(this.elements.titleSpans, (line, index) => {
      const letters = line.querySelectorAll('span');

      const onStart = () => {
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

      this.animateIn.fromTo(
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

    this.animateIn.call(() => {
      window.ASSETS.forEach(image => {
        const texture = new Texture(this.canvas.gl, {
          generateMipmaps: false,
        });

        const media = new window.Image();

        media.crossOrigin = 'anonymous';
        media.src = image;
        media.onload = () => {
          texture.image = media;

          this.onAssetLoaded();
        };

        window.TEXTURES[image] = texture;
      });
    });
  }

  onAssetLoaded() {
    this.length += 1;

    const percent = this.length / window.ASSETS.length;

    this.elements.numberText.innerHTML = `${Math.round(percent * 100)}%`;

    if (percent === 1) {
      this.onLoaded();
    }
  }

  onLoaded() {
    return new Promise(() => {
      this.emit('completed');

      this.animateOut = GSAP.timeline({
        delay: 1,
      });

      each(this.elements.titleSpans, (line, index) => {
        const letters = line.querySelectorAll('span');

        const onStart = () => {
          GSAP.to(letters, {
            autoAlpha: 0,
            delay: 0.2,
            display: 'inline-block',
            duration: 1,
            ease: 'back.inOut',
            stagger: 0.015,
            y: '-100%',
          });
        };

        this.animateOut.to(
          line,
          {
            autoAlpha: 0,
            delay: 0.2 * index,
            duration: 1.5,
            onStart,
            ease: 'expo.inOut',
            y: '-100%',
          },
          'start',
        );
      });

      this.animateOut.to(
        this.elements.numberText,
        {
          autoAlpha: 0,
          duration: 1,
          ease,
        },
        'start',
      );

      this.animateOut.to(this.element, {
        autoAlpha: 0,
        duration: 1,
      });

      this.animateOut.call(() => {
        this.destroy();
      });
    });
  }

  destroy() {
    this.element.parentNode.removeChild(this.element);
  }
}
