"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (fn) {
  var running = false;

  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (running) return;

    running = true;

    window.requestAnimationFrame(function () {
      fn.apply(undefined, args);

      running = false;
    });
  };
};