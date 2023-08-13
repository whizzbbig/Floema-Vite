import * as prismic from '@prismicio/client';
import fetch from 'node-fetch';

const accessToken =
  'MC5ZWDhQMVJFQUFDTUFHazRI.77-9aSLvv73vv73vv73vv73vv70h77-9dGhvYO-_ve-_vRFpD--_vXcd77-9f--_ve-_ve-_ve-_ve-_ve-_ve-_vXE';

const client = prismic.createClient('floema-ice', {
  accessToken,
  fetch,
});

export async function fetchPrismicData() {
  const about = await client.getSingle('about');
  const preloader = await client.getSingle('preloader');
  const home = await client.getSingle('home');
  const meta = await client.getSingle('meta');
  const navigation = await client.getSingle('navigation');
  const products = await client.getAllByType('product');
  const collection = await client.getAllByType('collection');
  const collections = await client.getSingle('collections');
  const prdouctList = await client.getSingle('product');

  return {
    about,
    home,
    meta,
    navigation,
    collection,
    preloader,
    collections,

    products,
  };
}
