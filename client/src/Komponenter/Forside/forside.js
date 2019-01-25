import React, {Component} from 'react';
import {Login} from '../../Moduler/login/login';
import {KommuneVelger} from '../../Moduler/KommuneVelger/kommuneVelger';
import {Link} from 'react-router-dom';
import {ProfileButton} from '../../Moduler/header/header';

/**
 * @ignore
 */
export class Forside extends Component {

  render() {
    return (
      <div>
        <header className="main-header">
          <div className="combinedlogo">
            <Link to="/">
              <img src="/hhlogo.svg" alt="Hverdagshelt logo" />
            </Link>
            <Link to="/">
              <h1>HverdagsHelt</h1>
            </Link>
          </div>
          <div className="mainbuttons">
            {global.payload == null ? (
            <button
              type="button"
              className="main-header-button btn btn-danger border border-dark mr-4"
              onClick={() => {
                clearInterval(this.shakeInterval);
                this.shake = 0;
                this.shakeDir = 5;
                this.shakeInterval = setInterval(() => {
                  if (Math.abs(this.shake) > 20) this.shakeDir*=-1;
                  this.shake += this.shakeDir;
                  document.body.style.transform = "translate("+this.shake+"px, 0)";
                },10);
                setTimeout(() => {
                  clearInterval(this.shakeInterval);
                  document.body.style.transform = "";
                  this.shake = 0;
                  this.shakeDir = 5;
                  document.querySelector(".logginnbutton").click();
                },300);
              }}
            >
              Meld inn feil
            </button>
            ) : global.payload.role == 'admin' || global.payload.role == 'privat' ? (
              <button
              type="button"
              className="main-header-button btn btn-danger border border-dark mr-4"
              onClick={() => {
                this.props.history.push('/meldfeil');
              }}
            >
              Meld inn feil
            </button>
            ) : null}
            <button
              type="button"
              className="main-header-button btn btn-light border border-dark mr-4"
              onClick={() => {
                this.props.history.push('/hendelser');
              }}
            >
              Hendelser
            </button>
            <div className="main-header-buttons d-inline-block">
              {' '}
              <ProfileButton history={this.props.history} location={this.props.location} />
            </div>
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
