# [react-virtual-list](http://developerdizzle.github.io/react-virtual-list/) [![Build Status](https://travis-ci.org/developerdizzle/react-virtual-list.svg?branch=master)](https://travis-ci.org/developerdizzle/react-virtual-list) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/react.svg)](https://bundlephobia.com/result?p=react-virtual-list)


Super simple virtualized list [children-as-function component](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) for [React](https://github.com/facebook/react) version `^15.0.0 || ^16.0.0`.

[Check out the demo here](http://developerdizzle.github.io/react-virtual-list)

`react-virtual-list` allows you to display a large list of fixed-height items, while only rendering the items visible on the screen.  This allows a large list to be rendered with much fewer DOM elements.

### Some other benefits:
* Minimal dependencies
* [Small!](https://bundlephobia.com/result?p=react-virtual-list)
* Performant - demo page almost always stays over 60fps [http://i.imgur.com/CHVCK9x.png](http://i.imgur.com/CHVCK9x.png)
* Keeps your components separate - as a children-as-function component
* Gives you control - doesn't force any particular markup, but gives you the necessary styles and data to use.

## Legacy

If you're looking for documentation on version 2, the higher-order component, it's [here](README.v2.md).

If you're looking for documentation on version 1, supporting React `~0.13.x`, it's [here](README.v1.md).

## Installation

You can use [npm](https://npmjs.org) to install [react-virtual-list](https://www.npmjs.com/package/react-virtual-list).

```console
> npm install react-virtual-list --save
```

## Usage

```js
import VirtualList from 'react-virtual-list';
```

Your render function uses the `virtual` parameter to render the visible items, and set a style to set the overall list height and padding.

```js

class MyVirtualList extends Component {
  renderMyList(virtual) {
    return (
      <ul style={virtual.style}>
        {virtual.items.map(item => (
          <li key={item.id} style={{height: this.props.itemHeight}}>
            Lorem ipsum dolor sit amet
          </li>
        ))}
      </ul>
    );
  }

  render() {
    return (
      <VirtualList
        items={this.props.myBigListOfItems}
        itemHeight={this.props.itemHeight}
        >
        {this.renderMyList}
      />
    );
  }
}
```

**Note:** You should set [keys](https://facebook.github.io/react/docs/lists-and-keys.html) on your list items.

#### Properties

These properties affect how the virtual list is rendered.

Name | Type | Default | Description
--- | --- | --- | ---
`items` | Array | - | Full array of list items.  Only the visible subset of these will be rendered.
`itemHeight` | Number | - | Height in pixels of a single item.  **You must have a CSS rule that sets the height of each list item to this value.**
`itemBuffer` | Number | 0 | Number of items that should be rendered before and after the visible viewport.  Try using this if you have a complex list that suffers from a bit of lag when scrolling.
`container` | DOM Element | window | Scrollable element that contains the list.  Use this if you have a list inside an element with `overflow: scroll`.
`initialState` | object | - | An object with `firstItemIndex` and `lastItemIndex` properties, which represent array indexes of `items` (see below).  These are used to calculate the visible items before the component is mounted.  Useful for server-side rendering.
`mapVirtualParameter` | Function | [defaultMapVirtualParameter](/src/utils/defaultMapVirtualToProps.js) | A function that maps the virtualizing data to the `virtual` parameter used by your children function.  See the [mapping](#Mapping) section for more info.

#### Mapping

`VirtualList` allows an optional property named `mapVirtualParameter`, which functions similarly to [Redux's `mapStateToProps`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options).  This function can be provided to change the data passed to your children function.  Its arguments are:

Name | Description
--- | ---
`props` | Includes all properties passed to `VirtualList`
`state` | Includes `firstItemIndex` and `lastItemIndex`; array indexes of the visible bounds of `items`

The default `mapVirtualParameter` can be found [here](/src/utils/defaultMapVirtualToProps.js).

#### Example Usage

Check out [demo/app.js](demo/app.js) for the example used in the [demo](http://developerdizzle.github.io/react-virtual-list).

## Tests

Use `npm test` to run the tests using [Jest](https://github.com/facebook/jest).  Not everything is currently tested yet!
