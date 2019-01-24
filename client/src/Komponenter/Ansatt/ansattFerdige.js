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
                <PageHeader history={this.props.history} location={this.props.location} />
                <div className="container-fluid vinduansatt">
                {global.payload.role == 'ansatt' ? <AnsattMeny/> : (global.payload.role == 'admin' && this.kommune) ? <AdminMeny kommune={this.kommune}/> : null}
                    <div className="row justify-content-md-center mt-3 mb-3">
                        <h1>Fullførte feil</h1>
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
                                        {this.fullforteFeil.map((feil) => (
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
                                    <div className="ansattFeilVindu">
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
                            </div>
                        </div>
                    </div>
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
        const load = async (kommune_id) => {
            let feil = await feilService.hentFeilForKommune(kommune_id);
            this.alleFeil = await feil.data;
        
            this.fullforteFeil = await feil.data.filter(e => (e.status === 'Ferdig'));
            
            await this.scroll();
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