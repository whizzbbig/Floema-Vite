import AutoBind from 'auto-bind'

import AppLink from './AppLink'

import Canvas from '@/canvas'

export default class App {
  constructor () {
    AutoBind(this)

    this.initContainer()
  }

  /**
   * Initialization.
   */
  initContainer () {
    this.content = document.querySelector('.app')
    this.template = this.content.getAttribute('data-template')

    if (!this.template) {
      console.warn('The attribute `data-template` in `.app` element is required for the application to run properly.')
    }
  }

  initCache () {
    this.cache = {}
  }

  initComponents (components) {
    this.components = components.map(({ component: Component }) => {
      return new Component({

      })
    })
  }

  initRoutes (routes) {
    this.routes = routes
    this.pages = {}

    routes.forEach(({ component: Component, template }) => {
      this.pages[template] = new Component()
    })

    this.page = this.pages[this.template]
    this.page.create()
    this.page.show()
  }

  initTransitions (transitions) {
    this.transitions = transitions.map(transition => {

    })
  }

  initLinks () {
    this.links = document.querySelectorAll('a')

    this.links = [...this.links].map(element => {
      const link = new AppLink({
        element
      })

      link.on('click', this.onLinkClick)
    })
  }

  initCanvas () {
    this.canvas = new Canvas({
      pages: this.pages,
      routes: this.routes,
      template: this.template
    })

    this.canvas.show(this.template)

    this.components.push(this.canvas)
  }

  init () {
    this.initCache()
    this.initLinks()
    this.initCanvas()

    this.onResize()

    this.addEventListeners()

    this.update()
  }

  /**
   * Routing.
   */
  onLinkClick ({ href }) {
    href = href.replace(window.location.origin, '')

    const promiseCanvas = this.canvas.hide()
    const promisePage = this.page.hide()
    const promises = [promiseCanvas, promisePage]

    if (!this.cache[href]) {
      const promiseFetch = window.fetch(href)

      promises.push(promiseFetch)
    }

    Promise.all(promises).then(async ([canvas, page, request]) => {
      if (request) {
        const response = await request.text()

        this.cache[href] = response
      }

      this.onPageRequested({
        href,
        response: this.cache[href]
      })
    })
  }

  onPageRequested ({ href, response }) {
    const html = document.createElement('div')

    html.innerHTML = response

    const app = html.querySelector('.app')
    const appTemplate = app.getAttribute('data-template')

    this.content.setAttribute('data-template', appTemplate)
    this.content.innerHTML = app.innerHTML

    this.template = appTemplate

    this.page = this.pages[this.template]
    this.page.create()
    this.page.show()

    this.canvas.show(this.template)

    window.history.pushState({}, document.title, href)
  }

  /**
   * Events.
   */
  onMouseDown (event) {
    this.components.forEach(component => component.onMouseDown?.({
      originalEvent: event
    }))
  }

  onMouseMove (event) {
    this.components.forEach(component => component.onMouseMove?.({
      originalEvent: event
    }))
  }

  onMouseUp (event) {
    this.components.forEach(component => component.onMouseUp?.({
      originalEvent: event
    }))
  }

  onResize () {
    this.windowInnerSizes = {
      height: window.innerHeight,
      width: window.innerWidth
    }

    this.windowOuterSizes = {
      height: window.outerHeight,
      width: window.outerWidth
    }

    this.components.forEach(component => component.onResize?.({
      windowInnerSizes: this.windowInnerSizes,
      windowOuterSizes: this.windowOuterSizes
    }))
  }

  /**
   * Listeners.
   */
  addEventListeners () {
    window.addEventListener('mousedown', this.onMouseDown)
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mouseup', this.onMouseUp)

    window.addEventListener('touchstart', this.onMouseDown)
    window.addEventListener('touchmove', this.onMouseMove)
    window.addEventListener('touchup', this.onMouseUp)

    window.addEventListener('resize', this.onResize)
  }

  /**
   * Loop.
   */
  update () {
    this.components.forEach(component => component.update?.())

    this.page?.update?.()

    this.frame = requestAnimationFrame(this.update)
  }
}
