const defaultMapToVirtualProps = ({
  items,
  itemHeight,
}, {
  firstItemIndex,
  lastItemIndex,
}) => {
  const visibleItems = lastItemIndex > -1 ? items.slice(firstItemIndex, lastItemIndex + 1) : [];

  // style
  const height = items.length * itemHeight;
  const paddingTop = firstItemIndex * itemHeight;

  return {
    virtual: {
      items: visibleItems,
      style: {
        height,
        paddingTop,
        boxSizing: 'border-box',
      },
    }
  };
}

export default defaultMapToVirtualProps;