import * as React from 'react';
import {Component} from 'react-simplified';
import {PageHeader} from '../../Moduler/header/header';
import {Card, Feed, Grid, Button, Header, Icon, Input, Image, Modal, List, CardContent} from 'semantic-ui-react';
import {FeedEvent, Filtrer, Info} from '../../Moduler/cardfeed';
import {feilService} from '../../services/feilService';
import { hendelseService } from '../../services/hendelseService';
import {markerTabell, ShowMarkerMap} from '../../Moduler/kart/map';
import {NavLink} from 'react-router-dom';
import {AnsattMeny} from './ansattMeny';

export class AnsattHendelser extends Component{
    hendelser = [];
    valgtHendelse = ""; 

    render(){
        return(
            <div>
                <PageHeader history={this.props.history} location={this.props.location}/>
                <div className="container-fluid vinduansatt">
                    <AnsattMeny/>
                    <div className="row mt-3 mb-3 justify-content-md-center">
                        <h1 >Hendelser</h1>
                    </div>
                    <div className="ansattHendelser">
                        <Grid stackable columns={3}>
                            {this.hendelser.map(hendelse => (
                                <Grid.Column>
                                    <Card className="h-100" fluid>
                                        <Image src={hendelse.bilde} className="hendelseBilde"/>
                                        <Card.Content>
                                            <Card.Header>{hendelse.overskrift}</Card.Header>
                                            <Card.Meta>
                                                <div className="row justify-content-md-center">
                                                    <span className="date">{hendelse.tid}</span>
                                                    <span className="date float-rigth">{hendelse.sted}</span>
                                                </div>
                                            </Card.Meta>
                                            <Card.Description>{hendelse.beskrivelse}</Card.Description>
                                        </Card.Content>
                                        <Card.Content extra>
                                            <Button color="green">Endre</Button>
                                        </Card.Content>
                                    </Card>
                                </Grid.Column>
                            ))}
                        </Grid>
                    </div>
                </div>
            </div>
        );
    }

    async mounted(){
        let res = await hendelseService.hentAlleHendelser(); 
        this.hendelser = await res.data; 
        await console.log(this.hendelser);
    }
}