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

export class AnsattUnder extends Component{
    underB = [];
    alleFeil = [];
    className = '';
    valgtfeil = {
        overskrift: '',
        beskrivelse: ''
    };

    visFeil(feil){
        this.valgtfeil = {...feil};
        this.feilApen = true; 
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
                                    <div className="ansattFeilVindu">
                                        <FeilVisning feil={this.valgtfeil}/>
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
        if (this.underB.length > 5) {
          this.className = 'ansattScroll';
        }
      }
    
      async mounted() {
        let feil = await feilService.hentFeilForKommune(global.payload.user.kommune_id);
        this.alleFeil = await feil.data;
    
        this.underB = await feil.data.filter(e => (e.status === 'Under behandling'));
        
        await this.scroll();
      }
    
}