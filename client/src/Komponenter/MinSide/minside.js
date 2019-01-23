import * as React from 'react';
import {PageHeader} from '../../Moduler/header/header';
import {Component, sharedComponentData} from 'react-simplified';
import {feilService} from '../../services/feilService';
import {Card, Feed, Grid, Button, Header, Icon, Image, Popup, Modal, Input, List, Dropdown} from 'semantic-ui-react';
import {FeedEvent, FeedHendelse, Filtrer, Info, FeedMinside, ModalHendelse} from '../../Moduler/cardfeed';
import {brukerService} from '../../services/brukerService';
import {NavLink, Link} from 'react-router-dom';
import {markerTabell, ShowMarkerMap} from '../../Moduler/kart/map';
import {KommuneInput} from '../../Moduler/kommuneInput/kommuneInput';
import { FeilModal } from '../../Moduler/modaler/feilmodal';

export class Minside extends Component {
  oppdaterteFeil = [];
  ikkeOppdaterteFeil = [];
  folgteFeil = [];
  folgteHendelser = [];
  advarsel = '';
  komin = React.createRef();
  valgtFeil = {
    overskrift: '',
    bilde: '',
    beskrivelse: '',
  };

  feil = {feil_id:0}

  passord = {
    gammeltPass: '',
    nyttPass: '',
    nyttPassSjekk: '',
  }

  brukerInfo = {
    fornavn: '',
    etternavn: '',
    epost: '',
    kommune_id: -1,
    kommune_navn: '',
  };

  brukerInfoDummy = {
    fornavn: '',
    etternavn: '',
    epost: '',
    kommune_id: -1,
    kommune_navn: '',
  };

  valgteHendelse = {
    overskrift: '',
    bilde: '',
    tid: '',
    sted: '',
    kommune_navn: '',
  };

  visHendelse = false;
  feilModal = false;
  visFeil = false;

  redigerer = false;

  passordModalOpen = false;

  classFeil = 'hovedsideTabeller';

  state = {open: false};

