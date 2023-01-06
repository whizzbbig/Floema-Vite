import { Texture } from 'ogl'

class Textures {
  constructor () {
    this.cache = {}
  }

  set (gl) {
    this.gl = gl
  }

  load (src, args = {}) {
    if (this.cache[src]) {
      args.onLoad?.(this.cache[src])

      return this.cache[src]
    }

    if (src.indexOf('mp4') > -1) {
      return this.loadVideo(src, args)
    } else {
      return this.loadImage(src, args)
    }
  }

  loadVideo (src, {
    generateMipmaps = false,
    height = 1080,
    loop = true,
    width = 1920
  } = {}) {
    const texture = new Texture(this.gl, {
      generateMipmaps,
      height,
      width
    })

    this.cache[src] = texture

    const video = document.createElement('video')
    video.loop = loop
    video.muted = true
    video.src = src
    video.setAttribute('crossorigin', 'anonymous')
    video.setAttribute('webkit-playsinline', true)
    video.setAttribute('playsinline', true)
    video.load()

    texture.restartVideo = _ => {
      video.currentTime = 0
      video.play()
    }

    texture.updateVideo = _ => {
      if (video.readyState >= video.HAVE_ENOUGH_DATA) {
        if (!texture.image) {
          texture.image = video
        }

        texture.needsUpdate = true
      }
    }

    return texture
  }

  loadImage (src, {
    generateMipmaps = true,
    onLoad = _ => {}
  } = {}) {
    const texture = new Texture(this.gl, {
      generateMipmaps
    })

    this.cache[src] = texture

    const image = new Image()

    image.onload = () => {
      texture.image = image

      onLoad(texture)
    }

    image.crossOrigin = 'anonymous'
    image.src = src

    return texture
  }
}

export default new Textures()
