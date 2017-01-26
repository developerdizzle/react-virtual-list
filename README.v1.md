# [react-virtual-list](http://developerdizzle.github.io/react-virtual-list/) [![Build Status](https://travis-ci.org/developerdizzle/react-virtual-list.svg?branch=master)](https://travis-ci.org/developerdizzle/react-virtual-list)
# Legacy (version 1)

Super simple virtualized list [React](https://github.com/facebook/react) component

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
var VirtualList = require('react-virtual-list');
```

#### JSX

```
<VirtualList items={this.props.items} renderItem={this.renderItem} itemHeight={this.props.itemHeight} />
```

#### Properties

* `items` the full array of list items.  Only the visible subset of these will be rendered.
* `renderItem` a function to render a single item, passed as argument `item`.  Must return a single React element (`React.createElement(...)`)
* `itemHeight` the height in pixels of a single item.  **You must have a CSS rule that sets the height of each list item to this value.**
* `container` the scrollable element that contains the list.  Defaults to `window`.  Use this if you have a list inside an element with `overflow: scroll`.
* `tagName` the tagName for the root element that surrounds the items rendered by renderItem.  Defaults to `div`.  Use this if you want to render a list with `ul` and `li`, or any other elements.
* `scrollDelay` the delay in milliseconds after scroll to recalculate.  Defaults to `0`.  Can be used to throttle recalculation.
* `itemBuffer` the number of items that should be rendered before and after the visible viewport.  Defaults to `0`.
 
Any other properties set on `VirtualList`, such as `className`, will be reflected on the component's root element.

#### Functions

* `visibleItems` the currently visible array of items.  Can be used to figure out which items are in the viewport.  Eg: `var items = this.refs.list.visibleItems()` 

#### Example Usage

Check out [https://github.com/developerdizzle/react-virtual-list/blob/gh-pages/App.jsx](https://github.com/developerdizzle/react-virtual-list/blob/gh-pages/App.jsx) for the example used in the demo.

## Tests

Use `npm test` to run the tests using [jasmine-node](https://github.com/mhevery/jasmine-node).  Currently only the math calculations are tested.  Hoping to add some DOM tests as well.

## To Do

* ES6/2015
* [Known issue with mobile scroll event](https://github.com/developerdizzle/react-virtual-list/issues/1)