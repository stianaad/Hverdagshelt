import * as React from 'react';
import {Component, sharedComponentData} from 'react-simplified';
import {HashRouter, Route, Link, NavLink, Redirect, Switch} from 'react-router-dom';
import {generellServices} from '../../services/generellServices';
import {feilService} from '../../services/feilService';
import {hendelseService} from '../../services/hendelseService';
import {PageHeader} from '../../Moduler/header/header';
import {PositionMap, Marker, MarkerMap, markerTabell, ShowMarkerMap} from '../../Moduler/kart/map';
import {Card, Feed, Grid, Button, Header, Icon, Image, Modal, GridColumn, List} from 'semantic-ui-react';
import {FeedEvent, FeedHendelse, Filtrer, Info} from '../../Moduler/cardfeed';
import { brukerService } from '../../services/brukerService';
import { AbonnerKnapp } from '../../Moduler/abonner/abonner';
import {FireNullFire} from '../firenullfire/firenullfire';
import { InfoBoks } from '../../Moduler/info/info';

export class Hovedside extends Component {
  kommune = 0;
  feilKategori = "0";

  visFeil = false;
  alleFeil = [];
  alleKategorier = [];
  aktivKategori = [];
  aktiveFeil = [];
  alleHendelser = [];
  visHendelser = false;
  bilderTilFeil = [];
  oppTilFeil = []
  bildeModal = null;
  statusIkon = '';
  markers = [];
  mobView = "#hovedtittelanchor";
  hendelsesKategori = [];
  filterHendelse = "0";

  feil = {
    overskrift: '',
    beskrivelse: '',
    status: '',
    tid: '',
  };

  hendelse = {
    overskrift: '',
    beskrivelse: '',
    sted: '',
    tid: '',
    url: '',
  };

  state = {open: false};

