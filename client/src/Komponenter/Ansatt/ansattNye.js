import * as React from 'react';
import {Component} from 'react-simplified';
import {PageHeader} from '../../Moduler/header/header';
import {
  Card,
  Grid,
  Button,
  Modal,
  TextArea,
} from 'semantic-ui-react';
import {FeedEvent, Filtrer, KatDropdown} from '../../Moduler/cardfeed';
import {feilService} from '../../services/feilService';
import {brukerService} from '../../services/brukerService';
import {AnsattMeny} from './ansattMeny';

export class NyeFeil extends Component {
  nyefeil = [];
  alleFeil = [];
  className = '';

  valgtfeil = {
    overskrift: '',
    beskrivelse: '',
  };

  valgtBilde = '';
  bilder = [];

  hovedkat = [];
  underkat = [];
  alleSubKat = [];
  valgtHovedKat = '';
  valgtUnderKat = '';

  feilApen = false;
  bildeApen = false;

  visBilde(url) {
    this.valgtBilde = url;
    this.bildeApen = true;
  }

  handleClose() {
    this.bildeApen = false;
  }

  visFeil(feil) {
    this.valgtfeil = {...feil};
    this.hentFeil(feil);
    console.log('Feil kopieres: ' + this.valgtfeil);
    console.log("finner kategorier: ")
    this.finnKategorier(feil);
    this.hentUnderKat(this.valgtHovedKat);
    this.feilApen = true;
  }

  async hentFeil(feil) {
    let res = await feilService.hentBilderTilFeil(feil.feil_id);
    this.bilder = await res.data;
    console.log('bilder: ' + this.bilder);
  }

  finnKategorier(feil){
    let underid = feil.subkategori_id; 
    console.log("Underid: " + underid);
    this.valgtUnderKat = this.alleSubKat.find((kat) => (kat.subkategori_id === underid));
    console.log(this.valgtUnderKat);
    let hovedid = this.valgtUnderKat.hovedkategori_id;
    console.log("hovedid: " + hovedid);
    this.valgtHovedKat = this.hovedkat.find((kat) => (kat.hovedkategori_id === hovedid));
    console.log(this.valgtHovedKat);
  }

  hentUnderKat(hoved){
    console.log("hiveeeeed", hoved);
    this.valgtHovedKat = {...hoved};
    if(hoved.kategorinavn != null){
      let hovedid = this.hovedkat.find(e => (e.kategorinavn === hoved.kategorinavn));
      this.valgtUnderKat = this.alleSubKat.find(e => (e.hovedkategori_id === hovedid.hovedkategori_id));
      console.log(hovedid);
      this.underkat = this.alleSubKat.filter(e => (e.hovedkategori_id === hovedid.hovedkategori_id));
    }
    else{
      let hovedid = this.hovedkat.find(e => (e.kategorinavn === hoved));
      console.log(hovedid);
      this.underkat = this.alleSubKat.filter(e => (e.hovedkategori_id === hovedid.hovedkategori_id));
      this.valgtUnderKat = this.alleSubKat.find(e => (e.hovedkategori_id === hovedid.hovedkategori_id));
    }
  }

