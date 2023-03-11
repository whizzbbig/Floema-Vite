import * as prismic from '@prismicio/client';
import fetch from 'node-fetch';
import fs from 'fs';

const deepClone = object => JSON.parse(JSON.stringify(object));

export default class PrismicHook {
  async getData() {
    const { VITE_PRISMIC_REPOSITORY, VITE_PRISMIC_ACCESS_TOKEN } = process.env;

    const accessToken = VITE_PRISMIC_ACCESS_TOKEN;
    const endpoint = prismic.getEndpoint(VITE_PRISMIC_REPOSITORY);
    const client = prismic.createClient(endpoint, {
      accessToken,
      fetch,
    });

    const about = await client.getSingle('about');
    const preloader = await client.getSingle('preloader');
    const home = await client.getSingle('home');
    const meta = await client.getSingle('meta');
    const navigation = await client.getSingle('navigation');
    const products = await client.getAllByType('product');
    const collection = await client.getAllByType('collection');
    const collectionsList = await client.getSingle('collections');
    const prdouctList = await client.getSingle('product');

    // console.log(preloader);

    fs.writeFileSync('src/pages/public/products.json', JSON.stringify(products), 'utf8') // prettier-ignore

    const collections = collectionsList.data.list.map(item => {
      item.collection = collection.find(({ uid }) => uid === item.collection.uid); // prettier-ignore

      // fetch the product and its image and model url from collection
      item.collection.data.list.map(product => {
        product.product = products.find(({ uid }) => uid === product.product.uid); // prettier-ignore
        product.product.data.image = product.product.data.image;
        product.product.data.model = product.product.data.model;
      });

      // console log the fetched items
      //   item.collection.data.list.map(product => {
      //     console.log(product.product.data.image);
      //     console.log(product.product.data.model);
      //   });

      return item.collection;
    });

    // console log each title of the collections
    collections.map(collection => {
      console.log(collection.data.title);
    });

    // console log product using map on products
    products.map(product => {
      // fetch the uid of product.data.collection and then get the title of collection
      const collection = collections.find(({ uid }) => uid === product.data.collection.uid); // prettier-ignore
      product.data.collection = collection.data.title;
    });

    // const collectionsTitle = proudcts.map(product => {
    //   console.log(product);
    // });

    // console log each image of the gallery in home page
    // home.data.gallery.map(image => {
    //   console.log(image.image);
    // });

    // console.log(about.data.body);

    // console.log about's slices
    // const aboutSlice = about.data.body.map(slice => {
    //   console.log(slice.slice_type);
    // });

    // console.log about slice_type == content slice primary
    // const aboutSlice = about.data.body.map(slice => {
    //   if (slice.slice_type === 'content') {
    //     console.log(slice.primary);
    //   }
    // });

    return {
      about,
      home,
      meta,
      navigation,
      preloader,
      collections,
      products,
    };
  }
}
