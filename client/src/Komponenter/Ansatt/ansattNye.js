import * as React from 'react';
import {Component} from 'react-simplified';
import {PageHeader} from '../../Moduler/header/header';
import {
  Card,
  Grid,
  Button,
  Modal,
  TextArea,
  Input,
  Popup,
} from 'semantic-ui-react';
import {FeedEvent, Filtrer, KatDropdown} from '../../Moduler/cardfeed';
import {feilService} from '../../services/feilService';
import {brukerService} from '../../services/brukerService';
import {generellServices} from '../../services/generellServices';
import {AnsattMeny} from './ansattMeny';
import {AdminMeny} from '../Admin/adminMeny';
import {ShowMarkerMap} from '../../Moduler/kart/map';
import {InfoBoks} from '../../Moduler/info/info';

export class NyeFeil extends Component {
  nyefeil = [];
  alleFeil = [];

  valgtfeil = {
    overskrift: '',
    beskrivelse: '',
  };

  valgtBilde = {
    bilde_id: '',
    feil_id: '',
    url: ''
  };
  
  bilder = [];

  hovedkat = [];
  underkat = [];
  alleSubKat = [];
  valgtHovedKat = '';
  valgtUnderKat = '';

  feilApen = false;
  bildeApen = false;

  visBilde(bilde) {
    this.valgtBilde = {...bilde};
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
    console.log(this.bilder);
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
        <PageHeader history={this.props.history} location={this.props.location}/>
        <Modal open={this.bildeApen} onClose={this.handleClose} basic>
          <Modal.Content>
              <div className="bildevisning">
                <Grid>
                    <Grid.Row centered>
                      <img src={this.valgtBilde.url} className="godkjennBildeVisning"/>
                    </Grid.Row>
                    <Grid.Row centered>
                      <Popup 
                        trigger={<Button basic color="red" inverted onClick={this.slettBilde}>Slett</Button>} 
                        content='Hvis du sletter bildet vil du ikke få det tilbake' />
                      <Popup 
                        trigger={<Button id="behold" color="green" inverted onClick={() => (this.bildeApen = false)}>Behold</Button>} 
                        content='Trykk her for å godkjenne bildet' />
                    </Grid.Row>
                </Grid>
              </div>
          </Modal.Content>
        </Modal>
        <div className="container-fluid vinduansatt">
        {global.payload.role == 'ansatt' ? <AnsattMeny/> : (global.payload.role == 'admin') ? <AdminMeny kommune={this.kommune}/> : null}
            <div className="ansattContent">
              <div className="row mt-3 mb-3 justify-content-md-center">
                <h1 >Nye feil og mangler</h1>
              </div>
              <div className="row">
                <div className="col-sm-4">
                  <Card color="red" fluid>
                    <Card.Content>
                      <Card.Header>
                        <h3 style={{display: 'inline'}}>Nye innsendinger</h3>
                        <InfoBoks style={{display: 'inline'}} tekst="Trykk på en feil for å gjøre endringer og godkjenne en sak. En sak må godkjennes før den legges ut på hovedsiden til kommunen"/>
                      </Card.Header>
                    </Card.Content>
                    <Card.Content className="hoydeTabell">
                      {this.nyefeil.map((feil) => (
                        <FeedEvent
                          onClick={() => this.visFeil(feil)}
                          status={feil.status}
                          tid={feil.tid}
                          kategori={feil.kategorinavn}
                        >
                          {feil.overskrift}
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
                              <Grid.Column>
                                <h5 >Overskrift:</h5>
                                <TextArea rows={2} value={this.valgtfeil.overskrift} onChange={(e) => (this.valgtfeil.overskrift = e.target.value)}></TextArea>
                              </Grid.Column>
                              <Grid.Column fluid textAlign="right">
                                <InfoBoks tekst="Her kan du endre overskrift, beskrivelse og kategorier. Når du trykker på godkjenn vil endringene bli lagret og feilen vil bli gjort offentlig"/>
                                <br/>
                                <div>
                                  <h5 style={{display: 'inline'}} >Sendt inn: </h5>
                                  <h6 style={{display: 'inline'}}>{this.valgtfeil.tid}</h6>
                                </div>
                              </Grid.Column>
                              <Grid.Column textAlign="left">
                                <h6>Status: {this.valgtfeil.status}</h6>
                              </Grid.Column>
                              <Grid.Column>
                                <Button floated="right" color="red" onClick={this.slett}>
                                  Slett feil
                                </Button>
                                <Button floated="right" color="green" onClick={this.godkjenn}>
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
                                <h6>Beskrivelse: </h6>
                                <TextArea value={this.valgtfeil.beskrivelse} className="feilModalBeskrivelse"
                                  onChange={(event) => (this.valgtfeil.beskrivelse = event.target.value)}
                                />
                              </Grid.Column>
                              <Grid.Column>
                                <h6>Posisjon: </h6>
                                <ShowMarkerMap key={this.valgtfeil.feil_id} width="100%" height="85%" id="posmap" feil={this.valgtfeil} />
                              </Grid.Column>
                              <Grid.Column>
                                <h6>Bilder: </h6>
                                {this.bilder.length > 0 ? (
                                  <div className="feilModalFyll" style={{height: '160px'}}>
                                    {this.bilder.map((bilde) => (
                                      <div className="feilModalBilde" key={bilde.bilde_id} onClick={() => this.visBilde(bilde)}>
                                        <img src={bilde.url} key={bilde.bilde_id} className="bilder" onClick={() => this.visBilde(bilde)} />
                                      </div>
                                    ))}
                                  </div>
                                ):(
                                  <p>Ingen bilder</p>
                                )}
                                <br/>
                                <h6>Kategorier</h6>
                                <KatDropdown
                                  valgt={this.valgtHovedKat}
                                  alleKategorier={this.hovedkat}
                                  onChange={(e) => this.hentUnderKat(e.target.value)}
                                />
                                <KatDropdown
                                  key={this.valgtHovedKat}
                                  valgt={this.valgtUnderKat}
                                  alleKategorier={this.underkat}
                                  onChange={(e) => (this.valgtUnderKat = e.target.value)}
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

  async slett(){
    this.feilApen = false;
    await feilService.slettFeil(this.valgtfeil.feil_id);
    let feil = await feilService.hentFeilForKommune(global.payload.user.kommune_id);
    this.nyefeil = await feil.data.filter((e) => e.status === 'Ikke godkjent');
  }

  async slettBilde(){
    let a = {bilde_id: this.valgtBilde.bilde_id, feil_id: this.valgtBilde.feil_id, kommune_id: this.valgtfeil.kommune_id}
    let res = await feilService.slettBildeFraFeil(a);

    await console.log(res);
    await this.visFeil(this.valgtfeil);
    this.bildeApen = await false;
  }

  async godkjenn(){
      this.feilApen = false; 

      let res1 = await feilService.lagOppdatering({
        "feil_id": this.valgtfeil.feil_id,
        "kommentar": 'Ansatt har godkjent feil', 
        "status_id": 2
      });
      
      let res2 = await feilService.oppdaterFeil({
        subkategori_id: this.valgtUnderKat.subkategori_id,
        overskrift: this.valgtfeil.overskrift,
        beskrivelse: this.valgtfeil.beskrivelse,
        lengdegrad: this.valgtfeil.lengdegrad,
        breddegrad: this.valgtfeil.breddegrad,
        feil_id: this.valgtfeil.feil_id
      }, this.valgtfeil.feil_id);

      Promise.all([res1.data, res2.data]).then(this.mounted);
  }

  async mounted() {

    const load = async (kommune_id) => {
      let feil = await feilService.hentFeilForKommune(kommune_id);
      this.alleFeil = await feil.data;

      this.nyefeil = await feil.data.filter((e) => e.status === 'Ikke godkjent');

      let hoved = await feilService.hentAlleHovedkategorier();
      this.hovedkat = await hoved.data;

      let under = await feilService.hentAlleSubkategorier();
      this.alleSubKat = await under.data;
    }

    if (global.payload.role == 'ansatt') load(global.payload.user.kommune_id);
    else if (global.payload.role == 'admin') {
        let res = await generellServices.sokKommune(this.props.match.params.kommune);
        await Promise.resolve(res.data).then(async () => {
            if (res.data.length > 0) {
                this.kommune = res.data[0];
                load(this.kommune.kommune_id);
            }
        });
    }

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