var React = require('react');
var utils = require('./utils');

var VirtualList = React.createClass({
    propTypes: {
        container: React.PropTypes.object.isRequired,
        initialVisibleItems: React.PropTypes.number.isRequired,
        itemBuffer: React.PropTypes.number.isRequired,
        itemHeight: React.PropTypes.number.isRequired,
        items: React.PropTypes.array.isRequired,
        renderItem: React.PropTypes.func.isRequired,
        scrollDelay: React.PropTypes.number.isRequired,
        tagName: React.PropTypes.string.isRequired
    },
    getDefaultProps: function() {
        return {
            container: typeof window !== 'undefined' ? window : undefined,
            initialVisibleItems: 0,
            itemBuffer: 0,
            scrollDelay: 0,
            tagName: 'div'
        };
    },
    getInitialState: function() {
        return {
            items: this.props.items.slice(0, this.props.initialVisibleItems),
            bufferStart: 0,
            height: 0
        };
    },
    getVirtualState: function(props) {
        // default values
        var state = {
            items: [],
            bufferStart: 0,
            height: 0
        };

        var container = props.container;
        var items = props.items;
        var itemHeight = props.itemHeight;
        var itemBuffer = props.itemBuffer;

        // early return if nothing to render
        if (typeof container === 'undefined' || items.length === 0 || itemHeight <= 0) return state;

        state.height = items.length * itemHeight;

        var viewHeight = typeof container.innerHeight !== 'undefined' ? container.innerHeight : container.clientHeight;
        
        // no space to render
        if (viewHeight <= 0) return state;
        
        var list = React.findDOMNode(this);

        var offsetTop = utils.topDifference(list, container);

        var viewTop = utils.viewTop(container);

        var renderStats = VirtualList.getItems(viewTop, viewHeight, offsetTop, itemHeight, items.length, itemBuffer);
        
        // no items to render
        if (renderStats.itemsInView.length === 0) return state;

        state.items = items.slice(renderStats.firstItemIndex, renderStats.lastItemIndex + 1);
        state.bufferStart = renderStats.firstItemIndex * itemHeight;
        
        return state;
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        if (this.state.bufferStart !== nextState.bufferStart) return true;

        if (this.state.height !== nextState.height) return true;
        
        var equal = utils.areArraysEqual(this.state.items, nextState.items);
        
        return !equal;
    },
    componentWillReceiveProps: function(nextProps) {
        var state = this.getVirtualState(nextProps);

        if (this.props.scrollDelay !== nextProps.scrollDelay) {
            this.props.container.removeEventListener('scroll', this.onScrollDebounced);

            this.onScrollDebounced = utils.debounce(this.onScroll, nextProps.scrollDelay, false);

            nextProps.container.addEventListener('scroll', this.onScrollDebounced);
        }
        
        this.setState(state);
    },
    componentWillMount: function() {
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
    // in case you need to get the currently visible items
    visibleItems: function() {
        return this.state.items;
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

VirtualList.getItems = function(viewTop, viewHeight, listTop, itemHeight, itemCount, itemBuffer) {
    if (itemCount === 0 || itemHeight === 0) return {
        itemsInView: 0
    };
    
    var listHeight = itemHeight * itemCount;
    
    var listBox = {
        top: listTop,
        height: listHeight,
        bottom: listTop + listHeight
    };
    
    var bufferHeight = itemBuffer * itemHeight;
    viewTop -= bufferHeight;
    viewHeight += bufferHeight * 2;
    
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