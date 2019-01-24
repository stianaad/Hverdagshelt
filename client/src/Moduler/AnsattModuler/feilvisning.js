import * as React from 'react';
import {Component} from 'react-simplified';
import {Card, Feed, Grid, Button, Header, Icon, Input, Image, Modal, List, CardContent} from 'semantic-ui-react';
import { ShowMarkerMap } from '../kart/map';
import { feilService } from '../../services/feilService';


export class FeilVisning extends Component {
    statuser = [];
    bilderTilFeil = [];
    valgtStatus = {
        status_id: '',
        status: this.props.feil.status
    }
    kommentar = '';

    handterStatuser(status){
        console.log(status);
        let stat = this.statuser.find(e => (e.status === status));
        console.log(stat);
        this.valgtStatus = {...stat};
        console.log(this.valgtStatus);
    }

    render(){
        return(
            <div>
                <Card fluid>
                    <Card.Content>
                        <Grid columns={2}>
                            <Grid.Column><h1>{this.props.feil.overskrift}</h1></Grid.Column>
                            <Grid.Column textAlign="right">{this.props.feil.tid}</Grid.Column>
                            <Grid.Column>Status: {this.props.feil.status}</Grid.Column>
                            <Grid.Column><Button floated="right" color="red">Slett</Button></Grid.Column>
                        </Grid>
                    </Card.Content>
                    <Card.Content extra>
                        <Grid fluid columns={3}>
                            <Grid.Column>
                                <h5>Beskrivelse</h5>
                                <p  style={{overflowY: 'auto', maxHeight: '100px'}}>{this.props.feil.beskrivelse}</p>
                                <h5>Posisjon:</h5>
                                <ShowMarkerMap key={this.props.feil.feil_id} width="100%" height="50%" id="posmap" feil={this.props.feil}/>
                            </Grid.Column>
                            <Grid.Column>
                                <h5>Kategori: </h5>
                                <p>{this.props.feil.kategorinavn}</p>
                                <h5>Bilder:</h5>
                                <div className="feilModalFyll" style={{height: '80px'}}>
                                    {this.props.bilder.map((bilde) => (
                                    <div className="feilModalBilde" key={bilde.bilde_id} onClick={() => this.visBilde(bilde.url)}>
                                        <img src={bilde.url} key={bilde.bilde_id} className="bilder" onClick={() => { this.bildeModal = bilde.url; this.bildeOpen = true; }} />
                                    </div>
                                    ))}
                                </div>
                            </Grid.Column>
                            <Grid.Column>
                                <h5>Oppdateringer</h5>
                                <List style={{overflowY: 'auto', maxHeight: '50px'}}>
                                    {this.props.opp.map((oppdatering) => (
                                        <List.Item>
                                            <List.Content>
                                                <List.Header>{oppdatering.status}<span className="float-right font-weight-light font-italic">{oppdatering.tid}</span></List.Header>
                                                <List.Description>{oppdatering.kommentar}</List.Description>
                                            </List.Content>
                                        </List.Item>
                                    ))}
                                </List>
                                <h5>Oppdater: </h5>
                                <div className="form-group">
                                    
                                    <input type="text" className="form-control" placeholder="Kommentar..."
                                        onChange={(e) => (this.kommentar = e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Status: </label>
                                    <select
                                        className="form-control"
                                        onChange={(e) => this.handterStatuser(e.target.value)}
                                        >
                                        <option hidden>{this.valgtStatus.status}</option>
                                        {this.statuser.map((status) => (
                                            <option value={status.status} key={status.status}>
                                            {' '}
                                            {status.status}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <Button basic color="green" onClick={this.oppdatering}>Oppdater</Button>
                            </Grid.Column>
                        </Grid> 
                    </Card.Content>
                </Card>
            </div>
        ); 
    }
    async oppdatering(){
        console.log("Starter oppdatering");
        await feilService.lagOppdatering({
            "feil_id": this.props.feil.feil_id,
            "kommentar": this.kommentar, 
            "status_id": this.valgtStatus.status_id
        });

        await this.props.oppdater;  
        console.log("Oppdatering sendt");
    }
    async mounted(){
        let res = await feilService.hentAlleStatuser();
        this.statuser = await res.data; 
    }
}
