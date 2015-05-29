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

var VirtualList = React.createClass({
    propTypes: {
        items: React.PropTypes.array.isRequired,
        itemHeight: React.PropTypes.number.isRequired,
        renderItem: React.PropTypes.func.isRequired,
        container: React.PropTypes.object.isRequired,
        tagName: React.PropTypes.string.isRequired
    },
    getDefaultProps: function() {
        return {
            container: window,
            tagName: 'div'
        };
    },
    getVirtualState: function(props) {
        // default values
        var state = {
            items: [],
            bufferStart: 0,
            bufferEnd: 0,
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
        if (this.state.height !== nextState.height) return true;
        
        var equal = areArraysEqual(this.state.items, nextState.items);
        
        return !equal;
    },
    componentWillReceiveProps: function(nextProps) {
        var state = this.getVirtualState(nextProps);

        this.props.container.removeEventListener('scroll', this.onScroll);
        nextProps.container.addEventListener('scroll', this.onScroll);
        
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
        <this.props.tagName {...this.props} style={{height: this.state.height, paddingTop: this.state.bufferStart, paddingBottom: this.state.bufferEnd }} >
            {this.state.items.map(this.props.renderItem)}
        </this.props.tagName>
        );
    }
});

module.exports = VirtualList;