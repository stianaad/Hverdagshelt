/* eslint eqeqeq: "off" */
import * as React from 'react';
import { Component,sharedComponentData } from 'react-simplified';
import { Router, Route, NavLink, Redirect,Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import {BildeTest} from './bildetest';
import {MeldFeil} from './Komponenter/MeldFeil/meldFeil'
import Popup from 'reactjs-popup';
import {Registrering} from './Komponenter/Registrering/registrering';
import {MineOppgaver} from './Komponenter/Ansatt/mineOppgaver';
import {generellServices} from './services/generellServices';
import {RodKnapp} from './widgets';
import {Login} from './Moduler/login/login'
import { PositionMap, Marker, MarkerMap, markerTabell } from './Moduler/kart/map';
import {Hovedside} from './Komponenter/hovedside/hovedside';

import {GlemtPassord} from "../src/Komponenter/GlemtPassord/glemtPassord";

import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

import {relative} from 'path';
import { KommuneVelger } from './Moduler/KommuneVelger/kommuneVelger';
import { KommuneInput } from './Moduler/kommuneInput/kommuneInput';



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
            src="FremsideHelt.png"
            alt="Hverdagshelt logo"
          />
          <div className="float-right mt-5 mr-3"> <Login /></div>
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
              {/*<form className="search" method="post" action="index.html">
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
              </form>*/}
              <KommuneVelger history={history}/>
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

  /*mounted() {
    generellServices.hentAlleKommuner().then((kommuner) => {
      this.sokteKommuner = kommuner;
      this.alleKommuner = kommuner;
      console.log(kommuner.length);
    });
  }*/
}

class Tabell extends Component{
  render() {
    return(
      <div className="ml-3">
        <h5>{this.props.hovedOverskrift}
        </h5>
        <br/>
        <div className="kanter">
          <nav>
            <ul className="list-group">
                <li className="kanter lister">
                  I dag</li>
                {this.props.tabell.map(tabell => (
                  <li className="kanter lister">
                  <NavLink to={'/hovedside/'+this.props.kommune} onClick = {() => {this.props.metode(tabell.overskrift)}}>
                      {tabell.overskrift}
                      <br/>
                      <i>{this.props.tema}</i>
                      <span className='float-right'>{tabell.tid}</span>
                  </NavLink>
                  </li>
                ))}
            </ul>
          </nav>
        </div>
    </div>
    )
  }
}

//<PositionMap width="100%" height="500px" id="posmap" center="Oslo" position={this.posisjon}></PositionMap>
class Menu extends Component {
  tekst = "";
  feil = [{
    overskrift: "Det er et problem her",
    beskrivelse: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    bildeurl: 'https://bjornost.tihlde.org/hverdagshelt/135d6d0f44a6ba73e3782c243663b90a',
    status: "Ikke godkjent",
    tid: "10/12/2018, 10:53",
    hovedkategori: "Veiarbeid",
    kategorinavn: "Hull i veien",
    breddegrad: 59.913777,
    lengdegrad: 10.722702
  }];
  markers = markerTabell(this.feil);
  markers2 = [new Marker("Det er et problem her", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  'https://bjornost.tihlde.org/hverdagshelt/135d6d0f44a6ba73e3782c243663b90a', 1, "10/12/2018, 10:53", "Veiarbeid", 59.911599, 10.743839),
  new Marker("Det er et problem her", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  'https://bjornost.tihlde.org/hverdagshelt/ac78b6d904ceb783e9da802a5c84ea7b', 2, "10/12/2018, 10:53", "Veiarbeid", 59.913777, 10.722702)];

  breddegrad = 59.913777;
  lengdegrad = 10.722702;

  flytt() {
    this.kart.flyttKart(this.breddegrad, this.lengdegrad);
  }

  render(){
    return(
      <div>
        <p>hehehehe</p>
        <MarkerMap width="100%" height="500px" id="mapr" markers={this.markers} center="Oslo" onRef={ref => (this.kart = ref)}></MarkerMap>
        <button onClick={this.flytt}></button>
      </div>
      
    )
  }
}

class komtest extends Component {
  kominput;

constructor(props) {
  super(props);
  this.kominput = React.createRef();
}

  render() {
    return (
      <>
        <div style={{width:"300px"}}>
          <KommuneInput ref={this.kominput} />
          {this.komm}
        </div>
        <button onClick={this.test}>test</button>
      </>
    );
  }

  test() {
    alert(this.kominput.current.verdi);
  }

}


const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <Router history={history}>
      <div>
        <Route exact path="/hovedside/:kommune" component={Hovedside} />
        <Route exact path="/kommunevalgtest" component={KommuneVelger} />
        <Route exact path="/meld-feil" component={MeldFeil} />
        <Route exact path="/nyheter" component={Menu} />
        <Route exact path="/registrering" component={Registrering} />
        <Route exact path="/" component={Forside} />
        <Route exact path="/bildetest" component={BildeTest} />
        <Route exact path="/glemt-passord" component={GlemtPassord}/>
        {//<Route exact path="/login" component={Login} />
        }
        <Route exact path="/mineoppgaver" component={MineOppgaver}/>
        <Route exact path="/login" component={Login} />
        <Route exact path="/kinput" component={komtest} />
      </div>
    </Router>,
    root
  );