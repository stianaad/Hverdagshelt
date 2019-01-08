// @flow
/* eslint eqeqeq: "off" */


import * as React from 'react';
import { Component,sharedComponentData } from 'react-simplified';
import { HashRouter, Route, NavLink, Redirect,Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Popup from 'reactjs-popup';
import { sakService} from './services';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

class Menu extends Component {
  tekst = "";

  render( ){
    return(
      <div>
        <p>hehehehe</p>
      
      </div>
    )
  }
}
const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <HashRouter>
      <div>
          <Route path="/nyheter" component={Menu} />
      </div>
    </HashRouter>,
    root
  );