  render() {
    return (
      <div>
        <PageHeader history={this.props.history} location={this.props.location} />
        <Modal open={this.bildeApen} onClose={this.handleClose} basic>
          <Modal.Content>
              <Grid>
                  <Grid.Row centered>
                    <img src={this.valgtBilde} className="bildevisning"/>
                  </Grid.Row>
                  <Grid.Row centered>
                    <Button basic color="red" inverted>No</Button>
                    <Button color="green" inverted>Yes</Button>
                  </Grid.Row>
              </Grid>
          </Modal.Content>
        </Modal>
        <div className="container-fluid vinduansatt">
            <AnsattMeny/>
            <div className="row mt-3 mb-3 justify-content-md-center">
                <h1 >Nye feil og mangler</h1>
              </div>
            <div className="ansattContent">
              <div className="row">
                <div className="col-sm-4">
                  <Card color="red" fluid>
                    <Card.Content>
                      <Card.Header>
                        Nye innsendinger
                      </Card.Header>
                    </Card.Content>
                    <Card.Content className={this.className}>
                      {this.nyefeil.map((feil) => (
                        <FeedEvent
                          onClick={() => this.visFeil(feil)}
                          status={feil.status}
                          tid={feil.tid}
                          kategori={feil.kategorinavn}
                        >
                          {feil.overskrift}>
                        </FeedEvent>
                      ))}
                    </Card.Content>
                  </Card>
                </div>
                <div className="col-sm-8">
                  {this.feilApen ? (
                    <div className="ansattFeilVisning">
                      <Card fluid>
                        <Card.Content>
                          <div>
                            <Grid fluid columns={2} verticalAlign="middle">
                              <Grid.Column textAlign="left">
                                <h3>{this.valgtfeil.overskrift}</h3>
                              </Grid.Column>
                              <Grid.Column textAlign="right" fluid>
                                <h6>{this.valgtfeil.tid}</h6>
                              </Grid.Column>
                              <Grid.Column textAlign="left">
                                <h6>Status: {this.valgtfeil.status}</h6>
                              </Grid.Column>
                              <Grid.Column>
                                <Button floated="right" color="red">
                                  Slett feil
                                </Button>
                                <Button floated="right" color="green" onClick={() => this.godkjenn(this.valgtfeil.feil_id, "test", 2)}>
                                  Godkjenn
                                </Button>
                              </Grid.Column>
                            </Grid>
                          </div>
                        </Card.Content>
                        <Card.Content extra>
                          <div>
                            <Grid columns={3} fluid stackable>
                              <Grid.Column>
                                <TextArea value={this.valgtfeil.beskrivelse} rows="18" 
                                  onChange={(event) => (this.valgtfeil.beskrivelse = event.target.value)}
                                />
                              </Grid.Column>
                              <Grid.Column>KART</Grid.Column>
                              <Grid.Column>
                                <Grid columns={2} fluid>
                                  {this.bilder.map((bilde) => (
                                    <Grid.Column>
                                      <div onClick={() => this.visBilde(bilde.url)}>
                                        <img src={bilde.url} className="bilder" />
                                      </div>
                                    </Grid.Column>
                                  ))}
                                </Grid>
                                <KatDropdown
                                  valgt={this.valgtHovedKat}
                                  alleKategorier={this.hovedkat}
                                  onChange={(e) => this.hentUnderKat(e.target.value)}
                                />
                                <KatDropdown
                                  key={this.valgtHovedKat}
                                  valgt={this.valgtUnderKat}
                                  alleKategorier={this.underkat}
                                />
                              </Grid.Column>
                            </Grid>
                          </div>
                        </Card.Content>
                      </Card>
                      </div>
                    ) : (
                      <div>Trykk på feil</div>
                    )}            
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }

  async godkjenn(){
      console.log("Beskrivelse: " + this.valgtfeil.beskrivelse);
      let nyOpp = {
          feil_id: this.valgtfeil.feil_id,
          kommentar: "Ansatt har godkjent innhold",
          status_id: 2
      };

      console.log("nyOpp: " + nyOpp.data);
  }

  scroll() {
    if (this.nyefeil.length > 5) {
      this.className = 'ansattScroll';
    }
  }

  async mounted() {
    let feil = await feilService.hentAlleFeil();
    this.alleFeil = await feil.data;

    this.nyefeil = await feil.data.filter((e) => e.status === 'Ikke godkjent');

    let hoved = await feilService.hentAlleHovedkategorier();
    this.hovedkat = await hoved.data;

    let under = await feilService.hentAlleSubkategorier();
    this.alleSubKat = await under.data;

    await this.scroll();
  }
}

export class StatusDropdown extends Component {
  statuser = [];
  render() {
    return (
      <div>
        <select onChange={this.props.onChange} style={{height: 30, width: 140}} className="form-control">
          {this.statuser.map((status) => (
            <option value={status.status_id} key={status.status_id}>
              {status.status}
            </option>
          ))}
        </select>
      </div>
    );
  }

  async mounted() {
    let alleStatuser = await feilService.hentAlleStatuser();
    this.statuser = await alleStatuser.data;
  }
}

export class BedriftDropdown extends Component {
  bedrifter = [];
  render() {
    return (
      <div>
        <select onChange={this.props.onChange} style={{height: 30, width: 140}} className="form-control">
          {this.bedrifter.map((bedrift) => (
            <option value={bedrift.bruker_id} key={bedrift.bruker_id}>
              {bedrift.navn}
            </option>
          ))}
        </select>
      </div>
    );
  }

  async mounted() {
    let alleBedrifter = await brukerService.hentBedrifter();
    this.bedrifter = await alleBedrifter.data;
  }
}