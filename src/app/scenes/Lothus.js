import { Mesh, Plane, Program, Texture } from 'ogl';

import Scene from '@/canvas/components/Scene';

import fragment from '@/shaders/lothus-fragment.glsl';
import vertex from '@/shaders/lothus-vertex.glsl';

import { lerp } from '@/utils/math';

export default class LothusScene extends Scene {
  create() {
    this.x = 0;
    this.y = 0;

    // TODO: Refactor the Texture loading into an utility class.
    this.page.elements.media.style.visibility = 'hidden';

    this.createTexture();
    this.createMask();
    this.createMesh();
  }

  createTexture() {
    this.texture = new Texture(this.gl, {
      generateMipmaps: false,
    });

    const image = new window.Image();

    image.crossOrigin = 'anonymous';
    image.src = this.page.elements.media.src;
    image.onload = _ => {
      this.texture.image = image;
    };
  }

  createMask() {
    this.mask = new Texture(this.gl, {
      generateMipmaps: false,
    });

    const image = new window.Image();

    image.crossOrigin = 'anonymous';
    image.src = this.page.elements.media.src;
    image.onload = _ => {
      this.mask.image = image;
    };
  }

  createMesh() {
    const geometry = new Plane(this.gl);

    const program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 1 },
        tMap: { value: this.texture },
        tMask: { value: this.mask },
        uMouse: { value: [0, 0] },
        uResolution: { value: [0, 0, 0, 0] },
      },
      transparent: true,
    });

    this.mesh = new Mesh(this.gl, {
      geometry,
      program,
    });

    this.mesh.setParent(this.group);
  }

  /**
   * Loop.
   */
  updateRatio() {
    if (!this.texture?.image) return;

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

  updateScale() {
    this.mesh.scale.x =
      (this.area.width * this.bounds.width) / this.sizes.width;
    this.mesh.scale.y =
      (this.area.height * this.bounds.height) / this.sizes.height;
  }

  updatePosition() {
    this.mesh.position.y =
      this.area.height / 2 -
      this.mesh.scale.y / 2 -
      (this.bounds.top / this.sizes.height) * this.area.height;
    this.mesh.position.x =
      -(this.area.width / 2) +
      this.mesh.scale.x / 2 +
      (this.bounds.left / this.sizes.width) * this.area.width;
  }

  update() {
    this.updateRatio();
    this.updateScale();
    this.updatePosition();

    this.x = lerp(this.mouse.normalized.x, this.x, 0.1);
    this.y = lerp(this.mouse.normalized.y, this.y, 0.1);

    this.mesh.program.uniforms.uMouse.value = [this.x, this.y];
  }

  /**
   * Events.
   */
  onResize(event) {
    super.onResize(event);

    this.bounds = this.page.elements.media.getBoundingClientRect();
  }
}
