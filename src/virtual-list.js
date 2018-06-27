import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import getVisibleItemBounds from './utils/getVisibleItemBounds';
import throttleWithRAF from './utils/throttleWithRAF';
import defaultMapVirtualParameter from './utils/defaultMapVirtualParameter';

class VirtualList extends PureComponent {
  static propTypes = {
    items: PropTypes.array.isRequired,
    itemHeight: PropTypes.number.isRequired,
    itemBuffer: PropTypes.number.isRequired,
    container: PropTypes.object.isRequired,
    mapVirtualToProps: PropTypes.func.isRequired,
    initialState: PropTypes.object.isRequired,
    children: PropTypes.func.isRequired,
  };

  static defaultProps = {
    itemBuffer: 0,
    container: typeof window !== 'undefined' ? window : undefined,
    mapVirtualToProps: defaultMapVirtualParameter,
    initialState: {
      firstItemIndex: 0,
      lastItemIndex: -1,
    },
  };

  _isMounted = false;

  constructor(props) {
    super(props);

    // initialState allows us to set the first/lastItemIndex (useful for server-rendering)
    this.state = props.initialState;

    // if requestAnimationFrame is available, use it to throttle refreshState
    if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
      this.refreshState = throttleWithRAF(this.refreshState);
    }
  };

  setStateIfNeeded(list, container, items, itemHeight, itemBuffer) {
    // get first and lastItemIndex
    const state = getVisibleItemBounds(list, container, items, itemHeight, itemBuffer);

    if (state === undefined) { return; }
    
    if (state.firstItemIndex > state.lastItemIndex) { return; }

    if (state.firstItemIndex !== this.state.firstItemIndex || state.lastItemIndex !== this.state.lastItemIndex) {
      this.setState(state);
    }
  }

  refreshState = () => {
    if (!this._isMounted) {
      return;
    }
    
    const { itemHeight, items, itemBuffer, container } = this.props;

    this.setStateIfNeeded(this.domNode, container, items, itemHeight, itemBuffer);
  };

  componentWillMount() {
    this._isMounted = true;
  }

  componentDidMount() {
    // cache the DOM node
    this.domNode = ReactDOM.findDOMNode(this);

    // we need to refreshState because we didn't have access to the DOM node before
    this.refreshState();

    // add events
    this.props.container.addEventListener('scroll', this.refreshState);
    this.props.container.addEventListener('resize', this.refreshState);
  };

  componentWillUnmount() {
    this._isMounted = false;

    // remove events
    this.props.container.removeEventListener('scroll', this.refreshState);
    this.props.container.removeEventListener('resize', this.refreshState);
  };

  // if props change, just assume we have to recalculate
  componentWillReceiveProps(nextProps) {
    const { itemHeight, items, itemBuffer, container } = nextProps;

    this.setStateIfNeeded(this.domNode, container, items, itemHeight, itemBuffer);
  };

  render() {
    const virtual = this.props.mapVirtualToProps(this.props, this.state);

    return this.props.children(virtual);
  };
}

export default VirtualList;
