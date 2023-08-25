interface NodeList {
  forEach(
    callback: (
      currentValue: Node,
      currentIndex: number,
      listObj: NodeList,
    ) => void,
    thisArg?: any,
  ): void;
}

declare module 'nodelist-foreach-polyfill';
