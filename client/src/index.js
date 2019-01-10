/* eslint eqeqeq: "off" */
import * as React from 'react';
import { Component,sharedComponentData } from 'react-simplified';
import { BrowserRouter, Route, NavLink, Redirect,Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import {BildeTest} from './bildetest';
import {MeldFeil} from './Komponenter/MeldFeil/meldFeil'
import Popup from 'reactjs-popup';
import {Registrering} from './Komponenter/Registrering/registrering';
import {generellServices} from './generellServices';
import {RodKnapp} from './widgets';
import { PositionMap, Marker, MarkerMap } from './widgets'

import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

import {relative} from 'path';

class Forside extends Component {
  sok = '';
  alleKommuner = [];
  sokteKommuner = [];

  handterSok(e) {
    this.sok = e.target.value;
    console.log(this.sok);
    if (this.sok.length > 0) {
      generellServices.filtrerKommuner(this.sok).then((kommuner) => {
        this.sokteKommuner = kommuner;
      });
    } else {
      this.sokteKommuner = this.alleKommuner;
    }

    /*if (this.sok.innhold.length >0) {
      sakService
          .filtrerNyhetssaker(this.sok.innhold)
          .then(sak => (this.delt.nyhetssaker = sak))
          .catch();
    }
      
    else{
        sakService
          .getAlleNyhetssaker()
          .then(nyeste => (this.delt.nyhetssaker = nyeste))
          .catch();
    }*/
  }
  render() {
    return (
      <div>
        <div>
          <img
            className="img-fluid w-50 "
            src="Hverdagshelt.png"
            alt="Hverdagshelt logo"
          />
          <button
            type="button"
            className="btn btn-secondary float-right mt-5 mr-3 border border-dark"
          >
            Logg inn
          </button>
          <button
            type="button"
            className="btn btn-danger float-right mt-5 mr-3 border border-dark"
          >
            Meld inn feil
          </button>
          <button
            type="button"
            className="btn btn-light float-right mt-5 mr-3 border border-dark"
          >
            Hendelser
          </button>
        </div>
        <div className="bilde">
          <img
            className="img-fluid w-100 "
            src="lofoten.jpg"
            alt="bilde av Lofoten"
          />
          {/*<video src="/norge.mp4" autoPlay loop></video>*/}
          <div className="centered">
            <h6 className="tekst">Kommuniser direkte med din kommune </h6>
            <section className="main">
              <form className="search" method="post" action="index.html">
                <input
                  type="text"
                  name="q"
                  placeholder="Søk..."
                  onChange={this.handterSok}
                />
                <ul className="results scroll">
                  <li>
                    <a href="index.html">
                      Search Result #1
                      <br />
                      <span>Description...</span>
                    </a>
                  </li>
                  {this.sokteKommuner.map((kommune) => (
                    <NavLink activeStyle={{color: 'darkblue'}} to={'/'}>
                      <li
                        className="text-dark"
                        key={kommune.kommune_id}
                        onClick={() => test}
                      >
                        {kommune.kommune_navn}
                      </li>
                    </NavLink>
                  ))}
                </ul>
              </form>
            </section>
          </div>
        </div>
        <footer>
          <div className="m-5" />
        </footer>
      </div>
    );
  }
  test() {
    console.log('hehehheeh');
  }

  mounted() {
    generellServices.hentAlleKommuner().then((kommuner) => {
      this.sokteKommuner = kommuner;
      this.alleKommuner = kommuner;
      console.log(kommuner.length);
    });
  }
}

class Menu extends Component {
  tekst = "";
  
  render(){
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
    <BrowserRouter>
      <div>
        <Route exact path="/meld-feil" component={MeldFeil} />
        <Route exact path="/nyheter" component={Menu} />
        <Route exact path="/registrering" component={Registrering} />
        <Route exact path="/" component={Forside} />
        <Route exact path="/bildetest" component={BildeTest} />
      </div>
    </BrowserRouter>,
    root
  );