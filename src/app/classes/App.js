import AutoBind from 'auto-bind';
import Stats from 'stats.js';

import AppLink from './AppLink';
import AppSprites from './AppSprites';

import Canvas from '@/canvas';

export default class App {
  constructor() {
    if (import.meta.env.DEV) {
      this.initStats();
    }

    AutoBind(this);

    document.documentElement.style.setProperty('--100vh', `${window.innerHeight}px`) // prettier-ignore

    this.initContainer();
  }

  /**
   * Initialization.
   */
  initContainer() {
    this.content = document.querySelector('.app');
    this.template = this.content.getAttribute('data-template');

    if (!this.template) {
      console.warn(
        'The attribute `data-template` in `.app` element is required for the application to run properly.'
      );
    }
  }

  initStats() {
    this.stats = new Stats();

    document.body.appendChild(this.stats.dom);
  }

  initCache() {
    this.cache = {};
  }

  initComponents(components) {
    this.components = components.map(({ component: Component }) => {
      return new Component({});
    });
  }

  initMouse() {
    this.mouse = {
      start: {
        x: 0,
        y: 0,
      },
      end: {
        x: 0,
        y: 0,
      },
    };
  }

  initRoutes(routes) {
    this.routes = routes;
    this.pages = {};

    routes.forEach(({ component: Component, template }) => {
      this.pages[template] = new Component();
    });

    this.page = this.pages[this.template];
    this.page.create();

    if (this.preloader) {
      this.preloader.on('complete', _ => {
        this.onResize();

        this.page.show();
      });
    } else {
      this.page.show();
    }
  }

  initTransitions(transitions) {
    this.transitions = transitions.map(transition => {});
  }

  initLinks() {
    if (this.links) {
      this.links.forEach(link => link.destroy());
    }

    this.links = document.querySelectorAll('a');

    this.links = [...this.links].map(element => {
      const link = new AppLink({
        element,
      });

      link.on('click', this.onLinkClick);

      return link;
    });
  }

  initSprites() {
    this.sprites = new AppSprites();
  }

  init() {
    this.initCache();
    this.initMouse();
    this.initLinks();
    this.initSprites();

    this.onResize();

    this.addEventListeners();

    this.update();
  }

  /**
   * Routing.
   */
  async onLinkClick({ href, pushState = true }) {
    if (this.isFetching) {
      return;
    }

    this.isFetching = true;

    href = href.replace(window.location.origin, '');

    let promiseFetch;

    if (!this.cache[href]) {
      promiseFetch = await window.fetch(href);
    }

    if (promiseFetch) {
      const response = await promiseFetch.text();

      this.cache[href] = response;
    }

    this.onPageRequested({
      href,
      response: this.cache[href],
      pushState,
    });
  }

  async onPageRequested({ href, response, pushState }) {
    const html = document.createElement('div');

    html.innerHTML = response;

    const app = html.querySelector('.app');
    const appTemplate = app.getAttribute('data-template');

    const content = document.createElement('div');

    content.innerHTML = app.innerHTML;

    this.content.setAttribute('data-template', appTemplate);
    this.content.appendChild(content.firstElementChild);

    this.initLinks();

    window.scrollTo(0, 0);

    const previousPage = this.page;

    this.page = this.pages[appTemplate];
    this.page.create();
    this.page.onResize?.();

    if (appTemplate === 'product' || this.template === 'product') {
      await previousPage.hide(this.page);

      this.page.show(previousPage);
    } else {
      this.page.show(previousPage);

      await previousPage.hide(this.page);
    }

    this.template = appTemplate;

    window.requestAnimationFrame(_ => {
      window.requestAnimationFrame(_ => {
        this.page.onResize?.();

        this.content.removeChild(this.content.firstElementChild);

        this.isFetching = false;

        if (pushState) {
          window.history.pushState({}, document.title, href);
        }

        this.components.forEach(component => {
          component.onNavigate?.();
        });
      });
    });
  }

  onPopState() {
    this.onLinkClick({
      href: window.location.href,
      pushState: false,
    });
  }

  /**
   * Events.
   */
  onMouseDown(event) {
    if (event.touches) {
      this.mouse.start = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    } else {
      this.mouse.start = {
        x: event.clientX,
        y: event.clientY,
      };
    }

    this.components.forEach(component =>
      component.onMouseDown?.({
        originalEvent: event,
        mouse: this.mouse,
      })
    );

    this.page.onMouseDown?.({
      originalEvent: event,
      mouse: this.mouse,
    });
  }

  onMouseMove(event) {
    if (event.touches) {
      this.mouse.end = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    } else {
      this.mouse.end = {
        x: event.clientX,
        y: event.clientY,
      };
    }

    this.mouse.distance = {
      x: this.mouse.start.x - this.mouse.end.x,
      y: this.mouse.start.y - this.mouse.end.y,
    };

    this.components.forEach(component =>
      component.onMouseMove?.({
        originalEvent: event,
        mouse: this.mouse,
      })
    );

    this.page.onMouseMove?.({
      originalEvent: event,
      mouse: this.mouse,
    });
  }

  onMouseUp(event) {
    this.components.forEach(component =>
      component.onMouseUp?.({
        originalEvent: event,
        mouse: this.mouse,
      })
    );

    this.page.onMouseUp?.({
      originalEvent: event,
      mouse: this.mouse,
    });
  }

  onResize() {
    window.INNER_SIZES = {
      height: window.innerHeight,
      width: window.innerWidth,
    };

    window.OUTER_SIZES = {
      height: window.outerHeight,
      width: window.outerWidth,
    };

    document.documentElement.style.setProperty(
      '--100vh',
      `${window.INNER_SIZES.height}px`
    );

    this.components.forEach(component => component.onResize?.());
    this.page.onResize?.();
  }

  /**
   * Listeners.
   */
  addEventListeners() {
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);

    window.addEventListener('touchstart', this.onMouseDown);
    window.addEventListener('touchmove', this.onMouseMove);
    window.addEventListener('touchup', this.onMouseUp);

    window.addEventListener('resize', this.onResize);

    window.addEventListener('popstate', this.onPopState);
  }

  /**
   * Loop.
   */
  update() {
    if (this.stats) {
      this.stats.begin();
    }

    this.page?.update?.();

    this.components.forEach(component => component.update?.());

    if (this.stats) {
      this.stats.end();
    }

    this.frame = window.requestAnimationFrame(this.update);
  }
}
