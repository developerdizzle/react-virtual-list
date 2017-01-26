import topFromWindow from './topFromWindow';
import getElementTop from './getElementTop';

const getVisibleItemBounds = (list, container, items, itemHeight, itemBuffer) => {
  // early return if we can't calculate
  if (!container) return undefined;
  if (!itemHeight) return  undefined;
  if (!items) return undefined;
  if (items.length === 0) return undefined;

  // what the user can see
  const { innerHeight, clientHeight } = container;

  const viewHeight = innerHeight || clientHeight; // how many pixels are visible

  if (!viewHeight) return undefined;

  const viewTop = getElementTop(container); // top y-coordinate of viewport inside container
  const viewBottom = viewTop + viewHeight;

  const listTop = topFromWindow(list) - topFromWindow(container); // top y-coordinate of container inside window
  const listHeight = itemHeight * items.length;
  
  // visible list inside view
  const listViewTop =  Math.max(0, viewTop - listTop); // top y-coordinate of list that is visible inside view
  const listViewBottom = Math.max(0, Math.min(listHeight, viewBottom - listTop)); // bottom y-coordinate of list that is visible inside view
  
  // visible item indexes
  const firstItemIndex = Math.max(0,  Math.floor(listViewTop / itemHeight) - itemBuffer);
  const lastItemIndex = Math.min(items.length, Math.ceil(listViewBottom / itemHeight) + itemBuffer) - 1;

  return {
    firstItemIndex,
    lastItemIndex,
  };
};

export default getVisibleItemBounds;
