import { Plane, Raycast, Transform, Vec2 } from 'ogl';
import GSAP from 'gsap';
import Prefix from 'prefix';

import { getOffset, mapEach } from '@utils/dom';

import Media from './Media';

export default class Collections {
  constructor({ camera, gl, renderer, scene, sizes, transition }) {
    this.id = 'collections';

    this.camera = camera;
    this.gl = gl;
    this.renderer = renderer;
    this.scene = scene;
    this.sizes = sizes;
    this.transition = transition;

    this.transformPrefix = Prefix('transform');

    this.group = new Transform();

    this.galleryWrapperElement = document.querySelector(
      '.collections__gallery__wrapper',
    );

    this.titlesElement = document.querySelector('.collections__titles');
    this.titlesItemsElements = document.querySelectorAll(
      '.collections__titles__wrapper:nth-child(2) .collections__titles__item',
    );

    this.collectionsElement = document.querySelector('.collections');
    this.collectionsElements = document.querySelectorAll(
      '.collections__article',
    );
    this.collectionsElementsLinks = document.querySelectorAll(
      '.collections__gallery__link',
    );
    this.collectionsElementsActive = 'collections__article--active';

    this.detailsElements = document.querySelectorAll('.detail');
    this.mediasElements = document.querySelectorAll(
      '.collections__gallery__media',
    );

    this.mouse = new Vec2();

    this.scroll = {
      current: 0,
      start: 0,
      target: 0,
      lerp: 0.1,
      velocity: 1,
    };

    this.createRaycast();
    this.createGeometry();
    this.createGallery();

    this.onResize({
      sizes: this.sizes,
    });
  }

  createRaycast() {
    this.raycast = new Raycast(this.gl);
  }

  createGeometry() {
    this.geometry = new Plane(this.gl);
  }

  createGallery() {
    this.medias = mapEach(this.mediasElements, (element, index) => {
      const media = new Media({
        detail: this.detailsElements[index],
        element,
        geometry: this.geometry,
        index,
        gl: this.gl,
        scene: this.group,
        sizes: this.sizes,
      });

      media.on('open', this.onOpen.bind(this));
      media.on('close', this.onClose.bind(this));

      return media;
    });

    this.mediasMeshes = mapEach(this.medias, media => media.jewlery);
  }

  /**
   * Animations.
   */
  async show() {
    this.isVisible = true;

    this.group.setParent(this.scene);

    if (this.transition) {
      const { src } = this.transition.mesh.program.uniforms.tMap.value.image;
      const texture = window.TEXTURES[src];
      const media = this.medias.find(media => media.texture === texture);
      const scroll =
        -media.bounds.left - media.bounds.width / 2 + window.innerWidth / 2;

      this.update();

      this.transition.animate(
        {
          position: { x: 0, y: media.mesh.position.y, z: 0 },
          rotation: media.mesh.rotation,
          scale: media.mesh.scale,
        },
        () => {
          media.opacity.multiplier = 1;

          mapEach(this.medias, item => {
            if (media !== item) {
              item.show();
            }
          });

          this.scroll.current =
            this.scroll.target =
            this.scroll.start =
            this.scroll.last =
              scroll;
        },
      );
    } else {
      mapEach(this.medias, media => media.show());
    }
  }

  hide() {
    document.body.style.cursor = '';

    this.isVisible = false;

    this.group.setParent(null);

    mapEach(this.medias, media => media.hide());
  }

  /**
   * Listeners.
   */
  onOpen(index) {
    this.isVisible = false;

    this.collectionsElement.classList.add('collections--open');

    mapEach(this.medias, (media, mediaIndex) => {
      if (mediaIndex === index) {
        media.show();
      } else {
        media.hide();
      }
    });
  }

  onClose() {
    this.isVisible = true;

    this.collectionsElement.classList.remove('collections--open');

    mapEach(this.medias, media => {
      media.show();
    });
  }

