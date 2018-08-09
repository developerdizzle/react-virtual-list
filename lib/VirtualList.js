'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _getVisibleItemBounds = require('./utils/getVisibleItemBounds');

var _getVisibleItemBounds2 = _interopRequireDefault(_getVisibleItemBounds);

var _throttleWithRAF = require('./utils/throttleWithRAF');

var _throttleWithRAF2 = _interopRequireDefault(_throttleWithRAF);

var _defaultMapVirtualToProps = require('./utils/defaultMapVirtualToProps');

var _defaultMapVirtualToProps2 = _interopRequireDefault(_defaultMapVirtualToProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VirtualList = function VirtualList(options) {
  var mapVirtualToProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _defaultMapVirtualToProps2.default;
  return function (InnerComponent) {
    var _class, _temp;

    return _temp = _class = function (_PureComponent) {
      _inherits(VList, _PureComponent);

      function VList(props) {
        _classCallCheck(this, VList);

        var _this = _possibleConstructorReturn(this, (VList.__proto__ || Object.getPrototypeOf(VList)).call(this, props));

        _this._isMounted = false;

        _this.refreshState = function () {
          if (!_this._isMounted) {
            return;
          }

          var _this$props = _this.props,
              itemHeight = _this$props.itemHeight,
              items = _this$props.items,
              itemBuffer = _this$props.itemBuffer;
          var _this$state = _this.state,
              domNode = _this$state.domNode,
              container = _this$state.options.container,
              firstItemIndex = _this$state.firstItemIndex,
              lastItemIndex = _this$state.lastItemIndex;

          var state = VList.setStateIfNeeded(domNode, container, items, itemHeight, itemBuffer, firstItemIndex, lastItemIndex);

          _this.setState(state);
        };

        _this.state = {
          firstItemIndex: 0,
          lastItemIndex: -1,
          options: _extends({
            container: typeof window !== 'undefined' ? window : undefined
          }, options)
        };

        // if requestAnimationFrame is available, use it to throttle refreshState
        if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
          _this.refreshState = (0, _throttleWithRAF2.default)(_this.refreshState);
        }
        return _this;
      }

      _createClass(VList, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          var container = this.state.options.container;


          this._isMounted = true;

          // cache the DOM node
          this.setState({ domNode: _reactDom2.default.findDOMNode(this) });

          // we need to refreshState because we didn't have access to the DOM node before
          this.refreshState();

          // add events
          container.addEventListener('scroll', this.refreshState);
          container.addEventListener('resize', this.refreshState);
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          var container = this.state.options.container;


          this._isMounted = false;

          // remove events
          container.removeEventListener('scroll', this.refreshState);
          container.removeEventListener('resize', this.refreshState);
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(InnerComponent, _extends({}, this.props, mapVirtualToProps(this.props, this.state)));
        }
      }], [{
        key: 'setStateIfNeeded',
        value: function setStateIfNeeded(list, container, items, itemHeight, itemBuffer, firstItemIndex, lastItemIndex) {
          // get first and lastItemIndex
          var state = (0, _getVisibleItemBounds2.default)(list, container, items, itemHeight, itemBuffer);

          if (state === undefined) {
            return null;
          }

          if (state.firstItemIndex > state.lastItemIndex) {
            return null;
          }

          if (state.firstItemIndex !== firstItemIndex || state.lastItemIndex !== lastItemIndex) {
            return state;
          }
        }

        // if props change, just assume we have to recalculate

      }, {
        key: 'getDerivedStateFromProps',
        value: function getDerivedStateFromProps(nextProps, nextState) {
          var itemHeight = nextProps.itemHeight,
              items = nextProps.items,
              itemBuffer = nextProps.itemBuffer;
          var domNode = nextState.domNode,
              container = nextState.options.container,
              firstItemIndex = nextState.firstItemIndex,
              lastItemIndex = nextState.lastItemIndex;


          var state = VList.setStateIfNeeded(domNode, container, items, itemHeight, itemBuffer, firstItemIndex, lastItemIndex);

          if (state === undefined) {
            return null;
          }

          return state;
        }
      }]);

      return VList;
    }(_react.PureComponent), _class.propTypes = {
      items: _propTypes2.default.array.isRequired,
      itemHeight: _propTypes2.default.number.isRequired,
      itemBuffer: _propTypes2.default.number
    }, _class.defaultProps = {
      itemBuffer: 0
    }, _temp;
  };
};

exports.default = VirtualList;