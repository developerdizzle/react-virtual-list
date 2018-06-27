import React, { PureComponent } from 'react';
import { render } from 'react-dom';
import VirtualList from '../src/virtual-list';

const makeItem = (i) => ({
  id: i,
  title: `Person #${i+1}`,
  text: 'Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.',
});

class App extends PureComponent {
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
      itemBuffer: 0,
    };
    
    this.state = state;
  };

  updateItemCount = () => {
    const itemCount = parseInt(this.refs.itemCount.value, 10);

    const items = [];

    for (let i = 0; i < itemCount; i++) {
      items[i] = makeItem(i);
    }

    this.setState({
      itemCount: itemCount,
      items: items,
    })
  }

  updateItemHeight = () => {
    this.setState({
      itemHeight: parseInt(this.refs.itemHeight.value, 10),
    });
  }

  updateItemBuffer = () => {
    this.setState({
      itemBuffer: parseInt(this.refs.itemBuffer.value, 10),
    });
  }
  renderItems = (virtual) => {
    return (
      <ul className="mdl-list" style={virtual.style}>
        {virtual.items.map((item) => (
          <li key={item.id} className="mdl-list__item mdl-list__item--three-line" style={{height: this.state.itemHeight }}>
            <span className="mdl-list__item-primary-content">
              <i className="material-icons mdl-list__item-avatar">person</i>
              <span>{item.title}</span>
              <span className="mdl-list__item-text-body">{item.text}</span>
            </span>
          </li>
        ))}
      </ul>
    );
  };

  render() {
    return (
      <div className="page-content">
        <section role="form">
          <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input
              className="mdl-textfield__input"
              type="number"
              onChange={this.updateItemHeight}
              min="0"
              value={this.state.itemHeight}
              id="itemHeight"
              ref="itemHeight"
              />
            <label className="mdl-textfield__label" htmlFor="itemHeight">Item Height</label>
          </div>

          <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input
              className="mdl-textfield__input"
              type="number"
              onChange={this.updateItemCount}
              min="0"
              value={this.state.itemCount}
              id="itemCount"
              ref="itemCount"
              />
            <label className="mdl-textfield__label" htmlFor="itemCount">Item Count</label>
          </div>

          <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input
              className="mdl-textfield__input"
              type="number"
              onChange={this.updateItemBuffer}
              min="0"
              value={this.state.itemBuffer}
              id="itemBuffer"
              ref="itemBuffer"
              />
            <label className="mdl-textfield__label" htmlFor="itemBuffer">Item Buffer</label>
          </div>
        </section>
        <section>
          <VirtualList
            items={this.state.items}
            itemBuffer={this.state.itemBuffer}
            itemHeight={this.state.itemHeight}
            >
            {this.renderItems}
          </VirtualList>
        </section>
      </div>
    );
  };
};

render(
  <App />,
  document.getElementById('app')
);

