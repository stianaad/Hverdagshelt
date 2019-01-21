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

export class AnsattMeny extends Component {
  state = { activeItem: 'Nye feil' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
        <div className="ansattMenyContainer">
          <nav className="nav flex-column">
            <NavLink className="nav-link active" to="/ansattest">Nye feil</NavLink>
            <NavLink className="nav-link active" to="/ferdigtest">Utførte feil</NavLink>
            <NavLink className="nav-link active" to="/nyhendelsetest">Ny hendelse</NavLink>
            <NavLink className="nav-link active" to="/">Test</NavLink>
          </nav>
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
        <div className="vinduansatt">
            <Grid>
                <Grid.Column width="2">
                    <AnsattMeny/>
                </Grid.Column>
                <Grid.Column width="13">
                  <Grid stackable>
                    <Grid.Row textAlign="center" centered>
                        <h1 className="mt-3">Nye feil</h1>
                    </Grid.Row>
                    <Grid.Column width="4">
                      <div>
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
                    </Grid.Column>
                    <Grid.Column width="11">
                      {this.feilApen ? (
                        <div className="feilDiv">
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
                                  <TextArea value={this.valgtfeil.beskrivelse} rows="18" />
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
                        </div>
                      ) : (
                        <div>Trykk på feil</div>
                      )}
                    </Grid.Column>
                  </Grid>
                </Grid.Column>
            </Grid>
        </div>
      </div>
    );
  }

  async godkjenn(){
      nyOpp = {
          feil_id: this.valgtfeil.feil_id,
          kommentar: "Ansatt har godkjent innhold",
          status_id: 2,
      };
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
