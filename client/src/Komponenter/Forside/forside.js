import React, { Component } from 'react';
import { Login } from '../../Moduler/login/login'
import { KommuneVelger } from '../../Moduler/KommuneVelger/kommuneVelger';
import { Link } from 'react-router-dom';

export class Forside extends Component {

  render() {
    return (
      <div>
        <header className="main-header">
          <Link to="/"><img src="hhlogo.svg" alt="Hverdagshelt logo"/></Link>
          <Link to="/"><h1>HverdagsHelt</h1></Link>
          <div className="float-right">
            <button
              type="button"
              className="main-header-button btn btn-danger border border-dark mr-4"
            >
              Meld inn feil
          </button>
            <button
              type="button"
              className="main-header-button btn btn-light border border-dark mr-4"
            >
              Hendelser
          </button>
            <div className="main-header-buttons d-inline-block"> <Login /></div>
          </div>
        </header>
        <div className="main-center">
          <div className="main-content">
            <h6 className="main-title">Kommuniser direkte med din kommune </h6>
            <div className="kommuneWrapper">
              <KommuneVelger history={this.props.history} />
            </div>
          </div>
        </div>
        <footer>
          <div className="m-5" />
        </footer>
      </div>
    );
  }
}