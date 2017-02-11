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

var _getVisibleItemBounds = require('./utils/getVisibleItemBounds');

var _getVisibleItemBounds2 = _interopRequireDefault(_getVisibleItemBounds);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VirtualList = function VirtualList(options) {
  return function (InnerComponent) {
    var _class, _temp;

    return _temp = _class = function (_PureComponent) {
      _inherits(vlist, _PureComponent);

      function vlist(props) {
        _classCallCheck(this, vlist);

        var _this = _possibleConstructorReturn(this, (vlist.__proto__ || Object.getPrototypeOf(vlist)).call(this, props));

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
        if (window && 'requestAnimationFrame' in window) {
          (function () {
            var refreshState = _this.refreshState;

            _this.refreshState = function () {
              if (_this.isRefreshingState) return;

              _this.isRefreshingState = true;

              window.requestAnimationFrame(function () {
                refreshState();

                _this.isRefreshingState = false;
              });
            };
          })();
        }
        return _this;
      }

      _createClass(vlist, [{
        key: 'setStateIfNeeded',
        value: function setStateIfNeeded(list, container, items, itemHeight, itemBuffer) {
          // get first and lastItemIndex
          var state = (0, _getVisibleItemBounds2.default)(list, container, items, itemHeight, itemBuffer);

          if (state !== undefined && (state.firstItemIndex !== this.state.firstItemIndex || state.lastItemIndex !== this.state.lastItemIndex)) {
            this.setState(state);
          }
        }
      }, {
        key: 'refreshState',
        value: function refreshState() {
          var _props = this.props,
              itemHeight = _props.itemHeight,
              items = _props.items,
              itemBuffer = _props.itemBuffer;


          this.setStateIfNeeded(this.domNode, this.options.container, items, itemHeight, itemBuffer);
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
          var _state = this.state,
              firstItemIndex = _state.firstItemIndex,
              lastItemIndex = _state.lastItemIndex;
          var _props2 = this.props,
              items = _props2.items,
              itemHeight = _props2.itemHeight;


          var visibleItems = lastItemIndex > -1 ? items.slice(firstItemIndex, lastItemIndex + 1) : [];
          // would be nice to make this not break shallowCompare with items.slice
          // but theoretically we're only rendering if we need to

          // style
          var height = items.length * itemHeight;
          var paddingTop = firstItemIndex * itemHeight;

          var virtual = {
            items: visibleItems,
            style: {
              height: height,
              paddingTop: paddingTop
            }
          };

          return _react2.default.createElement(InnerComponent, _extends({}, this.props, {
            virtual: virtual
          }));
        }
      }]);

      return vlist;
    }(_react.PureComponent), _class.propTypes = {
      items: _react.PropTypes.array.isRequired,
      itemHeight: _react.PropTypes.number.isRequired,
      itemBuffer: _react.PropTypes.number
    }, _class.defaultProps = {
      itemBuffer: 0
    }, _temp;
  };
};

exports.default = VirtualList;