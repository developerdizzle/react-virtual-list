'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _topFromWindow = require('./topFromWindow');

var _topFromWindow2 = _interopRequireDefault(_topFromWindow);

var _getElementTop = require('./getElementTop');

var _getElementTop2 = _interopRequireDefault(_getElementTop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getVisibleItemBounds = function getVisibleItemBounds(list, container, items, itemHeight, itemBuffer) {
  // early return if we can't calculate
  if (!container) return undefined;
  if (!itemHeight) return undefined;
  if (!items) return undefined;
  if (items.length === 0) return undefined;

  // what the user can see
  var innerHeight = container.innerHeight,
      clientHeight = container.clientHeight;


  var viewHeight = innerHeight || clientHeight; // how many pixels are visible

  if (!viewHeight) return undefined;

  var viewTop = (0, _getElementTop2.default)(container); // top y-coordinate of viewport inside container
  var viewBottom = viewTop + viewHeight;

  var listTop = (0, _topFromWindow2.default)(list) - (0, _topFromWindow2.default)(container); // top y-coordinate of container inside window
  var listHeight = itemHeight * items.length;

  // visible list inside view
  var listViewTop = Math.max(0, viewTop - listTop); // top y-coordinate of list that is visible inside view
  var listViewBottom = Math.max(0, Math.min(listHeight, viewBottom - listTop)); // bottom y-coordinate of list that is visible inside view

  // visible item indexes
  var firstItemIndex = Math.max(0, Math.floor(listViewTop / itemHeight) - itemBuffer);
  var lastItemIndex = Math.min(items.length, Math.ceil(listViewBottom / itemHeight) + itemBuffer) - 1;

  return {
    firstItemIndex: firstItemIndex,
    lastItemIndex: lastItemIndex
  };
};

exports.default = getVisibleItemBounds;