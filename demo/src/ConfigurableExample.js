import React, { PureComponent, PropTypes } from 'react';
import VirtualList from '../../src/VirtualList';

const makeItem = (i) => ({
  id: i,
  title: `Media heading #${i+1}`,
  text: 'Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.',
});

const ConfigurableExample = (MyList) => {
  let MyVirtualList = VirtualList()(MyList);

  return class MyConfigurableList extends PureComponent {
    constructor() {
      super();

      const defaultItemCount = 100000;

      const items = [];

      for (let i = 0; i < defaultItemCount; i++) {
        items[i] = makeItem(i);
      }
      
      const state = {
        itemHeight: 100,
        itemCount: defaultItemCount,
        items: items,
        contained: false,
        containerHeight: 250,
        itemBuffer: 0,
      };
      
      this.state = state;
    };

    update = () => {
      const items = [];
      const itemCount = parseInt(this.refs.itemCount.value, 10);

      for (var i = 0; i < itemCount; i++) {
        items[i] = makeItem(i);
      }
      
      const contained = this.refs.contained.checked;
      
      const state = {
        itemHeight: parseInt(this.refs.itemHeight.value, 10),
        itemCount: itemCount,
        items: items,
        contained: contained,
        container: this.refs.container,
        containerHeight: parseInt(this.refs.containerHeight.value, 10),
        itemBuffer: parseInt(this.refs.itemBuffer.value, 10),
      };

      if (state.contained !== this.state.contained) {
        const options = {
          container: state.contained ? state.container : window,
        };

        MyVirtualList = VirtualList(options)(MyList);
      }
      
      this.setState(state);
    };

    render() {
      return (
        <div>
          <div role="form" className="form-horizontal">
            <div className="form-group">
              <label className="col-xs-6 col-sm-2" htmlFor="contained">Contained</label>
              <div className="col-xs-6 col-sm-4">
                <input onChange={this.update} className="form-control" type="checkbox" checked ={this.state.contained} id="contained" ref="contained" />
              </div>
              <label className="col-xs-6 col-sm-2" htmlFor="containerHeight">Container Height</label>
              <div className="col-xs-6 col-sm-4">
                <input onChange={this.update} className="form-control" type="number" min="0" max="10000" value={this.state.containerHeight} id="containerHeight" ref="containerHeight" />
              </div>
            </div>
            <div className="form-group">
              <label className="col-xs-6 col-sm-2" htmlFor="itemHeight">Item Height</label>
              <div className="col-xs-6 col-sm-4">
                <input onChange={this.update} className="form-control" type="number" min="0" value={this.state.itemHeight} id="itemHeight" ref="itemHeight" />
              </div>
              <label className="col-xs-6 col-sm-2" htmlFor="itemCount">Item Count</label>
              <div className="col-xs-6 col-sm-4">
                <input onChange={this.update} className="form-control" type="number" min="0" value={this.state.itemCount} id="itemCount" ref="itemCount" />
              </div>
            </div>
            <div className="form-group">
              <label className="col-xs-6 col-sm-2" htmlFor="scrollDelay">Item Buffer</label>
              <div className="col-xs-6 col-sm-4">
                <input onChange={this.update} className="form-control" type="number" min="0" value={this.state.itemBuffer} id="itemBuffer" ref="itemBuffer" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12" id="container" ref="container" style={this.state.contained ? { overflow: 'scroll', height: this.state.containerHeight } : {}}>
              <MyVirtualList
                items={this.state.items}
                itemBuffer={this.state.itemBuffer}
                itemHeight={this.state.itemHeight}
              />
            </div>
          </div>
        </div>
      );
    };
  };
};

export default ConfigurableExample;