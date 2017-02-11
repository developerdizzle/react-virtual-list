import React from 'react';
import { render } from 'react-dom';
import ConfigurableExample from './ConfigurableExample';

require('file?name=[name].[ext]!./index.html');

const MyList = ({
  virtual,
  itemHeight,
}) => (
  <ul className="media-list list-group" style={virtual.style}>
    {virtual.items.map((item) => (
      <li key={`item${item.id}`} className="list-group-item" style={{height: itemHeight }}>
        <div className="media-left">
          <img className="media-object" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PGRlZnMvPjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjEzLjQ2ODc1IiB5PSIzMiIgc3R5bGU9ImZpbGw6I0FBQUFBQTtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxMHB0O2RvbWluYW50LWJhc2VsaW5lOmNlbnRyYWwiPjY0eDY0PC90ZXh0PjwvZz48L3N2Zz4=" />
        </div>
        <div className="media-body">
          <h4 className="media-heading">{item.title}</h4>
          <p>{item.text}</p>
        </div>
      </li>
    ))}
  </ul>
);

const MyConfigurableExample = ConfigurableExample(MyList);

render(
  <MyConfigurableExample />,
  document.getElementById('app')
);

