// @ts-ignore
import Component from '@classes/Component';

export default class AsyncLoad extends Component {
  private observer: IntersectionObserver;
  private element: HTMLImageElement;

  constructor({ element }: { element: HTMLImageElement }) {
    super({ element });

    this.element = element;
    this.createObserver();
  }

  private createObserver(): void {
    this.observer = new window.IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const dataSrc = this.element.getAttribute('data-src');
          if (!this.element.src && dataSrc) {
            this.element.src = dataSrc;
            this.element.onload = () => {
              this.element.classList.add('loaded');
              this.observer.unobserve(this.element);
            };
          }
        }
      });
    });

    this.observer.observe(this.element);
  }
}
