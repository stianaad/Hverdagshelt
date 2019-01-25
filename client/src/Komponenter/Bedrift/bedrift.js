import * as React from 'react';
import {Component} from 'react-simplified';
import {PageHeader} from '../../Moduler/header/header';
import {Card, Feed, Grid, Button, Header, Icon, Input, Image, Modal, List, CardContent} from 'semantic-ui-react';
import {FeedEvent, Filtrer, Info} from '../../Moduler/cardfeed';
import {feilService} from '../../services/feilService';
import {markerTabell, ShowMarkerMap} from '../../Moduler/kart/map';
import {NavLink} from 'react-router-dom';
import { FeilModal } from '../../Moduler/modaler/feilmodal';

export class Bedrift extends Component {
  nyefeil = [];
  alleNyeFeil = [];
  utførte = [];
  alleUtførte = [];
  underBehandling = [];
  alleUnderBehandling = [];
  alleFeil = [];
  bilderTilFeil = [];
  oppdateringer = [];
  visGodkjennJobb = false;
  alleKategorier = [];

  valgtFeil = {
    overskrift: '',
    bilde: '',
    beskrivelse: '',
  };

  classNye = 'hoyde-tabell';
  classUnderB = 'hoyde-tabell';
  classFerdig = 'hoyde-tabell';

  state = {
    open: false,
  };

  handleOpen = (feil) => {
    this.valgtFeil = {...feil};
    this.opneFeil(feil);
    this.setState({open: true});
  };

  async opneFeil(feil) {
    let res = await feilService.hentBilderTilFeil(feil.feil_id);
    this.bilderTilFeil = await res.data;

    let res2 = await feilService.hentAlleOppdateringerPaaFeil(feil.feil_id);
    this.oppdateringer = await res2.data;
  }

  handleClose = () => {
    this.setState({open: false});
  };

  feil = {feil_id:0}
  feilModal = false;
  /* <span>
                            <Button
                              floated="right"
                              color="red"
                              size="small"
                              onClick={() => {
                                this.avslaJobb(this.valgtFeil.feil_id);
                              }}
                            >
                              Ikke godta
                            </Button>
                            <Button
                              floated="right"
                              color="green"
                              size="small"
                              onClick={() => {
                                this.godtaJobb(this.valgtFeil.feil_id);
                              }}
                            >
                              Godta jobb
                            </Button>
                          </span>*/ 

