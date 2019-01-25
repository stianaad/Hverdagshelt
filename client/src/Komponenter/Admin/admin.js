import * as React from 'react';
import { Component } from 'react-simplified';
import { PageHeader } from '../../Moduler/header/header';
import { RegistrerBedrift } from '../Registrering/registrerBedrift';
import { RegistrerNyKategori } from './registrerNyKategori';
import { SlettKategori } from './slettKategori';
import { Grid, Button, Input, Select, List, Card, Feed, Dimmer, Loader, Accordion, Icon } from 'semantic-ui-react';
import { KommuneInput } from '../../Moduler/kommuneInput/kommuneInput';
import { brukerService } from '../../services/brukerService';
import { InfoBoks } from '../../Moduler/info/info';
import { EndreBrukerModal } from '../../Moduler/modaler/endrebrukermodal';
import { hendelseService } from '../../services/hendelseService';
import { feilService } from '../../services/feilService';

export class Administrasjon extends Component {
  kommune_navn = null;
  registrerBruker = '/registreransatt';
  registrerOptions = [
    { key: 'k', text: 'Kommuneansatt', value: '/registreransatt' },
    { key: 'b', text: 'Bedrift', value: '/registrerbedrift' },
    { key: 'a', text: 'Administrator', value: '/registreradmin' }];

  brukerSok = '';
  brukere = [];
  brukerOptions = [
    { key: 't', text: 'Alle brukertyper', value: 'alle' },
    { key: 'p', text: 'Privatbruker', value: 'privat' },
    { key: 'k', text: 'Kommuneansatt', value: 'ansatt' },
    { key: 'b', text: 'Bedrift', value: 'bedrift' },
    { key: 'a', text: 'Administrator', value: 'admin' }];
  brukerType = 'alle';

  bruker = {}
  brukerModal = false;
  brukerLaster = false;

  hendelseKategorier = [];
  hovedKategorier = [];
  subKategorier = [];

  hendelseKategori = null;
  hovedKategori = null;
  subKategori = null;

  nyHendelseKategori = '';
  nyHovedKategori = '';
  nySubHovedKategori = null;
  nySubKategori = '';

  mounted() {
    this.lastInnKategorier();
  }

  async lastInnKategorier() {
    let hres = await hendelseService.hentAlleKategorier();
    this.hendelseKategorier = await hres.data;

    let hfres = await feilService.hentAlleHovedkategorier();
    this.hovedKategorier = await hfres.data;

    let sfres = await feilService.hentAlleSubkategorier();
    this.subKategorier = await sfres.data;
  }

  async lagHendelseKategori() {
    let res = await hendelseService.opprettHendelseskategori({kategorinavn: this.nyHendelseKategori});
    Promise.resolve(res.data).then(() => {this.nyHendelseKategori = ''; this.lastInnKategorier()});
  }

  async lagHovedKategori() {
    let res = await feilService.opprettHovedkategori({kategorinavn: this.nyHovedKategori});
    Promise.resolve(res.data).then(() => {this.nyHovedKategori = ''; this.lastInnKategorier()});
  }

  async lagSubKategori() {
    let res = await feilService.opprettSubkategori({kategorinavn: this.nySubKategori, hovedkategori_id: this.nySubHovedKategori});
    Promise.resolve(res.data).then(() => {this.nySubKategori = ''; this.lastInnKategorier()});
  }

  async slettHendelseKategori() {
    let res = await hendelseService.slettHendelseKategori(this.hendelseKategori);
    Promise.resolve(res.data).then(() => {this.hendelseKategori = null; this.lastInnKategorier()});
  }

  async slettHovedKategori() {
    let res = await feilService.slettHovedkategori(this.hovedKategori);
    Promise.resolve(res.data).then(() => {this.hovedKategori = null; this.lastInnKategorier()});
  }

  async slettSubKategori() {
    let res = await feilService.slettSubkategori(this.subKategori);
    Promise.resolve(res.data).then(() => {this.subKategori = null; this.lastInnKategorier()});
  }

  async sokBrukere() {
    if (this.brukerSok.length > 0) {
      this.brukerLaster = true;
      let res = await brukerService.sokBrukere(this.brukerSok);
      this.brukere = await res.data;
      Promise.resolve(res.data).then(() => { this.brukerLaster = false })
    } else {
      this.brukere = [];
    }
  }

