import AutoBind from 'auto-bind'
import { createNanoEvents } from 'nanoevents'

export default class {
  constructor ({ autoListeners = true, autoMount = true, classes, element, elements, id } = {}) {
    AutoBind(this)

    this.autoListeners = autoListeners
    this.autoMount = autoMount
    this.classes = classes
    this.selector = element
    this.selectors = elements
    this.id = id

    if (this.autoMount) {
      this.create()
    }
  }

  create () {
    this.initElement(this.selector)
    this.initElements(this.selectors)
    this.initEmitter()

    if (this.autoListeners) {
      this.addEventListeners()
    }
  }

  initElement (selector) {
    if (!selector) {
      // throw 'Selector is required for Component!';
      return
    }

    if (selector instanceof window.HTMLElement) {
      this.element = selector
    } else {
      this.element = document.querySelector(selector)
    }
  }

  initElements (selectors) {
    this.elements = {}

    for (const key in selectors) {
      const selector = selectors[key]

      if (selector === window) {
        this.elements[key] = window
      } else if (selector instanceof window.HTMLElement) {
        this.elements[key] = selector
      } else {
        this.elements[key] = document.querySelectorAll(selector)

        if (this.elements[key].length === 0) {
          this.elements[key] = null
        } else if (this.elements[key].length === 1) {
          this.elements[key] = this.elements[key][0]
        } else {

        }
      }
    }
  }

  initEmitter () {
    this.emitter = createNanoEvents()
  }

  on (event, callback) {
    return this.emitter.on(event, callback)
  }

  addEventListeners () {

  }

  removeEventListeners () {

  }

  destroy () {
    this.removeEventListeners()
  }
}
