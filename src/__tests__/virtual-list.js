import ShallowRenderer from 'react-test-renderer/shallow'
import React from 'react';

import VirtualList from '../virtual-list';

const items = Array.apply(null, {length: 1000}).map(Number.call, Number);

describe('component that only renders visible items', () => {
  it('is a function', () => {
    expect(typeof VirtualList).toBe('function');
  });

  it('calls the child function with an object parameter', () => {
    const renderer = ShallowRenderer.createRenderer();

    const renderList = jest.fn();

    renderer.render(
      <VirtualList
        items={items}
        itemHeight={100}
        >
        {renderList}
      </VirtualList>
    );

    const result = renderer.getRenderOutput();

    expect(renderList).toBeCalledWith(expect.anything())
  });
});
