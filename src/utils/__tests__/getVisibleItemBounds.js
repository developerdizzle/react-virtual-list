import getVisibleItemBounds from '../getVisibleItemBounds';

const items = Array.apply(null, {length: 1000}).map(Number.call, Number);
const itemHeight = 100;
const itemBuffer = 0;

describe('function to get the visible item bounds within a container', () => {
  it('is a function', () => {
    expect(typeof getVisibleItemBounds).toBe('function');
  });

  it ('returns the correct first/lastItemIndex when the list is at the top of the container', () => {
    const container = {
      clientHeight: 100,
      offsetTop: 0,
    };

    const list = {
      offsetTop: 0,
    };

    const { firstItemIndex, lastItemIndex } = getVisibleItemBounds(list, container, items, itemHeight, itemBuffer);

    expect(firstItemIndex).toBe(0);
    expect(lastItemIndex).toBe(0);
  });

  it ('returns the correct first/lastItemIndex when the list is at the top of the container', () => {
    const container = {
      clientHeight: 500,
      offsetTop: 0,
    };

    const list = {
      offsetTop: 0,
    };

    const { firstItemIndex, lastItemIndex } = getVisibleItemBounds(list, container, items, itemHeight, itemBuffer);

    expect(firstItemIndex).toBe(0);
    expect(lastItemIndex).toBe(4);
  });
  
  it ('returns the correct first/lastItemIndex when the list is in the middle of the container', () => {
    const container = {
      clientHeight: 500,
      offsetTop: 0,
    };

    const list = {
      offsetTop: 250,
    };

    const { firstItemIndex, lastItemIndex } = getVisibleItemBounds(list, container, items, itemHeight, itemBuffer);

    expect(firstItemIndex).toBe(0);
    expect(lastItemIndex).toBe(2);
  });

  it ('returns 0 and -1 when the list is below the container', () => {
    const container = {
      clientHeight: 500,
      offsetTop: 0,
    };

    const list = {
      offsetTop: 500,
    };

    const { firstItemIndex, lastItemIndex } = getVisibleItemBounds(list, container, items, itemHeight, itemBuffer);

    expect(firstItemIndex).toBe(0);
    expect(lastItemIndex).toBe(-1);
  });


  it ('returns the correct first/lastItemIndex when the list is scrolled down', () => {
    const container = {
      clientHeight: 500,
      offsetTop: 500,
    };

    const list = {
      offsetTop: 0,
    };

    const { firstItemIndex, lastItemIndex } = getVisibleItemBounds(list, container, items, itemHeight, itemBuffer);

    expect(firstItemIndex).toBe(5);
    expect(lastItemIndex).toBe(9);
  });
});
