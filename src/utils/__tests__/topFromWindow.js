import topFromWindow from '../topFromWindow';

describe('function to get distance between the top of an element and the window', () => {
  it('is a function', () => {
    expect(typeof topFromWindow).toBe('function');
  });

  it('returns 0 for window', () => {
    const top = topFromWindow(window);

    expect(top).toBe(0);
  });

  it('returns 0 for non-object', () => {
    const top = topFromWindow(undefined);

    expect(top).toBe(0);
  });

  it('returns offsetTop for top-level element', () => {
    const element = {
      offsetTop: 10,
    };

    const top = topFromWindow(element);

    expect(top).toBe(element.offsetTop);
  });

  it('returns cumulative offsetTop for nested element', () => {
    const element = {
      offsetTop: 10,
      offsetParent: {
        offsetTop: 20,
      },
    };

    const top = topFromWindow(element);

    const expectedTop = element.offsetTop + element.offsetParent.offsetTop

    expect(top).toBe(expectedTop);
  });
});
