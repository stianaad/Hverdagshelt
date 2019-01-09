//kjør boi

import * as React from 'react';
import {Component, sharedComponentData} from 'react-simplified';
import'./login.css';

export class Login extends Component {

  render() {
    return ( 
      <div className="dropdown">
        <button type="button" className="btn btn-default navbar-btn" data-toggle="dropdown">
          Login
        </button>
        <div className="dropdown-menu">
          <form role="form">
            <div className="form-group">
              <label htmlFor="epost">E-post</label>
              <input type="text" className="form-control" id="epost" placeholder="E-post"></input>
              <label htmlFor="passord">Passord</label>
              <input type="password" className="form-control" id="passord" placeholder="Passord"></input>
            </div>
            <button type="submit" className="btn btn-default">Logg inn</button>
          </form>
        </div>
      </div>
    );
  }
}