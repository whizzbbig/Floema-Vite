import GSAP from 'gsap';
import { Mesh, Program } from 'ogl';

import SceneElement from './SceneElement';

import Textures from '../utils/Textures';
import { getBoundingClientRect } from '@/utils/dom';

export default class extends SceneElement {
  constructor({ area, element, geometry, gl, group, sizes }) {
    super();

    this.area = area;
    this.element = element;
    this.geometry = geometry;
    this.gl = gl;
    this.group = group;
    this.sizes = sizes;

    this.elements = {
      hover: this.element.closest('[data-gl="media-hover"]'),
      image: this.element.querySelector('img'),
    };

    this.elements.image.style.visibility = 'hidden';

    this.scroll = 0;
    this.speed = 0;
    this.z = parseFloat(this.element.getAttribute('data-gl-z'));

    this.createMesh();
  }

  createMesh() {
    this.textureValues = { value: [0, 0, 0, 0] };
    this.texture = Textures.load(this.elements.image.getAttribute('data-src'), {
      onLoad: _ => this.createBounds(),
    });

    const program = new Program(this.gl, {
      depthWrite: false,
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 0 },
        tMap: { value: this.texture },
        uResolution: this.textureValues,
        uSpeed: { value: 0 },
      },
      transparent: true,
    });

    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program,
    });

    this.mesh.setParent(this.group);
  }

  createBounds() {
    this.bounds = getBoundingClientRect(this.element);
  }

  /**
   * Loop.
   */
  updateRatio() {
    if (this.texture.image) {
      this.aspect = this.texture.image.height / this.texture.image.width;

      let a1;
      let a2;

      if (this.bounds.height / this.bounds.width > this.aspect) {
        a1 = (this.bounds.width / this.bounds.height) * this.aspect;
        a2 = 1;
      } else {
        a1 = 1;
        a2 = this.bounds.height / this.bounds.width / this.aspect;
      }

      this.mesh.program.uniforms.uResolution.value = [
        this.bounds.width,
        this.bounds.height,
        a1,
        a2,
      ];
    }
  }

  updateScale() {
    this.mesh.scale.x = (this.area.x * this.bounds.width) / this.sizes.x;
    this.mesh.scale.y = (this.area.y * this.bounds.height) / this.sizes.y;
  }

  updateX(x = 0) {
    if (this.element.x) {
      x -= this.element.x;
    }

    this.mesh.position.x =
      -(this.area.x / 2) +
      this.mesh.scale.x / 2 +
      ((this.bounds.left - x) / this.sizes.x) * this.area.x;
  }

  updateY(y = 0) {
    if (this.element.y) {
      y -= this.element.y;
    }

    this.mesh.position.y =
      this.area.y / 2 -
      this.mesh.scale.y / 2 -
      ((this.bounds.top - y) / this.sizes.y) * this.area.y;
  }

  updateZ(z = 0) {
    this.mesh.position.z = this.z;
  }

  update({ page }) {
    if (!this.bounds) return;

    const scroll = page.scrolling.current || 0;

    this.updateRatio();
    this.updateScale();
    this.updateX();
    this.updateY(scroll);
    this.updateZ();

    this.speed += (scroll - this.scroll) * 0.001;
    this.speed *= 0.9;

    this.mesh.program.uniforms.uSpeed.value = this.speed;

    this.scroll = scroll;
  }

  /**
   * Events.
   */
  onResize(event) {
    super.onResize(event);

    this.createBounds();
  }

  /**
   * Listeners.
   */
  addEventListeners() {
    if (this.elements.wrapper) {
      this.elements.wrapper.addEventListener('mouseenter', this.onMouseEnter, {
        passive: true,
      });
      this.elements.wrapper.addEventListener('mouseleave', this.onMouseLeave, {
        passive: true,
      });
    }
  }

  /**
   * Animations.
   */
  show() {
    GSAP.to(this.mesh.program.uniforms.uAlpha, {
      duration: 1.5,
      ease: 'expo.inOut',
      value: 1,
    });
  }

  hide() {
    return new Promise(resolve => {
      GSAP.to(this.mesh.program.uniforms.uAlpha, {
        duration: 1.5,
        ease: 'expo.inOut',
        onComplete: resolve,
        value: 0,
      });
    });
  }

  /**
   * Destroy.
   */
  destroy() {
    this.mesh.setParent(null);
  }
}
