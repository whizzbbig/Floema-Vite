export default class {
  constructor() {
    this.onFetch('/sprites.svg');
  }

  async onFetch(url) {
    const request = await window.fetch(url);
    const response = await request.text();

    this.createSprite(response);
  }

  createSprite(response) {
    const sprite = document.createElement('div');

    sprite.innerHTML = response;

    sprite.style.left = '-999999px';
    sprite.style.opacity = 0;
    sprite.style.position = 'absolute';
    sprite.style.top = 0;

    document.body.appendChild(sprite);
  }
}
