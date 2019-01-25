import * as React from 'react';
import {Component} from 'react-simplified';
import {PageHeader} from '../../Moduler/header/header';
import {Card, Feed, Grid, Button, Header, Icon, Input, Image, Modal, List, CardContent} from 'semantic-ui-react';
import {FeedEvent, Filtrer, Info} from '../../Moduler/cardfeed';
import {feilService} from '../../services/feilService';
import {markerTabell, ShowMarkerMap} from '../../Moduler/kart/map';
import {NavLink} from 'react-router-dom';
import {AnsattMeny} from './ansattMeny';
import { FeilVisning } from '../../Moduler/AnsattModuler/feilvisning';

export class FeilHosBedrift extends Component{
    underB = [];
    alleFeil = [];
    className = '';
    valgtfeil = {
        overskrift: '',
        beskrivelse: ''
    };
    bilder = [];
    oppdateringer = [];
    underBOgGodkjenning = [];

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
                    <AnsattMeny/>
                    <div className="row justify-content-md-center mt-3 mb-3">
                        <h1>Under behandling</h1>
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
                                        {this.underBOgGodkjenning.map((feil) => (
                                            <FeedEvent
                                            onClick={() => this.visFeil(feil)}
                                            status={feil.status}
                                            tid={feil.tid}
                                            kategori={(feil.status == "Godkjent") ? (<span>Sendt til {feil.navn}</span>) : (<span>Under behandling av {feil.navn}</span>)}
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
            </div>
        ); 
    }
    
    oppdater(){
        this.mounted();
        this.feilApen = false;
        console.log(this.feilApen);
    }

    scroll() {
        if (this.underB.length > 5) {
          this.className = 'ansattScroll';
        }
      }
    
      async mounted() {
        let feil = await feilService.hentFeilForKommune(global.payload.user.kommune_id);
        this.alleFeil = await feil.data;

        let res1 = await feilService.hentUnderBehandlingOgVenterPaaSvarAnsatt(global.payload.user.kommune_id);
        this.underBOgGodkjenning = await res1.data;
        await console.log(res1.data);

        this.underB = await feil.data.filter(e => (e.status === 'Under behandling'));
        await this.scroll();
      }
    
}