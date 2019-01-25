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
import { FeilVisning } from '../../Moduler/AnsattModuler/feilvisning';
import { InfoBoks } from '../../Moduler/info/info';
import { Footer } from '../../Moduler/footer/footer';

export class AnsattUnder extends Component{
    underB = [];
    alleFeil = [];
    valgtfeil = {
        overskrift: '',
        beskrivelse: ''
    };
    bilder = [];
    oppdateringer = [];

    visFeil(feil){
        this.valgtfeil = {...feil};
        this.hentInfo(feil);
        this.feilApen = true; 
        console.log(this.valgtfeil);
    }

    async hentInfo(feil){
        let res = await feilService.hentBilderTilFeil(feil.feil_id);
        this.bilder = await res.data; 

        let opp = await feilService.hentAlleOppdateringerPaaFeil(feil.feil_id);
        this.oppdateringer = await opp.data; 
    }

    render(){
        return(
            <div>
                <PageHeader/>
                <div className="vinduansatt containter-fluid">
                {global.payload.role == 'ansatt' ? <AnsattMeny/> : (global.payload.role == 'admin') ? <AdminMeny kommune={this.kommune}/> : null}
                
                    <div className="ansattContent">
                        <div className="row justify-content-md-center mt-3 mb-3">
                            <h1>Under behandling</h1>
                        </div>
                        <div className="row">
                            <div className="col-sm-4">
                                <Card color="yellow" fluid>
                                    <Card.Content>
                                        <Card.Header>
                                            <h3 style={{display: 'inline'}}>Under behandling</h3>
                                            <InfoBoks style={{display: 'inline'}} tekst="Trykk på en feil for å oppdatere eller redigere."/>
                                        </Card.Header>
                                    </Card.Content>
                                    <Card.Content className="hoydeTabell">
                                        {this.underB.map((feil) => (
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
                                    <div>
                                        <FeilVisning feil={this.valgtfeil} bilder={this.bilder} 
                                        opp={this.oppdateringer}  lukk={this.oppdater}/>
                                    </div>
                                ) : (
                                    <div>Trykk på feil</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        ); 
    }
    
    oppdater(){
        this.mounted();
        this.feilApen = false;
    }

      async mounted() {

        const load = async (kommune_id) => {
            let feil = await feilService.hentFeilForKommune(kommune_id);
            this.alleFeil = await feil.data;
        
            this.underB = await feil.data.filter(e => (e.status === 'Under behandling'));
            
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