import getElementTop from '../getElementTop';

describe('function to get top position of element', () => {
  it('is a function', () => {
    expect(typeof getElementTop).toBe('function');
  });

  it('returns pageYOffset for window', () => {
    const element = {
      pageYOffset: 10,
      document: {
        documentElement: { },
        body: { },
      },
    };

    const top = getElementTop(element);

    expect(top).toBe(10);
    expect(top).toBe(element.pageYOffset);
    expect(top).not.toBe(element.document.documentElement.scrollTop);
    expect(top).not.toBe(element.document.body.scrollTop);
  });

  it('falls back to documentElement.scrollTop for window', () => {
    const element = {
      document: {
        documentElement: {
          scrollTop: 10,
        },
        body: { },
      },
    };

    const top = getElementTop(element);

    expect(top).toBe(10);
    expect(top).not.toBe(element.pageYOffset);
    expect(top).toBe(element.document.documentElement.scrollTop);
    expect(top).not.toBe(element.document.body.scrollTop);
  });

  it('falls back to body.scrollTop for window', () => {
    const element = {
      document: {
        documentElement: { },
        body: {
          scrollTop: 10,
        },
      },
    };

    const top = getElementTop(element);

    expect(top).toBe(10);
    expect(top).not.toBe(element.pageYOffset);
    expect(top).not.toBe(element.document.documentElement.scrollTop);
    expect(top).toBe(element.document.body.scrollTop);
  });

  it('falls back to 0 for window', () => {
    const element = {
      document: {
        documentElement: { },
        body: { },
      },
    };

    const top = getElementTop(element);

    expect(top).toBe(0);
    expect(top).not.toBe(element.pageYOffset);
    expect(top).not.toBe(element.document.documentElement.scrollTop);
    expect(top).not.toBe(element.document.body.scrollTop);
  });

  
  it('returns scrollY for element', () => {
    const element = {
      scrollY: 10,
    };

    const top = getElementTop(element);

    expect(top).toBe(10);
    expect(top).toBe(element.scrollY);
    expect(top).not.toBe(element.scrollTop);
  });
  
  it('falls back to scrollTop for element', () => {
    const element = {
      scrollTop: 10,
    };

    const top = getElementTop(element);

    expect(top).toBe(10);
    expect(top).not.toBe(element.scrollY);
    expect(top).toBe(element.scrollTop);
  });
  
  it('falls back to 0 for element', () => {
    const element = { };

    const top = getElementTop(element);

    expect(top).toBe(0);
    expect(top).not.toBe(element.scrollY);
    expect(top).not.toBe(element.scrollTop);
  });
});