  handleOpen = (feil) => {
    if (this.visHendelse) {
      this.valgteHendelse = {...feil};
      console.log(this.valgteHendelse);
      console.log('ehehheh');
    } else {
      this.valgtFeil = {...feil};
    }
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  openPassordModal() {
    this.passordModalOpen = true;
  }

  closePassordModal() {
    this.passordModalOpen = false;
  }

  render() {
    return (
      <div>
        <PageHeader history={this.props.history} location={this.props.location} />
        <Modal open={this.passordModalOpen} onClose={this.closePassordModal} size="small" centered>
          <Modal.Content>
            <div className="container">
              <h1 className="text-center">Endre passord</h1>
              <div className="card">
                <div className="card-body">
                  <div className="form-group row">
                    <label htmlFor='gammeltPass' className="col-sm-4 col-form-label venstreForm"> Gammelt passord:</label>
                    <div className="col-sm-8">
                      <input
                        type="password"
                        id="gammeltPass"
                        name="gammeltPass"
                        className="form-control hoyreForm"
                        value={this.passord.gammeltPass}
                        required={true}
                        placeholder="Gammelt passord"
                        onChange={this.endrePassVerdi}
                      />
                      <small className="form-text text-muted">Skriv inn din ditt gamle passord</small>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label htmlFor='nyttPass' className="col-sm-4 col-form-label venstreForm"> Nytt passord:</label>
                    <div className="col-sm-8">
                      <input
                        type="password"
                        id="nyttPass"
                        name="nyttPass"
                        className="form-control hoyreForm"
                        value={this.passord.nyttPass}
                        required={true}
                        placeholder="Nytt passord"
                        onChange={this.endrePassVerdi}
                      />
                      <small className="form-text text-muted">Skriv inn din ditt nye passord. Minst 8 tegn langt</small>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label htmlFor='nyttPassSjekk'className="col-sm-4 col-form-label venstreForm"> Gjenta nytt passord:</label>
                    <div className="col-sm-8">
                      <input
                        type="password"
                        id="nyttPassSjekk"
                        name="nyttPassSjekk"
                        className="form-control hoyreForm"
                        value={this.passord.nyttPassSjekk}
                        placeholder="Gjenta passord"
                        required={true}
                        onChange={this.endrePassVerdi}
                      />
                      <small className="form-text text-muted">Gjenta ditt nye passord</small>
                    </div>
                  </div>
                  <Button basic color="green" onClick={this.lagrePass}>
                    Endre Passord
                  </Button>
                  <p>{this.advarsel}</p>
                </div>
              </div>
            </div>
          </Modal.Content>
        </Modal>
        <FeilModal key={this.feil.feil_id+this.feilModal} open={this.feilModal} feil={this.feil} onClose={() => {this.feilModal = false}} />
        {/*
        <Modal open={this.state.open} onClose={this.handleClose} size="small" centered dimmer="blurring">
          {!this.visHendelse ? (
            <Modal.Content>
              <div>
                <Card fluid>
                  <Card.Content>
                    <div>
                      <h1>
                        {this.valgtFeil.overskrift}
                        <NavLink to={'/minside'} onClick={this.handleClose}>
                          <img
                            className="float-right"
                            src="https://image.freepik.com/free-icon/x_318-27992.jpg"
                            width="20"
                            height="20"
                          />
                        </NavLink>
                      </h1>
                      <h6>
                        Status: {this.valgtFeil.status} <img src="/warningicon.png" width="30" height="30" />
                      </h6>
                    </div>
                  </Card.Content>
                  <Card.Content extra>
                    <Grid fluid columns={3}>
                      <Grid.Column>
                        <h6>Beskrivelse</h6>
                        <Input>{this.valgtFeil.beskrivelse}</Input>
                      </Grid.Column>
                      <Grid.Column>
                        <h6>Posisjon</h6>
                        <ShowMarkerMap width="100%" height="300px" id="posmap" feil={this.valgtFeil} />
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
                        </List>
                        <Image.Group size="tiny">
                          <Image src="/lofoten.jpg" />
                          <Image src="/lofoten.jpg" />
                          <Image src="/lofoten.jpg" />
                          <Image src="/lofoten.jpg" />
                          <Image src="/lofoten.jpg" />
                          <Image src="/lofoten.jpg" />
                        </Image.Group>
                      </Grid.Column>
                    </Grid>
                  </Card.Content>
                </Card>
              </div>
            </Modal.Content>
          ) : (
            <ModalHendelse
              overskrift={this.valgteHendelse.overskrift}
              url={this.valgteHendelse.bilde}
              tid={this.valgteHendelse.tid}
              sted={this.valgteHendelse.sted}
              kommune_navn={this.valgteHendelse.kommune_navn}
            />
          )}
          </Modal>*/}
        <div className="mt-3 hovedTittel">
          <h1 className="text-center text-capitalize display-4">Min side </h1>
          <Link to="/meldfeil">
            <Button color="red" size="large">
              Meld inn feil
            </Button>
          </Link>
        </div>
        <div className="row minRow">
          <div className="col-sm mt-3 ml-3" id="sideListe">
            <Card fluid>
              <Card.Content>
                <Card.Header>
                  Dine rapporterte feil
                  <Button basic color="green" onClick={this.visRapporterteFeil}>
                    {this.oppdaterteFeil.length === 0 ? (
                      <span>Ingen ny(e) oppdateringer</span>
                    ) : (
                      <span>{this.oppdaterteFeil.length} nye oppdateringer</span>
                    )}
                  </Button>
                </Card.Header>
              </Card.Content>
              {this.visFeil ? (
                <Card.Content className={this.classFeil}>
                  {this.oppdaterteFeil.length + this.ikkeOppdaterteFeil.length > 0 ? (
                    <Feed>
                      {this.oppdaterteFeil.map((feil) => (
                        <FeedMinside
                          status={feil.status}
                          tid={feil.tid}
                          kategori={feil.kategorinavn}
                          oppdatering={true}
                          fjern={() => {
                            this.fjernFeil(feil.feil_id);
                          }}
                          onClick={() => {
                            this.visHendelse = false;
                            this.handleOpen(feil);
                          }}
                        >
                          {feil.overskrift}
                        </FeedMinside>
                      ))}
                      {this.ikkeOppdaterteFeil.map((feil) => (
                        <FeedMinside
                          status={feil.status}
                          tid={feil.tid}
                          kategori={feil.kategorinavn}
                          fjern={() => {
                            this.fjernFeil(feil.feil_id);
                          }}
                          onClick={() => this.handleOpen(feil)}
                        >
                          {feil.overskrift}
                        </FeedMinside>
                      ))}
                    </Feed>
                  ) : (
                    <Card>
                      <Card.Content>
                        <Header as="h4">Du har desverre ikke rapportert inn noen feil:( </Header>
                      </Card.Content>
                    </Card>
                  )}
                </Card.Content>
              ) : null}
            </Card>
          </div>
          <div className="col-sm mt-3">
            <div className="columnCenter">
              <h2>Hendelser du følger</h2>
              {this.folgteHendelser.length > 0 ? (
                <Card.Group itemsPerRow={1}>
                  {this.folgteHendelser.map((hendelse) => (
                    <Card
                      className="feilCard"
                      onClick={() => {
                        this.visHendelse = true;
                        this.handleOpen(hendelse);
                      }}
                    >
                      <Image src={hendelse.bilde} className="feilCardImage" />
                      <Card.Content>
                        <Card.Header>{hendelse.overskrift}</Card.Header>
                        <Card.Description>
                          <img
                            className="mr-2"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Simple_icon_time.svg/750px-Simple_icon_time.svg.png"
                            height="20"
                            width="25"
                          />
                          {hendelse.tid}
                        </Card.Description>
                      </Card.Content>
                    </Card>
                  ))}
                </Card.Group>
              ) : (
                <Card>
                  <Card.Content>
                    <Header as="h4">
                      Du følger for øyeblikket ingen hendelser. Finn hendelser i kommunesider eller hovedsiden for
                      hendelser for å følge de du interesserer deg for!
                    </Header>
                  </Card.Content>
                </Card>
              )}
            </div>
          </div>
          <div className="col-sm mt-3">
            <div className="columnCenter">
              <h2>Feil/mangler du følger</h2>
              {this.folgteFeil.length > 0 ? (
                <Card.Group itemsPerRow={1}>
                  {this.folgteFeil.map((feil) => (
                    <Card
                      className="feilCard"
                      onClick={() => {
                        this.feilModal = true;
                        this.feil = feil;
                      }}
                    >
                      <Image src={feil.url} className="feilCardImage" />
                      <Card.Content>
                        <Card.Header>{feil.overskrift}</Card.Header>
                        <Card.Description>
                          <img
                            className="mr-2"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Simple_icon_time.svg/750px-Simple_icon_time.svg.png"
                            height="20"
                            width="25"
                          />
                          {feil.tid}
                        </Card.Description>
                      </Card.Content>
                    </Card>
                  ))}
                </Card.Group>
              ) : (
                <Card>
                  <Card.Content>
                    <Header as="h4">
                      Du følger for øyeblikket ingen feil. Finn feil i kommunesider for å følge de du interesserer deg
                      for!
                    </Header>
                  </Card.Content>
                </Card>
              )}
            </div>
          </div>
          <div className="col-sm mt-3 ml-3" id="sideListeH">
            <Card fluid>
              <Card.Content>
                <Card.Header>Brukerinformasjon</Card.Header>
              </Card.Content>
              <Card.Content>
                <div id="container">
                  {this.redigerer ? (
                    <div id="innhold">
                      <div className="form-group row">
                        <label className="col-sm-4 col-form-label venstreForm" htmlFor="fornavn">
                          Fornavn:{' '}
                        </label>
                        <div className="col-sm-8">
                          <input
                            type="text"
                            id="fornavn"
                            className="form-control hoyreForm"
                            placeholder="Fornavn"
                            value={this.brukerInfoDummy.fornavn}
                            onChange={this.endreVerdi}
                            name="fornavn"
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-sm-4 col-form-label venstreForm" htmlFor="etternavn">
                          Etternavn:{' '}
                        </label>
                        <div className="col-sm-8">
                          <input
                            type="text"
                            id="etternavn"
                            className="form-control hoyreForm"
                            placeholder="Etternavn"
                            value={this.brukerInfoDummy.etternavn}
                            onChange={this.endreVerdi}
                            name="etternavn"
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-sm-4 col-form-label venstreForm" htmlFor="e-post">
                          E-post:{' '}
                        </label>
                        <div className="col-sm-8">
                          <input
                            type="text"
                            id="e-post"
                            className="form-control hoyreForm"
                            placeholder="Epost"
                            value={this.brukerInfoDummy.epost}
                            onChange={this.endreVerdi}
                            name="epost"
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-sm-4 col-form-label venstreForm" htmlFor="kommune">
                          Kommune:{' '}
                        </label>
                        <div className="col-sm-8 hoyreForm">
                          <KommuneInput
                            id="kommune"
                            className="hoyreForm"
                            ref={this.komin}
                            key={this.brukerInfo.kommune_id}
                            kommune_id={this.brukerInfo.kommune_id}
                            onChange={(e) => {
                              this.brukerInfoDummy.kommune_id = e.id;
                              this.brukerInfoDummy.kommune_navn = e.navn;
                            }}
                          />
                        </div>
                      </div>
                      <p className="modalPopup" onClick={this.openPassordModal}>
                        Endre passord?
                      </p>
                    </div>
                  ) : (
                    <>
                      <div id="keys">
                        <p>Fornavn:</p>
                        <p>Etternavn:</p>
                        <p>E-post: </p>
                        <p>Kommune: </p>
                      </div>
                      <div id="innhold">
                        <p>{this.brukerInfo.fornavn}</p>
                        <p>{this.brukerInfo.etternavn}</p>
                        <p>{this.brukerInfo.epost}</p>
                        <p>{this.brukerInfo.kommune_navn}</p>
                      </div>
                    </>
                  )}
                </div>
              </Card.Content>
              <Card.Content textAlign="center">
                {this.redigerer ? (
                  <>
                    <Button basic color="green" onClick={this.rediger}>
                      Lagre
                    </Button>
                    <Button basic color="red" onClick={() => (this.redigerer = false)}>
                      Avbryt
                    </Button>
                  </>
                ) : (
                  <>
                    <Button basic color="blue" onClick={this.rediger}>
                      Rediger bruker
                    </Button>
                  </>
                )}
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  oppdaterInfo(res) {
    if (res.result) {
      let base64Url = res.token.split('.')[1];
      let base64 = base64Url.replace('-', '+').replace('_', '/');
      global.payload = JSON.parse(window.atob(base64));
      sessionStorage.setItem('pollett', res.token);
    }
  }

  async rediger() {
    if (this.redigerer) {
      this.redigerer = false;
      this.brukerInfo = {...this.brukerInfoDummy};
      let res = await brukerService.oppdaterSpesifisertBruker(this.brukerInfo);
      await this.oppdaterInfo(res.data);
    } else {
      this.brukerInfoDummy = {...this.brukerInfo};
      this.redigerer = true;
    }
  }

  endrePassVerdi(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target.checked ? 1 : 0) : target.value;
    const name = target.name;
    this.passord[name] = value;
  }

  endreVerdi(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target.checked ? 1 : 0) : target.value;
    const name = target.name;
    this.brukerInfoDummy[name] = value;
  }

  lagrePass() {
    if (this.passord.nyttPass.length < 8 || this.passord.nyttPass !== this.passord.nyttPassSjekk) {
      this.advarsel = 'Feil ved innsending. Nytt passord må være 8 tegn langt og passordene må være like.';
    } else {
      if (brukerService.endrePassord(this.passord)) {
        this.advarsel = 'Gammelt passord er ikke korrekt, eller noe gikk galt ved innmelding.';
      } else {
        alert('Passord er endret');
        this.closePassordModal();
      }
    }
  }

  async finnFeilBruker() {
    let res1 = await brukerService.finnFeilTilBruker();
    this.rapporterteFeil = await res1.data;
  }

  async visRapporterteFeil() {
    this.visFeil = !this.visFeil;
    if (this.visFeil) {
      this.finnIkkeOppdaterteFeil();
      await this.scrollFeil();
      await brukerService.oppdaterSistInnloggetPrivat();
    }
  }

  scrollFeil() {
    if (this.oppdaterteFeil.length + this.ikkeOppdaterteFeil.length > 4) {
      console.log(this.oppdaterteFeil.length + this.ikkeOppdaterteFeil.length);
      this.classFeil = 'rapporterteFeilScroll';
    }
  }

  async finnOppdaterteFeilBruker() {
    let res1 = await brukerService.finnOppdaterteFeilTilBruker();
    this.oppdaterteFeil = await res1.data;
    //await console.log(res1.data);
  }

  async finnIkkeOppdaterteFeil() {
    let res1 = await brukerService.finnIkkeOppdaterteFeilTilBruker();
    this.ikkeOppdaterteFeil = await res1.data;
    await this.scrollFeil();
  }

  async hentMinInfo() {
    let res4 = await brukerService.minInfo();
    this.brukerInfo = await res4.data[0];
    await console.log(res4.data);
  }

  async fjernFeil(id) {
    console.log(id);
    /*let res1 = await feilService.slettFeil(id);
        await this.finnFeilBruker(this.props.match.params.bruker_id);*/
  }

  async mounted() {
    await this.finnOppdaterteFeilBruker();
    await this.hentMinInfo();

    let res2 = await brukerService.finnFolgteFeilTilBruker();
    this.folgteFeil = await res2.data;
    //await console.log(res2.data);

    let res3 = await brukerService.finnFolgteHendelserTilBruker();
    this.folgteHendelser = await res3.data;
    //await console.log(res3.data);
  }
}
