require('dotenv').config();

const prismicH = require('@prismicio/helpers');
const prismic = require('@prismicio/client');
const axios = require('axios');

const PRISMIC_REPO = process.env.PRISMIC_REPOSITORY;
const PRISMIC_TOKEN = process.env.PRISMIC_ACCESS_TOKEN;

const axiosAdapter = async (url, options = {}) => {
  try {
    const response = await axios({ url, ...options });
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      statusText: response.statusText,
      json: () => Promise.resolve(response.data),
    };
  } catch (error) {
    if (error.response) {
      return {
        ok: false,
        status: error.response.status,
        statusText: error.response.statusText,
        json: () => Promise.resolve(error.response.data),
      };
    }
    throw error;
  }
};

const client = prismic.createClient(PRISMIC_REPO, {
  accessToken: PRISMIC_TOKEN,
  fetch: axiosAdapter,
});

async function fetchAbout() {
  return client.getSingle('about');
}

async function fetchPreloader() {
  return client.getSingle('preloader');
}

async function fetchHome() {
  return client.getSingle('home');
}

async function fetchMeta() {
  return client.getSingle('meta');
}

async function fetchNavigation() {
  return client.getSingle('navigation');
}

async function fetchCollection() {
  return client.getAllByType('collection', {
    fetchLinks: ['product.image', 'product.model'],
  });
}

async function fetchCollections() {
  return client.getSingle('collections', {
    fetchLinks: 'collection.title',
  });
}

async function fetchProducts() {
  return client.getAllByType('product', {
    fetchLinks: 'collection.title',
    pageSize: 100,
  });
}

function gatherAssets(home, about, collection) {
  const assets = [];
  const { gallery } = home.data;
  const { body } = about.data;

  gallery.forEach(item => {
    assets.push(item.image.url);
  });

  about.data.gallery.forEach(item => {
    assets.push(item.image.url);
  });

  body.forEach(section => {
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

  return assets;
}

async function fetchPrismicData() {
  const [
    about,
    preloader,
    home,
    meta,
    navigation,
    collection,
    collections,
    products,
  ] = await Promise.all([
    fetchAbout(),
    fetchPreloader(),
    fetchHome(),
    fetchMeta(),
    fetchNavigation(),
    fetchCollection(),
    fetchCollections(),
    fetchProducts(),
  ]);

  const assets = gatherAssets(home, about, collection);

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
