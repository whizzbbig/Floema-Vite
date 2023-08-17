import { Camera, Renderer, Transform } from 'ogl';

import About from './About';
import Collections from './Collections';
import Home from './Home';

export default class Canvas {
  constructor({ template }) {
    this.template = template;

    this.x = {
      start: 0,
      distance: 0,
      end: 0,
    };

    this.y = {
      start: 0,
      distance: 0,
      end: 0,
    };

    this.createRenderer();
    this.createCamera();
    this.createScene();

    this.onResize();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
    });

    this.gl = this.renderer.gl;

    document.body.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.position.z = 5;
  }

  createScene() {
    this.scene = new Transform();
  }

  /**
   * Home.
   */
  createHome() {
    this.home = new Home({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes,
    });
  }

  /**
   * About.
   */
  createAbout() {
    this.about = new About({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes,
    });
  }

  /**
   * Collections.
   */
  createCollections() {
    this.collections = new Collections({
      camera: this.camera,
      gl: this.gl,
      renderer: this.renderer,
      scene: this.scene,
      sizes: this.sizes,
      transition: this.transition,
    });
  }

  /**
   * Events.
   */
  onPreloaded() {
    this.createAbout();
    this.createCollections();
    this.createHome();

    this.onChange(this.template, true);
  }

  onChange(template, isPreloaded) {
    if (template === '/about') {
      this.about.show(isPreloaded);
    } else {
      this.about.hide();
    }

    if (template === '/collections') {
      this.collections.show(isPreloaded);
    } else {
      this.collections.hide();
    }

    if (template === '/') {
      this.home.show(isPreloaded);
    } else {
      this.home.hide();
    }

    this.template = template;
  }

  onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera.perspective({
      aspect: window.innerWidth / window.innerHeight,
    });

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.sizes = {
      height,
      width,
    };

    const values = {
      sizes: this.sizes,
    };

    if (this.about) {
      this.about.onResize(values);
    }

    if (this.collections) {
      this.collections.onResize(values);
    }

    if (this.home) {
      this.home.onResize(values);
    }
  }

  onTouchDown(event) {
    this.isDown = true;

    this.x.start = event.touches ? event.touches[0].clientX : event.clientX;
    this.y.start = event.touches ? event.touches[0].clientY : event.clientY;

    const values = {
      x: this.x,
      y: this.y,
    };

    if (this.about) {
      this.about.onTouchDown(values);
    }

    if (this.collections) {
      this.collections.onTouchDown(values);
    }

    if (this.home) {
      this.home.onTouchDown(values);
    }
  }

  onTouchMove(event) {
    const x = event.touches ? event.touches[0].clientX : event.clientX;
    const y = event.touches ? event.touches[0].clientY : event.clientY;

    this.x.end = x;
    this.y.end = y;

    const values = {
      x: this.x,
      y: this.y,
    };

    if (this.collections) {
      this.collections.onTouchMove(values);
    }

    if (!this.isDown) return;

    if (this.about) {
      this.about.onTouchMove(values);
    }

    if (this.home) {
      this.home.onTouchMove(values);
    }
  }

  onTouchUp(event) {
    this.isDown = false;

    const x = event.changedTouches
      ? event.changedTouches[0].clientX
      : event.clientX;
    const y = event.changedTouches
      ? event.changedTouches[0].clientY
      : event.clientY;

    this.x.end = x;
    this.y.end = y;

    const values = {
      x: this.x,
      y: this.y,
    };

    if (this.about) {
      this.about.onTouchUp(values);
    }

    if (this.collections) {
      this.collections.onTouchUp(values);
    }

    if (this.home) {
      this.home.onTouchUp(values);
    }
  }

  onWheel(event) {
    if (this.collections) {
      this.collections.onWheel(event);
    }

    if (this.home) {
      this.home.onWheel(event);
    }
  }

  /**
   * Loop.
   */
  update(scroll) {
    if (this.about) {
      this.about.update(scroll);
    }

    if (this.collections) {
      this.collections.update();
    }

    if (this.home) {
      this.home.update();
    }

    this.renderer.render({
      camera: this.camera,
      scene: this.scene,
    });
  }
}
