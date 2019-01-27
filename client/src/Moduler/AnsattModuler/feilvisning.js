import * as React from 'react';
import {Component} from 'react-simplified';
import {Card, Feed, Grid, Button, Header, Icon, Input, Image, Modal, List, Popup} from 'semantic-ui-react';
import { ShowMarkerMap } from '../kart/map';
import { feilService } from '../../services/feilService';
import { RedigerModal } from './redigerModal';
import { InfoBoks } from '../info/info';

/**
 * Card som viser informasjon om en feil. Blir brukt av ansatt for å se informasjon om feil som er 'Under behandling' eller 'Ferdig'.
 * @reactProps {Object} feil - den feilen man ønsker å se
 * @reactProps {Object[]} bilder - bildene som tilhører den feilen man åpner.
 * @reactProps {function()} lukk - Det som skal gjøres når vinduet lukkes. 
 * @reactProps {function()} opp - oppdateringer som hører til en feil. 
 */
export class FeilVisning extends Component {
    /**
     * Alle statuser en feil kan ha
     * @type {string[]}
     */
    statuser = [];

    /**
     * Bildene som tilhører en feil
     * @type {Object[]}
     */
    bilderTilFeil = [];

    /**
     * Om oppdateringsmuligheten skal vises (kan ikke gjøres om den er sendt til bedrift)
     * @type {boolean}
     * @default true
     */
    visOppdater = true;

    /**
     * Statusen som velges fra dropdown menyen
     * @type {Object}
     * @property {number} status_id iden til statusen
     * @property {string} status navnet på statusen
     */
    valgtStatus = {
        status_id: '',
        status: this.props.feil.status
    }
    /**
     * Kommentaren som hører til oppdateringen
     * @type {string}
     */
    kommentar = '';

    /**
     * Linken til bildet man ønsker å åpne større
     * @type {string}
     */
    valgtBilde = "";

    /**
     * Om bildet er åpnet stort eller ikke. 
     * @type {boolean}
     * @default false
     */
    bildeApen = false;
    
    /**
     * Om redigeringsvinduet skal være åpent
     * @type {boolean}
     * @default false
     */
    redigerModal = false;
    
    /**
     * Den feilen det skal vises informasjon om
     * @type {feil}
     */
    valgtfeil = ''

    /**
     * Om feilen er sendt til bedrift, avgjør om statusen kan oppdateres
     * @type {boolean}
     * @default false
     */
    sendtTilBedrift = false; 

    /**
     * Brukes for å få tak i status_id når en status velges fra menyen
     * @param {string} status 
     */
    handterStatuser(status){
        let stat = this.statuser.find(e => (e.status === status));
        this.valgtStatus = {...stat};
    }

    /**
     * Brukes for å vise et bildet i større format.
     */
    visBilde(){
        this.valgtBilde = this.props.bilder[0].url; 
        this.visBilde = true; 
    }

    /**
     * Brukes for å åpne redigeringsvinduet
     */
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
                        <h3 style={{display: 'inline'}}>{this.props.feil.overskrift}</h3>
                        <InfoBoks style={{display: 'inline'}} 
                            tekst="Her kan du se informasjon om en feil, og oppdatere statusen.&#10;For å redigere informasjon eller slette bilder: trykk på rediger."/>
                        <div style={{textAlign: 'right'}}>
                            <Popup trigger={<Button color="red" onClick={() => {this.slett();}} className="float-rigth">Slett</Button>} content="Hvis du trykker her så sletter du feilen"/>   
                            <Popup trigger={<Button color="blue" onClick={() => {this.openRedigering();}}>Rediger</Button>} content="Trykk her for å redigere feilen"/>
                        </div>
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

    /**
     * Brukes for å laste inn listen over feil på nytt hvis det gjøres endringer. 
     */
    refresh(){
        this.feilApen = false;
        this.mounted();
        console.log(this.feilApen);
        this.props.lukk(this.valgtStatus.status_id);
    }

    /**
     * Brukes for å sende inn en oppdatering på en feil. 
     */
    async oppdatering(){
        await feilService.lagOppdatering({
            "feil_id": this.props.feil.feil_id,
            "kommentar": this.kommentar, 
            "status_id": this.valgtStatus.status_id
        });
        this.props.lukk(this.valgtStatus.status_id);
    }

    /**
     * Brukes for å slette en feil fra databasen
     */
    async slett(){
        this.feilApen=false;
        let res = await feilService.slettFeil(this.props.feil.feil_id);
        Promise.resolve(res.data).then(this.props.lukk(this.valgtStatus.status_id));
    }

    /**
     * Henter ut alle statuser, og setter valgtStatus til feilenes nåværende status.
     */
    async mounted(){
        let res = await feilService.hentAlleStatuser();
        let alle = await res.data; 
        this.statuser = await alle.filter(e => e.status_id !== 1);
        this.valgtStatus = this.statuser.find(e => e.status === this.props.feil.status);

        await this.handterStatuser(this.props.feil.feil_id);
    }
}
