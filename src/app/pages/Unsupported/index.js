import Page from '@classes/Page';

export default class UnsupportedScreen extends Page {
  constructor() {
    super({
      id: 'unsupported-screen',

      classes: {
        disabled: 'unsupported--disabled',
      },

      element: '#unsupported-screen',
      elements: {
        wrapper: '.unsupported__wrapper',
      },
    });

    this.show();
  }

  show() {
    this.element.classList.remove(this.classes.disabled);
  }

  hide() {
    this.element.classList.add(this.classes.disabled);
  }
}
