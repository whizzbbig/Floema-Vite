require('dotenv').config();

const prismicH = require('@prismicio/helpers');
const prismic = require('@prismicio/client');
const fetch = require('node-fetch');

const PRISMIC_REPO = process.env.PRISMIC_REPOSITORY;
const PRISMIC_TOKEN = process.env.PRISMIC_ACCESS_TOKEN;

const client = prismic.createClient(PRISMIC_REPO, {
  accessToken: PRISMIC_TOKEN,
  fetch,
});

async function fetchPrismicData() {
  const about = await client.getSingle('about');
  const preloader = await client.getSingle('preloader');
  const home = await client.getSingle('home');
  const meta = await client.getSingle('meta');
  const navigation = await client.getSingle('navigation');

  const collection = await client.getAllByType('collection', {
    fetchLinks: ['product.image', 'product.model'],
  });

  const products = await client.getAllByType('product', {
    fetchLinks: 'collection.title',
    pageSize: 100,
  });

  const collections = await client.getSingle('collections');
  // const prdouctList = await client.getSingle('product');

  const assets = [];

  home.data.gallery.forEach(item => {
    assets.push(item.image.url);
  });

  about.data.gallery.forEach(item => {
    assets.push(item.image.url);
  });

  about.data.body.forEach(section => {
    if (section.slice_type === 'gallery') {
      section.items.forEach(item => {
        assets.push(item.image.url);
      });
    }
  });

  collection.forEach(collection => {
    collection.data.list.forEach(item => {
      assets.push(item.product.data.image.url);
      assets.push(item.product.data.model.url);
    });
  });

  const data = {
    assets,
    about,
    home,
    meta,
    navigation,
    collection,
    preloader,
    collections,
    products,
    ...prismicH,
  };

  return data;
}

module.exports = fetchPrismicData;
