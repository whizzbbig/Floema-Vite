import Component from './Component'

export default class AppLink extends Component {
  constructor ({ element }) {
    super({
      element
    })
  }

  onMouseEnter (event) {
    event.preventDefault()
  }

  onMouseLeave (event) {
    event.preventDefault()
  }

  onClick (event) {
    event.preventDefault()

    this.emitter.emit('click', this.element)
  }

  addEventListeners () {
    const isSkip = this.element.classList.contains('skip')
    const isLocal = this.element.href.indexOf(window.location.origin) > -1
    const isNotEmail = this.element.href.indexOf('mailto') === -1
    const isNotPhone = this.element.href.indexOf('tel') === -1

    if (isSkip) return

    if (isLocal) {
      this.element.onclick = this.onClick
      this.element.onmouseenter = this.onMouseEnter
      this.element.onmouseleave = this.onMouseLeave
    } else if (isNotEmail && isNotPhone) {
      this.element.rel = 'noopener'
      this.element.target = '_blank'
    }
  }
}
