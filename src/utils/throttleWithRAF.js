export default (fn) => {
  let running = false;

  return (...args) => {
    if (running) return;

    running = true;

    window.requestAnimationFrame(() => {
      fn.apply(this, args);

      running = false;
    });
  };
};
