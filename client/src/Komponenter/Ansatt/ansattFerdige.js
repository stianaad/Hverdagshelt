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

export class AnsattFerdig extends Component{
    fullforteFeil = [];
    alleFeil = [];
    className = '';
    valgtfeil = {
        overskrift: '',
        beskrivelse: ''
    };
    bilder = []; 
    oppdateringer = [];
    feilApen = false; 

    async hentInfo(feil){
        let res = await feilService.hentBilderTilFeil(feil.feil_id); 
        this.bilder = await res.data; 

        let opp = await feilService.hentAlleOppdateringerPaaFeil(feil.feil_id); 
        this.oppdateringer = await opp.data; 
    }

    visFeil(feil){
        this.valgtfeil = {...feil};
        this.hentInfo(feil);
        this.feilApen = true; 
    }

    render(){
        return(
            <div>
                <PageHeader history={this.props.history} location={this.props.location} />
                <div className="container-fluid vinduansatt">
                    <AnsattMeny/>
                    <div className="row justify-content-md-center mt-3 mb-3">
                        <h1>Fullførte feil</h1>
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
                                        {this.fullforteFeil.map((feil) => (
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
                                       <FeilVisning feil={this.valgtfeil} bilder={this.bilder} opp={this.oppdateringer}/>
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

    scroll() {
        if (this.fullforteFeil.length > 5) {
          this.className = 'ansattScroll';
        }
      }
    
      async mounted() {
        let feil = await feilService.hentFeilForKommune(global.payload.user.kommune_id);
        this.alleFeil = await feil.data;
    
        this.fullforteFeil = await feil.data.filter(e => (e.status === 'Ferdig'));
        
        await this.scroll();
        await console.log(this.fullforteFeil);
      }
    
}