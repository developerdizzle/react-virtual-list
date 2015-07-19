var React = require('react');
var utils = require('./utils');

var VirtualList = React.createClass({
    propTypes: {
        items: React.PropTypes.array.isRequired,
        itemHeight: React.PropTypes.number.isRequired,
        renderItem: React.PropTypes.func.isRequired,
        container: React.PropTypes.object.isRequired,
        tagName: React.PropTypes.string.isRequired,
        scrollDelay: React.PropTypes.number
    },
    getDefaultProps: function() {
        return {
            container: typeof window !== 'undefined' ? window : undefined,
            tagName: 'div',
            scrollDelay: 0
        };
    },
    getVirtualState: function(props) {
        // default values
        var state = {
            items: [],
            bufferStart: 0,
            height: 0
        };
        
        // early return if nothing to render
        if (typeof props.container === 'undefined' || props.items.length === 0 || props.itemHeight <= 0 || !this.isMounted()) return state;
        
        var items = props.items;
        
        state.height = props.items.length * props.itemHeight;

        var container = props.container;

        var viewHeight = typeof container.innerHeight !== 'undefined' ? container.innerHeight : container.clientHeight;
        
        // no space to render
        if (viewHeight <= 0) return state;
        
        var list = this.getDOMNode();

        var offsetTop = utils.topDifference(list, container);

        var viewTop = typeof container.scrollY !== 'undefined' ? container.scrollY : container.scrollTop;

        var renderStats = VirtualList.getItems(viewTop, viewHeight, offsetTop, props.itemHeight, items.length);
        
        // no items to render
        if (renderStats.itemsInView.length === 0) return state;

        state.items = items.slice(renderStats.firstItemIndex, renderStats.lastItemIndex + 1);
        state.bufferStart = renderStats.firstItemIndex * props.itemHeight;
        
        return state;
    },
    getInitialState: function() {
        return this.getVirtualState(this.props);
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        if (this.state.bufferStart !== nextState.bufferStart) return true;

        if (this.state.height !== nextState.height) return true;
        
        var equal = utils.areArraysEqual(this.state.items, nextState.items);
        
        return !equal;
    },
    componentWillReceiveProps: function(nextProps) {
        console.log('componentWillReceiveProps');
        
        var state = this.getVirtualState(nextProps);

        this.props.container.removeEventListener('scroll', this.onScrollDebounced);

        this.onScrollDebounced = utils.debounce(this.onScroll, nextProps.scrollDelay, false);

        nextProps.container.addEventListener('scroll', this.onScrollDebounced);
        
        this.setState(state);
    },
    componentWillMount: function() {
        console.log('componentWillMount', this.props);
        
        this.onScrollDebounced = utils.debounce(this.onScroll, this.props.scrollDelay, false);
    },
    componentDidMount: function() {
        var state = this.getVirtualState(this.props);
        
        this.setState(state);
        
        this.props.container.addEventListener('scroll', this.onScrollDebounced);
    },
    componentWillUnmount: function() {
        this.props.container.removeEventListener('scroll', this.onScrollDebounced);
    },
    onScroll: function() {
        var state = this.getVirtualState(this.props);
        
        this.setState(state);
    },
    render: function() {
        return (
        <this.props.tagName {...this.props} style={{boxSizing: 'border-box', height: this.state.height, paddingTop: this.state.bufferStart }} >
            {this.state.items.map(this.props.renderItem)}
        </this.props.tagName>
        );
    }
});

VirtualList.getBox = function(view, list) {
    list.height = list.height || list.bottom - list.top;
    
    return {
        top: Math.max(0, Math.min(view.top - list.top)),
        bottom: Math.max(0, Math.min(list.height, view.bottom - list.top))
    };
};

VirtualList.getItems = function(viewTop, viewHeight, listTop, itemHeight, itemCount) {
    if (itemCount === 0 || itemHeight === 0) return {
        itemsInView: 0
    };
    
    var listHeight = itemHeight * itemCount;
    
    var listBox = {
        top: listTop,
        height: listHeight,
        bottom: listTop + listHeight
    };
    
    var viewBox = {
        top: viewTop,
        bottom: viewTop + viewHeight
    };
    
    // list is below viewport
    if (viewBox.bottom < listBox.top) return {
        itemsInView: 0
    };
    
    // list is above viewport
    if (viewBox.top > listBox.bottom) return {
        itemsInView: 0
    };
    
    var listViewBox = VirtualList.getBox(viewBox, listBox);
    
    var firstItemIndex = Math.max(0,  Math.floor(listViewBox.top / itemHeight));
    var lastItemIndex = Math.ceil(listViewBox.bottom / itemHeight) - 1;
    
    var itemsInView = lastItemIndex - firstItemIndex + 1;

    var result = {
        firstItemIndex: firstItemIndex,
        lastItemIndex: lastItemIndex,
        itemsInView: itemsInView,
    };
    
    return result;
};

module.exports = VirtualList;