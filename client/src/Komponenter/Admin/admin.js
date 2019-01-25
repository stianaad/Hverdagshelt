import * as React from 'react';
import { Component } from 'react-simplified';
import { PageHeader } from '../../Moduler/header/header';
import { RegistrerBedrift } from '../Registrering/registrerBedrift';
import { RegistrerNyKategori } from './registrerNyKategori';
import { SlettKategori } from './slettKategori';
import { Grid, Button, Input, Select, List, Card, Feed, Dimmer, Loader } from 'semantic-ui-react';
import { KommuneInput } from '../../Moduler/kommuneInput/kommuneInput';
import { brukerService } from '../../services/brukerService';
import { InfoBoks } from '../../Moduler/info/info';
import { EndreBrukerModal } from '../../Moduler/modaler/endrebrukermodal';

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

  async sokBrukere() {
    if (this.brukerSok.length > 0) {
      this.brukerLaster = true;
      let res = await brukerService.sokBrukere(this.brukerSok);
      this.brukere = await res.data;
      Promise.resolve(res.data).then(()=>{this.brukerLaster=false})
      await console.log(res.data);
    }
  }

  render() {
    return (
      <div className="container">
        <PageHeader history={this.props.history} location={this.props.location} />
        <EndreBrukerModal key={this.bruker+this.brukerModal} bruker={this.bruker} open={this.brukerModal} onLagre={this.sokBrukere} onClose={() => {this.brukerModal = false}} />
        <h1 style={{ textAlign: "center" }}>Administrasjon</h1>
        <Grid columns={3} centered>
          <Grid.Column>
            <h2>Kommuner</h2>
            <h4>Administrer en kommune:</h4>
            <KommuneInput style={{ display: "inline-block", marginRight: "5px" }} onChange={(e) => { this.kommune_navn = e.navn }} onInputChange={(e) => { this.kommune_navn = e.id ? e.navn : null }} />
            <Button color="blue" disabled={this.kommune_navn == null} onClick={() => this.props.history.push("/admin/" + this.kommune_navn.toLowerCase() + "/oversikt")}>Administrer</Button>
          </Grid.Column>
          <Grid.Column>
            <h2>Brukere</h2>
            <h4>Registrer en ny bruker:</h4>
            <Select style={{ display: "inline-block", marginRight: "5px", width: "calc(100% - 109px)"}} value={this.registrerBruker} onChange={(e, { value }) => { this.registrerBruker = value }} options={this.registrerOptions} />
            <Button color="blue" onClick={() => { this.props.history.push(this.registrerBruker) }}>Registrer</Button>
            <h4>Finn en bruker:<InfoBoks tekst="Her kan du søke på alle brukere i systemet.&#10;Du kan søke på f.eks. navn, e-post, kommune osv." /></h4>
            <Input className="adminBrukerSok" placeholder="Søketekst" value={this.brukerSok} onChange={(e, { value }) => { this.brukerSok = value }} />
            <Button color="blue" onClick={this.sokBrukere}>Søk</Button>
            <Card color="blue" fluid>
              <Card.Content>
                <Card.Header>
                  <h3 style={{ display: 'inline' }}>Brukere</h3>
                  <InfoBoks style={{ display: 'inline' }} tekst="Trykk på en bruker for å gjøre endringer.&#10;Du kan også filtrere på brukertyper" />
                  <Select style={{fontSize:"14px", marginLeft:"15px"}} options={this.brukerOptions} size='mini' value={this.brukerType} onChange={(e, { value }) => { this.brukerType = value }} />
                </Card.Header>
              </Card.Content>
              <Card.Content className="adminBrukerScroll">
                {this.brukere.filter((bruker) => (this.brukerType == 'alle' || this.brukerType == 'privat' && !!bruker.privat || this.brukerType == 'ansatt' && !!bruker.ansatt || this.brukerType == 'bedrift' && !!bruker.bedrift || this.brukerType == 'admin' && !!bruker.admin)).map((bruker) => (
                  <Feed>
                    <Feed.Event onClick={() => {this.bruker = bruker; this.brukerModal = true;}}>
                      <Feed.Content>
                        <Feed.Summary>{!!bruker.admin ? bruker.anavn : !!bruker.ansatt ? bruker.afnavn + " " + bruker.aenavn : !!bruker.bedrift ? bruker.bnavn : !!bruker.privat ? bruker.pfnavn + " " + bruker.penavn : "udefinert"}</Feed.Summary>
                        <Feed.Date content={bruker.epost} />
                        <Feed.Label>{!!bruker.admin ? "Administrator" : !!bruker.ansatt ? "Kommuneansatt" : !!bruker.bedrift ? "Bedrift" : !!bruker.privat ? "Privatbruker" : "udefinert"}</Feed.Label>
                      </Feed.Content>
                    </Feed.Event>
                  </Feed>
                ))}
                <Dimmer style={{zIndex:"10000"}} active={this.brukerLaster}>
                  <Loader />
                </Dimmer>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column>
            <h2>Kategorier</h2>
            <RegistrerNyKategori overskrift="Registrer ny hovedkat" label="hovedkat" placeholder="vann" id={3} />
            <SlettKategori overskrift="Slett hendelsekategori" visHendKat={"true"} />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}