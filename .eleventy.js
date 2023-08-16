const path = require('path');
const htmlmin = require('html-minifier');
const EleventyVitePlugin = require('@11ty/eleventy-plugin-vite');
const { VitePWA } = require('vite-plugin-pwa');
const glslifyPlugin = require('vite-plugin-glslify').default;

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyVitePlugin, {
    tempFolderName: '.11ty-vite',
    viteOptions: {
      publicDir: 'public',
      root: 'src',
      plugins: [
        VitePWA({
          injectRegister: 'script',
          registerType: 'autoUpdate',
          includeAssets: [],
          workbox: {
            globPatterns: ['**/*.{js,css,html,png,jpg,svg,woff,woff2}'],
          },
        }),
        glslifyPlugin(),
      ],

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

  // Copy files for asset pipeline
  eleventyConfig.addPassthroughCopy('public');
  eleventyConfig.addPassthroughCopy('src/app');
  eleventyConfig.addPassthroughCopy('src/fonts');
  eleventyConfig.addPassthroughCopy('src/styles');
  eleventyConfig.setServerPassthroughCopyBehavior('copy');

  eleventyConfig.setServerOptions({
    port: 3000,
  });

  // Minify HTML
  eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
    if (outputPath && outputPath.endsWith('.html')) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }
    return content;
  });

  return {
    dir: {
      input: 'src/views',
      output: '_site',
    },
    passthroughFileCopy: true,
    htmlTemplateEngine: 'pug',
  };
};
