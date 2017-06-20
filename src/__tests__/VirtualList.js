import ShallowRenderer from 'react-test-renderer/shallow'
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

const items = Array.apply(null, {length: 1000}).map(Number.call, Number);

describe('higher-order component that only renders visible items', () => {
  it('is a function', () => {
    expect(typeof VirtualList).toBe('function');
  });

  it('renders the inner component', () => {
    const MyVirtualList = VirtualList()(MyList);

    const renderer = ShallowRenderer.createRenderer();
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
    const MyVirtualList = VirtualList()(MyList);

    const renderer = ShallowRenderer.createRenderer();
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
    const MyVirtualList = VirtualList()(MyList);

    const renderer = ShallowRenderer.createRenderer();
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
    const MyVirtualList = VirtualList()(MyList);

    const renderer = ShallowRenderer.createRenderer();
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

  //   const renderer = ShallowRenderer.createRenderer();
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
    };

    const MyVirtualList = VirtualList(options)(MyList);

    const renderer = ShallowRenderer.createRenderer();
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

  it('has default mapVirtualToProps', () => {
    const container = {
      clientHeight: 500,
      offsetTop: 0,
    };

    const options = {
      container,
      initialState: {
        firstItemIndex: 0,
        lastItemIndex: 4,
      },
    };

    const MyVirtualList = VirtualList(options)(MyList);

    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      (
      <MyVirtualList
        items={items}
        itemHeight={100}
      />
      )
    );

    const result = renderer.getRenderOutput();

    expect(result.props.virtual).toBeDefined();
  });

  it('allows custom mapVirtualToProps', () => {
    const container = {
      clientHeight: 500,
      offsetTop: 0,
    };

    const options = {
      container,
      initialState: {
        firstItemIndex: 0,
        lastItemIndex: 4,
      },
    };

    const mapVirtualToProps = ({ items }) => ({ customItemsRef: items })

    const MyVirtualList = VirtualList(options, mapVirtualToProps)(MyList);

    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      (
      <MyVirtualList
        items={items}
        itemHeight={100}
      />
      )
    );

    const result = renderer.getRenderOutput();

    expect(result.props.virtual).toBeUndefined();
    expect(result.props.customItemsRef).toBeDefined();
  });
});
