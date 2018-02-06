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
      _inherits(vlist, _PureComponent);

      function vlist(props) {
        _classCallCheck(this, vlist);

        var _this = _possibleConstructorReturn(this, (vlist.__proto__ || Object.getPrototypeOf(vlist)).call(this, props));

        _this._isMounted = false;


        _this.options = _extends({
          container: typeof window !== 'undefined' ? window : undefined
        }, options);

        _this.state = {
          firstItemIndex: 0,
          lastItemIndex: -1
        };

        // initialState allows us to set the first/lastItemIndex (useful for server-rendering)
        if (options && options.initialState) {
          _this.state = _extends({}, _this.state, options.initialState);
        }

        _this.refreshState = _this.refreshState.bind(_this);

        // if requestAnimationFrame is available, use it to throttle refreshState
        if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
          _this.refreshState = (0, _throttleWithRAF2.default)(_this.refreshState);
        }
        return _this;
      }

      _createClass(vlist, [{
        key: 'setStateIfNeeded',
        value: function setStateIfNeeded(list, container, items, itemHeight, itemBuffer) {
          // get first and lastItemIndex
          var state = (0, _getVisibleItemBounds2.default)(list, container, items, itemHeight, itemBuffer);

          if (state === undefined) {
            return;
          }

          if (state.firstItemIndex > state.lastItemIndex) {
            return;
          }

          if (state.firstItemIndex !== this.state.firstItemIndex || state.lastItemIndex !== this.state.lastItemIndex) {
            this.setState(state);
          }
        }
      }, {
        key: 'refreshState',
        value: function refreshState() {
          if (!this._isMounted) {
            return;
          }

          var _props = this.props,
              itemHeight = _props.itemHeight,
              items = _props.items,
              itemBuffer = _props.itemBuffer;


          this.setStateIfNeeded(this.domNode, this.options.container, items, itemHeight, itemBuffer);
        }
      }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
          this._isMounted = true;
        }
      }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
          // cache the DOM node
          this.domNode = _reactDom2.default.findDOMNode(this);

          // we need to refreshState because we didn't have access to the DOM node before
          this.refreshState();

          // add events
          this.options.container.addEventListener('scroll', this.refreshState);
          this.options.container.addEventListener('resize', this.refreshState);
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this._isMounted = false;

          // remove events
          this.options.container.removeEventListener('scroll', this.refreshState);
          this.options.container.removeEventListener('resize', this.refreshState);
        }
      }, {
        key: 'componentWillReceiveProps',


        // if props change, just assume we have to recalculate
        value: function componentWillReceiveProps(nextProps) {
          var itemHeight = nextProps.itemHeight,
              items = nextProps.items,
              itemBuffer = nextProps.itemBuffer;


          this.setStateIfNeeded(this.domNode, this.options.container, items, itemHeight, itemBuffer);
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(InnerComponent, _extends({}, this.props, mapVirtualToProps(this.props, this.state)));
        }
      }]);

      return vlist;
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