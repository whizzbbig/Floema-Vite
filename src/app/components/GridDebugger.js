import Component from '@/classes/Component';

export default class extends Component {
  constructor() {
    super({
      element: '.layout-grid',
      elements: {
        toggleButton: '.toggle',
        debugger: '.debugger',
      },
    });

    this.visible = false;
    this.isMobile = window.matchMedia('(max-width: 800px)').matches;

    this.columns = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        '--layout-columns-count'
      )
    );

    this.gridGap = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        '--layout-columns-gap'
      )
    );

    this.updateGrid = this.updateGrid.bind(this);

    // Call updateGrid to set initial column values
    this.updateGrid();
  }

  updateGrid() {
    this.isMobile = window.matchMedia('(max-width: 800px)').matches;

    if (this.isMobile) {
      this.columns = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--layout-columns-count'
        )
      );

      this.gridGap = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--layout-columns-gap'
        )
      );
    }

    this.element.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`;
    this.element.style.gridGap = `${this.gridGap}vw`;

    // update the span elements in the debugger div
    const numSpans = this.elements.debugger.childElementCount;
    if (this.columns > numSpans) {
      for (let i = numSpans; i < this.columns; i++) {
        const span = document.createElement('span');
        this.elements.debugger.appendChild(span);
      }
    } else if (this.columns < numSpans) {
      for (let i = numSpans - 1; i >= this.columns; i--) {
        this.elements.debugger.children[i].remove();
      }
    }
  }

  addEventListeners() {
    this.elements.toggleButton.addEventListener('click', () => {
      this.visible = !this.visible;

      if (this.visible) {
        this.element.style.display = 'grid';
        this.updateGrid();
      } else {
        this.element.style.display = 'none';
      }
    });

    window.addEventListener('resize', this.updateGrid);
  }

  update() {
    if (!this.visible) {
      this.elements.debugger.innerHTML = '';
    }
  }
}
