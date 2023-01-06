import AutoBind from 'auto-bind';
import { Renderer, Camera, Transform, Vec2 } from 'ogl';

import Component from '@/classes/Component';

import Mouse from './components/Mouse';

import Textures from './utils/Textures';

export default class App extends Component {
  constructor({ pages, routes, template }) {
    super();

    AutoBind(this);

    this.pages = pages;
    this.routes = routes;
    this.template = template;

    this.area = new Vec2();
    this.sizes = new Vec2();

    this.createRenderer();
    this.createCamera();

    this.onResize();

    this.createGroup();
    this.createMouse();
    this.createPages();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      dpr: Math.min(window.devicePixelRatio, 2),
    });

    this.gl = this.renderer.gl;
    this.gl.canvas.classList.add('canvas');

    Textures.set(this.gl);

    document.body.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 2;
  }

  createGroup() {
    this.group = new Transform();
  }

  createMouse() {
    this.mouse = new Mouse({
      area: this.area,
      sizes: this.sizes,
    });
  }

  createPages() {
    this.scenes = {};

    for (const key in this.routes) {
      const { scene: Scene, template } = this.routes[key];

      this.scenes[template] = new Scene({
        area: this.area,
        camera: this.camera,
        gl: this.gl,
        group: this.group,
        mouse: this.mouse,
        page: this.pages[template],
        renderer: this.renderer,
        sizes: this.sizes,
      });
    }
  }

  /**
   * Events.
   */
  onMouseDown({ originalEvent }) {
    this.mouse.onMouseDown(originalEvent);
  }

  onMouseMove({ originalEvent }) {
    this.mouse.onMouseMove(originalEvent);
  }

  onMouseUp({ originalEvent }) {
    this.mouse.onMouseUp(originalEvent);
  }

  onResize() {
    this.sizes.x = window.innerWidth;
    this.sizes.y = window.innerHeight;

    this.renderer.setSize(this.sizes.x, this.sizes.y);

    this.camera.perspective({
      aspect: this.sizes.x / this.sizes.y,
    });

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.area.x = width;
    this.area.y = height;

    if (this.mouse) {
      this.mouse.onResize();
    }

    if (this.scene) {
      this.scene?.onResize();
    }
  }

  /**
   * Navigation.
   */
  async hide() {
    await this.scene.hide();

    this.scene.destroy();

    return Promise.resolve();
  }

  show(template) {
    this.template = template;

    this.scene = this.scenes[this.template];
    this.scene.create();

    this.scene.onResize({
      area: this.area,
      sizes: this.sizes,
    });

    this.scene.show();
  }

  /**
   * Update.
   */
  update() {
    if (!this.sizes) return;

    this.mouse?.update();
    this.scene?.update();
  }
}
