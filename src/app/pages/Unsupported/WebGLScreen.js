import Page from '@classes/Page';

export default class WebGLScreen extends Page {
  constructor() {
    super({
      id: 'webgl-screen',

      classes: {
        disabled: 'unsupported--disabled',
      },

      element: '#webgl-screen',
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
