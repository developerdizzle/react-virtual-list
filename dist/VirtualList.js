var React = require('react');
var VirtualRenderer = require('./utils/virtual-renderer');

function areArraysEqual(a, b) {
    if (!a || !b) return false;

    if (a.length != b.length) return false;
    
    for (var i = 0, length = a.length; i < length; i++) {
        if (a[i] != b[i]) return false;   
    }
    
    return true;
}

function topDifference(element, container) {
    return topFromWindow(element) - topFromWindow(container);
}

function topFromWindow(element) {
    if (!element || element === window) return 0;
    
    return element.offsetTop + topFromWindow(element.offsetParent);
}

var VirtualList = React.createClass({displayName: "VirtualList",
    propTypes: {
        items: React.PropTypes.array.isRequired,
        itemHeight: React.PropTypes.number.isRequired,
        renderItem: React.PropTypes.func.isRequired,
        container: React.PropTypes.object.isRequired
    },
    getDefaultProps: function() {
        return {
            container: window
        };
    },
    getVirtualState: function(props) {
        // default values
        var state = {
            items: [],
            bufferStart: 0,
            bufferEnd: 0
        };
        
        // early return if nothing to render
        if (typeof this.props.container === 'undefined' || props.items.length === 0 || props.itemHeight <= 0 || !this.isMounted()) return state;
        
        var items = props.items;

        var container = this.props.container;

        var viewHeight = typeof container.innerHeight !== 'undefined' ? container.innerHeight : container.clientHeight;
        
        // no space to render
        if (viewHeight <= 0) return state;
        
        var list = this.getDOMNode();

        var offsetTop = topDifference(list, container);

        var viewTop = typeof container.scrollY !== 'undefined' ? container.scrollY : container.scrollTop;

        var renderer = new VirtualRenderer(viewTop, viewHeight, offsetTop, props.itemHeight, items.length);

        var renderStats = renderer.getItems();
        
        // no items to render
        if (renderStats.itemsInView.length === 0) return state;

        state.items = items.slice(renderStats.firstItemIndex, renderStats.lastItemIndex + 1);
        state.bufferStart = renderStats.firstItemIndex * props.itemHeight;
        state.bufferEnd = renderStats.itemsAfterView * props.itemHeight;
        
        return state;
    },
    getInitialState: function() {
        return this.getVirtualState(this.props);
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        if (this.state.bufferStart !== nextState.bufferStart) return true;
        if (this.state.bufferEnd !== nextState.bufferEnd) return true;
        
        var equal = areArraysEqual(this.state.items, nextState.items);
        
        return !equal;
    },
    componentWillReceiveProps: function(nextProps) {
        var state = this.getVirtualState(nextProps);
        
        this.setState(state);
    },
    componentDidMount: function() {
        var state = this.getVirtualState(this.props);
        
        this.setState(state);
        
        this.props.container.addEventListener('scroll', this.onScroll);
    },
    componentWillUnmount: function() {
        this.props.container.removeEventListener('scroll', this.onScroll);
    },
    onScroll: function() {
        var state = this.getVirtualState(this.props);
        
        this.setState(state);
    },
    render: function() {
        return (
        React.createElement("div", null, 
            React.createElement("div", {style: {height: this.state.bufferStart}}), 
            this.state.items.map(this.props.renderItem), 
            React.createElement("div", {style: {height: this.state.bufferEnd}})
        )
        );
    }
});

module.exports = VirtualList;