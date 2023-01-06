import Component from './Component';

import map from 'lodash/map';

// import Title from '../animations/Title';
// import Paragraph from '../animations/Paragraph';
// import Label from '../animations/Label';

export default class Page extends Component {
  constructor({ element, elements }) {
    super({
      autoMount: false,
      element,
      elements: {
        ...elements,
        images: 'img',
        // animationsParagraph: '[data-animation="paragraph"]',
        // animationsTitle: '[data-animation="title"]',
        // animationsLabel: '[data-animation="label"]',
      },
    });
  }

  beforeShow() {
    if (this.elements.images) {
      if (!this.elements.images.length) {
        this.elements.images = [this.elements.images];
      }

      this.elements.images.forEach(image => {
        image.setAttribute('src', image.getAttribute('data-src'));
      });
    }
  }

  //   createAnimations() {
  //     this.animations = [];

  //     // Title

  //     this.animationsTitle = map(this.elements.animationsTitle, element => {
  //       return new Title({
  //         element,
  //       });
  //     });

  //     this.animations.push(...this.animationsTitle);

  //     // Paragraphs

  //     this.animationsParagraph = map(
  //       this.elements.animationsParagraph,
  //       element => {
  //         return new Paragraph({
  //           element,
  //         });
  //       }
  //     );

  //     this.animations.push(...this.animationsParagraph);

  //     // Label

  //     this.animationsLabel = map(this.elements.animationsLabel, element => {
  //       return new Label({
  //         element,
  //       });
  //     });

  //     this.animations.push(...this.animationsLabel);
  //   }

  show(animation) {
    this.beforeShow();
    // this.createAnimations();

    return new Promise(async resolve => {
      if (animation) {
        await animation;
      } else {
        console.warn(`Page doesn't have animation in set.`);
      }

      this.afterShow();

      resolve();
    });
  }

  afterShow() {}

  beforeHide() {}

  hide(animation) {
    this.beforeHide();

    return new Promise(async resolve => {
      if (animation) {
        await animation;
      } else {
        console.warn(`Page doesn't have animation out set.`);
      }

      this.afterHide();

      resolve();
    });
  }

  afterHide() {}
}
