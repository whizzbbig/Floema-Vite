import { Vec2 } from 'ogl'

export default class Mouse {
  constructor ({ area, sizes }) {
    this.area = area
    this.sizes = sizes

    this.position = new Vec2(0, 0)
    this.normalized = new Vec2(0, 0)
    this.normalizedLerp = new Vec2(0, 0)
  }

  onMouseDown (event) {

  }

  onMouseMove (event) {
    const x = event.touches ? event.touches[0].clientX : event.clientX
    const y = event.touches ? event.touches[0].clientY : event.clientY

    this.position.set(x, y)

    const xNorm = x / this.sizes.x - 0.5
    const yNorm = y / this.sizes.y - 0.5

    this.normalized.set(xNorm, yNorm)
  }

  onMouseUp (event) {

  }

  onResize () {

  }

  update () {
    this.normalizedLerp.lerp(this.normalized, 0.1)
  }
}
