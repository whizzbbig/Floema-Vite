import GUI from 'lil-gui';

export const gui =
  window.location.search.indexOf('gui') > -1 ? new GUI() : null;

if (gui) {
  gui.close();
}
