/* eslint-disable no-undef */
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import { resolve } from 'path';
import vitePluginPug from './plugins/vite-plugin-pug';

export default () => {
  return defineConfig({
    root: 'src',
    publicDir: '../public',

    build: {
      outDir: resolve(__dirname, 'dist'),
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src', 'index.pug'),
        },
      },
    },

    plugins: [vitePluginPug(), glsl()],

    resolve: {
      alias: [
        {
          find: '@app',
          replacement: '/app',
        },

        {
          find: '@utils',
          replacement: '/app/utils',
        },
        {
          find: '@components',
          replacement: '/app/components',
        },
        {
          find: '@styles',
          replacement: '/styles',
        },

        {
          find: '@canvas',
          replacement: '/app/components/Canvas',
        },

        {
          find: '@shaders',
          replacement: '/app/shaders',
        },

        {
          find: '@pages',
          replacement: '/app/pages',
        },

        {
          find: '@classes',
          replacement: '/app/classes',
        },

        {
          find: '@animations',
          replacement: '/app/animations',
        },
      ],
    },

    css: {
      preprocessorOptions: {
        scss: {
          sassOptions: {
            outputStyle: 'compressed',
          },
        },
      },
    },
  });
};
