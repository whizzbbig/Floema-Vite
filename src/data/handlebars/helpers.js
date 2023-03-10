import Handlebars from 'handlebars'

import * as prismicHelpers from '@prismicio/helpers'
import { prismicHelpersLinks } from '../prismic/helpers.js'

export const handlebarsHelpers = {
  breaklines: text => {
    text = Handlebars.Utils.escapeExpression(text)
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>')
    text = text.replace(/\s{2,}/g, ' ').trim()

    return new Handlebars.SafeString(text)
  },

  prismicLink: data => {
    return prismicHelpers.asLink(data, prismicHelpersLinks)
  },

  prismicHTML: data => {
    return prismicHelpers.asHTML(data, prismicHelpersLinks)
  },

  prismicText: data => {
    return prismicHelpers.asText(data, prismicHelpersLinks)
  },

  prismicMedia: ({ url } = {}) => {
    if (url) {
      url = url.replace('https://floema-ice.cdn.prismic.io/floema-ice/', '/medias/') // TODO:
      url = url.replace('https://images.prismic.io/floema-ice/', '/medias/') // TODO:
      url = url.replace('?auto=compress,format', '')
      url = url.replace(/\+/g, '-')
    }

    return url
  }
}

Handlebars.registerHelper('math', function (l, operator, r, options) {
  l = parseFloat(l)
  r = parseFloat(r)

  return {
    '+': l + r,
    '-': l - r,
    '*': l * r,
    '/': l / r,
    '%': l % r
  }[operator]
})

Handlebars.registerHelper('length', function (value) {
  return value.length
})

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
  switch (operator) {
    case '==': return (v1 === v2) ? options.fn(this) : options.inverse(this)
    case '===': return (v1 === v2) ? options.fn(this) : options.inverse(this)
    case '!=': return (v1 !== v2) ? options.fn(this) : options.inverse(this)
    case '!==': return (v1 !== v2) ? options.fn(this) : options.inverse(this)
    case '<': return (v1 < v2) ? options.fn(this) : options.inverse(this)
    case '<=': return (v1 <= v2) ? options.fn(this) : options.inverse(this)
    case '>': return (v1 > v2) ? options.fn(this) : options.inverse(this)
    case '>=': return (v1 >= v2) ? options.fn(this) : options.inverse(this)
    case '&&': return (v1 && v2) ? options.fn(this) : options.inverse(this)
    case '||': return (v1 || v2) ? options.fn(this) : options.inverse(this)
    default: return options.inverse(this)
  }
})

Handlebars.registerHelper('parse', function (uid, field, list, data) {
  const product = list.find(page => page.uid === uid)
  const value = data ? product.data[field] : product[field]

  return value
})

Handlebars.registerHelper('times', function (n, block) {
  let loop = ''

  for (let i = 0; i < n; ++i) {
    loop += block.fn(i)
  }

  return loop
})
