import GSAP from 'gsap';

import Link from '@animations/Link';
import Component from '@classes/Component';

import { COLOR_BRIGHT_GRAY, COLOR_QUARTER_SPANISH_WHITE } from '@utils/colors';
import { mapEach } from '@utils/dom';

export default class Navigation extends Component {
  constructor({ template }) {
    super({
      element: '.navigation',
      elements: {
        items: '.navigation__list__item',
        links: '.navigation__list__link',
      },
    });

    this.links = mapEach(this.elements.links, element => {
      return new Link({
        element,
      });
    });

    this.onChange(template);
  }

  onChange(template) {
    if (template === '/about') {
      GSAP.set(this.element, {
        color: COLOR_BRIGHT_GRAY,
      });

      GSAP.set(this.elements.items[0], { autoAlpha: 1 });
      GSAP.set(this.elements.items[1], { autoAlpha: 0 });
    } else {
      GSAP.set(this.element, {
        color: COLOR_QUARTER_SPANISH_WHITE,
      });

      GSAP.set(this.elements.items[0], { autoAlpha: 0 });
      GSAP.set(this.elements.items[1], { autoAlpha: 1 });
    }
  }
}
