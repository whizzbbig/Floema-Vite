import Page from '@classes/Page';

import { mapEach } from '@utils/dom';

import Detail from './Detail';

export default class Details extends Page {
  constructor() {
    super({
      id: 'details',

      classes: {
        active: 'details--active',
      },

      element: '.details',
      elements: {
        details: '.detail',
      },
    });
  }

  create() {
    super.create();

    this.details = mapEach(this.elements.details, element => {
      return new Detail({
        element,
      });
    });
  }

  /**
   * Animations.
   */
  async show(url) {
    this.element.classList.add(this.classes.active);

    return super.show(url);
  }

  async hide(url) {
    this.element.classList.remove(this.classes.active);

    return super.hide(url);
  }

  destroy() {
    super.destroy();

    mapEach(this.details, element => {
      element.destroy();
    });
  }
}