  render() {
    return (
      <div className="container">
        <PageHeader history={this.props.history} location={this.props.location} />
        <EndreBrukerModal key={this.bruker + this.brukerModal} bruker={this.bruker} open={this.brukerModal} onLagre={this.sokBrukere} onClose={() => { this.brukerModal = false }} />
        <h1 style={{ textAlign: "center" }}>Administrasjon</h1>
        <Grid columns={3} centered>
          <Grid.Column>
            <h2>Kommuner</h2>
            <h3>Administrer en kommune:</h3>
            <KommuneInput style={{ display: "inline-block", marginRight: "5px" }} onChange={(e) => { this.kommune_navn = e.navn }} onInputChange={(e) => { this.kommune_navn = e.id ? e.navn : null }} />
            <Button color="blue" disabled={this.kommune_navn == null} onClick={() => this.props.history.push("/admin/" + this.kommune_navn.toLowerCase() + "/oversikt")}>Administrer</Button>
          </Grid.Column>
          <Grid.Column>
            <h2>Brukere</h2>
            <h3>Registrer en ny bruker:</h3>
            <Select style={{ display: "inline-block", marginRight: "5px", width: "calc(100% - 109px)" }} value={this.registrerBruker} onChange={(e, { value }) => { this.registrerBruker = value }} options={this.registrerOptions} />
            <Button color="blue" onClick={() => { this.props.history.push(this.registrerBruker) }}>Registrer</Button>
            <h3>Finn en bruker:<InfoBoks tekst="Her kan du søke på alle brukere i systemet.&#10;Du kan søke på f.eks. navn, e-post, kommune osv." /></h3>
            <Input className="adminBrukerSok" placeholder="Søketekst" value={this.brukerSok} onChange={(e, { value }) => { this.brukerSok = value }} />
            <Button color="blue" onClick={this.sokBrukere}>Søk</Button>
            <Card color="blue" fluid>
              <Card.Content>
                <Card.Header>
                  <h3 style={{ display: 'inline' }}>Brukere</h3>
                  <InfoBoks style={{ display: 'inline' }} tekst="Trykk på en bruker for å gjøre endringer.&#10;Du kan også filtrere på brukertyper" />
                  <Select style={{ fontSize: "14px", marginLeft: "15px" }} options={this.brukerOptions} size='mini' value={this.brukerType} onChange={(e, { value }) => { this.brukerType = value }} />
                </Card.Header>
              </Card.Content>
              <Card.Content className="adminBrukerScroll">
                {this.brukere.filter((bruker) => (this.brukerType == 'alle' || this.brukerType == 'privat' && !!bruker.privat || this.brukerType == 'ansatt' && !!bruker.ansatt || this.brukerType == 'bedrift' && !!bruker.bedrift || this.brukerType == 'admin' && !!bruker.admin)).map((bruker) => (
                  <Feed>
                    <Feed.Event onClick={() => { this.bruker = bruker; this.brukerModal = true; }}>
                      <Feed.Content>
                        <Feed.Summary>{!!bruker.admin ? bruker.anavn : !!bruker.ansatt ? bruker.afnavn + " " + bruker.aenavn : !!bruker.bedrift ? bruker.bnavn : !!bruker.privat ? bruker.pfnavn + " " + bruker.penavn : "udefinert"}</Feed.Summary>
                        <Feed.Date content={bruker.epost} />
                        <Feed.Label>{!!bruker.admin ? "Administrator" : !!bruker.ansatt ? "Kommuneansatt" : !!bruker.bedrift ? "Bedrift" : !!bruker.privat ? "Privatbruker" : "udefinert"}</Feed.Label>
                      </Feed.Content>
                    </Feed.Event>
                  </Feed>
                ))}
                <Dimmer style={{ zIndex: "10000" }} active={this.brukerLaster}>
                  <Loader />
                </Dimmer>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column>
            <h2>Kategorier</h2>
            <h3>Hendelseskategorier</h3>
            <h5>Ny kategori:</h5>
            <Input className="adminSendInput" value={this.nyHendelseKategori} onChange={(e,{value}) => this.nyHendelseKategori = value} placeholder="Kategorinavn" /><Button onClick={this.lagHendelseKategori} disabled={this.nyHendelseKategori==''}>Send</Button>
            <h5>Slett kategorier:</h5>
            <Select className="adminRedigerInput" value={this.hendelseKategori} onChange={(e,{value}) => this.hendelseKategori=value} placeholder="Kategorier" options={this.hendelseKategorier.map((kat) => ({key:kat.hendelseskategori_id, text: kat.kategorinavn, value: kat.hendelseskategori_id}))} /><Button onClick={this.slettHendelseKategori} disabled={this.hendelseKategori==null}>Slett</Button>
            <h3>Feilkategorier</h3>
            <h5>Ny hovedkategori:</h5>
            <Input className="adminSendInput" value={this.nyHovedKategori} onChange={(e,{value}) => this.nyHovedKategori = value} placeholder="Kategorinavn" /><Button onClick={this.lagHovedKategori} disabled={this.nyHovedKategori==''}>Send</Button>
            <h5>Slett hovedkategorier:</h5>
            <Select className="adminRedigerInput" placeholder="Hovedkategorier" value={this.hovedKategori} onChange={(e,{value}) => this.hovedKategori=value} options={this.hovedKategorier.map((kat) => ({key:kat.hovedkategori_id, text: kat.kategorinavn, value: kat.hovedkategori_id}))}/><Button onClick={this.slettHovedKategori} disabled={this.hovedKategori==null}>Slett</Button>
            <h5>Ny subkategori:</h5>
            <Select style={{marginBottom:"5px"}} className="adminInput" value={this.nySubHovedKategori} onChange={(e,{value}) => this.nySubHovedKategori=value} placeholder="Hovedkategorier" options={this.hovedKategorier.map((kat) => ({key:kat.hovedkategori_id, text: kat.kategorinavn, value: kat.hovedkategori_id}))} />
            <Input className="adminSendInput" value={this.nySubKategori} onChange={(e,{value}) => this.nySubKategori = value} placeholder="Subkategorier" /><Button onClick={this.lagSubKategori} disabled={this.nySubKategori==''||this.nySubHovedKategori==null}>Send</Button>
            <h5>Slett subkategorier:</h5>
            <Select className="adminRedigerInput" placeholder="Subkategorier" value={this.subKategori} onChange={(e,{value}) => this.subKategori=value} options={this.subKategorier.filter((kat) => true).map((kat) => ({key:kat.subkategori_id, text: kat.hovednavn + " > " + kat.kategorinavn, value: kat.subkategori_id}))} /><Button onClick={this.slettSubKategori} disabled={this.subKategori==null}>Slett</Button>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}