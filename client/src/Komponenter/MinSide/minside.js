import * as React from 'react';
import {PageHeader} from '../../Moduler/header/header';
import {Component} from 'react-simplified';
import {Card, Feed, Button, Header, Image} from 'semantic-ui-react';
import {FeedMinside, ModalHendelse} from '../../Moduler/cardfeed';
import {brukerService} from '../../services/brukerService';
import {feilService} from '../../services/feilService';
import {Link} from 'react-router-dom';
import {KommuneInput} from '../../Moduler/kommuneInput/kommuneInput';
import { FeilModal } from '../../Moduler/modaler/feilmodal';
import { EndrePassordModal } from '../../Moduler/modaler/endrepassordmodal';
import {InfoBoks} from '../../Moduler/info/info';
import { HendelseModal } from '../../Moduler/modaler/hendelsemodal';

export class Minside extends Component {
  alleOppdaterteFeil = [];
  alleIkkeOppdaterteFeil = [];
  oppdaterteFeil = [];
  ikkeOppdaterteFeil = [];
  folgteFeil = [];
  folgteHendelser = [];
  komin = React.createRef();
  dropdownPil = "https://static.thenounproject.com/png/196765-200.png";

  feil = {feil_id:0};
  feilModal = false;

  hendelse = {hendelse_id:0};
  hendelseModal = false;

  mobView = "#mintittelanchor"
  endrePassordModal = false;

  brukerInfo = {
    fornavn: '',
    etternavn: '',
    epost: '',
    kommune_id: -1,
    kommune_navn: '',
    hendelsevarsling: -1,
  };

  brukerInfoDummy = {
    fornavn: '',
    etternavn: '',
    epost: '',
    kommune_id: -1,
    kommune_navn: '',
    hendelsevarsling: -1,
  };

  redigerer = false;

  classFeil = 'hovedsideTabeller';

  mobileView(view) {
    let q = (id) => document.querySelector(id);
    if (view == this.mobView) return;

    if (view == "#mintittelanchor") {
      q(this.mobView).style.display = "none";
      q("#mintittelanchor").style.display = "block";
      q("#sideListe").style.display = "block";
    }
    else if (this.mobView == "#mintittelanchor") {
      q("#mintittelanchor").style.display = "none";
      q("#sideListe").style.display = "none";
      q(view).style.display = "block";
    }
    else {
      q(this.mobView).style.display = "none";
      q(view).style.display = "block";
    }
    this.mobView = view;
  }

