import * as React from 'react';
import {Component} from 'react-simplified';
import {PageHeader} from '../../Moduler/header/header';
import {Card, Feed, Grid, Button, Header, Icon, Input, Image, Modal, List, CardContent} from 'semantic-ui-react';
import {FeedEvent, Filtrer, Info} from '../../Moduler/cardfeed';
import {feilService} from '../../services/feilService';
import {markerTabell, ShowMarkerMap} from '../../Moduler/kart/map';
import {NavLink} from 'react-router-dom';
import {AnsattMeny} from './kommuneansatt';

export class AnsattFerdig extends Component{
    fullforteFeil = [];
    alleFeil = [];
    className = '';
    valgtfeil = {
        overskrift: '',
        beskrivelse: ''
    };

    render(){
        return(
            <div>
                <PageHeader/>
                <div className="vinduansatt">
                    <Grid>
                        <Grid.Column width="3">
                            <AnsattMeny/>
                        </Grid.Column>
                        <Grid.Column width="14">
                            <Grid stackable>
                                <Grid.Row textAlign="center" centered>
                                    <h1 className="mt-3">Ferdige feil</h1>
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
                                            {this.fullforteFeil.map((feil) => (
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

    scroll() {
        if (this.fullforteFeil.length > 5) {
          this.className = 'ansattScroll';
        }
      }
    
      async mounted() {
        let feil = await feilService.hentAlleFeil();
        this.alleFeil = await feil.data;
    
        this.fullforteFeil = await feil.data.filter(e => (e.status === 'Ferdig'));
        
        await this.scroll();
      }
    
}