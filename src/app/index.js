import '@styles/index.scss';
import '@utils/polyfill';
import '@utils/scroll';

import AutoBind from 'auto-bind';
import Stats from 'stats.js';
import NormalizeWheel from 'normalize-wheel';
import each from 'lodash/each';
import FontFaceObserver from 'fontfaceobserver';

import { Detection } from '@classes/Detection';

import Canvas from '@components/Canvas';
import Navigation from '@components/Navigation';
import Preloader from '@components/Preloader';
import Transition from '@components/Transition';

import Unsupported from '@pages/Unsupported';
import About from '@pages/About';
import Collections from '@pages/Collections';
import Home from '@pages/Home';

class App {
  constructor() {
    this.template = window.location.pathname;

    if (import.meta.env.DEV && window.location.search.indexOf('fps') > -1) {
      this.createStats();
    }

    this.mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    AutoBind(this);

    Detection.check({
      onErrorWebGL: this.createUnsupportedScreen,
      onSuccess: this.init,
    });
  }

  init() {
    this.createCanvas();
    this.createPreloader();

    this.createTransition();
    this.createNavigation();
    this.createPages();

    this.addEventListeners();
    this.addLinkListeners();

    this.onResize();
  }

  createNavigation() {
    this.navigation = new Navigation({
      template: this.template,
    });
  }

  createPreloader() {
    this.preloader = new Preloader({
      canvas: this.canvas,
    });

    this.preloader.once('completed', this.onPreloaded);
  }

  createCanvas() {
    this.canvas = new Canvas({
      template: this.template,
    });
  }

  createTransition() {
    this.transition = new Transition();
  }

  createPages() {
    this.about = new About();
    this.collections = new Collections();
    this.home = new Home();

    this.pages = {
      '/': this.home,
      '/about': this.about,
      '/collections': this.collections,
    };

    this.page = this.pages[this.template];
  }

  createUnsupportedScreen() {
    this.UnsupportedScreen = new Unsupported();
  }

  /**
   * Stats.
   */
  createStats() {
    this.stats = new Stats();

    document.body.appendChild(this.stats.dom);
  }

  createAnalytics() {
    // Custom events for Plausible, Fathom, etc
  }

  /**
   * Events.
   */
  onPreloaded() {
    this.onResize();

    this.createAnalytics();

    this.update();

    this.canvas.onPreloaded();

    this.page.show();
  }

  onContextMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  onPopState() {
    this.onChange({
      url: window.location.pathname,
      push: false,
    });
  }

  async onChange({ url, push = true }) {
    url = url.replace(window.location.origin, '');

    const page = this.pages[url];

    await this.transition.show({
      color: page.element.getAttribute('data-color'),
    });

    if (push) {
      window.history.pushState({}, '', url);
    }

    this.template = window.location.pathname;

    this.page.hide();

    this.navigation.onChange(this.template);
    this.canvas.onChange(this.template);

    this.page = page;
    this.page.show();

    this.onResize();

    this.transition.hide();
  }

  onResize() {
    if (this.page && this.page.onResize) {
      this.page.onResize();
    }

    window.requestAnimationFrame(() => {
      if (this.canvas && this.canvas.onResize) {
        this.canvas.onResize();
      }
    });
  }

  onKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
    }

    if (event.key === 'ArrowDown') {
      this.page.scroll.target += 100;
    } else if (event.key === 'ArrowUp') {
      this.page.scroll.target -= 100;
    }
  }

  onFocusIn(event) {
    event.preventDefault();
  }

  onTouchDown(event) {
    if (this.canvas && this.canvas.onTouchDown) {
      this.canvas.onTouchDown(event);
    }

    if (this.page && this.page.onTouchDown) {
      this.page.onTouchDown(event);
    }
  }

  onTouchMove(event) {
    if (this.canvas && this.canvas.onTouchMove) {
      this.canvas.onTouchMove(event);
    }

    if (this.page && this.page.onTouchDown) {
      this.page.onTouchMove(event);
    }
  }

  onTouchUp(event) {
    if (this.canvas && this.canvas.onTouchUp) {
      this.canvas.onTouchUp(event);
    }

    if (this.page && this.page.onTouchDown) {
      this.page.onTouchUp(event);
    }
  }

  onWheel(event) {
    const normalizedWheel = NormalizeWheel(event);

    if (this.canvas && this.canvas.onWheel) {
      this.canvas.onWheel(normalizedWheel);
    }

    if (this.page && this.page.onWheel) {
      this.page.onWheel(normalizedWheel);
    }
  }

  /**
   * Loop.
   */
  update() {
    if (this.stats) {
      this.stats.begin();
    }

    if (this.page) {
      this.page.update();
    }

    if (this.canvas) {
      this.canvas.update(this.page.scroll);
    }

    if (this.stats) {
      this.stats.end();
    }

    this.frame = window.requestAnimationFrame(this.update);
  }

  /***
   * Listeners.
   */
  addEventListeners() {
    window.addEventListener('popstate', this.onPopState, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });

    window.addEventListener('mousedown', this.onTouchDown, { passive: true });
    window.addEventListener('mousemove', this.onTouchMove, { passive: true });
    window.addEventListener('mouseup', this.onTouchUp, { passive: true });

    window.addEventListener('touchstart', this.onTouchDown, { passive: true });
    window.addEventListener('touchmove', this.onTouchMove, { passive: true });
    window.addEventListener('touchend', this.onTouchUp, { passive: true });

    window.addEventListener('wheel', this.onWheel, { passive: true });

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('focusin', this.onFocusIn);

    window.oncontextmenu = this.onContextMenu;
  }

  addLinkListeners() {
    const links = document.querySelectorAll('a');

    each(links, link => {
      const isLocal = link.href.indexOf(window.location.origin) > -1;
      const isAnchor = link.href.indexOf('#') > -1;

      const isNotEmail = link.href.indexOf('mailto') === -1;
      const isNotPhone = link.href.indexOf('tel') === -1;

      if (isLocal) {
        link.onclick = event => {
          event.preventDefault();

          if (!isAnchor) {
            this.onChange({
              url: link.href,
            });
          }
        };
      } else if (isNotEmail && isNotPhone) {
        link.rel = 'noopener';
        link.target = '_blank';
      }
    });
  }
}

const georgeX = new FontFaceObserver('George X');
const suisseBP = new FontFaceObserver('Suisse BP');

const timeout = 2000;

Promise.all([georgeX.load(null, timeout), suisseBP.load(null, timeout)])
  .then(() => {
    window.APP = new App();
  })
  .catch(() => {
    window.APP = new App();
  });

console.log(
  '%c Developed by Bizarro - https://bizar.ro/',
  'background: #000; color: #fff;',
);
