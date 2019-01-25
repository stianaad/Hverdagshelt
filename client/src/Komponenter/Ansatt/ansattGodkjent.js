import * as React from 'react';
import {Component} from 'react-simplified';
import {PageHeader} from '../../Moduler/header/header';
import {Card, Feed, Grid, Button, Header, Icon, Input, Image, Modal, List, CardContent} from 'semantic-ui-react';
import {FeedEvent, Filtrer, Info} from '../../Moduler/cardfeed';
import {feilService} from '../../services/feilService';
import {markerTabell, ShowMarkerMap} from '../../Moduler/kart/map';
import {NavLink} from 'react-router-dom';
import {AnsattMeny} from './ansattMeny';
import { brukerService } from '../../services/brukerService';

export class AnsattGodkjent extends Component{
    godkjente = [];
    alleFeil = [];
    className = '';
    valgtfeil = {
        overskrift: '',
        beskrivelse: ''
    };
    kommentar = '';

    valgtStatus = {
        status_id: '',
        status: ''
    }

    valgtBedrift = {
        bruker_id: '',
        orgnr: '',
        navn: '',
        tlf: ''
    }

    feilApen = false; 

    statuser = [];

    alleBedrifter = [];

    sendtTilBedrift = false; 

    visFeil(feil){
        this.feilApen = true;
        this.valgtfeil = feil; 
    }

    handterStatuser(status){
        let res = this.statuser.find(e => (e.status === status));
        this.valgtStatus = res; 
        console.log(this.valgtStatus);
    }

    handterBedrift(bed){
        let res = this.alleBedrifter.find(e => (e.navn === bed));
        this.valgtBedrift = res;
        console.log(this.valgtBedrift);
    }

    render(){
        return(
            <div>
                <PageHeader history={this.props.history} location={this.props.location} />
                <div className="container-fluid vinduansatt">
                    <AnsattMeny/>
                    <div className="row justify-content-md-center mt-3 mb-3">
                        <h1>Godkjente feil</h1>
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
                                        {this.godkjente.map((feil) => (
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
                                                <h3>{this.valgtfeil.overskrift}</h3>
                                            </Card.Content>
                                            <Card.Content extra>
                                                <div>
                                                    <Grid columns={3} fluid stackable divided>
                                                        <Grid.Column>
                                                            <div>
                                                                <h5>Beskrivelse: </h5>
                                                                <p className="feilModalBeskrivelse" style={{maxHeight: '100px'}}>{this.valgtfeil.beskrivelse}</p>
                                                                <h5>Posisjon: </h5>
                                                                <ShowMarkerMap key={this.valgtfeil.feil_id} width="100%" height="50%" id="posmap" feil={this.valgtfeil} />
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
                                                                    <option hidden>{this.valgtfeil.status}</option>
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
                                                        <Grid.Column>
                                                            {(!this.sendtTilBedrift ? (
                                                                <div>
                                                                    <h5>Send til bedrift: </h5>
                                                                    <div className="form-group">
                                                                        <select
                                                                            className="form-control"
                                                                            onChange={(e) => this.handterBedrift(e.target.value)}
                                                                            >
                                                                            <option hidden>Velg bedrift</option>
                                                                            {this.alleBedrifter.map((bed) => (
                                                                                <option value={bed.navn} key={bed.navn}
                                                                                >
                                                                                {' '}
                                                                                {bed.navn}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    <Button basic color="blue" onClick={this.sendTilBed}>Send</Button>
                                                                </div>
                                                            ):(
                                                                <p>Sendt</p>
                                                            ))}
                                                            
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

    async oppdatering(){
        await feilService.lagOppdatering({
            "feil_id": this.valgtfeil.feil_id,
            "kommentar": this.kommentar, 
            "status_id": this.valgtStatus.status_id
        });

        await this.mounted(); 
        this.feilApen = await false;
    }

    async sendTilBed(){
        console.log("orgnr: " + this.valgtBedrift.orgnr + ", id: " + this.valgtfeil.feil_id);
        await feilService.sendFeilTilBedrift({
            orgnr: this.valgtBedrift.orgnr,
            feil_id: this.valgtfeil.feil_id
        });

        this.sendtTilBedrift = await true; 
    }

    scroll() {
        if (this.godkjente.length > 5) {
          this.className = 'ansattScroll';
        }
      }
    
      async mounted() {
        let feil = await feilService.hentFeilForKommune(global.payload.user.kommune_id);
        this.alleFeil = await feil.data;
    
        this.godkjente = await feil.data.filter(e => (e.status === 'Godkjent'));
        
        await this.scroll();

        let status = await feilService.hentAlleStatuser();
        this.statuser = await status.data; 

        let bed = await brukerService.hentBedrifter();
        this.alleBedrifter = await bed.data; 
      }
    
}