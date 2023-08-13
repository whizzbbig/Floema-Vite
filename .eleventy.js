require('dotenv').config();
const EleventyVitePlugin = require('@11ty/eleventy-plugin-vite');
const path = require('path');
const prismic = require('@prismicio/client');
const fetch = require('node-fetch');
const glslifyPlugin = require('vite-plugin-glslify').default;

const fetchPrismicData = require('./config/prismic');
const { Numbers } = require('./config/globals');

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

  eleventyConfig.addGlobalData('Numbers', Numbers);

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
