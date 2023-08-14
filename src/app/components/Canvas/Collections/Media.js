import GSAP from 'gsap';
import { Mesh, Program, Transform } from 'ogl';

import Component from '@classes/Component';

import fragment from '@shaders/collections-fragment.glsl';
import vertex from '@shaders/collections-vertex.glsl';

import MediaDOM from './MediaDOM';

export default class Media extends Component {
  constructor({ detail, element, geometry, gl, index, scene, sizes }) {
    super({
      element,
      elements: {
        image: '.collections__gallery__media__image',
      },
    });

    this.detail = detail;
    this.geometry = geometry;
    this.gl = gl;
    this.index = index;
    this.scene = scene;
    this.sizes = sizes;

    this.animation = 0;
    this.group = new Transform();
    this.frame = 0;

    this.opacity = {
      current: 0,
      target: 0,
      lerp: 0.1,
      multiplier: 0,
    };

    this.createDetail();
    this.createJewlery();
    this.createModel();

    this.createBounds({
      sizes: this.sizes,
    });

    this.original =
      -this.sizes.width / 2 +
      this.jewlery.scale.x / 2 +
      this.x * this.sizes.width;

    this.group.setParent(this.scene);
  }

  createDetail() {
    this.detailDOM = new MediaDOM({
      element: this.detail,
    });

    this.detailDOM.on('close', this.animateOut.bind(this));
  }

  createJewlery() {
    const program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 0 },
        tMap: {
          value: window.TEXTURES[this.elements.image.getAttribute('data-src')],
        },
      },
    });

    this.jewlery = new Mesh(this.gl, {
      geometry: this.geometry,
      program,
    });

    this.jewlery.index = this.index;

    this.jewlery.setParent(this.group);
  }

  createModel() {
    const program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 0 },
        tMap: {
          value:
            window.TEXTURES[this.elements.image.getAttribute('data-model-src')],
        },
      },
    });

    this.model = new Mesh(this.gl, {
      geometry: this.geometry,
      program,
    });

    this.model.rotation.y = Math.PI;

    this.model.setParent(this.group);
  }

  createBounds({ sizes }) {
    this.sizes = sizes;

    this.collectionsBounds = this.element.getBoundingClientRect();

    this.updateScale();
    this.updateX();
  }

  /**
   * Animations.
   */
  show() {
    GSAP.to(this.opacity, {
      delay: 0.5,
      multiplier: 1,
    });
  }

  hide() {
    GSAP.to(this.opacity, {
      multiplier: 0,
    });

    this.detailDOM.animateOut();
  }

  /**
   * Events.
   */
  onResize(sizes, scroll) {
    this.detailDOM.onResize();

    this.createBounds(sizes);
    this.updateX(scroll && scroll.x);
  }

  /**
   * Animations.
   */
  animateIn() {
    GSAP.to(this, {
      animation: 1,
      duration: 2,
      ease: 'expo.inOut',
    });

    this.detailDOM.animateIn();

    this.emit('open', this.index);
  }

  animateOut() {
    GSAP.to(this, {
      animation: 0,
      duration: 2,
      ease: 'expo.inOut',
    });

    this.detailDOM.animateOut();

    this.emit('close', this.index);
  }

  /**
   * Loop.
   */
  updateScale() {
    const height = GSAP.utils.interpolate(
      this.collectionsBounds.height,
      this.detailDOM.bounds.height,
      this.animation,
    );
    const width = GSAP.utils.interpolate(
      this.collectionsBounds.width,
      this.detailDOM.bounds.width,
      this.animation,
    );

    this.height = height / window.innerHeight;
    this.width = width / window.innerWidth;

    this.jewlery.scale.x = this.sizes.width * this.width;
    this.jewlery.scale.y = this.sizes.height * this.height;

    this.model.scale.x = this.sizes.width * this.width;
    this.model.scale.y = this.sizes.height * this.height;
  }

  updateX(scroll = 0) {
    const x = GSAP.utils.interpolate(
      this.collectionsBounds.left + scroll,
      this.detailDOM.bounds.left,
      this.animation,
    );

    this.x = x / window.innerWidth;

    this.group.position.x =
      -this.sizes.width / 2 +
      this.jewlery.scale.x / 2 +
      this.x * this.sizes.width;
    this.group.position.z = GSAP.utils.interpolate(0, 0.1, this.animation);

    this.group.rotation.y = GSAP.utils.interpolate(
      0,
      2 * Math.PI,
      this.animation,
    );
  }

  update(scroll, index) {
    this.updateScale();
    this.updateX(scroll);

    const frequency = 500;
    const amplitude = 0.5;

    const sliderY =
      Math.sin((this.original / 10) * (Math.PI * 2) + this.frame / frequency) *
      amplitude;
    const detailY = 0;

    if (this.animation > 0.01) {
      this.jewlery.program.depthTest = false;
      this.jewlery.program.depthWrite = false;

      this.model.program.depthTest = false;
      this.model.program.depthWrite = false;
    } else {
      this.jewlery.program.depthTest = true;
      this.jewlery.program.depthWrite = true;

      this.model.program.depthTest = true;
      this.model.program.depthWrite = true;
    }

    this.group.position.y = GSAP.utils.interpolate(
      sliderY,
      detailY,
      this.animation,
    );

    const sliderZ = GSAP.utils.mapRange(
      -this.sizes.width * 0.25,
      this.sizes.width * 0.25,
      this.group.position.y * 0.3,
      -this.group.position.y * 0.3,
      this.group.position.x,
    );
    const detailZ = Math.PI * 0.01;

    this.group.rotation.z = GSAP.utils.interpolate(
      sliderZ,
      detailZ,
      this.animation,
    );

    this.opacity.target = index === this.index ? 1 : 0.4;
    this.opacity.current = GSAP.utils.interpolate(
      this.opacity.current,
      this.opacity.target,
      this.opacity.lerp,
    );

    this.jewlery.program.uniforms.uAlpha.value =
      this.opacity.multiplier * this.opacity.current;
    this.model.program.uniforms.uAlpha.value =
      this.opacity.multiplier * this.opacity.current;

    this.frame += 1;
  }
}
