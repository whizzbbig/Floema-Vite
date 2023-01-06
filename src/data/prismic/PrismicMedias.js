import fetch from 'node-fetch';
import fs from 'fs';

const ID = 'dirName'; // TODO:
const DIRECTORY = 'src/pages/public/medias';

export default class {
  constructor(results) {
    this.medias = [];
    this.results = results;
  }

  generate() {
    return new Promise(async resolve => {
      // eslint-disable-line
      this.findMedias(this.results);
      await this.generateMedias();

      resolve();
    });
  }

  findMedias(object) {
    Object.keys(object).forEach(key => {
      const value = object[key];

      if (key === 'url' && value?.includes('cdn.prismic.io')) {
        this.medias.push(value);
      }

      if (key === 'url' && value?.includes('images.prismic.io')) {
        this.medias.push(value);
      }

      const isObject = typeof value === 'object';
      const isArray = Array.isArray(value);

      if (isArray && value.length) {
        value.forEach(value => {
          this.findMedias(value);
        });
      }

      if (isObject && value) {
        this.findMedias(value);
      }
    });
  }

  generateMedias() {
    fs.mkdirSync(`${DIRECTORY}`, {
      recursive: true,
    });

    const images = this.medias.filter((v, i, a) => a.indexOf(v) === i);

    const promises = images.map(async image => {
      let file = image.replace('?auto=compress,format', '');
      file = file
        .replace(`https://images.prismic.io/${ID}/`, '')
        .replace(/\+/g, '-');
      file = file
        .replace(`https://${ID}.cdn.prismic.io/${ID}/`, '')
        .replace(/\+/g, '-');

      const path = `${DIRECTORY}/${file}`;

      if (fs.existsSync(path)) {
        console.log(`${path} downloaded already.`);
      } else {
        const response = await fetch(image);
        const buffer = await response.buffer();

        fs.writeFile(path, buffer, event => {
          console.log(`${path} downloaded.`);
        });
      }

      return Promise.resolve();
    });

    return Promise.all(promises);
  }
}
