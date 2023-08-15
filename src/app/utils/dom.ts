import map from 'lodash/map';

interface ExtendedElement extends Element {
  matchesSelector?: typeof Element.prototype.matches;
}

export const findAncestor = (
  element: ExtendedElement,
  selector: string,
): Element | null => {
  while (
    element &&
    !(element.matches || element.matchesSelector)?.call(element, selector)
  ) {
    return element.parentElement;
  }
  return null;
};

export const getOffset = (
  element: HTMLElement,
  scroll: number = 0,
): {
  bottom: number;
  height: number;
  left: number;
  top: number;
  width: number;
} => {
  const box = element.getBoundingClientRect();

  return {
    bottom: box.bottom,
    height: box.height,
    left: box.left,
    top: box.top + scroll,
    width: box.width,
  };
};

export function getIndex(node: Element | null): number {
  let index = 0;

  while (node && (node = node.previousElementSibling)) {
    index++;
  }

  return index;
}

export function mapEach<T>(
  element: HTMLElement | HTMLElement[],
  callback: (el: HTMLElement) => T,
): T[] {
  if (element instanceof window.HTMLElement) {
    return [callback(element)];
  }

  return map(element, callback);
}