  render() {
    return (
      <React.Fragment>
        <PageHeader history={this.props.history} location={this.props.location} />
        <div className="bedriftContainer">
          {/*<Modal.Header>
                        {this.valgtFeil.overskrift}
                    </Modal.Header>*/}
            <FeilModal abonner={false} aksepter={this.visGodkjennJobb} godtaJobb={this.godtaJobb} avslaJobb={this.avslaJobb}
            key={this.feil.feil_id+this.feilModal} open={this.feilModal} feil={this.feil} onClose={() => {this.feilModal = false}} />
          <h1>Mine oppgaver</h1>
          <div>
            <div className="row mt-5">
              <div className="col-sm-4">
                <div className="m1-3">
                  <Card color="red" fluid>
                    <Card.Content>
                      <Card.Header>
                        Nye feil til bedriften
                        <Filtrer alleKategorier={this.alleKategorier} onChange={this.filterNyeFeil}/>
                      </Card.Header>
                    </Card.Content>
                    <Card.Content className={this.classNye}>
                      {this.nyefeil.map((feil) => (
                        <FeedEvent
                          onClick={() => {
                            this.feil = feil;
                            this.visGodkjennJobb = true;
                            this.feilModal = true;
                          }}
                          key={feil.feil_id}
                          status={feil.status}
                          tid={feil.tid}
                          visSakID={true}
                          feil_id={feil.feil_id}
                          kategori={feil.kategorinavn}
                        >
                          {feil.overskrift}
                        </FeedEvent>
                      ))}
                    </Card.Content>
                  </Card>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="m1-3">
                  <Card color="yellow" fluid>
                    <Card.Content>
                      <Card.Header>
                        Under behandling
                        <Filtrer alleKategorier = {this.alleKategorier} onChange = {this.filterUnderB}/>
                      </Card.Header>
                    </Card.Content>
                    <Card.Content className={this.classUnderB}>
                      {this.underBehandling.map((feil) => (
                        <FeedEvent
                          onClick={() => {
                            this.feil = feil;
                            this.visGodkjennJobb = false;
                            this.feilModal = true;
                          }}
                          key={feil.feil_id}
                          status={feil.status}
                          visSakID={true}
                          tid={feil.tid}
                          visRedigering="true"
                          knapp={this.oppdater}
                          feil_id={feil.feil_id}
                          kategori={feil.kategorinavn}
                        >
                          {feil.overskrift}
                        </FeedEvent>
                      ))}
                    </Card.Content>
                  </Card>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="m1-3">
                  <Card color="green" fluid>
                    <Card.Content>
                      <Card.Header>
                        Avsluttede feil
                        <Filtrer alleKategorier={this.alleKategorier} onChange={this.filterUtførte}/>
                      </Card.Header>
                    </Card.Content>
                    <Card.Content className={this.classFerdig}>
                      {this.utførte.map((feil) => (
                        <FeedEvent
                          onClick={() => {
                            this.feil = feil;
                            this.visGodkjennJobb = false;
                            this.feilModal = true;
                          }}
                          key={feil.feil_id}
                          visSakID={true}
                          status={feil.status}
                          tid={feil.tid}
                          feil_id={feil.feil_id}
                          kategori={feil.kategorinavn}
                        >
                          {feil.overskrift}
                        </FeedEvent>
                      ))}
                    </Card.Content>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  filterUtførte(e) {
    let verdi = e.target.value;
    if (verdi == 0) {
      this.utførte = this.alleUtførte;
    } else {
      this.utførte = this.alleUtførte.filter((kat) => kat.kategorinavn === verdi);
    }
  }

  filterUnderB(e) {
    let verdi = e.target.value;
    if (verdi == 0) {
      this.underBehandling = this.alleUnderBehandling;
    } else {
      this.underBehandling = this.alleUnderBehandling.filter((kat) => kat.kategorinavn === verdi);
    }
  }

  filterNyeFeil(e) {
    let verdi = e.target.value;
    if (verdi == 0) {
      this.nyefeil = this.alleNyeFeil;
    } else {
      this.nyefeil = this.alleNyeFeil.filter((kat) => kat.kategorinavn === verdi);
    }
  }

  async oppdater(tekst, statusVerdi, feil_id) {
    let res1 = await feilService.lagOppdatering({"feil_id": feil_id,"kommentar":tekst,"status_id":statusVerdi});
    await this.hentUnderBehandlingFeil();
    await this.hentFerdigeFeilBedrift();
  }

  async godtaJobb(feil_id) {
    await feilService.oppdaterStatusFeilTilBedrift({feil_id: feil_id, status: 4});
    await feilService.lagOppdatering({"feil_id": feil_id,"kommentar":"Bedrift godtok jobben og begynner arbeidet straks","status_id":3});
    await this.hentNyeFeil();
    await this.hentUnderBehandlingFeil();
    this.feilModal = false;
  }

  async avslaJobb(feil_id) {
    await feilService.oppdaterStatusFeilTilBedrift({feil_id: feil_id, status: 1});
    await this.hentNyeFeil();
    this.feilModal = false;
    this.handleClose();
  }

  scrollNye() {
    if (this.nyefeil.length > 4) {
      this.classNye = 'scroll-tabell';
    }
  }

  scrollUnderB() {
    if (this.underBehandling.length > 4) {
      this.classUnderB = 'scroll-tabell';
    }
  }

  scrollFerdig() {
    if (this.utførte.length > 4) {
      this.classFerdig = 'scroll-tabell';
    }
  }

  async hentNyeFeil() {
    let hentNyeFeilTilBedrift = await feilService.hentNyeFeilTilBedrift();
    this.nyefeil = await hentNyeFeilTilBedrift.data;
    this.alleNyeFeil = await hentNyeFeilTilBedrift.data;
    await this.scrollNye();
  }

  async hentUnderBehandlingFeil() {
    let underBehandling = await feilService.hentUnderBehandlingFeilTilBedrift();
    this.underBehandling = await underBehandling.data;
    this.alleUnderBehandling = await underBehandling.data;
    await this.scrollUnderB();
  }

  async hentFerdigeFeilBedrift() {
    let res1 = await feilService.hentFerdigeFeilTilBedrift(); 
    this.utførte = res1.data;
    this.alleUtførte = res1.data;
    await this.scrollFerdig(); 
  }

  async mounted() {
    await this.hentNyeFeil();
    await this.hentUnderBehandlingFeil();
    await this.hentFerdigeFeilBedrift();
    let res2 = await feilService.hentAlleHovedkategorier();
    this.alleKategorier = await res2.data;
  }
}