/* eslint eqeqeq: "off" */

import * as React from 'react';
import {Component, sharedComponentData} from 'react-simplified';
import {
  BrowserRouter,
  Route,
  NavLink,
  Redirect,
  Switch,
} from 'react-router-dom';
import ReactDOM from 'react-dom';
import Popup from 'reactjs-popup';

import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

class Menu extends Component {
  tekst = '';

  render() {
    return (
      <div>
        <p>hehehehe</p>
      </div>
    );
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