  /**
   * Events.
   */
  onResize(event) {
    this.sizes = event.sizes;

    this.bounds = this.galleryWrapperElement.getBoundingClientRect();

    this.scroll.last = this.scroll.target = 0;

    mapEach(this.medias, media => media.onResize(event, this.scroll));

    mapEach(this.collectionsElementsLinks, (element, elementIndex) => {
      element.bounds = getOffset(element);
    });

    mapEach(this.titlesItemsElements, element => {
      element.bounds = getOffset(element);
    });

    this.scroll.limit = this.bounds.width - this.medias[0].element.clientWidth;
  }

  onTouchDown({ x, y }) {
    if (!this.isVisible) return;

    this.isDown = true;

    this.scroll.last = this.scroll.current;
  }

  onTouchMove({ x, y }) {
    if (!this.isVisible) return;

    this.mouse.set(
      2.0 * (x.end / this.renderer.width) - 1.0,
      2.0 * (1.0 - y.end / this.renderer.height) - 1.0,
    );

    this.raycast.castMouse(this.camera, this.mouse);

    const [hit] = this.raycast.intersectBounds(this.mediasMeshes);

    this.hit = hit ? hit.index : null;

    if (this.hit !== null && this.index === this.hit) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = '';
    }

    if (!this.isDown) return;

    const distance = x.start - x.end;

    this.scroll.target = this.scroll.last - distance;
  }

  onTouchUp({ x, y }) {
    if (!this.isVisible) return;

    this.isDown = false;

    if (this.hit !== null && this.index === this.hit) {
      this.medias[this.hit].animateIn();
    }
  }

  onWheel({ pixelY }) {
    if (!this.isVisible) return;

    this.scroll.target += pixelY;
  }

  /**
   * Changed.
   */
  onChange(index) {
    this.index = index;

    const selectedCollection = parseInt(
      this.mediasElements[this.index].getAttribute('data-index'),
    );

    mapEach(this.collectionsElements, (element, elementIndex) => {
      if (elementIndex === selectedCollection) {
        element.classList.add(this.collectionsElementsActive);
      } else {
        element.classList.remove(this.collectionsElementsActive);
      }
    });
  }

  onUpdateTitle() {
    const map = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    };

    mapEach(this.collectionsElementsLinks, (element, elementIndex) => {
      const index = element.getAttribute('data-index');

      map[index] += element.bounds.width;
    });

    const progress = [
      GSAP.utils.clamp(
        0,
        1,
        GSAP.utils.mapRange(0, map[0], 0, 1, -this.scroll.current),
      ),
      GSAP.utils.clamp(
        0,
        1,
        GSAP.utils.mapRange(0, map[1], 0, 1, -this.scroll.current - map[0]),
      ),
      GSAP.utils.clamp(
        0,
        1,
        GSAP.utils.mapRange(
          0,
          map[2],
          0,
          1,
          -this.scroll.current - map[0] - map[1],
        ),
      ),
      GSAP.utils.clamp(
        0,
        1,
        GSAP.utils.mapRange(
          0,
          map[3],
          0,
          1,
          -this.scroll.current - map[0] - map[1] - map[2],
        ),
      ),
    ];

    let y = 0;

    mapEach(this.titlesItemsElements, (element, index) => {
      y += element.bounds.height * progress[index];
    });

    this.titlesElement.style[
      this.transformPrefix
    ] = `translateY(calc(-${y}px - 33.33% + ${window.innerHeight * 0.5}px))`;
  }

  /**
   * Update.
   */
  update() {
    this.scroll.target = GSAP.utils.clamp(
      -this.scroll.limit,
      0,
      this.scroll.target,
    );

    this.scroll.current = GSAP.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      this.scroll.lerp,
    );

    if (this.scroll.last < this.scroll.current) {
      this.scroll.direction = 'right';
    } else if (this.scroll.last > this.scroll.current) {
      this.scroll.direction = 'left';
    }

    this.scroll.last = this.scroll.current;

    const index = Math.floor(
      Math.abs(
        (this.scroll.current - this.medias[0].collectionsBounds.width / 2) /
          this.scroll.limit,
      ) *
        (this.medias.length - 1),
    );

    if (this.index !== index) {
      this.onChange(index);
    }

    this.onUpdateTitle();

    mapEach(this.medias, (media, index) => {
      media.update(this.scroll.current, this.index);
    });
  }

  /**
   * Destroy.
   */
  destroy() {
    this.scene.removeChild(this.group);
  }
}
