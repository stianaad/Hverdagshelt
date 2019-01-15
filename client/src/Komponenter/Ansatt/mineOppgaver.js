import * as React from 'react';
import {Component} from 'react-simplified';
import {Card, Feed, Grid, Button, Header, Icon, Image, Modal, Segment, List} from 'semantic-ui-react';
import {FeedEvent, Filtrer, Info} from '../../Moduler/cardfeed'
import {feilService} from '../../services/feilService';
import {markerTabell,ShowMarkerMap } from '../../Moduler/kart/map';

export class MineOppgaver extends Component{
    nyefeil = []; 
    utførte = []; 
    underBehandling = []; 
    alleFeil = [];
    bilderTilFeil = []; 
    oppdateringer = []; 

    valgtFeil = {
        overskrift: "",
        bilde: "",
        beskrivelse: ""
    }; 

    state = {
        open: false
    }
    

    handleOpen = (feil) => {
        this.valgtFeil = {...feil};
        this.opneFeil(feil);
        console.log(this.valgtFeil);
        this.setState({ open: true })
        console.log(this.state);
    }

    async opneFeil(feil){
        let res = await feilService.hentBilderTilFeil(feil.feil_id);
        this.bilderTilFeil = await res.data; 
        console.log("Bilder: " + this.bilderTilFeil);

        let res2 = await feilService.hentAlleOppdateringerPaaFeil(feil.feil_id);
        this.oppdateringer = await res2.data; 
        await console.log(this.oppdateringer);
        await console.log("res2: " + res2);
    }

    handleClose = () => {
        this.setState({ open: false }) 
    } 


    render(){
        return(
            <div className="container">
                <Modal open={this.state.open} onClose={this.handleClose} size="small" centered={true}>
                    <Modal.Header>{this.valgtFeil.overskrift}</Modal.Header>
                    <Modal.Content>
                        <div>
                            <Grid columns={3} divided>
                                <Grid.Row stretched> 
                                    <Grid.Column>
                                        <p>{this.valgtFeil.beskrivelse}</p>
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
                                        <Segment>Bilder</Segment>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>
                    </Modal.Content>
                </Modal>
                <h1>
                    Mine oppgaver
                </h1>
                <div>
                    <div className="row mt-5">
                        <div className="col-sm-4"> 
                            <div className="m1-3">
                                <Card color="red" fluid="true">
                                    <Card.Content>
                                        <Card.Header>   
                                            Nye innsendinger
                                            <Filtrer/>
                                        </Card.Header>
                                    </Card.Content>
                                    <Card.Content>
                                        {this.nyefeil.map(feil => (
                                            <FeedEvent onClick={() => this.handleOpen(feil)}
                                                status ={feil.status}
                                                tid={feil.tid}
                                                kategori ={feil.kategorinavn}>
                                                {feil.overskrift}
                                            </FeedEvent>
                                        ))} 
                                    </Card.Content>
                                </Card>
                            </div>
                        </div>
                        <div className="col-sm-4"> 
                            <div className="m1-3">
                                <Card color='yellow' fluid="true">
                                    <Card.Content>
                                        <Card.Header>
                                            Under behandling
                                            <Filtrer/>
                                        </Card.Header>
                                    </Card.Content>
                                    <Card.Content>
                                        {this.underBehandling.map(feil => (
                                            <FeedEvent onClick={() => this.handleOpen(feil)}
                                                status ={feil.status}
                                                tid={feil.tid}
                                                kategori ={feil.kategorinavn}>
                                                {feil.overskrift}
                                            </FeedEvent>
                                        ))}
                                    </Card.Content>
                                </Card>
                            </div>
                        </div>
                        <div className="col-sm-4"> 
                            <div className="m1-3">
                                <Card color="green" fluid="true">
                                    <Card.Content>
                                        <Card.Header>
                                            Avsluttede saker
                                            <Filtrer/>
                                        </Card.Header>
                                    </Card.Content>

                                    <Card.Content>
                                        {this.utførte.map(feil => (
                                                <FeedEvent onClick={() => this.handleOpen(feil)}
                                                    status ={feil.status}
                                                    tid={feil.tid}
                                                    kategori ={feil.kategorinavn}>
                                                    {feil.overskrift}
                                                </FeedEvent>
                                            ))}
                                    </Card.Content>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    async mounted(){
        let feil = await feilService.hentAlleFeil();
        this.alleFeil = await feil.data; 
        await console.log(this.alleFeil);
        this.nyefeil = await feil.data.filter(e => (e.status === 'Ikke godkjent'));
        await console.log(this.nyefeil);
        this.underBehandling = await feil.data.filter(e => (e.status === 'Under behandling'));
        await console.log(this.underBehandling);
        this.utførte = await feil.data.filter(e => (e.status === 'Ferdig')); 
        await console.log(this.utførte); 
    }
}