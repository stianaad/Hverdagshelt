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

export class AlleBedrifter extends Component{
    bedrifter = [];
    className = '';

    render(){
        return(
            <div>
                <PageHeader/>
                <div className="vinduansatt containter-fluid">
                    <AnsattMeny/>
                    <div className="row justify-content-md-center mt-3 mb-3">
                        <h1>Alle bedrifter</h1>
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
                                        {this.bedrifter.map((bed) => (
                                            <Feed>
                                                <Feed.Event>
                                                    <Feed.Content>
                                                        <Feed.Summary>{bed.navn}</Feed.Summary>
                                                        <Feed.Date content={bed.telefon}/>
                                                    </Feed.Content>
                                                </Feed.Event>  
                                            </Feed>
                                                                 
                                        ))}
                                    </Card.Content>
                                </Card>
                            </div>
                            <div className="col-sm-8">
                               
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ); 
    }

    scroll() {
        if (this.bedrifter.length > 5) {
          this.className = 'ansattScroll';
        }
      }
    
      async mounted() {
        let bed = await brukerService.hentBedrifter();
        this.bedrifter = await bed.data; 
        await console.log(this.bedrifter);
        
        await this.scroll();
      }
    
}