  render() {
    return (
      <div>
        <PageHeader history={this.props.history} location={this.props.location} />
        <EndrePassordModal key={'endrepassordmodal'+this.endrePassordModal} open={this.endrePassordModal} onClose={() => {this.endrePassordModal = false}} />
        <FeilModal abonner={true} key={'feilmodal'+this.feil.feil_id+this.feilModal} open={this.feilModal} feil={this.feil} onClose={() => {this.feilModal = false}} />
        <HendelseModal abonner={true} key={'hendelsemodal'+this.hendelse.hendelse_id+this.hendelseModal} open={this.hendelseModal} hendelse={this.hendelse} onClose={() => {this.hendelseModal = false}} />
        <div className="mt-3 hovedTittel" id="mintittelanchor">
          <h1 className="text-center text-capitalize display-4">Min side</h1>
          <Link to="/meldfeil">
            <Button color="red" size="large">
              Meld inn feil
            </Button>
          </Link>
        </div>

        <div className="mobileButtons">
          <div>
            <a onClick={() => this.mobileView("#mintittelanchor")}>
              <div className={this.mobView=="#mintittelanchor"?"mobActive":""}><p className="text-capitalize">Min side</p></div>
            </a>
            <a onClick={() => this.mobileView("#hendelseListe")}>
              <div className={this.mobView=="#hendelseListe"?"mobActive":""}><p>Hendelser</p></div>
            </a>
            <a onClick={() => this.mobileView("#feilListe")}>
              <div className={this.mobView=="#feilListe"?"mobActive":""}><p>Feil</p></div>
            </a>
            <a onClick={() => this.mobileView("#sideListeH")}>
              <div className={this.mobView=="#sideListeH"?"mobActive":""}><p>Bruker</p></div>
            </a>
          </div>
        </div>

        <div className="row" id="minRow">
          <div className="col minSideUtKolonne" id="sideListe">
            <Card key ={'sideListe'} fluid>
              <Card.Content>
                <Card.Header>
                  Dine rapporterte feil<InfoBoks key = {'rapportertefeil'} tekst="Trykk på knappen under for å se dine rapporterte feil."/>
                    <br/>
                    {this.alleOppdaterteFeil.length === 0 ? (
                      <p className="ingenNyeOppdateringer mt-2">Ingen nye oppdateringer</p>
                    ) : (
                      <p className="highlight mt-2">{this.alleOppdaterteFeil.length} ny(e) oppdateringer  <a className="float-right" basic onClick={this.visRapporterteFeil}><img src={this.dropdownPil} height="20" width="20"/> </a></p>
                    )}
                </Card.Header>
              </Card.Content>
              {(this.visFeil) ? (
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
                            this.feilModal = true;
                            this.feil = feil;
                          }}>
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
              ) : (null)}
            </Card>
          </div>
          <div className="col-md-auto mx-1 minSideInKolonne" id="hendelseListe">
              <h2>Hendelser du følger</h2>
              {this.folgteHendelser.length > 0 ? (
                <Card.Group itemsPerRow={1}>
                  {this.folgteHendelser.map((hendelse) => (
                    <Card
                      key = {'feilCard'+hendelse.hendelse_id}
                      className="feilCard"
                      onClick={() => {
                        this.hendelse = hendelse;
                        this.hendelseModal = true;
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
                <Card key = {'folgerikke'}>
                  <Card.Content>
                    <Header as="h4">
                      Du følger for øyeblikket ingen hendelser. Finn hendelser i kommunesider eller hovedsiden for
                      hendelser for å følge de du interesserer deg for!
                    </Header>
                  </Card.Content>
                </Card>
              )}
            </div>
          <div className="col-md-auto mx-1 minSideInKolonne" id="feilListe">
              <h2>Feil/mangler du følger</h2>
              {this.folgteFeil.length > 0 ? (
                <Card.Group itemsPerRow={1}>
                  {this.folgteFeil.map((feil) => (
                    <Card
                      key = {'feilCard'+feil.feil_id}
                      className="feilCard"
                      onClick={() => {
                        this.feil = feil;
                        this.feilModal = true;
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
                <Card key = {'folgerikkefeil'}>
                  <Card.Content>
                    <Header as="h4">
                      Du følger for øyeblikket ingen feil. Finn feil i kommunesider for å følge de du interesserer deg
                      for!
                    </Header>
                  </Card.Content>
                </Card>
              )}
            </div>
          <div className="col minSideUtKolonne" id="sideListeH">
            <Card fluid key = {'sideListeH'}>
              <Card.Content>
                <Card.Header>Brukerinformasjon<InfoBoks key={'brukerinfo'} tekst="Her kan du både se og redigere din personlige informasjon.&#10;Du kan også endre passord ved: 'Rediger bruker' > 'Endre passord'."/></Card.Header>
              </Card.Content>
              <Card.Content>
                <div id="container">
                  {this.redigerer ? (
                    <div id="redInnhold">
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
                      <div className="form-group row">
                        <div className="form-check checkMinSide">
                          <input 
                          className="form-check-input checkVarsling" 
                          type="checkbox" 
                          id ="hendelsevarsling" 
                          checked={!!this.brukerInfoDummy.hendelsevarsling} 
                          onChange={this.endreVerdi}
                          name="hendelsevarsling"/>
                          <label className="form-check-label labelVarsling" htmlFor="hendelsevarsling">
                            Hendelsesvarsling i fylket ditt
                          </label>
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
    console.log(this.oppdaterteFeil);
    if (this.visFeil) {
      if(this.alleIkkeOppdaterteFeil.length.length > 0 ){
        this.ikkeOppdaterteFeil = this.alleIkkeOppdaterteFeil;
      } else {
        this.finnIkkeOppdaterteFeil();
      }
      this.dropdownPil = "https://static.thenounproject.com/png/196761-200.png";
      this.oppdaterteFeil = this.alleOppdaterteFeil;
      await this.scrollFeil();
      await brukerService.oppdaterSistInnloggetPrivat();
    } else {
      this.ikkeOppdaterteFeil = [];
      this.oppdaterteFeil = [];
      this.dropdownPil = "https://static.thenounproject.com/png/196765-200.png";
    }
  }

  scrollFeil() {
    if (this.oppdaterteFeil.length + this.ikkeOppdaterteFeil.length > 4) {
      this.classFeil = 'rapporterteFeilScroll';
    }
  }

  async finnOppdaterteFeilBruker() {
    let res1 = await brukerService.finnOppdaterteFeilTilBruker();
    this.oppdaterteFeil = await res1.data;
    this.alleOppdaterteFeil = await res1.data;
  }

  async finnIkkeOppdaterteFeil() {
    let res1 = await brukerService.finnIkkeOppdaterteFeilTilBruker();
    this.ikkeOppdaterteFeil = await res1.data;
    this.alleIkkeOppdaterteFeil = await res1.data;
    await this.scrollFeil();
  }

  async hentMinInfo() {
    let res4 = await brukerService.minInfo();
    this.brukerInfo = await res4.data[0];
    this.brukerInfo.hendelsevarsling = this.brukerInfo.hendelsevarsling.data[0];
  }

  async fjernFeil(id) {
    await feilService.slettFeil(id);
    //await this.finnFeilBruker(this.props.match.params.bruker_id);
    await this.finnOppdaterteFeilBruker();
    await this.finnIkkeOppdaterteFeil();
    await this.scrollFeil();
    //this.ikkeOppdaterteFeil = this.ikkeOppdaterteFeil.filter(e => e.feil_id != id);
    //this.oppdaterteFeil = this.oppdaterteFeil.filter(e => e.feil_id != id);
    await console.log(this.ikkeOppdaterteFeil);
    await console.log(this.oppdaterteFeil);
  }

  async mounted() {
    await this.finnOppdaterteFeilBruker();
    await this.hentMinInfo();

    let res2 = await brukerService.finnFolgteFeilTilBruker();
    this.folgteFeil = await res2.data;

    let res3 = await brukerService.finnFolgteHendelserTilBruker();
    this.folgteHendelser = await res3.data;
  }
}
