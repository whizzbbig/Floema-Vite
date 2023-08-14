import Animation from '@classes/Animation';

export default class extends Animation {
  constructor({ element }) {
    super({
      element,
    });
  }

  update(scroll) {
    this.element.style[this.transformPrefix] = `rotate(${
      scroll.current * 0.25
    }deg)`;
  }
}
