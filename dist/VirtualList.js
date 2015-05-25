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

function documentOffsetTop(element) {
    if (!element) return 0;
    
    return element.offsetTop + documentOffsetTop(element.offsetParent);
}

var VirtualList = React.createClass({displayName: "VirtualList",
    // TODO add propTypes
    getVirtualState: function(props) {
        // default values
        var state = {
            items: [],
            bufferStart: 0,
            bufferEnd: 0
        };
        
        if (typeof window === 'undefined') return state;
        
        var items = props.items;

        if (items.length === 0) return state;
        
        var offsetTop = this.isMounted() ? documentOffsetTop(this.getDOMNode()) : 0;

        var renderer = new VirtualRenderer(window.scrollY, window.innerHeight, offsetTop, props.itemHeight, items.length);
        
        var renderStats = renderer.getItems();
        
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
        
        window.addEventListener('scroll', this.onScroll);
    },
    componentWillUnmount: function() {
        window.removeEventListener('scroll', this.onScroll);
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