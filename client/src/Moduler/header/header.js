import * as React from 'react';
import {Component} from 'react-simplified';
import {KommuneVelger} from '../KommuneVelger/kommuneVelger';
import {Link} from 'react-router-dom';
import {Login} from '../../Moduler/login/login';

export class ProfileButton extends Component {
  loggetInn = null;
  brukerType = null;

  mounted() {
    this.loggetInn = global.payload != undefined;
    this.brukerType = global.payload != undefined ? global.payload.role : null;
  }

  loggut() {
    sessionStorage.removeItem('pollett');
    global.payload = null;
    global.sideRefresh(true);
  }

  clickDrop(event) {
    let drop = document.getElementById('drops');
    if (drop.style.display == 'none' || drop.style.display == '') {
      drop.style.display = 'block';
      this.hideOnClickOutside(drop);
    } else {
      drop.style.display = 'block';
    }
  }

  hideOnClickOutside(element) {
    const isVisible = (elem) => !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length); // source: https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js
    const outsideClickListener = (event) => {
      if (!element.contains(event.target)) {
        if (isVisible(element)) {
          element.style.display = 'none';
          removeClickListener();
        }
      }
    };

    const removeClickListener = () => {
      document.removeEventListener('click', outsideClickListener);
    };

    document.addEventListener('click', outsideClickListener);
  }

  render() {
    return (
      <>
        {!this.loggetInn ? (
          /*<div className="dropdown">
                    <img className="profileIcon" src="/profile.svg" alt="Bruker ikon" onClick={this.clickDrop}></img>
                    <div className="dropdown-menu dropdown-menu-right dropdownbox" id="drops">
                    <div className="arrow"></div>
                    <div className="arrowborder"></div>
                    <div className="form-group">
                        <label htmlFor="epost">E-post:</label>
                        <input type="text" name="epost" className="form-control" id="epost" placeholder="E-post"></input>
                        <label htmlFor="passord">Passord:</label>
                        <input type="password" name ="passord" className="form-control" id="passord" placeholder="Passord"></input>
                        <p className="glemtLink">Glemt passord?</p>
                    </div>
                    
                    <button className="myLoginButton">Logg inn</button>
                    <Link to="/registrering"><button style={{float:"right"}} className="myLoginButton">Registrer deg</button></Link>
                    
                    </div>
                </div>*/
          <Login history={this.props.history} location={this.props.location} />
        ) : this.brukerType == 'privat' ? (
          <div className="dropdown profileButton">
            <img className="profileIcon" src="/profile.svg" alt="Bruker ikon" onClick={this.clickDrop} />
            <div
              style={{width: '170px'}}
              className="dropdown-menu dropdown-menu-right dropdownbox brukerbox"
              id="drops"
            >
              <div className="arrow" />
              <div className="arrowborder" />
              <Link to="/minside">
                <div className="dropdown-item">Min side</div>
              </Link>
              <div className="dropdown-item">Instillinger</div>
              <div onClick={this.loggut} className="dropdown-item">
                Logg ut
              </div>
            </div>
          </div>
        ) : this.brukerType == 'ansatt' ? (
          <div className="dropdown profileButton">
            <img className="profileIcon" src="/profile.svg" alt="Bruker ikon" onClick={this.clickDrop} />
            <div
              style={{width: '190px'}}
              className="dropdown-menu dropdown-menu-right dropdownbox brukerbox"
              id="drops"
            >
              <div className="arrow" />
              <div className="arrowborder" />
              <Link to="/mineoppgaver">
                <div className="dropdown-item">Mine oppgaver</div>
              </Link>
              <div className="dropdown-item">Legg til hendelse</div>
              <div className="dropdown-item">Instillinger</div>
              <div onClick={this.loggut} className="dropdown-item">
                Logg ut
              </div>
            </div>
          </div>
        ) : this.brukertType == 'bedrift' ? (
          <div className="dropdown profileButton">
            <img className="profileIcon" src="/profile.svg" alt="Bruker ikon" onClick={this.clickDrop} />
            <div
              style={{width: '180px'}}
              className="dropdown-menu dropdown-menu-right dropdownbox brukerbox"
              id="drops"
            >
              <div className="arrow" />
              <div className="arrowborder" />
              <Link to="/mineoppgaver">
                <div className="dropdown-item">Mine oppgaver</div>
              </Link>
              <div className="dropdown-item">Instillinger</div>
              <div onClick={this.loggut} className="dropdown-item">
                Logg ut
              </div>
            </div>
          </div>
        ) : this.brukerType == 'admin' ? (
          <div className="dropdown profileButton">
            <img className="profileIcon" src="/profile.svg" alt="Bruker ikon" onClick={this.clickDrop} />
            <div
              style={{width: '200px'}}
              className="dropdown-menu dropdown-menu-right dropdownbox brukerbox"
              id="drops"
            >
              <div className="arrow" />
              <div className="arrowborder" />
              <Link to="/administrasjon">
                <div className="dropdown-item">Administrasjon</div>
              </Link>
              <div className="dropdown-item">Kontoinnstillinger</div>
              <div onClick={this.loggut} className="dropdown-item">
                Logg ut
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  }
}

export class PageHeader extends Component {
  loggetinn = false;
  brukertype = null;

  render() {
    return (
      <>
        <header className="pageHeader unselectable">
          <Link to="/">
            <img className="pageHeaderLogo" src="/hhlogotight.svg" alt="Hverdagshelt logo" />
          </Link>
          <Link to="/hendelser">
            {' '}
            <button type="button" className="pageHeaderButton">
              Hendelser
            </button>
          </Link>
          <div className="pageHeaderRight">
            <div className="headKomWrapper">
              <KommuneVelger history={this.props.history} />
            </div>
            <ProfileButton history={this.props.history} location={this.props.location} />
          </div>
        </header>
        <div className="pageHeaderBuffer" />
      </>
    );
  }

  /*mounted() {
        if (global.payload) {
            this.loggetinn = true;
            this.brukertype = global.payload.role;
        } else {
            this.loggetinn = false;
            this.brukertype = null;
        }
    }*/
}
