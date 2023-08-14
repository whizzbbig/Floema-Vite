import Page from '@classes/Page';

import Titles from './Titles';

export default class Home extends Page {
  constructor() {
    super({
      id: 'home',

      classes: {
        active: 'home--active',
      },

      element: '.home',
      elements: {
        wrapper: '.home__wrapper',

        navigation: document.querySelector('.navigation'),
        link: '.home__link',
        list: '.home__titles',
        items: '.home__titles__label, .home__titles__title',
      },
    });
  }

  create() {
    super.create();

    this.titles = new Titles({
      element: document.body,
      elements: {
        list: this.elements.list,
        items: this.elements.items,
      },
    });

    this.titles.enable();
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

  /**
   * Events.
   */
  onResize() {
    super.onResize();

    this.titles.onResize();
  }

  onTouchDown(event) {
    this.titles.onTouchDown(event);
  }

  onTouchMove(event) {
    this.titles.onTouchMove(event);
  }

  onTouchUp(event) {
    this.titles.onTouchUp(event);
  }

  onWheel(event) {
    this.titles.onWheel(event);
  }

  /**
   * Loop.
   */
  update() {
    super.update();

    this.titles.update();
  }

  /**
   * Destroy.
   */
  destroy() {
    super.destroy();
  }
}
