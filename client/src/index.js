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
//import {Hovedside} from './Komponenter/hovedside/hovedside';


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

class Hovedside extends Component {
  visFeil = false;
  alleFeil = [];
  alleKategorier = [];
  aktivKategori = [];
  aktiveFeil = [];
  alleHendelser = [];
  visHendelser = false;
  bilderTilFeil = [];
  statusIkon = '';
  markers = [];

  feil= {
    overskrift: '',
    beskrivelse: ''
  }

  async merInfo(feil){
      this.visFeil = true;
      console.log(feil.feil_id);
      console.log(feil.overskrift);
      this.feil.overskrift = feil.overskrift;
      this.feil.beskrivelse = feil.beskrivelse;
      console.log(feil.status);
      console.log(feil.tid);
      let res = await generellServices.hentBilderTilFeil(feil.feil_id);
      this.bilderTilFeil = await res.data;
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
      console.log(this.alleFeil);
      this.aktiveFeil = this.alleFeil.filter( kat => (kat.kategorinavn === verdi));
      console.log(this.aktivKategori);
    /*generellServices
      .hentFeilFiltrertKategori(verdi)
      .then(aktiveFeil => {
        this.aktiveFeil = aktiveFeil;
        console.log(aktiveFeil.length);
        confirm.log()
      })*/
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

  flyttKart(lengdegrad,breddegrad){
    this.kart.flyttKart(lengdegrad,breddegrad);
  }

  endreStatusIkon(status){
    if(status === "Ikke godkjent"){
      this.statusIkon = 'warningicon.png';
    } else if(status === "Under behandling"){
      this.statusIkon = 'processingicon.png';
    } else {
      this.statusIkon = 'successicon.png';
    }
  }

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
                              <option value={kategori.kategorinavn} key={kategori.kategorinavn}> {kategori.kategorinavn}</option>
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
                                <p
                                onClick={() => this.merInfo({
                                  feil_id: feil.feil_id,overskrift: feil.overskrift,beskrivelse: feil.beskrivelse,tid: feil.tid,status:feil.status})}>
                                    {feil.overskrift}
                                    <span className="float-right">
                                      {//<img src={this.statusIkon}/>
                                      }
                                    </span>
                                    <br/>
                                    <i>{feil.kategorinavn}</i>
                                    <span className='float-right'>{feil.tid}</span>
                                </p>
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
                              <MarkerMap width="100%" height="300px" id="posmap" center="Oslo" markers={markerTabell(this.alleFeil)} onRef={ref => (this.kart1 = ref)} />
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
                              <h6 className="mt-3">Bilder:</h6>
                              <div className="bildeGrid">
                              {this.bilderTilFeil.map(bilde => (
                                  <img src={bilde.url} height="40" width="40"/>
                                ))}
                                {this.bilderTilFeil.map(bilde => (
                                  <img src={bilde.url} height="40" width="40"/>
                                ))}
                                
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
                      <MarkerMap width="100%" height="300px" id="test" center="Oslo" markers={this.markers} onRef={ref => (this.kart = ref)}/>
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
                                  <p onClick = {() => {this.visHendelser = true;this.visEnHendelse(tabell.overskrift)}}>
                                      {tabell.overskrift}
                                      <br/>
                                      <i>konsert</i>
                                      <span className='float-right'>{tabell.tid}</span>
                                  </p>
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
                        <h5 className="card-title">Julekonsert i Nidarosdomen
                                <NavLink to={'/hovedside/'+this.props.match.params.kommune} onClick={() => {this.visHendelser = false}}><img className="float-right" src="https://image.freepik.com/free-icon/x_318-27992.jpg" width="20" height="20"/></NavLink>
                            </h5>
                          <div className="row">
                              <div className="col-sm-6">
                              <img  className="img-fluid w-100 " src="data:image/jpeg;base64,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" />
                                <button type="button" className="btn btn-success mt-2">kjøp billetter</button>  
                                <button type="button" className="btn btn-danger mt-2 float-right">Abonner</button>  
                                <p className="mt-2"><img className="mr-2" src="https://image.flaticon.com/icons/svg/33/33622.svg" height="20" width="20"/>Nidarosdomen, Trondheim, Norge </p>
                                <p><img className="mr-2" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Simple_icon_time.svg/750px-Simple_icon_time.svg.png" height="20" width="25"/>08.01.2019, 20:00</p>
                              </div>
                              <div className="col-sm-6">
                                <p>trykkeindustrien. Lorem Ipsum har vært bransjens standard for dummytekst helt siden 1500-tallet, da en ukjent boktrykker stokket en mengde bokstaver for å lage et prøveeksemplar av en bok. Lorem Ipsum har tålt tidens tann usedvanlig godt, og har i tillegg til å bestå gjennom fem århundrer også tålt spranget over til elektronisk typografi uten vesentlige endringer. Lorem Ipsum ble gjort allment kjent i 1960-årene ved lanseringen av Letraset-ark med avsnitt fra Lorem Ipsum, og senere med sideombrekkingsprogrammet Aldus PageMaker som tok i bruk nettopp Lorem Ipsum for dummytekst.</p>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
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

  async mounted(){
      let res1 = await generellServices.hentAlleFeil();
      this.alleFeil = await res1.data;
      this.aktiveFeil = await res1.data;
      await console.log(res1.data);

      let res2 = await generellServices.hentAlleKategorier();
      this.alleKategorier = await res2.data;
      await console.log(res2.data);
      
      let res3 = await generellServices.hentAlleHendelser();
      this.alleHendelser = await res3.data;
      await console.log(res3.data);
      
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
        <Route exact path="/mineoppgaver" component={MineOppgaver}/>
        <Route exact path="/login" component={Login} />
        <Route exact path="/kinput" component={komtest} />
      </div>
    </Router>,
    root
  );