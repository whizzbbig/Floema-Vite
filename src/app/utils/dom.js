export const getBoundingClientRect = (element, scrolling) => {
  const bounds = element.getBoundingClientRect();

  let scroll = 0;

  if (!scrolling) {
    scroll = window.App?.page?.scrolling?.current || 0;
  }

  return {
    bottom: bounds.bottom + scroll,
    height: bounds.height,
    left: bounds.left,
    right: bounds.right,
    top: bounds.top + scroll,
    width: bounds.width,
  };
};
