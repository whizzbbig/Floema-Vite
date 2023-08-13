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
  const products = await client.getAllByType('product');
  const collection = await client.getAllByType('collection');
  const collections = await client.getSingle('collections');
  // const prdouctList = await client.getSingle('product');

  const data = {
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
