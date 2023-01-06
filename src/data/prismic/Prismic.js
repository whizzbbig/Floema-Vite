import * as prismic from '@prismicio/client'

import fetch from 'node-fetch'

export default class PrismicHook {
  async getData () {
    const {
      VITE_PRISMIC_REPOSITORY,
      VITE_PRISMIC_ACCESS_TOKEN
    } = process.env

    const accessToken = VITE_PRISMIC_ACCESS_TOKEN
    const endpoint = prismic.getEndpoint(VITE_PRISMIC_REPOSITORY)
    const client = prismic.createClient(endpoint, {
      accessToken,
      fetch
    })

    const about = await client.getSingle('about')
    const footer = await client.getSingle('footer')
    const home = await client.getSingle('home')
    const meta = await client.getSingle('meta')
    const navigation = await client.getSingle('navigation')
    const productsData = await client.getAllByType('product')
    const productsList = await client.getSingle('products')


    const products = productsList.data.products.map(({ products_product: { id } }) => {
      return productsData.find(p => p.id === id)
    })

    return {
      about,
      footer,
      home,
      meta,
      navigation,
    }
  }
}
