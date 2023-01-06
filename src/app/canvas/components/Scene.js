import AutoBind from 'auto-bind'
import { Plane, Transform } from 'ogl'
import SceneMedia from './SceneMedia'

export default class Scene {
  constructor ({ area, camera, gl, group, mouse, page, renderer, sizes }) {
    AutoBind(this)

    this.group = new Transform()

    this.area = area
    this.camera = camera
    this.gl = gl
    this.mouse = mouse
    this.page = page
    this.renderer = renderer
    this.scene = group
    this.sizes = sizes
  }

  create () {
    this.createMedias()
  }

  destroy () {
    this.destroyMedias()
  }

  /**
   * Medias.
   */
  createMedias () {
    this.mediasElements = this.page.element.querySelectorAll('[data-gl="media"]')

    const geometry = new Plane(this.gl)

    if (this.mediasElements?.length) {
      this.medias = this.mediasElements.map(element => {
        return new SceneMedia({
          area: this.area,
          element,
          geometry,
          gl: this.gl,
          group: this.group,
          sizes: this.sizes
        })
      })
    }
  }

  destroyMedias () {
    if (this.medias) {
      this.medias.forEach(media => media.destroy())
    }
  }

  /**
   * Animations.
   */
  show () {
    this.group.setParent(this.scene)

    if (this.medias) {
      this.medias.forEach(media => media.show())
    }
  }

  async hide () {
    if (this.medias) {
      await Promise.all(this.medias.map(media => media.hide()))
    }

    this.group.setParent(null)
  }

  /**
   * Events.
   */
  onResize (event) {
    this.medias?.forEach(media => {
      media.onResize(event)
    })
  }

  /**
   * Loop.
   */
  update () {
    this.medias?.forEach(media => {
      media.update({ page: this.page })
    })

    this.renderer.render({
      scene: this.scene,
      camera: this.camera
    })
  }
}
