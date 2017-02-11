const topFromWindow = (element) => {
  if (typeof element === 'undefined' || !element) return 0;
  
  return (element.offsetTop || 0) + topFromWindow(element.offsetParent);
};

export default topFromWindow;