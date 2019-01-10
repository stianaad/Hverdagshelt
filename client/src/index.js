/* eslint eqeqeq: "off" */
import * as React from 'react';
import { Component,sharedComponentData } from 'react-simplified';
import { BrowserRouter, Route, NavLink, Redirect,Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import {BildeTest} from './bildetest';
import Popup from 'reactjs-popup';
import {sakService} from './services';
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
//<MarkerMap width="1000" height="500" id="map" center="Oslo" markers={this.markers}></MarkerMap>
class Menu extends Component {
  tekst = "";
  markers = [new Marker("Det er et problem her", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  'https://bjornost.tihlde.org/hverdagshelt/135d6d0f44a6ba73e3782c243663b90a', 1, "10/12/2018, 10:53", "Veiarbeid", 59.911599, 10.743839),
  new Marker("Det er et problem her", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  'https://bjornost.tihlde.org/hverdagshelt/ac78b6d904ceb783e9da802a5c84ea7b', 2, "10/12/2018, 10:53", "Veiarbeid", 59.913777, 10.722702)];
  posisjon(pos) {
    console.log(pos);
  }
  render(){
    return(
      <div>
        <p>hehehehe</p>
        <PositionMap width="1000" height="500" id="posmap" center="Oslo" position={this.posisjon}></PositionMap>
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
        <Route path="/registrering" component={Registrering} />
        <Route exact path="/" component={Forside} />
        <Route path="/bildetest" component={BildeTest} />
      </div>
    </BrowserRouter>,
    root
  );