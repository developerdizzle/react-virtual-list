const getElementTop = (element) => {
  if (element.pageYOffset) return element.pageYOffset;

  if (element.document) {
    if (element.document.documentElement && element.document.documentElement.scrollTop) return element.document.documentElement.scrollTop;
    if (element.document.body && element.document.body.scrollTop) return element.document.body.scrollTop;

    return 0;
  }

  return element.scrollY ||  element.scrollTop || 0;
};

export default getElementTop;
