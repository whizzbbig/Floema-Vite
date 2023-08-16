import { Plane, Transform } from 'ogl';
import GSAP from 'gsap';

import map from 'lodash/map';

import { gui } from '@classes/GUI';

import Media from './Media';

export default class Home {
  constructor({ gl, scene, sizes }) {
    this.gl = gl;
    this.scene = scene;
    this.sizes = sizes;

    this.group = new Transform();

    this.galleryElement = document.querySelector('.home__gallery');
    this.mediasElements = document.querySelectorAll(
      '.home__gallery__media__image',
    );

    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1,
    };

    this.scrollCurrent = {
      x: 0,
      y: 0,
    };

    this.scroll = {
      x: 0,
      y: 0,
    };

    this.speed = {
      current: 0,
      target: 0,
      lerp: 0.1,
    };

    this.velocity = 2;

    this.createGeometry();
    this.createGallery();

    this.onResize({
      sizes: this.sizes,
    });

    if (gui) this.createDebug();
  }

  createGeometry() {
    this.geometry = new Plane(this.gl, {
      heightSegments: 20,
      widthSegments: 20,
    });
  }

  createGallery() {
    this.medias = map(this.mediasElements, (element, index) => {
      return new Media({
        element,
        geometry: this.geometry,
        index,
        gl: this.gl,
        scene: this.group,
        sizes: this.sizes,
      });
    });
  }

  /**
   * Animations.
   */
  show(isPreloaded) {
    this.group.setParent(this.scene);

    map(this.medias, media => media.show(isPreloaded));
  }

  hide() {
    this.group.setParent(null);

    map(this.medias, media => media.hide());
  }

  /**
   * Events.
   */
  onResize(event) {
    this.galleryBounds = this.galleryElement.getBoundingClientRect();

    this.sizes = event.sizes;

    this.gallerySizes = {
      height:
        (this.galleryBounds.height / window.innerHeight) * this.sizes.height,
      width: (this.galleryBounds.width / window.innerWidth) * this.sizes.width,
    };

    this.scroll.y = this.y.target = 0;

    map(this.medias, media => media.onResize(event, this.scroll));
  }

  onTouchDown() {
    this.scrollCurrent.x = this.scroll.x;
    this.scrollCurrent.y = this.scroll.y;
  }

  onTouchMove({ y }) {
    const yDistance = y.start - y.end;

    this.y.target = this.scrollCurrent.y - yDistance;
  }

  onTouchUp() {}

  onWheel({ pixelY }) {
    this.y.target += pixelY;

    this.velocity = pixelY > 0 ? 2 : -2;
  }

  /**
   * Debug.
   */
  createDebug() {
    const folder = gui.addFolder('Home');
    folder.add(this, 'velocity').min(0).max(10).step(0.01);

    folder.add(this.y, 'lerp').min(0).max(1).step(0.01).name('Y Lerp');
    folder.add(this.speed, 'lerp').min(0).max(1).step(0.01).name('Speed Lerp');

    folder.add(this, 'show').name('Show Gallery');
    folder.add(this, 'hide').name('Hide Gallery');
  }

  /**
   * Update.
   */
  update() {
    this.y.target += this.velocity;

    this.speed.target = (this.y.target - this.y.current) * 0.001;
    this.speed.current = GSAP.utils.interpolate(
      this.speed.current,
      this.speed.target,
      this.speed.lerp,
    );

    this.y.current = GSAP.utils.interpolate(
      this.y.current,
      this.y.target,
      this.y.lerp,
    );

    if (this.scroll.y < this.y.current) {
      this.y.direction = 'top';
    } else if (this.scroll.y > this.y.current) {
      this.y.direction = 'bottom';
    }

    this.scroll.y = this.y.current;

    map(this.medias, media => {
      const offsetY = this.sizes.height * 0.5;
      const scaleY = media.mesh.scale.y / 2;

      if (this.y.direction === 'top') {
        const y = media.mesh.position.y + scaleY;

        if (y < -offsetY) {
          media.extra.y += this.gallerySizes.height;
        }
      } else if (this.y.direction === 'bottom') {
        const y = media.mesh.position.y - scaleY;

        if (y > offsetY) {
          media.extra.y -= this.gallerySizes.height;
        }
      }

      media.update(this.scroll, this.speed.current);
    });
  }

  /**
   * Destroy.
   */
  destroy() {
    this.scene.removeChild(this.group);
  }
}
