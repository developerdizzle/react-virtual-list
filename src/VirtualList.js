import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import getVisibleItemBounds from './utils/getVisibleItemBounds';
import throttleWithRAF from './utils/throttleWithRAF';
import defaultMapToVirtualProps from './utils/defaultMapVirtualToProps';

const VirtualList = (options, mapVirtualToProps = defaultMapToVirtualProps) => (InnerComponent) => {
  return class VList extends PureComponent {
    constructor(props) {
      super(props);

      this.state = {
        firstItemIndex: 0,
        lastItemIndex: -1,
        options: {
          container: typeof window !== 'undefined' ? window : undefined,
          ...options,
        }
      };

      // if requestAnimationFrame is available, use it to throttle refreshState
      if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
        this.refreshState = throttleWithRAF(this.refreshState);
      }
    };

    static propTypes = {
      items: PropTypes.array.isRequired,
      itemHeight: PropTypes.number.isRequired,
      itemBuffer: PropTypes.number,
    };

    static defaultProps = {
      itemBuffer: 0,
    };

    _isMounted = false;

    componentDidMount() {
      const { options: { container } } = this.state

      this._isMounted = true;

      // cache the DOM node
      this.setState({domNode: ReactDOM.findDOMNode(this)});

      // we need to refreshState because we didn't have access to the DOM node before
      this.refreshState();

      // add events
      container.addEventListener('scroll', this.refreshState);
      container.addEventListener('resize', this.refreshState);
    };

    componentWillUnmount() {
      const { options: { container } } = this.state

      this._isMounted = false;

      // remove events
      container.removeEventListener('scroll', this.refreshState);
      container.removeEventListener('resize', this.refreshState);
    };

    static setStateIfNeeded(list, container, items, itemHeight, itemBuffer, firstItemIndex, lastItemIndex) {
      // get first and lastItemIndex
      const state = getVisibleItemBounds(list, container, items, itemHeight, itemBuffer);

      if (state === undefined) { return null; }
      
      if (state.firstItemIndex > state.lastItemIndex) { return null; }

      if (state.firstItemIndex !== firstItemIndex || state.lastItemIndex !== lastItemIndex) {
        return state;
      }
    }

    // if props change, just assume we have to recalculate
    static getDerivedStateFromProps(nextProps, nextState) {
      const { itemHeight, items, itemBuffer } = nextProps;
      const { domNode, options: { container }, firstItemIndex, lastItemIndex } = nextState

      const state = VList.setStateIfNeeded(
        domNode, 
        container, 
        items, 
        itemHeight, 
        itemBuffer,
        firstItemIndex,
        lastItemIndex,
      );

      if (state === undefined) {
        return null;
      }

      return state;
    };

    refreshState = () => {
      if (!this._isMounted) {
        return;
      }
      
      const { itemHeight, items, itemBuffer } = this.props;
      const { domNode, options: { container }, firstItemIndex, lastItemIndex } = this.state
      const state = VList.setStateIfNeeded(
        domNode, 
        container, 
        items, 
        itemHeight, 
        itemBuffer,
        firstItemIndex,
        lastItemIndex,
      );

      this.setState(state)
    };

    render() {
      return (<InnerComponent {...this.props} {...mapVirtualToProps(this.props, this.state)} />);
    };
  };
};

export default VirtualList;
