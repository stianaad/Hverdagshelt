import * as React from 'react';
import {Component} from 'react-simplified';
import {PageHeader} from '../../Moduler/header/header';
import {Card, Feed, Grid, Button, Header, Icon, Input, Image, Modal, List, CardContent, Popup} from 'semantic-ui-react';
import {FeedEvent, Filtrer, Info} from '../../Moduler/cardfeed';
import {feilService} from '../../services/feilService';
import {generellServices} from '../../services/generellServices';
import {markerTabell, ShowMarkerMap} from '../../Moduler/kart/map';
import {NavLink} from 'react-router-dom';
import {AnsattMeny} from './ansattMeny';
import {AdminMeny} from '../Admin/adminMeny';
import { brukerService } from '../../services/brukerService';
import { InfoBoks } from '../../Moduler/info/info';
import { RedigerModal } from '../../Moduler/AnsattModuler/redigerModal';

export class AnsattGodkjent extends Component{
    godkjente = [];
    alleFeil = [];
    valgtfeil = {
        feil_id: '',
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
    redigerModal = false; 

    visFeil(feil){
        this.feilApen = true;
        this.valgtfeil = {...feil};
        this.hosBedrift(feil);
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

    async hosBedrift(feil){
        let res = await feilService.hentJobbSoknadStatus(feil.feil_id);
        let svar =  await res.data; 

        let venter = await svar.find(e => (e.status === 3));
        await this.erDenSendt(venter);

    }

    erDenSendt(tabell){
        if(tabell === undefined){
            this.sendtTilBedrift = false; 
        }

        else{
            this.valgtBedrift = this.alleBedrifter.find(e => e.bruker_id === tabell.bruker_id);
            this.sendtTilBedrift  = true; 
        }
    }
    
    render(){
        return(
            <div>
                <PageHeader history={this.props.history} location={this.props.location} />
                <RedigerModal key={this.valgtfeil.feil_id+this.redigerModal} open={this.redigerModal} lukk={this.refresh} feil={this.valgtfeil} onClose={() => {this.redigerModal = false}} />
                <div className="container-fluid vinduansatt">
                {global.payload.role == 'ansatt' ? <AnsattMeny/> : (global.payload.role == 'admin') ? <AdminMeny kommune={this.kommune}/> : null}
                    
                    <div className="ansattContent">
                        <div className="row justify-content-md-center mt-3 mb-3">
                            <h1>Godkjente feil</h1>
                        </div>
                        <div className="row">
                            <div className="col-sm-4">
                                <Card color="red" fluid>
                                    <Card.Content>
                                        <Card.Header>
                                            Godkjente feil
                                        </Card.Header>
                                    </Card.Content>
                                    <Card.Content className="hoydeTabell">
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
                                                <h3 style={{display: 'inline'}}>{this.valgtfeil.overskrift}</h3>
                                                <InfoBoks style={{display: 'inline'}} 
                                                    tekst="Her ser du informasjon om alle feil som alt er godkjent og gjort offentlig&#10;Du kan endre statusen på feil, da vil de bli flyttet til den kategorien du velger (du finner alle i menyen)&#10;Du kan sende en feil til en bedrift ved å velge en bedrift fra nedtreksmenyen og trykke send"/>
                                                <div style={{textAlign: 'right'}}>
                                                    <Popup trigger={<Button color="red" onClick={() => {this.slett();}} className="float-rigth">Slett</Button>} content="Hvis du trykker her så sletter du feilen"/>
                                                    <Popup trigger={<Button color="blue" onClick={() => {this.redigerModal = true}}>Rediger</Button>} content="Trykk her for å redigere feilen"/>
                                                </div>
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
                                                                <div>
                                                                    <p>Feilen er sendt videre til: {this.valgtBedrift.navn}</p>
                                                                    <p>Hvis bedriften godtar oppdraget vil feilen bli flyttet til 'Under Behandling'</p>
                                                                    <p>Dersom bedriften ikke godtar oppdraget vil du kunne sende til en ny bedrift</p>
                                                                </div>
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

    refresh(){
        this.feilApen = false;
        this.mounted();
        console.log(this.feilApen);
    }

    async slett(){
        this.feilApen=false;
        let res = await feilService.slettFeil(this.valgtfeil.feil_id);
        Promise.resolve(res.data).then(this.mounted);
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

    async mounted() {

        const load = async (kommune_id) => {
            let feil = await feilService.hentFeilForKommune(kommune_id);
            this.alleFeil = await feil.data;
        
            this.godkjente = await feil.data.filter(e => (e.status === 'Godkjent'));
            
            let status = await feilService.hentAlleStatuser();
            this.statuser = await status.data; 

            let bed = await brukerService.hentBedrifter();
            this.alleBedrifter = await bed.data; 
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