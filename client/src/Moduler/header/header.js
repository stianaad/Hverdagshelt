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
    console.log(this.brukerType);
  }

  loggut() {
    sessionStorage.removeItem('pollett');
    global.payload = null;
    let p = window.location.pathname;
    if (p == "/" || p.startsWith("/hovedside/") || p.startsWith("/hendelser") || p.startsWith("/resett-passord/")) {
      global.sideRefresh(true);
    } else {
      global.sidePush("/",true);
    }
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
              <Link to="/ansatt/oversikt">
                <div className="dropdown-item">Kommune</div>
              </Link>
              <div onClick={this.loggut} className="dropdown-item">
                Logg ut
              </div>
            </div>
          </div>
        ) : this.brukerType == 'bedrift' ? (
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
