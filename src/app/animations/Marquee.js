import NormalizeWheel from 'normalize-wheel';
import Prefix from 'prefix';

import each from 'lodash/each';

import Component from '@/classes/Component';

import { getOffset } from '@/utils/dom';
import { lerp } from '@/utils/math';

export default class extends Component {
  constructor({ element, elements, index }) {
    super({
      element,
      elements,
    });

    this.index = index;

    this.transformPrefix = Prefix('transform');

    this.scroll = {
      ease: 0.1,
      position: 0,
      current: 0,
      speed: this.index % 2 === 0 ? 2 : -2,
      target: 0,
      last: 0,
    };

    each(this.elements.items, element => {
      const offset = getOffset(element);

      element.extra = 0;
      element.width = offset.width;
      element.offset = offset.left;
      element.position = 0;
    });

    this.length = this.elements.items.length;

    this.width = this.elements.items[0].width;
    this.widthTotal = this.element.getBoundingClientRect().width;
  }

  enable() {
    this.isEnabled = true;

    this.update();
  }

  disable() {
    this.isEnabled = false;
  }

  onWheel(event) {
    if (!this.isEnabled) return;

    const normalized = NormalizeWheel(event);
    const speed = normalized.pixelY * 0.5;

    let speedValue = this.index % 2 === 0 ? 2 : -2;

    if (speed < 0) {
      speedValue *= -1;
    }

    this.scroll.speed = speedValue;
    this.scroll.target += speedValue;
  }

  transform(element, x) {
    element.style[this.transformPrefix] = `translate3d(${Math.floor(
      x
    )}px, 0, 0)`;
  }

  update() {
    if (!this.isEnabled) return;

    this.scroll.target += this.scroll.speed;

    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );

    if (this.scroll.current < this.scroll.last) {
      this.direction = 'down';
    } else {
      this.direction = 'up';
    }

    each(this.elements.items, (element, index) => {
      element.position = -this.scroll.current - element.extra;

      const offset = element.position + element.offset + element.width;

      element.isBefore = offset < 0;
      element.isAfter = offset > this.widthTotal;

      if (this.direction === 'up' && element.isBefore) {
        element.extra = element.extra - this.widthTotal;

        element.isBefore = false;
        element.isAfter = false;
      }

      if (this.direction === 'down' && element.isAfter) {
        element.extra = element.extra + this.widthTotal;

        element.isBefore = false;
        element.isAfter = false;
      }

      this.transform(element, element.position);
    });

    this.scroll.last = this.scroll.current;
  }

  onResize() {
    each(this.elements.items, element => {
      this.transform(element, 0);

      const offset = getOffset(element);

      element.extra = 0;
      element.width = offset.width;
      element.offset = offset.left;
      element.position = 0;
    });

    this.width = this.elements.items[0].getBoundingClientRect().width;
    this.widthTotal = this.element.getBoundingClientRect().width;

    this.scroll = {
      ease: 0.1,
      position: 0,
      current: 0,
      speed: this.index % 2 === 0 ? 2 : -2,
      target: 0,
      last: 0,
    };
  }
}
