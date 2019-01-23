import * as React from 'react';
import {Component} from 'react-simplified';
import {PageHeader} from '../../Moduler/header/header';
import {Card, Feed, Grid, Button, Header, Icon, Input, Image, Modal, List, CardContent} from 'semantic-ui-react';
import {FeedEvent, Filtrer, Info} from '../../Moduler/cardfeed';
import {feilService} from '../../services/feilService';
import {markerTabell, ShowMarkerMap} from '../../Moduler/kart/map';
import {NavLink} from 'react-router-dom';
import {AnsattMeny} from './ansattMeny';

export class AnsattOversikt extends Component {
  nyefeil = [];
  utførte = [];
  underBehandling = [];
  alleFeil = [];
  bilderTilFeil = [];
  oppdateringer = [];

  valgtFeil = {
    overskrift: '',
    bilde: '',
    beskrivelse: '',
  };

  classNye = 'hoyde-tabell';
  classUnderB = 'hoyde-tabell';
  classFerdig = 'hoyde-tabell';

  state = {
    open: false,
  };

  handleOpen = (feil) => {
    this.valgtFeil = {...feil};
    this.opneFeil(feil);
    console.log(this.valgtFeil);
    this.setState({open: true});
    console.log(this.state);
  };

  async opneFeil(feil) {
    let res = await feilService.hentBilderTilFeil(feil.feil_id);
    this.bilderTilFeil = await res.data;
    console.log('Bilder: ' + this.bilderTilFeil);

    let res2 = await feilService.hentAlleOppdateringerPaaFeil(feil.feil_id);
    this.oppdateringer = await res2.data;
    await console.log(this.oppdateringer);
    await console.log('res2: ' + res2);
  }

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    return (
      <>
        <PageHeader history={this.props.history} location={this.props.location} />
        <div className="vinduansatt container-fluid">
            <AnsattMeny/>
            <div className="row justify-content-md-center mt-3 mb-3">
                <h1>Oversikt</h1>
            </div>
            <div className="ansattContent">
                <div className="row justify-content-md-center">
                    <div className="col-sm-4">
                        <Card color="red" fluid>
                            <Card.Content>
                            <Card.Header>
                                Nye innsendinger
                            </Card.Header>
                            </Card.Content>
                            <Card.Content className={this.classNye}>
                            {this.nyefeil.map((feil) => (
                                <FeedEvent
                                onClick={() => this.handleOpen(feil)}
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
                    <div className="col-sm-4">
                        <Card color="yellow fluid">
                            <Card.Content>
                                <Card.Header>
                                    Under behandling
                                </Card.Header>
                            </Card.Content>
                            <Card.Content className={this.classUnderB}>
                            {this.underBehandling.map((feil) => (
                                <FeedEvent
                                onClick={() => this.handleOpen(feil)}
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
                    <div className="col-sm-4">
                        <Card color="green" fluid>
                            <Card.Content>
                            <Card.Header>
                                Avsluttede saker
                            </Card.Header>
                            </Card.Content>

                            <Card.Content className={this.classFerdig}>
                            {this.utførte.map((feil) => (
                                <FeedEvent
                                onClick={() => this.handleOpen(feil)}
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
                </div>
            </div>
        </div>         
      </>
    );
  }

  scrollNye() {
    if (this.nyefeil.length > 4) {
      this.classNye = 'scroll-tabell';
    }
  }

  scrollUnderB() {
    if (this.underBehandling.length > 4) {
      this.classUnderB = 'scroll-tabell';
    }
  }

  scrollFerdig() {
    if (this.utførte.length > 4) {
      this.classFerdig = 'scroll-tabell';
    }
  }

  async mounted() {
    let feil = await feilService.hentAlleFeil();
    this.alleFeil = await feil.data;
    await console.log(this.alleFeil);

    this.nyefeil = await feil.data.filter((e) => e.status === 'Ikke godkjent');
    await this.scrollNye();
    await console.log(this.nyefeil);

    this.underBehandling = await feil.data.filter((e) => e.status === 'Under behandling');
    await this.scrollUnderB();
    await console.log(this.underBehandling);

    this.utførte = await feil.data.filter((e) => e.status === 'Ferdig');
    await this.scrollFerdig();
    await console.log(this.utførte);
  }
}

/*<Grid columns={3} divided fluid>
                                <Grid.Row> 
                                    <Grid.Column>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam porttitor quam eget enim pharetra faucibus. Nam porttitor commodo justo et congue. Aliquam metus ipsum, sodales in molestie nec, porttitor ac justo. Nullam lobortis vel ex at molestie. Duis ultrices at libero commodo consequat. Donec in tellus quis sem imperdiet dignissim. Nunc libero metus, volutpat id facilisis auctor, consequat eu mi. Fusce mauris nunc, blandit et nulla a, tempor venenatis est. Etiam euismod diam id quam laoreet, id elementum nisi elementum.</p>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <ShowMarkerMap width="100%" height="300px" id="posmap" feil={this.valgtFeil} markers={markerTabell(this.alleFeil)}/>
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
                                            {this.oppdateringer.map(oppdatering => (
                                                <List.Item>
                                                    <List.Content>
                                                        <List.Header>{oppdatering.kommentar}</List.Header>
                                                        <List.Description>{oppdatering.tid}</List.Description>
                                                    </List.Content>
                                                </List.Item>
                                            ))}
                                        </List>
                                        <Image.Group size='tiny'>
                                            <Image src="lofoten.jpg" />
                                            <Image src="lofoten.jpg" />
                                            <Image src="lofoten.jpg" />
                                            <Image src="lofoten.jpg" />
                                            <Image src="lofoten.jpg" />
                                            <Image src="lofoten.jpg" />
                                        </Image.Group>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>*/
