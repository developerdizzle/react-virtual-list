# [react-virtual-list](http://developerdizzle.github.io/react-virtual-list/) [![Build Status](https://travis-ci.org/developerdizzle/react-virtual-list.svg?branch=master)](https://travis-ci.org/developerdizzle/react-virtual-list)

Super simple virtualized list [higher-order component](https://facebook.github.io/react/docs/higher-order-components.html) for [React](https://github.com/facebook/react) version `^15.0.0`.

[Check out the demo here](http://developerdizzle.github.io/react-virtual-list)

`react-virtual-list` allows you to display a large list of fixed-height items, while only rendering the items visible on the screen.  This allows a large list to be rendered with much fewer DOM elements.

### Some other benefits:
* Zero dependencies
* Small - `~4.2k` gzipped & minified, `~4.9k` minified [http://i.imgur.com/DxRCuLv.png](http://i.imgur.com/DxRCuLv.png)
* Decent performance - demo page almost always stays over 60fps [http://i.imgur.com/CHVCK9x.png](http://i.imgur.com/CHVCK9x.png)
* Keeps your components separate - as a higher-order component
* Gives you control - doesn't force any particular markup, but gives you the necessary styles and data to use.

## Legacy

If you're looking for documentation on version 1, supporting React `~0.13.x`, it's [here](README.v1.md).

## Installation

You can use [npm](https://npmjs.org) to install [react-virtual-list](https://www.npmjs.com/package/react-virtual-list).

```console
> npm install react-virtual-list --save
```

## Usage

The `./lib/VirtualList.js` module exports a single, ES5-compatible, CommonJS-accessible, component factory.

```js
import VirtualList from 'react-virtual-list';
```

Your inner list component uses the `virtual` property to render the visible items, and set a style to set the overall list height and padding.

```js
const MyList = ({
  virtual,
  itemHeight,
}) => (
  <ul style={virtual.style}>
    {virtual.items.map(item => (
      <li key={`item_${item.id}`} style={{height: itemHeight}}>
        Lorem ipsum dolor sit amet
      </li>
    ))}
  </ul>
);
```

**Note:** You should set [keys](https://facebook.github.io/react/docs/lists-and-keys.html) on your list items.

Create the virtualized component.

```js
const MyVirtualList = VirtualList()(MyList);
```

Write the JSX for the virtualized component with the necessary [properties](#properties).

```js
<MyVirtualList
  items={myBigListOfItems}
  itemHeight={100}
/>
```

#### Options

Options are used before the virtualized component can be created.  This means that if you need to change an option after the initial render, you will need to recreate the virtualized component.

```js
const options = {
  container: this.refs.container, // use this scrollable element as a container
  initialState: {
    firstItemIndex: 0, // show first ten items
    lastItemIndex: 9,  // during initial render
  },
};

const MyVirtualList = VirtualList(options)(MyList);
```

Name | Type | Default | Description
--- | --- | --- | ---
`container` | DOM Element | window | Scrollable element that contains the list.  Use this if you have a list inside an element with `overflow: scroll`.
`initialState` | object | - | An object with `firstItemIndex` and `lastItemIndex` properties, which represent array indexes of `items` (see below).  These are used to calculate the visible items before the component is mounted.  Useful for server-side rendering.

#### Properties

These properties and any others set on your virtual component, such as `className`, will be passed down to the inner component.

Name | Type | Default | Description
--- | --- | --- | ---
`items` | Array | - | Full array of list items.  Only the visible subset of these will be rendered.
`itemHeight` | Number | - | Height in pixels of a single item.  **You must have a CSS rule that sets the height of each list item to this value.**
`itemBuffer` | Number | 0 | Number of items that should be rendered before and after the visible viewport.  Try using this if you have a complex list that suffers from a bit of lag when scrolling.

#### Mapping

`VirtualList` allows a second, optional, parameter, named `mapVirtualToProps`, which functions similarly to [Redux's `mapStateToProps`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options).  This function can be provided to change the properties passed to `MyList`.  Its arguments are:

Name | Description
--- | ---
`props` | Includes all properties passed to `MyVirtualList`
`state` | Includes `firstItemIndex` and `lastItemIndex`; array indexes of the visible bounds of `items`

The default `mapVirtualToProps` can be found [here](/src/utils/defaultMapVirtualToProps.js).

#### Example Usage

Check out [demo/src/app.js](demo/src/app.js) and [demo/src/ConfigurableExample.js](demo/src/ConfigurableExample.js) for the example used in the [demo](http://developerdizzle.github.io/react-virtual-list).

## Tests

Use `npm test` to run the tests using [Jest](https://github.com/facebook/jest).  Not everything is currently tested yet!
