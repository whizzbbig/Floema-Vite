import Page from '@classes/Page';

import { mapEach } from '@utils/dom';
import { split } from '@utils/text';

export default class Collections extends Page {
  constructor() {
    super({
      id: 'collections',

      classes: {
        active: 'collections--active',
      },

      element: '.collections',
      elements: {
        wrapper: '.collections__wrapper',

        articlesDescriptions: '.collections__article__description',
      },
    });
  }

  /**
   * Animations.
   */
  async show(url) {
    this.element.classList.add(this.classes.active);

    mapEach(this.elements.articlesDescriptions, element => {
      split({
        element,
        expression: '<br>',
      });

      split({
        element,
        expression: '<br>',
      });
    });

    return super.show(url);
  }

  async hide(url) {
    this.element.classList.remove(this.classes.active);

    return super.hide(url);
  }
}
