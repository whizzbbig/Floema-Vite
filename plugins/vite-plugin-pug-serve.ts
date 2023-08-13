import fs from 'fs';
import { send } from 'vite';
import type { ViteDevServer, Plugin } from 'vite';
import { compileFile } from 'pug';
import type { LocalsObject, Options } from 'pug';

import { fetchPrismicData } from '../config/datafetch';
import { log } from 'console';

type PugSettings = {
  options: Options;
  locals: LocalsObject;
};

const transformPugToHtml = (
  server: ViteDevServer,
  path: string,
  options: Options,
  locals: LocalsObject,
) => {
  try {
    const compiled = compileFile(path, options)(locals);
    return server.transformIndexHtml(path, compiled);
  } catch (error) {
    console.log(error);
    return server.transformIndexHtml(path, 'Pug Compile Error');
  }
};

export const vitePluginPugServe = ({
  options,
  locals,
}: PugSettings): Plugin => {
  locals.Numbers = index => {
    return index == 0
      ? 'One'
      : index == 1
      ? 'Two'
      : index == 2
      ? 'Three'
      : index == 3
      ? 'Four'
      : '';
  };

  return {
    name: 'vite-plugin-pug-serve',
    enforce: 'pre',
    apply: 'serve',
    handleHotUpdate(context) {
      context.server.ws.send({
        type: 'full-reload',
      });
      return [];
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const root = server.config.root;
        let fullReqPath = root + req.url;

        if (fullReqPath.endsWith('/')) {
          fullReqPath += 'index.html';
        }

        if (fullReqPath.endsWith('.html')) {
          if (fs.existsSync(fullReqPath)) {
            return next();
          }

          const pugPath = `${
            fullReqPath.slice(0, Math.max(0, fullReqPath.lastIndexOf('.'))) ||
            fullReqPath
          }.pug`;
          if (!fs.existsSync(pugPath)) {
            return send(req, res, '404 Not Found', 'html', {});
          }

          const data = await fetchPrismicData();

          // console.log(data.collectionsList.data.list);

          const html = await transformPugToHtml(server, pugPath, options, {
            ...locals,
            data,
          });

          return send(req, res, html, 'html', {});
        } else {
          return next();
        }
      });
    },
  };
};
