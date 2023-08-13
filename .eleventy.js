const EleventyVitePlugin = require('@11ty/eleventy-plugin-vite');
const path = require('path');
const prismic = require('@prismicio/client');
const fetch = require('node-fetch');
const glslifyPlugin = require('vite-plugin-glslify').default;

const accessToken =
  'MC5ZWDhQMVJFQUFDTUFHazRI.77-9aSLvv73vv73vv73vv73vv70h77-9dGhvYO-_ve-_vRFpD--_vXcd77-9f--_ve-_ve-_ve-_ve-_ve-_ve-_vXE';

const client = prismic.createClient('floema-ice', {
  accessToken,
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
  const prdouctList = await client.getSingle('product');

  const data = {
    about,
    home,
    meta,
    navigation,
    collection,
    preloader,
    collections,
    products,
  };

  console.log(data);

  return data;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyVitePlugin, {
    viteOptions: {
      root: 'src',

      plugins: [glslifyPlugin()],
      resolve: {
        alias: {
          '@styles': path.resolve('.', '/src/styles'),
          '@app': path.resolve('.', '/src/app'),
          '@utils': path.resolve('.', '/src/app/utils'),
          '@components': path.resolve('.', '/src/app/components'),
          '@shaders': path.resolve('.', '/src/app/shaders'),
          '@classes': path.resolve('.', '/src/app/classes'),
          '@animations': path.resolve('.', '/src/app/animations'),
          '@pages': path.resolve('.', '/src/app/pages'),
          '@canvas': path.resolve('.', '/src/app/components/Canvas'),
        },
      },
    },
  });

  eleventyConfig.addGlobalData('Numbers', function (index) {
    return index == 0
      ? 'One'
      : index == 1
      ? 'Two'
      : index == 2
      ? 'Three'
      : index == 3
      ? 'Four'
      : '';
  });

  eleventyConfig.addPassthroughCopy('src');

  eleventyConfig.setServerPassthroughCopyBehavior('copy');

  eleventyConfig.addGlobalData('data', fetchPrismicData);

  return {
    dir: {
      input: 'src/views',
      output: '_site',
    },
  };
};
