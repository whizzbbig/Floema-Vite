import { Pane } from 'tweakpane';

const tabList = ['General', 'Animation'];

export default class Debug {
  constructor() {
    const PARAMS = {
      factor: 123,
      title: 'hello',
      color: '#ff0055',
    };

    this.gui = new Pane();

    console.log('yes');

    this.gui.addInput(PARAMS, 'factor');
    this.gui.addInput(PARAMS, 'title');
    this.gui.addInput(PARAMS, 'color');

    this.debugFolders = {};
    this.tabs = {};

    this.initTab();
  }

  setFolder(folderLabel, tabLabel = tabList[0], expanded = true) {
    const l = folderLabel.toLowerCase();
    const tab = this.getTab(tabLabel);
    this.debugFolders[l] = tab.addFolder({
      title: folderLabel,
      expanded: expanded,
    });
  }

  getFolder(folderLabel) {
    const l = folderLabel.toLowerCase();
    return this.debugFolders[l];
  }

  initTab() {
    const pages = [];
    tabList.forEach(tab => {
      pages.push({ title: tab });
    });

    this.tabs = this.gui.addTab({
      pages: pages,
    });
  }

  getTab(tabLabel, folderLabel) {
    const checkIndex = tabList.indexOf(tabLabel);
    if (checkIndex == -1)
      console.warn(
        `Tab '${tabLabel}' doesn't exist ❗️ \n Setting folder in tab 'General' per default`
      );

    const index = checkIndex == -1 ? 0 : checkIndex;
    return this.tabs.pages[index];
  }

  destroy() {
    this.gui.dispose();
  }
}
