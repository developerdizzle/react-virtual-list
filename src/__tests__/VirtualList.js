import ReactTestUtils from 'react-addons-test-utils'
import React from 'react';

import VirtualList from '../VirtualList';

const MyList = ({ itemHeight, virtual }) => {
  return (
    <ul style={virtual.style}>
      {virtual.items.map(item => (
        <li style={{ height: itemHeight }}>{item}</li>
      ))}
    </ul>
  );
};

const mapVirtualToProps = (virtual) => ({ virtual: virtual });

const items = Array.apply(null, {length: 1000}).map(Number.call, Number);

describe('higher-order component that only renders visible items', () => {
  it('is a function', () => {
    expect(typeof VirtualList).toBe('function');
  });

  it('renders the inner component', () => {
    const MyVirtualList = VirtualList({ mapVirtualToProps })(MyList);

    const renderer = ReactTestUtils.createRenderer();
    renderer.render(
      (
      <MyVirtualList
        items={items}
        itemHeight={100}
        />
      )
    );
    const result = renderer.getRenderOutput();

    expect(result.type).toBe(MyList);
  });

  it('provides the virtual prop', () => {
    const MyVirtualList = VirtualList({ mapVirtualToProps })(MyList);

    const renderer = ReactTestUtils.createRenderer();
    renderer.render(
      (
      <MyVirtualList
        items={items}
        itemHeight={100}
        />
      )
    );
    const result = renderer.getRenderOutput();

    expect(result.props.virtual).not.toBe(undefined);
  });

  it('provides the items prop', () => {
    const MyVirtualList = VirtualList({ mapVirtualToProps })(MyList);

    const renderer = ReactTestUtils.createRenderer();
    renderer.render(
      (
      <MyVirtualList
        items={items}
        itemHeight={100}
        />
      )
    );
    const result = renderer.getRenderOutput();

    expect(result.props.virtual.items).not.toBe(undefined);
  });

  it('provides the style prop', () => {
    const MyVirtualList = VirtualList({ mapVirtualToProps })(MyList);

    const renderer = ReactTestUtils.createRenderer();
    renderer.render(
      (
      <MyVirtualList
        items={items}
        itemHeight={100}
        />
      )
    );
    const result = renderer.getRenderOutput();

    expect(result.props.virtual.style).not.toBe(undefined);
  });

  // it('renders only visible items', () => {
  //   const container = {
  //     clientHeight: 500,
  //     offsetTop: 0,
  //   };

  //   const options = {
  //     container,
  //   };

  //   const MyVirtualList = VirtualList(options)(MyList);

  //   const renderer = ReactTestUtils.createRenderer();
  //   renderer.render(
  //     (
  //     <MyVirtualList
  //       items={items}
  //       itemHeight={100}
  //       />
  //     )
  //   );

  //   const result = renderer.getRenderOutput();

  //   expect(result.props.virtual.items).toHaveLength(5);
  // });

  it('uses initialState options', () => {
    const container = {
      clientHeight: 500,
      offsetTop: 0,
    };

    const options = {
      container,
      initialState: {
        firstItemIndex: 0,
        lastItemIndex: 4,
        style: {
          height: 500,
          paddingTop: 0,
        },
      },
      mapVirtualToProps,
    };

    const MyVirtualList = VirtualList(options)(MyList);

    const renderer = ReactTestUtils.createRenderer();
    renderer.render(
      (
      <MyVirtualList
        items={items}
        itemHeight={100}
        />
      )
    );

    const result = renderer.getRenderOutput();

    expect(result.props.virtual.items).toHaveLength(5);
  });
});
