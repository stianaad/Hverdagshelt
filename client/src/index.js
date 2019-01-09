/* eslint eqeqeq: "off" */


import * as React from 'react';
import { Component,sharedComponentData } from 'react-simplified';
import { BrowserRouter, Route, NavLink, Redirect,Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Popup from 'reactjs-popup';
import { sakService} from './services';
import { PositionMap, Marker, MarkerMap } from './widgets'

import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

class Menu extends Component {
  tekst = "";
  position = [0, 0];
  markers = [new Marker("Overskrift", "Dette er en veldig fin beskrivelse synes jeg da ihvertfall, den må være såpass lang at jeg kan sjekke ting på kartet.",
  "bildeurl", 1, "tid", "Veiproblem", 59.91872060876284, 10.75492858886719),
  new Marker("Overskrift", "Dette er en veldig fin beskrivelse synes jeg da ihvertfall, den må være såpass lang at jeg kan sjekke ting på kartet.",
  "bildeurl", 2, "tid", "Veiproblem", 59.910631722724226, 10.772094726562502),
  new Marker("Overskrift", "Dette er en veldig fin beskrivelse synes jeg da ihvertfall, den må være såpass lang at jeg kan sjekke ting på kartet.",
  "bildeurl", 3, "tid", "Veiproblem", 59.91717182572499, 10.70274353027344),
  new Marker("Overskrift", "Dette er en veldig fin beskrivelse synes jeg da ihvertfall, den må være såpass lang at jeg kan sjekke ting på kartet.",
  "bildeurl", 0, "tid", "Veiproblem",59.93363738824308, 10.708875060081482)];


  positionCallback(latlng) {
    this.position = latlng;
  }
  render(){
    return(
      <div>
        <div>
          <p>hehehehe</p>
          <PositionMap height="500" width="500" id="map" position={this.positionCallback} center="Oslo"></PositionMap>
          <MarkerMap height="500" width="1000" id="map2" center="Oslo" markers={this.markers}></MarkerMap>
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