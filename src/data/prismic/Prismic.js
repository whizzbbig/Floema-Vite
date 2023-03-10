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

    console.log(preloader);

    fs.writeFileSync('src/pages/public/products.json', JSON.stringify(products), 'utf8') // prettier-ignore

    const collections = collectionsList.data.list.map(item => {
      item.collection = collection.find(({ uid }) => uid === item.collection.uid); // prettier-ignore

      console.log(item.collection.data);

      return item.collection;
    });

    // console.log about's slices
    // const aboutSlice = about.data.body.map(slice => {
    //   console.log(slice.slice_type);
    // });

    // console.log about slice_type == content slice primary
    const aboutSlice = about.data.body.map(slice => {
      if (slice.slice_type === 'content') {
        console.log(slice.primary);
      }
    });

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
