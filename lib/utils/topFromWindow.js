'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var topFromWindow = function topFromWindow(element) {
  if (typeof element === 'undefined' || !element) return 0;

  return (element.offsetTop || 0) + topFromWindow(element.offsetParent);
};

exports.default = topFromWindow;