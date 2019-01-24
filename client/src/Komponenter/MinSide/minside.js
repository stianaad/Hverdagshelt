import * as React from 'react';
import {PageHeader} from '../../Moduler/header/header';
import {Component} from 'react-simplified';
import {Card, Feed, Button, Header, Image} from 'semantic-ui-react';
import {FeedMinside, ModalHendelse} from '../../Moduler/cardfeed';
import {brukerService} from '../../services/brukerService';
import {Link} from 'react-router-dom';
import {KommuneInput} from '../../Moduler/kommuneInput/kommuneInput';
import { FeilModal } from '../../Moduler/modaler/feilmodal';
import { EndrePassordModal } from '../../Moduler/modaler/endrepassordmodal';
import {InfoBoks} from '../../Moduler/info/info';

export class Minside extends Component {
  oppdaterteFeil = [];
  ikkeOppdaterteFeil = [];
  folgteFeil = [];
  folgteHendelser = [];
  komin = React.createRef();
  valgtFeil = {
    overskrift: '',
    bilde: '',
    beskrivelse: '',
  };

  feil = {feil_id:0}
  feilModal = false;

  endrePassordModal = false;

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
  visFeil = false;

  redigerer = false;

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

  render() {
    return (
      <div>
        <PageHeader history={this.props.history} location={this.props.location} />
        <EndrePassordModal key={this.endrePassordModal} open={this.endrePassordModal} onClose={() => {this.endrePassordModal = false}} />
        <FeilModal abonner={true} key={this.feil.feil_id+this.feilModal} open={this.feilModal} feil={this.feil} onClose={() => {this.feilModal = false}} />
        {/*
        <Modal open={this.state.open} onClose={this.handleClose} size="small" centered dimmer="blurring">
          {!this.visHendelse ? (
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
        <div className="row">
          <div className="col"></div>
          <div className="col-md-auto ml-3 mr-1 minSideUtKolonne" id="sideListe">
            <Card fluid>
              <Card.Content>
                <Card.Header>
                  Dine rapporterte feil<InfoBoks tekst="Trykk på knappen under for å se dine rapporterte feil."/>
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
                          onClick={() => {
                            this.feilModal = true;
                            this.feil = feil;
                          }}
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
          <div className="col-md-auto mx-1 minSideInKolonne">
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
          <div className="col-md-auto mx-1 minSideInKolonne">
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
          <div className="col-md-auto mr-3 ml-1 minSideUtKolonne" id="sideListeH">
            <Card fluid>
              <Card.Content>
                <Card.Header>Brukerinformasjon<InfoBoks tekst="Her kan du både se og redigere din personlige informasjon. Du kan også endre passord ved: 'Rediger bruker' > 'Endre passord'."/></Card.Header>
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
                      <p className="modalPopup" onClick={() => {this.endrePassordModal = true;}}>
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
          <div className="col"></div>
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

  endreVerdi(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target.checked ? 1 : 0) : target.value;
    const name = target.name;
    this.brukerInfoDummy[name] = value;
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
