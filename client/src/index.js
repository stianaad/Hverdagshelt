/* eslint eqeqeq: "off" */
import * as React from 'react';
import { Component,sharedComponentData } from 'react-simplified';
import { BrowserRouter, Route, NavLink, Redirect,Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import {BildeTest} from './bildetest';
import {MeldFeil} from './Komponenter/MeldFeil/meldFeil'
import Popup from 'reactjs-popup';
import {Registrering} from './Komponenter/Registrering/registrering';
import {generellServices} from './services/generellServices';
import {RodKnapp} from './widgets';
import { PositionMap, Marker, MarkerMap } from './widgets'
//import {Hovedside} from './Komponenter/hovedside/hovedside';


import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

import {relative} from 'path';
import { KommuneVelger } from './Moduler/KommuneVelger/kommuneVelger';



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
              <KommuneVelger />
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

class Hovedside extends Component {
  visFeil = false;
  alleFeil = [];
  alleKategorier = [];
  aktiveFeil = [];
  alleHendelser = [];
  visHendelser = false;

  feil= {
    overskrift: '',
    beskrivelse: ''
  }

  merInfo(feil){
      this.visFeil = true;
      console.log(feil.feil_id);
      console.log(feil.overskrift);
      this.feil.overskrift = feil.overskrift;
      this.feil.beskrivelse = feil.beskrivelse;
  }

  visEnHendelse(overskrift){
    console.log(overskrift);
    // <Tabell tabell={this.alleHendelser} hovedOverskrift="Kommende hendelser" metode={this.visEnHendelse} kommune={this.props.match.params.kommune} tema="konsert"/>
                     
  }

  filter(e){
    let verdi = e.target.value;
    console.log(verdi);
    if(verdi == 0){
      this.aktiveFeil = this.alleFeil;
      console.log("FEEEIl",this.alleFeil);
    } else {
    generellServices
      .hentFeilFiltrertKategori(verdi)
      .then(aktiveFeil => {
        this.aktiveFeil = aktiveFeil;
        console.log(aktiveFeil.length);
      })
    }
  }
  /*hentKommuner(){
    generellServices
          .hentAlleKategorier()
          .then(alleKategorier => {
            this.alleKategorier = alleKategorier;
            console.log(alleKategorier.length);
          })
          onClick={() => {this.hentKommuner()}}
  }*/

  render() {
      return(
          <div>
              <h1 className='text-center'>{this.props.match.params.kommune} </h1>
              { (!this.visHendelser) ? (
              <div className="row mt-5">
                  <div className="col-sm-4 ">
                      <div className="ml-3">
                          <h5>Nylige feil og mangler
                          <select
                            onChange={this.filter}
                            className="form-control float-right" 
                            style={{width: 120}}>
                            <option hidden> Filter </option>
                            <option value="0"> Alle kategorier </option>
                            {this.alleKategorier.map(kategori => (
                              <option value={kategori.hovedkategori_id} key={kategori.hovedkategori_id}> {kategori.kategorinavn}</option>
                            ))}
                          </select>
                          </h5>
                          <br/>
                          <div className="kanter">
                          <nav>
                          <ul className="list-group">
                              <li className="kanter lister">
                                I dag</li>
                              {this.aktiveFeil.map(feil => (
                                <li className="kanter lister" key={feil.feil_id}>
                                <NavLink to={'/hovedside/'+this.props.match.params.kommune} 
                                onClick={() => this.merInfo({feil_id: feil.feil_id,overskrift: feil.overskrift,beskrivelse: feil.beskrivelse})}>
                                    {feil.overskrift}
                                    <br/>
                                    <i>{feil.kategorinavn}</i>
                                    <span className='float-right'>19:20</span>
                                </NavLink>
                                </li>
                              ))}
                          </ul>
                          </nav>
                          </div>
                      </div>
                  </div>
                  <div className='col-sm-8'>
                  {(this.visFeil) ? (
                  <div className='mt-5 mr-5'>
                      <div className="card" >
                      <div className="card-body">
                      <h5 className="card-title">{this.feil.overskrift}
                       <NavLink to={'/hovedside/'+this.props.match.params.kommune} onClick={() => {this.visFeil = false}}><img className="float-right" src="https://image.freepik.com/free-icon/x_318-27992.jpg" width="20" height="20"/></NavLink>
                       <span className="float-right mr-5">08.01.2019, 19:31</span>
                      </h5>
                      <h6 className="card-subtitle mb-2 mt-2 text-muted">Status: Avventer behandling<button type="button" className="btn btn-danger float-right mr-5 border border-dark">Abonner</button></h6>
                      <br></br>
                      <div>
                          <div className="row">
                              <div className="col-sm-4">
                              <h6>Beskrivelse:</h6>
                              {this.feil.beskrivelse}
                               </div>
                              <div className="col-sm-4">
                              <h6>Posisjon</h6>
                              <PositionMap width="200" height="300" id="posmap" center="Oslo" position={this.posFunksjon}/>
                              </div>
                              <div className="col-sm-4">
                              <h6>Oppdateringer:</h6>
                              <div className="kanter oppdatering">
                              Sendt inn <span className="float-right mr-1 small">I dag 19:45</span>
                              <br></br>
                              Godkjent <span className="float-right mr-1 small">I dag 19:45</span>
                              <br></br>
                              d
                              <br></br>
                              dagd
                              <br></br>
                              dagd
                              <br></br>
                              dagd
                              <br></br>
                              dagd
                              <br></br>
                              dag
                              </div>
                              </div>

                          </div>
                       </div>
                  </div>
                </div></div>
                  ): (
                  <div className='row'>
                      <div className="col-sm-6 text-center">
                      <button type="button" className="btn btn-danger border border-dark" >
                      Meld inn feil
                      </button>
                      <div className="mt-5">
                      <PositionMap width="300" height="300" id="posmap" center="Oslo" position={this.posFunksjon}/>
                      </div>
                      </div>
                      <div className="col-sm-6">
                      <div className="ml-3">
                        <h5>Kommende hendelser
                        </h5>
                        <br/>
                        <div className="kanter">
                          <nav>
                            <ul className="list-group">
                                <li className="kanter lister">
                                  I dag</li>
                                {this.alleHendelser.map(tabell => (
                                  <li className="kanter lister">
                                  <NavLink to={'/hovedside/'+this.props.match.params.kommune} onClick = {() => {this.visHendelser = true;this.visEnHendelse(tabell.overskrift)}}>
                                      {tabell.overskrift}
                                      <br/>
                                      <i>konsert</i>
                                      <span className='float-right'>{tabell.tid}</span>
                                  </NavLink>
                                  </li>
                                ))}
                            </ul>
                          </nav>
                        </div>
                    </div>
                      </div>
                  </div>)}
                  </div>
              </div>) : (
                <div className="row mt-5">
                  <div className="col-sm-8 ">
                  <div className='mt-5 ml-5'>
                      <div className="card" >
                      <div className="card-body">
                      <h5 className="card-title">Test
                       <NavLink to={'/hovedside/'+this.props.match.params.kommune} onClick={() => {this.visHendelser = false}}><img className="float-right" src="https://image.freepik.com/free-icon/x_318-27992.jpg" width="20" height="20"/></NavLink>
                       <span className="float-right mr-5">08.01.2019, 19:31</span>
                      </h5>
                      <h6 className="card-subtitle mb-2 mt-2 text-muted">Status: Avventer behandling<button type="button" className="btn btn-danger float-right mr-5 border border-dark">Abonner</button></h6>
                      <br></br>
                      <div>
                          <div className="row">
                              <div className="col-sm-4">
                              <h6>Beskrivelse:</h6>
                              beskrivelse
                               </div>
                              <div className="col-sm-4">
                              <h6>Posisjon</h6>
                              <PositionMap width="200" height="300" id="posmap" center="Oslo" position={this.posFunksjon}/>
                              </div>
                              <div className="col-sm-4">
                              <h6>Oppdateringer:</h6>
                              <div className="kanter oppdatering">
                              Sendt inn <span className="float-right mr-1 small">I dag 19:45</span>
                              <br></br>
                              Godkjent <span className="float-right mr-1 small">I dag 19:45</span>
                              <br></br>
                              d
                              <br></br>
                              dagd
                              <br></br>
                              dagd
                              <br></br>
                              dagd
                              <br></br>
                              dagd
                              <br></br>
                              dag
                              </div>
                              </div>

                          </div>
                       </div>
                  </div>
                </div></div>
                  </div>
                  <div className="col-sm-4">
                  <div className="ml-3">
                        <h5>Kommende hendelser
                        </h5>
                        <br/>
                        <div className="kanter">
                          <nav>
                            <ul className="list-group">
                                <li className="kanter lister">
                                  I dag</li>
                                {this.alleHendelser.map(tabell => (
                                  <li className="kanter lister">
                                  <NavLink to={'/hovedside/'+this.props.match.params.kommune} onClick = {() => {this.visHendelser = true;this.visEnHendelse(tabell.overskrift)}}>
                                      {tabell.overskrift}
                                      <br/>
                                      <i>konsert</i>
                                      <span className='float-right'>{tabell.tid}</span>
                                  </NavLink>
                                  </li>
                                ))}
                            </ul>
                          </nav>
                        </div>
                        </div>
                  </div>
                </div>
              )}
          </div>
      )
  }
  posFunksjon(){
      console.log("hei");
  }

  mounted(){
      generellServices
          .hentAlleFeil()
          .then(alleFeil => {
              this.alleFeil = alleFeil;
              this.aktiveFeil = alleFeil;
              console.log(this.alleFeil[0].beskrivelse);
          });
      
          generellServices
          .hentAlleKategorier()
          .then(alleKategorier => {
            this.alleKategorier = alleKategorier;
            console.log(alleKategorier.length);
          })
      
      generellServices
          .hentAlleHendelser()
          .then(alleHendelser => {
            this.alleHendelser = alleHendelser;
            console.log(alleHendelser);
          })
  }
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
        <Route exact path="/hovedside/:kommune" component={Hovedside} />
        <Route exact path="/kommunevalgtest" component={KommuneVelger} />
        <Route exact path="/meld-feil" component={MeldFeil} />
        <Route exact path="/nyheter" component={Menu} />
        <Route exact path="/registrering" component={Registrering} />
        <Route exact path="/" component={Forside} />
        <Route exact path="/bildetest" component={BildeTest} />
      </div>
    </BrowserRouter>,
    root
  );