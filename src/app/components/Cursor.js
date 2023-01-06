import Prefix from 'prefix';

import Component from '@/classes/Component';

import { lerp } from '@/utils/math';

export default class extends Component {
  constructor({ lerp = 0.1 }) {
    super({
      element: '.cursor',
      elements: {},
    });

    this.lerp = lerp;

    this.x = {
      target: window.innerWidth / 2,
      value: window.innerWidth / 2,
    };

    this.y = {
      target: window.innerHeight / 2,
      value: window.innerHeight / 2,
    };

    this.transform = Prefix('transform');
  }

  onMouseMove({ originalEvent: { clientX, clientY } }) {
    this.x.target = clientX;
    this.y.target = clientY;
  }

  update() {
    this.x.value = lerp(this.x.value, this.x.target, this.lerp);
    this.y.value = lerp(this.y.value, this.y.target, this.lerp);

    this.element.style[
      this.transform
    ] = `translate(${this.x.value}px, ${this.y.value}px)`;
  }
}
