import * as React from 'react';
import {Component} from 'react-simplified';
import {PageHeader} from '../../Moduler/header/header';
import {Card, Feed, Grid, Button, Header, Icon, Input, Image, Modal, List, CardContent} from 'semantic-ui-react';
import {FeedEvent, Filtrer, Info} from '../../Moduler/cardfeed';
import {feilService} from '../../services/feilService';
import {markerTabell, ShowMarkerMap} from '../../Moduler/kart/map';
import {NavLink} from 'react-router-dom';
import {AnsattMeny} from './ansattMeny';
import {AdminMeny} from '../Admin/adminMeny';
import {generellServices} from '../../services/generellServices';
import { brukerService } from '../../services/brukerService';

export class AlleBedrifter extends Component{
    bedrifter = [];
    aktivBedrift = [];
    className = '';
    bedApen = false; 
    feilApen = false; 
    valgtBed = '';
    feilHosBedrift = [];
    valgtFeil = {
        feil_id: "",
        overskrift: "",
        beskrivelse: ""
    }
    oppdateringer = [];

    tekst = "";

    openBed(bed){
        this.valgtBed = {...bed};
        this.feilApen = false;
        this.bedApen = true;
        this.hentFeil(bed);
    }

    async hentFeil(bed){
        let res1 = await feilService.hentFerdigeFeilForAnsatt(bed.orgnr);
        this.feilHosBedrift = await res1.data;

        this.aktivBedrift = this.bedrifter.find(bedrift => (bed.orgn=bedrift.orgnr));

        if(this.feilHosBedrift.length > 0){
            this.tekst = "Trykk på en feil for å se mer informasjon";
        }else{
            this.tekst = "Denne bedriften har ikke fullført noen oppgaver i denne kommunen."
        }
    }

    async hentOppdateringer(feil){
        let res = await feilService.hentAlleOppdateringerPaaFeil(feil.feil_id);
        this.oppdateringer = await res.data;
    }

    visFeil(feil){
        this.valgtFeil = {...feil};
        this.hentOppdateringer(feil);
        this.feilApen = true;
    }

    render(){
        return(
            <div>
                <PageHeader/>
                <div className="vinduansatt containter-fluid">
                {global.payload.role == 'ansatt' ? <AnsattMeny/> : (global.payload.role == 'admin') ? <AdminMeny kommune={this.kommune}/> : null}
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
                                                <Feed.Event onClick={() => this.openBed(bed)}>
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
                                {this.bedApen ? (
                                    <div>
                                       <Card fluid className="bedrifterVindu">
                                            <Card.Header textAlign="center"><h3>{this.valgtBed.navn}</h3></Card.Header>
                                            <Card.Content>
                                            <Grid fluid divided>
                                                <Grid.Column width={4}>
                                                    <div>
                                                        <List divided relaxed style={{height: '50%', overflow: 'auto'}}>
                                                            {this.feilHosBedrift.map((feil) => (
                                                                <List.Item onClick={() => this.visFeil(feil)}>
                                                                    <List.Content>
                                                                        <List.Header>{feil.overskrift}</List.Header>
                                                                        <List.Description>{feil.tid}</List.Description>
                                                                    </List.Content>
                                                                </List.Item>
                                                            ))}
                                                        </List> 
                                                    </div>                                               
                                                </Grid.Column>
                                                <Grid.Column width={12}>
                                                    {this.feilApen ? (
                                                        <Grid columns={2}>
                                                            <Grid.Column>
                                                                <h5>Overskrift: </h5>
                                                                {this.valgtFeil.overskrift}
                                                                <h5>Beskrivelse:</h5>
                                                                <p style={{maxHeight:'100px', overflow: 'auto'}}>{this.valgtFeil.beskrivelse}</p>
                                                                <ShowMarkerMap key={this.valgtFeil.feil_id} width="100%" height="30%" id="posmap" feil={this.valgtFeil} />
                                                            </Grid.Column>
                                                            <Grid.Column>
                                                                <div className="oppdateringScroll">
                                                                    <List className="p-2">
                                                                        {this.oppdateringer.map((opp) => (
                                                                        <List.Item>
                                                                        <List.Content>
                                                                            <List.Header>{opp.status}<span className="float-right font-weight-light font-italic">{opp.tid}</span></List.Header>
                                                                            <List.Description>{opp.kommentar}</List.Description>
                                                                        </List.Content>
                                                                        </List.Item>
                                                                        ))}
                                                                    </List>
                                                                </div>
                                                            </Grid.Column>
                                                        </Grid>
                                                    ):(
                                                        <span>
                                                            <p>{this.tekst} </p>
                                                            <p><strong>Kontaktinformasjon:</strong></p>
                                                            <p>Telefonnr: {this.aktivBedrift.telefon}</p>
                                                            <p>E-post: {this.aktivBedrift.epost}</p>
                                                        </span>
                                                    )}
                                                </Grid.Column>
                                            </Grid>
                                            </Card.Content>
                                       </Card>
                                    </div>
                                ):(
                                    <div>
                                        Velg en bedrift for å se mer informasjon
                                    </div>
                                )}
                               
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
        
        await this.scroll();

          if (global.payload.role == 'ansatt') load(global.payload.user.kommune_id);
          else if (global.payload.role == 'admin') {
              let res = await generellServices.sokKommune(this.props.match.params.kommune);
              await Promise.resolve(res.data).then(async () => {
                  if (res.data.length > 0) {
                      this.kommune = res.data[0];
                  }
              });
          }
      }
    
}
