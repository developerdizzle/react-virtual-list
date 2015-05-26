# react-virtual-list
Super simple virtualized list React component

[Check out the demo here](http://developerdizzle.github.io/react-virtual-list)

This React component allows you to display a large list of fixed-height items in your document, while only rendering the items visible in the viewport.  This allows a large list to be rendered with much fewer DOM elements.

## Installation

You can use NPM to install react-virtual-list:

```console
$ npm install react-virtual-list --save
```

## Usage

The `./dist/VirtualList.js` module exports a single React component.

```
var VirtualList = require('./node_modules/react-virtual-list/dist/VirtualList.js');
```

#### JSX

```
<VirtualList items={this.props.items} renderItem={this.renderItem} itemHeight={this.props.itemHeight} />
```

#### Properties

* `items` the full array of list items.  Only the visible subset of these will be rendered.
* `renderItem` a function to render a single item, passed as argument `item`
* `itemHeight` the height in pixels of a single item.  **You must have a CSS rule that sets the height of each list item to this value.**
* `container` the scrollable element that contains the list.  Defaults to `window`

#### Example Usage

Check out [https://github.com/developerdizzle/react-virtual-list/blob/gh-pages/App.jsx](https://github.com/developerdizzle/react-virtual-list/blob/gh-pages/App.jsx) for the example used in the demo.
