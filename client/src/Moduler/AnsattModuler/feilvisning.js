import * as React from 'react';
import {Component} from 'react-simplified';
import {Card, Feed, Grid, Button, Header, Icon, Input, Image, Modal, List, CardContent} from 'semantic-ui-react';
import { ShowMarkerMap } from '../kart/map';
import { feilService } from '../../services/feilService';


export class FeilVisning extends Component {
    statuser = [];
    bilderTilFeil = [];

    render(){
        return(
            <div>
                <Card fluid>
                    <Card.Content>
                        <Grid columns={3}>
                            <Grid.Column><h1>{this.props.feil.overskrift}</h1></Grid.Column>
                            <Grid.Column/>
                            <Grid.Column textAlign="right">{this.props.feil.tid}</Grid.Column>
                            <Grid.Column>Status: {this.props.feil.status}</Grid.Column>
                        </Grid>
                    </Card.Content>
                    <Card.Content extra>
                        <Grid fluid columns={3}>
                            <Grid.Column>
                                <h6>Beskrivelse</h6>
                                <p className="feilModalBeskrivelse" style={{maxHeight: '100px'}}>{this.props.feil.beskrivelse}</p>
                            </Grid.Column>
                            <Grid.Column>
                                <ShowMarkerMap key={this.props.feil.feil_id} width="100%" height="50%" id="posmap" feil={this.props.feil} />
                                <h6>Bilder:</h6>
                                <div className="feilModalFyll">
                                    {this.props.bilder.map((bilde) => (
                                    <div className="feilModalBilde" key={bilde.bilde_id} onClick={() => this.visBilde(bilde.url)}>
                                        <img src={bilde.url} key={bilde.bilde_id} className="bilder" onClick={() => { this.bildeModal = bilde.url; this.bildeOpen = true; }} />
                                    </div>
                                    ))}
                                </div>
                            </Grid.Column>
                            <Grid.Column>
                                <h5>Oppdater: </h5>
                                <div className="form-group">
                                    <label>Kommentar: </label>
                                    <input type="text" className="form-control"
                                        onChange={(e) => (this.kommentar = e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Status: </label>
                                    <select
                                        className="form-control"
                                        onChange={(e) => this.handterStatuser(e.target.value)}
                                        >
                                        <option hidden>{this.props.feil.status}</option>
                                        {this.statuser.map((status) => (
                                            <option value={status.status} key={status.status}>
                                            {' '}
                                            {status.status}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <Button basic color="green" onClick={this.oppdatering}>Lagre</Button>
                            </Grid.Column>
                        </Grid> 
                    </Card.Content>
                </Card>
            </div>
        ); 
    }

    async mounted(){
        let res = await feilService.hentAlleStatuser();
        this.statuser = await res.data; 
    }
}
