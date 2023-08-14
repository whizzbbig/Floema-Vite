declare module '@11ty/eleventy-plugin-vite' {
  export interface ViteResolveOptions {
    alias: {
      '/node_modules': string;
      [key: string]: string;
    };
  }

  export interface ViteOptions {
    resolve?: ViteResolveOptions;
    clearScreen?: boolean;
    appType?: string;
    server?: {
      mode?: 'development';
      middlewareMode?: boolean;
    };
    build?: {
      mode?: 'production';
      rollupOptions?: any;
    };
  }

  export interface EleventyViteOptions {
    tempFolderName?: string;
    viteOptions?: ViteOptions;
  }

  export class EleventyVite {
    constructor(outputDir: string, pluginOptions?: EleventyViteOptions);

    getServerMiddleware(): Promise<any>; // A ajuster selon la valeur de retour exacte
    getIgnoreDirectory(): string;
    runBuild(input: any[]): Promise<void>;
  }

  export default EleventyVite;
}
