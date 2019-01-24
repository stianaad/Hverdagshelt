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
    console.log(this.valgtFeil);
    this.setState({open: true});
    console.log(this.state);
  };

  async opneFeil(feil) {
    let res = await feilService.hentBilderTilFeil(feil.feil_id);
    this.bilderTilFeil = await res.data;
    console.log('Bilder: ' + this.bilderTilFeil);

    let res2 = await feilService.hentAlleOppdateringerPaaFeil(feil.feil_id);
    this.oppdateringer = await res2.data;
    await console.log("OPPDATERINGER",this.oppdateringer[0]);
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
      <>
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
      </>
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
    console.log(tekst);
    console.log(statusVerdi);
    console.log(feil_id);
    let res1 = await feilService.lagOppdatering({"feil_id": feil_id,"kommentar":tekst,"status_id":statusVerdi});
    await console.log(res1);
    await this.hentUnderBehandlingFeil();
    await this.hentFerdigeFeilBedrift();
  }

  async godtaJobb(feil_id) {
    //console.log(feil_id);
    console.log(feil_id)
    let res = await feilService.oppdaterStatusFeilTilBedrift({feil_id: feil_id, status: 4});
    await feilService.lagOppdatering({"feil_id": feil_id,"kommentar":"Bedrift godtok jobben og begynner arbeidet straks","status_id":3});
    //console.log(res.data);
    this.feilModal = false;
    await this.hentNyeFeil();
    await this.hentUnderBehandlingFeil();
  }

  async avslaJobb(feil_id) {
    await feilService.oppdaterStatusFeilTilBedrift({feil_id: feil_id, status: 1});
    await this.hentNyeFeil();
    //console.log(feil_id);
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
    await console.log('heiehi');
    await console.log(this.nyefeil);
  }

  async hentUnderBehandlingFeil() {
    let underBehandling = await feilService.hentUnderBehandlingFeilTilBedrift();
    this.underBehandling = await underBehandling.data;
    this.alleUnderBehandling = await underBehandling.data;
    await this.scrollUnderB();
    //await console.log(this.nyefeil);
  }

  async hentFerdigeFeilBedrift() {
    let res1 = await feilService.hentFerdigeFeilTilBedrift(); 
    this.utførte = res1.data;
    this.alleUtførte = res1.data;
    await this.scrollFerdig(); 
    await console.log(this.utførte); 
  }

  async mounted() {
    await this.hentNyeFeil();
    await this.hentUnderBehandlingFeil();
    await this.hentFerdigeFeilBedrift();
    let res2 = await feilService.hentAlleHovedkategorier();
    this.alleKategorier = await res2.data;
  }
}

/*<Grid columns={3} divided fluid>
                                <Grid.Row> 
                                    <Grid.Column>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam porttitor quam eget enim pharetra faucibus. Nam porttitor commodo justo et congue. Aliquam metus ipsum, sodales in molestie nec, porttitor ac justo. Nullam lobortis vel ex at molestie. Duis ultrices at libero commodo consequat. Donec in tellus quis sem imperdiet dignissim. Nunc libero metus, volutpat id facilisis auctor, consequat eu mi. Fusce mauris nunc, blandit et nulla a, tempor venenatis est. Etiam euismod diam id quam laoreet, id elementum nisi elementum.</p>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <ShowMarkerMap width="100%" height="300px" id="posmap" feil={this.valgtFeil} markers={markerTabell(this.alleFeil)}/>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <List>
                                            <List.Item>
                                                <List.Content>
                                                    <List.Header>Godkjent</List.Header>
                                                    <List.Description>01.01.18 19:00</List.Description>
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <List.Content>
                                                    <List.Header>Godkjent</List.Header>
                                                    <List.Description>01.01.18 19:00</List.Description>
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <List.Content>
                                                    <List.Header>Godkjent</List.Header>
                                                    <List.Description>01.01.18 19:00</List.Description>
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <List.Content>
                                                    <List.Header>Godkjent</List.Header>
                                                    <List.Description>01.01.18 19:00</List.Description>
                                                </List.Content>
                                            </List.Item>
                                            {this.oppdateringer.map(oppdatering => (
                                                <List.Item>
                                                    <List.Content>
                                                        <List.Header>{oppdatering.kommentar}</List.Header>
                                                        <List.Description>{oppdatering.tid}</List.Description>
                                                    </List.Content>
                                                </List.Item>
                                            ))}
                                        </List>
                                        <Image.Group size='tiny'>
                                            <Image src="lofoten.jpg" />
                                            <Image src="lofoten.jpg" />
                                            <Image src="lofoten.jpg" />
                                            <Image src="lofoten.jpg" />
                                            <Image src="lofoten.jpg" />
                                            <Image src="lofoten.jpg" />
                                        </Image.Group>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>*/
