import * as React from 'react';
import {Component} from 'react-simplified';
import {PageHeader} from '../../Moduler/header/header';
import {
  Menu,
  Card,
  Feed,
  Grid,
  Button,
  Header,
  Icon,
  Input,
  Image,
  Modal,
  List,
  CardContent,
  GridColumn,
  Dropdown,
  TextArea,
} from 'semantic-ui-react';
import {FeedEvent, Filtrer, Info} from '../../Moduler/cardfeed';
import {feilService} from '../../services/feilService';
import {markerTabell, ShowMarkerMap} from '../../Moduler/kart/map';
import {NavLink} from 'react-router-dom';
import {brukerService} from '../../services/brukerService';

export class AnsattSide extends Component {
  render() {
    return (
      <div>
        <PageHeader history={this.props.history} location={this.props.location} />
        <div className="vinduansatt">
            <Grid>
                <Grid.Column width="2">
                    <div className="ansattMenyContainer">
                    <Menu vertical pointing secondary fluid>
                        <Menu.Item active>Nye feil</Menu.Item>
                        <Menu.Item>Valg2</Menu.Item>
                        <Menu.Item>Valg3</Menu.Item>
                        <Menu.Item>Valg4</Menu.Item>
                        <Menu.Item>Valg5</Menu.Item>
                    </Menu>
                    </div>
                </Grid.Column>
                <Grid.Column width="13">
                    <NyeFeil />
                </Grid.Column>
            </Grid>
        </div>
      </div>
    );
  }
}

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
    this.feilApen = true;
  }

  async hentFeil(feil) {
    let res = await feilService.hentBilderTilFeil(feil.feil_id);
    this.bilder = await res.data;
    console.log('bilder: ' + this.bilder);
  }

  render() {
    return (
      <div>
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
        <Grid stackable>
          <Grid.Row columns={4}>
            <Grid.Column />
            <Grid.Column>
              <h1 className="mt-3">Nye feil</h1>
            </Grid.Column>
            <Grid.Column />
          </Grid.Row>
          <Grid.Column width="4">
            <div>
              <Card color="red" fluid>
                <Card.Content>
                  <Card.Header>
                    Nye innsendinger
                    <Filtrer />
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
          </Grid.Column>
          <Grid.Column width="11">
            {this.feilApen ? (
              <Card fluid>
                <Card.Content>
                  <div>
                    <Grid fluid columns={2} verticalAlign="middle">
                      <Grid.Column textAlign="left">
                        <h1>{this.valgtfeil.overskrift}</h1>
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
                        <Button floated="right" color="green">
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
                        <TextArea value={this.valgtfeil.beskrivelse} rows="6" />
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
                      </Grid.Column>
                    </Grid>
                  </div>
                </Card.Content>
              </Card>
            ) : (
              <div>Trykk på feil</div>
            )}
          </Grid.Column>
        </Grid>
      </div>
    );
  }

  async godkjenn(){
      
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
    this.valgtfeil = await {...this.nyefeil[0]};

    let res = await feilService.hentBilderTilFeil(this.valgtfeil.feil_id);
    this.bilder = await res.data;

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
