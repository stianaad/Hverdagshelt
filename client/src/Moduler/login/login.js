//kjør boi

import * as React from 'react';
import { Component, sharedComponentData } from 'react-simplified';
import {brukerService} from '../../services/brukerService';

export class Login extends Component {

  data = {
    epost: "",
    passord: "",
  }

  render() {
    return (
      <div className="dropdown">
        <button type="button" className="btn btn-default navbar-btn" data-toggle="dropdown">
          Login
        </button>
        <div className="dropdown-menu dropdown-menu-right dropdownbox">
          <div className="form-group">
            <label htmlFor="epost">E-post:</label>
            <input type="text" value={this.data.epost} onChange={this.endre} name="epost" className="form-control" id="epost" placeholder="E-post"></input>
            <label htmlFor="passord">Passord:</label>
            <input type="password" value={this.data.passord} onChange={this.endre} name ="passord" className="form-control" id="passord" placeholder="Passord"></input>
          </div>
          <button className="btn btn-default" onClick={this.login}>Logg inn</button>
        </div>
      </div>
    );
  }

  endre(e) {
    this.data[e.target.name] = e.target.value;
  }

  async login() {
    let res = await brukerService.loggInn(this.data);
    await alert(res.data);
  }

}