  handleOpen = (url) => {
    this.bildeModal = url;
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false});
  };

  async merInfo(feil) {
    if (this.mobView == "#hovedFeil") {
      document.querySelector("#hovedFeil").style.display="none";
    }
    this.visFeil = true;
    this.feil = {...feil};
    let res1 = await feilService.hentBilderTilFeil(feil.feil_id),
        res2 = await feilService.hentAlleOppdateringerPaaFeil(feil.feil_id);
    this.bilderTilFeil = await res1.data;
    this.oppTilFeil = await res2.data;
    await console.log(res2.data);

    this.endreStatusIkon(feil.status);
  }

  visEnHendelse(hendelse) {
    if (this.mobView == "#hovedHendelser") {
      setTimeout(()=>{
        document.querySelector("#hovedHendelser").style.display="none";
      },100);
      
      /*setTimeout(() => {
        document.querySelector("#hovedHendelser").style.display="none";
        setTimeout(()=>{document.querySelector(".hendelseFeil").style.display="block";}, 100);
        console.log("yeet");
      }, 200);*/
    }
    this.visHendelser = true;
    this.hendelse = hendelse;
    // <Tabell tabell={this.alleHendelser} hovedOverskrift="Kommende hendelser" metode={this.visEnHendelse} kommune={this.props.match.params.kommune} tema="konsert"/>
  }

  filter(e) {
    let verdi = e.target.value;
    console.log(verdi);
    if (verdi == 0) {
      this.aktiveFeil = this.alleFeil;
      console.log('FEEEIl', this.alleFeil);
    } else {
      console.log(this.alleFeil);
      this.aktiveFeil = this.alleFeil.filter((kat) => kat.kategorinavn === verdi);
      console.log(this.aktivKategori);
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

  flyttKart(lengdegrad, breddegrad) {
    this.kart.flyttKart(lengdegrad, breddegrad);
  }

  endreStatusIkon(status) {
    if (status === 'Godkjent') {
      this.statusIkon = '/warningicon.png';
    } else if (status === 'Under behandling') {
      this.statusIkon = '/processingicon.png';
    } else {
      this.statusIkon = '/successicon.png';
    }
  }

  mobileView(view) {
    if(this.visFeil) {
      this.visFeil = false;
      setTimeout(() => this.mobileView(view), 200);
    }
    else if (this.visHendelser) {
      this.visHendelser = false;
      setTimeout(() => this.mobileView(view), 200);
    }
    else {
      //window.scrollTo(0, document.querySelector(id).offsetTop - 115);
      let q = (id) => document.querySelector(id);
      //q("#mapContainer").style.height ="0px";
      //q("#test").style.height = "0px";
      if (view == this.mobView && view == "#hovedKart") {
        return;
      } else {
        q("#mapContainer").style.height ="0px";
        q("#test").style.height = "0px";
      }
      if (view == "#hovedKart") {
        if (!window.closedObj.isClosed) {
          window.setClosed();
        }

        q(this.mobView).style.display = "none";
        q("#mapContainer").style.height = "calc(100vh - 75px)";
        q("#test").style.height = "100%";
      }
      else if (this.mobView == "#hovedKart") {
        q("#mapContainer").style.height ="0px";
        q("#test").style.height = "0px";
        q(view).style.display ="block";
      }
      else {
        q(this.mobView).style.display = "none";
        q(view).style.display = "block";
      }
      this.mobView = view;
    }
  }

  render() {
    if (this.kommune == 0) return (<></>);
    if (this.kommune == null) return (<FireNullFire history={this.props.history} location={this.props.location}/>);
    return (
      <div>
        <PageHeader history={this.props.history} location={this.props.location} />
        <div className="hovedTittel" id="hovedtittelanchor">

          <h1 className="text-center text-capitalize display-4">{this.props.match.params.kommune} </h1>

          {global.payload == null ? (
            <Button
              color="red"
              size = "large"
              className="meldFeilHoved"
              onClick={() => {
                clearInterval(this.shakeInterval);
                this.shakeDir = 5;
                this.shake = 0;
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
            </Button>
            ) : global.payload.role == 'admin' || global.payload.role == 'privat' ? (
              <Link to={this.kommune ? "/meldfeil?k="+this.kommune.kommune_id : "/meldfeil"}>
                <Button className="meldFeilHoved" color="red" size="large">
                  Meld inn feil
                </Button>
              </Link>
            ) : null}

          

        </div>
        <div className="mobileButtons">
          <div>
            <a onClick={() => this.mobileView("#hovedtittelanchor")}>
              <div className={this.mobView=="#hovedtittelanchor"?"mobActive":""}><p className="text-capitalize">{this.props.match.params.kommune}</p></div>
            </a>
            <a onClick={() => this.mobileView("#hovedFeil")}>
              <div className={this.mobView=="#hovedFeil"?"mobActive":""}><p>Feil</p></div>
            </a>
            <a onClick={() => this.mobileView("#hovedKart")}>
              <div className={this.mobView=="#hovedKart"?"mobActive":""}><p>Kart</p></div>
            </a>
            <a onClick={() => this.mobileView("#hovedHendelser")}>
              <div className={this.mobView=="#hovedHendelser"?"mobActive":""}><p>Hendelser</p></div>
            </a>
          </div>
        </div>
        {!this.visHendelser ? (
          <div className="row mt-4 hovedContainer ml-1 mr-1">
            <div className="col-md-auto" id="hovedFeil">
              {/**
                      *NYLIGE FEIL
                      *NYLIGE FEIL
                      *NYLIGE FEIL
              */}
              <Card fluid className="hovedKort">
                <Card.Content>
                  <Card.Header>
                    Nylige feil og mangler
                    <InfoBoks tekst="Her finner du alle nye feil på infrastruktur i kommunen." />
                    <select
                      onChange={(e) => {this.feilKategori = e.target.value;}}
                      className="form-control right floated meta"
                      style={{height: "30px", width: "100%", marginTop:"10px"}}
                    >
                      <option hidden> Filter </option>
                      <option value="0"> Alle kategorier </option>
                      {this.alleKategorier.map((kategori) => (
                        <option value={kategori.kategorinavn} key={kategori.kategorinavn}>
                          {' '}
                          {kategori.kategorinavn}
                        </option>
                      ))}
                    </select>
                  </Card.Header>
                </Card.Content>
                <Card.Content className='hovedsideTabeller'>
                  <Feed>
                    {this.alleFeil.filter((feil) => (this.feilKategori == feil.kategorinavn) || this.feilKategori == "0").map((feil) => (
                      <FeedEvent
                        onClick={() => this.merInfo(feil)}
                        status={feil.status}
                        tid={feil.tid}
                        kategori={feil.kategorinavn}
                        key={feil.feil_id}
                      >
                        {feil.overskrift}
                      </FeedEvent>
                    ))}
                  </Feed>
                </Card.Content>
              </Card>
            </div>
            {this.visFeil ? (
              <div className="col feilInfo">
              
                <Card fluid>
                  <Card.Content extra style={{height:"120px", color:"black"}}>
                    <div>
                      <h1 className="hovedSideFeilOverskrift">
                        {this.feil.overskrift}
                        {/*</Link>*/}
                      </h1>
                      <img
                          onClick={() => {
                            if (this.mobView == "#hovedFeil") {
                              //document.querySelector("#hovedFeil").style.display="block";
                              this.mobileView("#hovedFeil");
                            }
                            else {
                              this.visFeil = false;
                            }
                          }}
                          src="https://image.freepik.com/free-icon/x_318-27992.jpg"
                          width="20"
                          height="20"
                          className="hovedSideX"
                        />
                      <h6><b>
                        Status:</b> {(this.feil.status=== "Godkjent") ? (<span>Mottatt</span>) : (this.feil.status)} <img src={this.statusIkon} width="30" height="30" />
                        {(global.payload && global.payload.role == 'privat') ? (
                        <AbonnerKnapp style={{float:"right", width:"90px"}} key={this.feil.feil_id} feil_id={this.feil.feil_id} />
                        ) : null}
                      </h6>
                    </div>
                  </Card.Content>
                  <Card.Content extra style={{height: '100%', color:"black"}}>
                    <Grid  columns={3} stackable style={{height: '100%'}}>
                      <Grid.Column>
                        <h6><b>Beskrivelse:</b></h6>
                        <div class="hovedSideFeilBeskrivelse">{this.feil.beskrivelse.split("\n").map((tekst) => (
                          <p >{tekst}</p>))}
                        </div>
                      </Grid.Column>
                      <Grid.Column>
                        <h6><b>Posisjon:</b></h6>
                        <ShowMarkerMap key={this.feil.feil_id} width="100%" height="100%" id="posmap" feil={this.feil} />
                      </Grid.Column>
                      <Grid.Column>
                        <div className="oppdateringScroll">
                        <h6><b>Oppdateringer:</b></h6>
                          <List className="p-2">
                            {this.oppTilFeil.map((opp) => (
                            <List.Item>
                              <List.Content>
                                <List.Header>{opp.status}<span className="float-right font-weight-light font-italic">{opp.tid}</span></List.Header>
                                <List.Description>{opp.kommentar}</List.Description>
                              </List.Content>
                            </List.Item>
                            ))}
                          </List>
                        </div>
                        <br />
                        <div className="oppdateringScroll">
                          <h6><b>Bilder:</b></h6>
                          <div>
                            {this.bilderTilFeil.map((bilde) => (
                                <div className="feilModalBilde" onClick={() => this.visBilde(bilde.url)}>
                                  <img src={bilde.url} key={bilde.bilde_id} className="bilder" onClick={() => {this.handleOpen(bilde.url)}}/>
                                </div>
                            ))}
                          </div>
                        </div>
                      </Grid.Column>
                    </Grid>
                  </Card.Content>
                </Card>
                <Modal open={this.state.open} onClose={this.handleClose} basic centered className="modalwidth">
                  <Modal.Content>
                      <img src={this.bildeModal} className="bildevisning"/>
                  </Modal.Content>
                </Modal>
              
              </div>
            ) : (
              /*
                KART
                KART
                KART
              */
              <>
                <div className="col text-center" id="hovedKart">
                  <div id="mapContainer">
                    <MarkerMap
                      key={this.props.match.params.kommune}
                      width="100%"
                      height="100%"
f                      id="test"
                      center={this.props.match.params.kommune}
                      callback={this.callMap}
                      onRef={(ref) => (this.kart = ref)}
                    />
                  </div>
                </div>
                <div className="col-md-auto" id="hovedHendelser">
                  {/**
                    *KOMMENDE HENDELSER
                    *KOMMENDE HENDELSER
                    *KOMMENDE HENDELSER
                  */}
                  <Card fluid className="hovedKort">
                    <Card.Content>
                    <Card.Header>
                    Kommende hendelser
                    <InfoBoks tekst="Her finner du kulturarrangementer og planlagt arbeid på infrastruktur for kommunen." />
                    <select
                      onChange={(e) => {this.filterHendelse = e.target.value;}}
                      className="form-control right floated meta"
                      style={{height: "30px", width: "100%", marginTop:"10px"}}
                    >
                      <option hidden> Filter </option>
                      <option value="0"> Alle kategorier </option>
                      {this.hendelseKategori.map((kategori) => (
                        <option value={kategori.kategorinavn} key={kategori.kategorinavn}>
                          {' '}
                          {kategori.kategorinavn}
                        </option>
                      ))}
                    </select>
                  </Card.Header>
                    </Card.Content>
                    <Card.Content className='hovedsideTabeller'>
                      <Feed>
                        {this.alleHendelser.filter(kat => ((kat.kategorinavn == this.filterHendelse) || this.filterHendelse == "0")).map((hendelse) => (
                          <FeedHendelse
                            onClick={() => {
                              this.visEnHendelse(hendelse);
                              console.log(hendelse);
                            }}
                            //status ={feil.status}
                            tid={hendelse.tid}
                            kategori={hendelse.kategorinavn}
                            key={hendelse.hendelse_id}>
                            {hendelse.overskrift}
                          </FeedHendelse>
                        ))}
                      </Feed>
                    </Card.Content>
                  </Card>
                  
                </div>
              </>
            )}
          </div>
          
        ) : (
          <div className="row mt-4 hovedContainer ml-1 mr-1">
            <div className="col hendelseInfo">
              <Card fluid>
                <Card.Content>
                  <div>
                    <h1>
                      {this.hendelse.overskrift}
                      <NavLink
                        to={'/hovedside/' + this.props.match.params.kommune}
                        onClick={() => {
                          if (this.mobView == "#hovedHendelser") {
                            document.querySelector("#hovedHendelser").style.display="block";
                            this.mobileView("#hovedHendelser");
                          }
                          else {
                            this.visHendelser = false;
                          }
                        }}
                      >
                        <img
                          className="float-right"
                          src="https://image.freepik.com/free-icon/x_318-27992.jpg"
                          width="20"
                          height="20"
                        />
                      </NavLink>
                    </h1>
                    <div>
                      <Grid columns={2} stackable>
                        <Grid.Column>
                          <img
                            className="img-fluid w-100"
                            src={this.hendelse.bilde}
                          />
                          <br />
                          <div id="hendelseKnapper">
                            {this.hendelse.billett && <a href={this.hendelse.billett} target="_blank"><Button color="green" style={{height:"33.5px"}}>Kjøp billetter</Button></a>}
                            {(global.payload && global.payload.role == 'privat') && <AbonnerKnapp style={{float:"right", width:"90px"}} key={this.hendelse.hendelse_id} hendelse_id={this.hendelse.hendelse_id} />}
                          </div>
                          <br />

                          <div>
                            <p>
                              <img src="https://image.flaticon.com/icons/svg/33/33622.svg" height="20" width="20" />
                              {this.hendelse.sted}, {this.kommune.kommune_navn}, Norge
                            </p>
                            <p>
                              <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Simple_icon_time.svg/750px-Simple_icon_time.svg.png"
                                height="20"
                                width="25"
                              />
                              {this.hendelse.tid}
                            </p>
                          </div>
                        </Grid.Column>
                        <Grid.Column>
                          <div id="hendelseBeskrivelse">{this.hendelse.beskrivelse.split("\n").map((tekst) => (
                            <p >{tekst}</p>))}
                          </div>
                        </Grid.Column>
                      </Grid>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </div>
            <div className="col-md-auto" id="hovedHendelser">
                  {/**
                    *KOMMENDE HENDELSER
                    *KOMMENDE HENDELSER
                    *KOMMENDE HENDELSER
                  */}
                  <Card fluid className="hovedKort">
                    <Card.Content>
                    <Card.Header>
                    Kommende hendelser
                    <InfoBoks tekst="Her finner du kulturarrangementer og planlagt arbeid på infrastruktur for kommunen." />
                    <select
                      onChange={(e) => {this.feilKategori = e.target.value;}}
                      className="form-control right floated meta"
                      style={{height: "30px", width: "100%", marginTop:"10px"}}
                    >
                      <option hidden> Filter </option>
                      <option value="0"> Alle kategorier </option>
                      {this.alleKategorier.map((kategori) => (
                        <option value={kategori.kategorinavn} key={kategori.kategorinavn}>
                          {' '}
                          {kategori.kategorinavn}
                        </option>
                      ))}
                    </select>
                  </Card.Header>
                    </Card.Content>
                    <Card.Content className='hovedsideTabeller'>
                      <Feed>
                        {this.alleHendelser.map((hendelse) => (
                          <FeedHendelse
                            onClick={() => {
                              this.visEnHendelse(hendelse);
                              console.log(hendelse);
                            }}
                            //status ={feil.status}
                            tid={hendelse.tid}
                            kategori={hendelse.kategorinavn}
                            key={hendelse.hendelse_id}
                          >
                            {hendelse.overskrift}
                          </FeedHendelse>
                        ))}
                      </Feed>
                    </Card.Content>
                  </Card>
                  
                </div>
          </div>
        )}
      </div>
    );
  }

  callMap() {
    this.kart.addMarkers(this.alleFeil);
  }

  async mounted() {
    this.visFeil = false;
    console.log("mounted");
    let res = await generellServices.sokKommune(this.props.match.params.kommune);
    let res4 = await hendelseService.hentAlleHovedkategorier();
    this.hendelseKategori = res4.data;
    await Promise.resolve(res.data).then(async () => {
      if (res.data.length > 0) {
        this.kommune = res.data[0];

        let res1 = await feilService.hentGodkjenteFeilForKommune(this.kommune.kommune_id),
            res2 = await feilService.hentAlleHovedkategorier(),
            res3 = await hendelseService.hentHendelserForKommune(this.kommune.kommune_id);

        [this.alleFeil, this.aktiveFeil, this.alleKategorier, this.alleHendelser] = await Promise.all([
          res1.data,
          res1.data,
          res2.data,
          res3.data,
        ]);
    
        await Promise.all([res1.data/*, res2.data, res3.data, res4.data, res.data*/]).then(() => {
          if (this.kart.loaded) {
            this.kart.addMarkers(res1.data);
            if (this.mobView != "#hovedKart" && L.Browser.mobile) {window.setClosed();}
          }
          else {
            let listenfunc = () => {
              if (this.kart.loaded) {
                if (this.mobView != "#hovedKart" && L.Browser.mobile) {window.setClosed();}
              }
              else {
                setTimeout(()=>listenfunc(), 100);
              }
            }
            listenfunc();
          }
        });

      } else {
        this.kommune = null;
      }
    });
  }
}

