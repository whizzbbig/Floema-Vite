import AutoBind from 'auto-bind';
import Prefix from 'prefix';

interface IAnimation {
  element: HTMLElement;
  elements: NodeListOf<HTMLElement>;
}

export default class Animation {
  element: HTMLElement;
  elements: NodeListOf<HTMLElement>;
  target: HTMLElement | null;
  delay: string | undefined;
  isVisible: boolean;
  observer: IntersectionObserver | null;
  transformPrefix: string;

  constructor({ element, elements }: IAnimation) {
    AutoBind(this);

    const { animationDelay, animationTarget } = element.dataset;

    this.delay = animationDelay;

    this.element = element;
    this.elements = elements;

    this.target = animationTarget ? element.closest(animationTarget) : element;
    this.transformPrefix = Prefix('transform');

    this.isVisible = false;

    if ('IntersectionObserver' in window) {
      this.createObserver();

      this.animateOut();
    } else {
      this.animateIn();
    }
  }

  private createObserver() {
    this.observer = new window.IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!this.isVisible && entry.isIntersecting) {
          this.animateIn();
        } else {
          this.animateOut();
        }
      });
    });

    if (this.target) {
      this.observer.observe(this.target);
    }
  }

  animateIn() {
    this.isVisible = true;
  }

  animateOut() {
    this.isVisible = false;
  }
}
