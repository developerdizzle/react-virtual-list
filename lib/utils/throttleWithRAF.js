"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _arguments = arguments;

exports.default = function (fn) {
  var running = false;

  return function () {
    if (running) return;

    running = true;

    window.requestAnimationFrame(function () {
      fn.apply(undefined, _arguments);

      running = false;
    });
  };
};