import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Grid, Modal, Input, List, Image, Button, Loader, Dimmer } from 'semantic-ui-react';
import { hendelseService } from '../../services/hendelseService';
import { AbonnerKnapp } from '../abonner/abonner';
import { KommuneInput } from '../kommuneInput/kommuneInput';
import { brukerService } from '../../services/brukerService';

export class EndreBrukerModal extends Component {
  open = false;

  bruker = {
    admin: 0,
    adtlf: '',
    aenavn: '',
    afnavn: '',
    anavn: '',
    ansatt: 0,
    atlf: '',
    bedrift: 0,
    bnavn: '',
    bruker_id: 0,
    btlf: '',
    epost: '',
    hendelsevarsling: false,
    kommune_id: 0,
    orgnr: 0,
    penavn: '',
    pfnavn: '',
    privat: 0,
  };

  laster = false;

  async mounted() {
    this.open = this.props.open;
    this.bruker = this.props.bruker;
    if (!!this.bruker.privat) this.bruker.hendelsevarsling = this.bruker.hendelsevarsling.data[0];
    this.laster = false;
    console.log(this.bruker)
  }

  rediger(e, a) {
    if (a.type == "checkbox") this.bruker[a.name] = !a.checked;
    else this.bruker[a.name] = a.value;
  }

  async lagre() {
    this.laster = true;
    let res = await brukerService.oppdaterSpesifisertBrukerAdmin(this.bruker);
    Promise.resolve(res.data).then(() => {this.props.onLagre(); this.props.onClose(); this.laster=false;});
  }

  async slett() {
    this.laster = true;
    let res = await brukerService.slettBruker(this.bruker.bruker_id);
    Promise.resolve(res.data).then(() => {this.props.onLagre(); this.props.onClose(); this.laster=false;});
  }

  render() {
    return (
      <>
        {this.open ? (
          <Modal open={true} size="small" centered onClose={this.props.onClose}>
            <Card style={{ width: "100%", height: "100%" }}>
              <Card.Header style={{ padding: "25px" }}>
                <h3>Basisinfo:</h3>
                <Grid columns={3}>
                  <Grid.Column>
                    <label>Bruker id:</label>
                    <br />
                    <Input style={{ width: "100%" }} disabled value={this.bruker.bruker_id}></Input>
                  </Grid.Column>
                  <Grid.Column>
                    <label>E-post:</label>
                    <br />
                    <Input name="epost" onChange={this.rediger} style={{ width: "100%" }} value={this.bruker.epost}></Input>
                  </Grid.Column>
                  <Grid.Column>
                    <label>Kommune:</label>
                    <br />
                    <KommuneInput onChange={(e) => this.bruker.kommune_id = e.id} onInputChange={(e) => this.bruker.kommune_id = e.id} style={{ width: "100%" }} kommune_id={this.bruker.kommune_id} />
                  </Grid.Column>
                </Grid>
              </Card.Header>
              <Card.Content style={{ padding: "25px" }}>
                <h3>{(!!this.bruker.admin ? "Admin" : !!this.bruker.ansatt ? "Ansatt" : !!this.bruker.bedrift ? "Bedrifts" : !!this.bruker.privat ? "Privatbruker" : "udefinert") + "info"}</h3>
                <br />
                {!!this.bruker.privat ? (
                  <Grid columns={3}>
                    <Grid.Column>
                      <label>Fornavn:</label>
                      <br />
                      <Input name="pfnavn" onChange={this.rediger} style={{ width: "100%" }} value={this.bruker.pfnavn}></Input>
                    </Grid.Column>
                    <Grid.Column>
                      <label>Etternavn:</label>
                      <br />
                      <Input name="penavn" onChange={this.rediger} style={{ width: "100%" }} value={this.bruker.penavn}></Input>
                    </Grid.Column>
                    <Grid.Column>
                      <div style={{padding: "30px 0"}}>
                        <label style={{marginRight: "10px"}} htmlFor="hendelsecheck">Hendelsevarsling:</label>
                        <Input id="hendelsecheck" type="checkbox" name="hendelsevarsling" onChange={this.rediger} checked={this.bruker.hendelsevarsling}></Input>
                      </div>
                    </Grid.Column>
                  </Grid>
                ) : !!this.bruker.bedrift ? (
                  <Grid columns={3}>
                    <Grid.Column>
                      <label>Navn:</label>
                      <br />
                      <Input name="bnavn" onChange={this.rediger} style={{ width: "100%" }} value={this.bruker.bnavn}></Input>
                    </Grid.Column>
                    <Grid.Column>
                      <label>Org.nr.:</label>
                      <br />
                      <Input name="orgnr" onChange={this.rediger} style={{ width: "100%" }} value={this.bruker.orgnr}></Input>
                    </Grid.Column>
                    <Grid.Column>
                      <label>Telefon:</label>
                      <br />
                      <Input name="btlf" onChange={this.rediger} style={{ width: "100%" }} value={this.bruker.btlf}></Input>
                    </Grid.Column>
                  </Grid>
                ) : !!this.bruker.ansatt ? (
                  <Grid columns={3}>
                    <Grid.Column>
                      <label>Fornavn:</label>
                      <br />
                      <Input name="afnavn" onChange={this.rediger} style={{ width: "100%" }} value={this.bruker.afnavn}></Input>
                    </Grid.Column>
                    <Grid.Column>
                      <label>Etternavn:</label>
                      <br />
                      <Input name="aenavn" onChange={this.rediger} style={{ width: "100%" }} value={this.bruker.aenavn}></Input>
                    </Grid.Column>
                    <Grid.Column>
                      <label>Telefon:</label>
                      <br />
                      <Input name="atlf" onChange={this.rediger} style={{ width: "100%" }} value={this.bruker.atlf}></Input>
                    </Grid.Column>
                  </Grid>
                ) : !!this.bruker.admin ? (
                  <Grid columns={2}>
                    <Grid.Column>
                      <label>Navn:</label>
                      <br />
                      <Input name="anavn" onChange={this.rediger} style={{ width: "100%" }} value={this.bruker.anavn}></Input>
                    </Grid.Column>
                    <Grid.Column>
                      <label>Telefon:</label>
                      <br />
                      <Input name="adtlf" onChange={this.rediger} style={{ width: "100%" }} value={this.bruker.adtlf}></Input>
                    </Grid.Column>
                  </Grid>
                ) : null}
              </Card.Content>
              <Card.Content extra style={{ padding: "25px" }}>
                <Button color="green" onClick={this.lagre}>Lagre</Button>
                <Button color="gray" onClick={this.props.onClose}>Avbryt</Button>
                <Button floated="right" color="red" onClick={this.slett}>Slett bruker</Button>
              </Card.Content>
            </Card>
          </Modal>
        ) : null}
        <Dimmer style={{zIndex:"10000"}} active={this.laster}>
        <Loader />
      </Dimmer>
      </>
    );
  }
}