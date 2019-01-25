import * as React from 'react';
import {Component} from 'react-simplified';
import {Card, Feed, Grid, Button, Header, Icon, Input, Image, Modal, List, Popup} from 'semantic-ui-react';
import { ShowMarkerMap } from '../kart/map';
import { feilService } from '../../services/feilService';
import { RedigerModal } from './redigerModal';


export class FeilVisning extends Component {
    statuser = [];
    bilderTilFeil = [];
    visOppdater = true;
    valgtStatus = {
        status_id: '',
        status: this.props.feil.status
    }
    kommentar = '';
    valgtBilde = "";
    bildeApen = false; 
    redigerModal = false; 
    valgtfeil = ''

    handterStatuser(status){
        let stat = this.statuser.find(e => (e.status === status));
        this.valgtStatus = {...stat};
    }

    visBilde(){
        this.valgtBilde = this.props.bilder[0].url; 
        this.visBilde = true; 
    }

    openRedigering(){
        this.redigerModal = true; 
        this.valgtfeil = {...this.props.feil};
    }

    render(){
        return(
            <div>
                <RedigerModal key={this.valgtfeil.feil_id+this.redigerModal} open={this.redigerModal} lukk={this.refresh} feil={this.valgtfeil} onClose={() => {this.redigerModal = false}} />
                <Card fluid>
                    <Card.Content>
                        <Grid columns={2}>
                            <Grid.Column><h1>{this.props.feil.overskrift}</h1></Grid.Column>
                            <Grid.Column textAlign="right">{this.props.feil.tid}</Grid.Column>
                            <Grid.Column>Status: {this.props.feil.status}</Grid.Column>
                            <Grid.Column>
                                <div style={{textAlign: 'right'}}>
                                    <Popup trigger={<Button color="red" className="float-rigth">Slett</Button>} content="Hvis du trykker her så sletter du feilen"/>   
                                    <Popup trigger={<Button color="blue" onClick={() => {this.openRedigering();}}>Rediger</Button>} content="Trykk her for å redigere feilen"/>
                                </div>
                            </Grid.Column>
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
                                    <div className="feilModalBilde" key={bilde.bilde_id}>
                                        <img src={bilde.url} key={bilde.bilde_id} className="bilder" onClick={() => this.visBilde} />
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
                                        onChange={(e) => {this.kommentar = e.target.value;
                                        if(this.kommentar.length > 0 ){
                                            this.visOppdater = false;
                                        } else {
                                            this.visOppdater = true;
                                        }
                                        }}
                                    />
                                </div>
                                {(this.props.visStatus) ? (null) : ( <div className="form-group">
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
                                </div>)}
                                <Button basic color="green" disabled={this.visOppdater} onClick={() => {this.oppdatering();}}>Oppdater</Button>
                            </Grid.Column>
                        </Grid> 
                    </Card.Content>
                </Card>
                <Modal open={this.bildeApen} onClose={() => { this.bildeOpen = false; }} basic centered className="modalwidth">
                    <Modal.Content>
                        <img src={this.valgtBilde} className="bildevisning" />
                    </Modal.Content>
                </Modal>
            </div>
        ); 
    }

    refresh(){
        this.feilApen = false;
        this.mounted();
        console.log(this.feilApen);
        this.props.lukk(this.valgtStatus.status_id);
    }

    async oppdatering(){
        await feilService.lagOppdatering({
            "feil_id": this.props.feil.feil_id,
            "kommentar": this.kommentar, 
            "status_id": this.valgtStatus.status_id
        });
        this.props.lukk(this.valgtStatus.status_id);
    }
    async mounted(){
        let res = await feilService.hentAlleStatuser();
        let alle = await res.data; 
        this.statuser = await alle.filter(e => e.status_id !== 1);
        this.valgtStatus = this.statuser.find(e => e.status === this.props.feil.status);
    }
}
