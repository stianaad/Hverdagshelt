import * as React from 'react';
import {Component} from 'react-simplified';
import {PageHeader} from '../../Moduler/header/header';
import {Menu, Card, Feed, Grid, Button, Header, Icon, Input, Image, Modal, List, CardContent, GridColumn} from 'semantic-ui-react';
import {FeedEvent, Filtrer, Info} from '../../Moduler/cardfeed'
import {feilService} from '../../services/feilService';
import {markerTabell,ShowMarkerMap } from '../../Moduler/kart/map';
import {NavLink} from 'react-router-dom';

export class AnsattSide extends Component{
    render(){
        return(
            <div>
                <PageHeader history={this.props.history} location={this.props.location}/>
                <Grid>
                    <Grid.Column width="3">
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
                        <NyeFeil/>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export class NyeFeil extends Component{
    nyefeil = [];
    alleFeil = [];
    className = '';
    valgtfeil = {
        overskrift: "",
        beskrivelse: ""
    }

    visFeil(feil){
        this.valgtfeil = {...feil};
        console.log("Feil kopieres: " + this.valgtfeil);
    }

    render(){
        return(
            <div>
                <Grid>
                    <Grid.Row columns={3}>
                        <Grid.Column/>
                        <Grid.Column>
                            <h1 className="mt-3">Nye feil</h1>
                        </Grid.Column>
                        <Grid.Column/>
                    </Grid.Row>
                    <Grid.Column width="4">
                        <div>
                            <Card color="red" fluid>
                                <Card.Content>
                                    <Card.Header>   
                                        Nye innsendinger
                                        <Filtrer/>
                                    </Card.Header>
                                </Card.Content>
                                <Card.Content className={this.className}>
                                    {this.nyefeil.map(feil => (
                                        <FeedEvent
                                            onClick={() => this.visFeil(feil)}
                                            status ={feil.status}
                                            tid={feil.tid}
                                            kategori ={feil.kategorinavn}>
                                            {feil.overskrift}>
                                        </FeedEvent>
                                    ))} 
                                </Card.Content>
                            </Card>
                        </div>
                    </Grid.Column>
                    <Grid.Column width="11">
                        <Card fluid>
                            <Card.Content>
                                <div>
                                    <Grid fluid columns={3} verticalAlign="middle">
                                            <Grid.Column>
                                                <h1>{this.valgtfeil.overskrift}</h1>
                                            </Grid.Column>
                                            <Grid.Column/>
                                            <Grid.Column textAlign="right" fluid>
                                                <h6>{this.valgtfeil.tid}</h6>
                                            </Grid.Column>
                                    </Grid>
                                </div>
                            </Card.Content>
                            <Card.Content extra>
                                <div>
                                    heihei
                                </div>
                            </Card.Content>
                        </Card>                    
                    </Grid.Column>
                </Grid>
            </div>
        );
    }

    scroll(){
        if(this.nyefeil.length > 5){
            this.className = 'ansattScroll';
        }
    }

    async mounted(){
        let feil = await feilService.hentAlleFeil(); 
        this.alleFeil = await feil.data; 

        this.nyefeil = await feil.data.filter(e => (e.status === 'Ikke godkjent'));
        this.valgtfeil = await {...this.nyefeil[0]};

        await this.scroll();
    }
}