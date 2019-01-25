import * as React from 'react';
import {Component} from 'react-simplified';
import {PageHeader} from '../../Moduler/header/header';
import {Card, Feed, Grid, Button, Header, Icon, Input, Image, Modal, List, CardContent} from 'semantic-ui-react';
import {FeedEvent, Filtrer, Info} from '../../Moduler/cardfeed';
import {feilService} from '../../services/feilService';
import {generellServices} from '../../services/generellServices';
import {markerTabell, ShowMarkerMap} from '../../Moduler/kart/map';
import {NavLink} from 'react-router-dom';
import {AnsattMeny} from './ansattMeny';
import {AdminMeny} from '../Admin/adminMeny';
import {InfoBoks} from '../../Moduler/info/info';
import {FeilModal} from '../../Moduler/modaler/feilmodal';

export class AnsattOversikt extends Component {
  nyefeil = [];
  godkjente = [];
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

  feilModal = false; 

  classNye = 'hoyde-tabell';
  classGodkjent = 'hoyde-tabell';
  classUnderB = 'hoyde-tabell';
  classFerdig = 'hoyde-tabell';

  openModal(feil){
    this.valgtFeil = {...feil};
    this.feilModal = true; 
  }
  
  render() {
    return (
      <React.Fragment>
        <PageHeader history={this.props.history} location={this.props.location} />
        <FeilModal key={this.valgtFeil.feil_id+this.feilModal} open={this.feilModal} feil={this.valgtFeil} onClose={() => {this.feilModal = false}} />
        <div className="vinduansatt container-fluid">
            {global.payload.role == 'ansatt' ? <AnsattMeny/> : (global.payload.role == 'admin') ? <AdminMeny kommune={this.kommune}/> : null}
            <div className="row justify-content-md-center mt-3 mb-3">
                <h1>Oversikt</h1>
            </div>
            <div className="ansattContent">
                <div className="row justify-content-md-center">
                    <div className="col-sm-4">
                        <Card fluid>
                            <Card.Content>
                            <Card.Header>
                                <h3 style={{display: 'inline'}}>Nye innsendinger</h3>
                                <InfoBoks style={{display: 'inline'}} 
                                tekst="Trykk på en feil for mer informasjon om den.&#10;Velg Nye Feil i menyen for å gjøre endringer på feilene"/>
                            </Card.Header>
                            </Card.Content>
                            <Card.Content className={this.classNye}>
                            {this.nyefeil.map((feil) => (
                                <FeedEvent
                                onClick={() => this.openModal(feil)}
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
                        <Card fluid>
                            <Card.Content>
                            <Card.Header>
                                <h3 style={{display: 'inline'}}>Godkjente feil</h3>
                                <InfoBoks style={{display: 'inline'}} 
                                tekst="Trykk på en feil for mer informasjon om den.&#10;Velg 'Godkjent' i menyen for å endre status eller sende til bedrift"/>
                            </Card.Header>
                            </Card.Content>
                            <Card.Content className={this.classNye}>
                            {this.godkjente.map((feil) => (
                                <FeedEvent
                                onClick={() => this.openModal(feil)}
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
                <div className="row justify-content-md-center mt-5">
                    <div className="col-sm-4">
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>
                                    <h3 style={{display: 'inline'}}>Under behandling</h3>
                                    <InfoBoks style={{display: 'inline'}} 
                                    tekst="Trykk på en feil for mer informasjon om den.&#10;Velg 'Under Behandling' i menyen for å endre statuser"/>
                                </Card.Header>
                            </Card.Content>
                            <Card.Content className={this.classUnderB}>
                            {this.underBehandling.map((feil) => (
                                <FeedEvent
                                onClick={() => this.openModal(feil)}
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
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>
                                    <h3 style={{display: 'inline'}}>Avsluttede saker</h3>
                                    <InfoBoks style={{display: 'inline'}} 
                                        tekst="Trykk på en feil for mer informasjon om den.&#10;Velg 'Under Behandling' i menyen for å endre statuser"/>
                                </Card.Header>
                            </Card.Content>

                            <Card.Content className={this.classFerdig}>
                            {this.utførte.map((feil) => (
                                <FeedEvent
                                onClick={() => this.openModal(feil)}
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
      </React.Fragment>
    );
  }

  scrollNye() {
    if (this.nyefeil.length > 4) {
      this.classNye = 'scroll-tabell';
    }
  }

  scrollGodkjent(){
      if(this.godkjente.length > 4){
          this.classGodkjent = 'scroll-tabell';
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

    const load = async (kommune_id) => {
        let feil = await feilService.hentFeilForKommune(kommune_id);
        this.alleFeil = await feil.data;
        await console.log(this.alleFeil);

        this.nyefeil = await feil.data.filter((e) => e.status === 'Ikke godkjent');
        await this.scrollNye();
        await console.log(this.nyefeil);

        this.godkjente = await feil.data.filter((e) => e.status === 'Godkjent');
        await this.scrollGodkjent();

        this.underBehandling = await feil.data.filter((e) => e.status === 'Under behandling');
        await this.scrollUnderB();
        await console.log(this.underBehandling);

        this.utførte = await feil.data.filter((e) => e.status === 'Ferdig');
        await this.scrollFerdig();
        await console.log(this.utførte);
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
