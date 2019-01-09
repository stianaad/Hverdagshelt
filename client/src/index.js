/* eslint eqeqeq: "off" */


import * as React from 'react';
import { Component,sharedComponentData } from 'react-simplified';
import { BrowserRouter, Route, NavLink, Redirect,Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Popup from 'reactjs-popup';
import { sakService} from './services';
import { PositionMap } from './widgets'

import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

class Menu extends Component {
  tekst = "";
  position = [0, 0];

  positionCallback(latlng) {
    this.position = latlng;
  }
  render(){
    return(
      <div>
      <div>
        <p>hehehehe</p>
        <PositionMap height="500" width="500" id="map" position={this.positionCallback} center="oslo"></PositionMap>
      </div>
      <p>{this.position.lat+", "+this.position.lng}</p>
      </div>
    )
  }
}
const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <BrowserRouter>
      <div>
          <Route path="/nyheter" component={Menu} />
      </div>
    </BrowserRouter>,
    root
  );