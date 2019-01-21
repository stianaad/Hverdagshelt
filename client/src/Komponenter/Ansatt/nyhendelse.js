import * as React from 'react';
import {Component} from 'react-simplified';
import {PageHeader} from '../../Moduler/header/header';
import {
  Menu,
  Card,
  Feed,
  Grid,
  Form,
  Button,
  Header,
  Icon,
  Input,
  Image,
  Modal,
  List,
  CardContent,
  GridColumn,
  Dropdown,
  TextArea,
} from 'semantic-ui-react';
import {FeedEvent, Filtrer, Info} from '../../Moduler/cardfeed';
import {feilService} from '../../services/feilService';
import {markerTabell, ShowMarkerMap} from '../../Moduler/kart/map';
import {NavLink} from 'react-router-dom';
import {brukerService} from '../../services/brukerService';
import {AnsattMeny} from './kommuneansatt';
import {hendelseService} from '../../services/hendelseService'


export class NyHendelse extends Component{
    kategorier = [];
    overskrift = "";
    beskrivelse = ""; 
    adresse = ""; 
    dato = "";
    tid = ""; 
    kategori = ""; 

    render(){
        return(
            <div>
                <PageHeader/>
                <div className="vinduansatt">
                    <Grid fluid>
                        <Grid.Column width="2">
                            <AnsattMeny/>
                        </Grid.Column>
                        <Grid.Column width="13">
                            <Grid stackable fluid>
                                <Grid.Row textAlign="center" centered>
                                    <h1 className="mt-3">Ny hendelse</h1>
                                </Grid.Row>
                                
                                        <Grid.Row centered fluid>
                                            <div className="form-group">
                                                <label>Overskrift</label>
                                                <input type="text" className="form-control" placeholder="Overskrift" 
                                                required={true}
                                                onChange={(event) => (this.overskrift = event.target.value)}/>
                                            </div>
                                        </Grid.Row>
                                        <Grid.Row centered fluid>
                                            <div className="form-group">
                                                <label>Beskrivelse</label>
                                                <textarea className="form-control" rows="3" placeholder="Fortell litt om ditt"
                                                    required={true}
                                                    onChange={(event) => (this.beskrivelse = event.target.value)}
                                                />
                                            </div>
                                        </Grid.Row>
                                        <Grid.Row centered fluid>
                                            <div className="form-group">
                                                <label>Adresse</label>
                                                <input type="text" className="form-control" placeholder="Adresse"
                                                    required={true}
                                                    onChange={(event) => (this.adresse = event.target.value)}
                                                />
                                            </div>
                                        </Grid.Row>
                                        <Grid.Row centered fluid>
                                            <Grid.Column>
                                                <div className="form-group">
                                                    <label>Dato:</label>
                                                    <input type="date" className="form-control"
                                                        required={true}
                                                        onChange={(event) => (this.dato = event.target.value)}
                                                    />
                                                </div>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <div className="form-group">
                                                    <label>Start:</label>
                                                    <input type="time" className="form-control"
                                                        required={true}
                                                        onChange={(event) => (this.tid = event.target.value)}
                                                    />
                                                </div>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <div className="form-group">
                                                    <label>Kategori: </label>
                                                    <select
                                                        className="form-control"
                                                        onChange={(event) => (this.kategori = event.target.value)}
                                                        >
                                                        <option hidden> Kategori</option>
                                                        {this.kategorier.map((kategori) => (
                                                            <option value={kategori.kategorinavn} key={kategori.kategorinavn}>
                                                            {' '}
                                                            {kategori.kategorinavn}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row centered>
                                            <Button color="green" onClick={this.lagre}>Ferdig</Button>
                                        </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid>
                </div>
            </div>
        );
    }

    lagre(){
        console.log(this.overskrift);
        console.log(this.beskrivelse);
        console.log(this.adresse);
        console.log(this.dato);
        console.log(this.tid);
        console.log(this.kategori);

        let datotid = this.dato + " " + this.tid + ":00";
        console.log(res);

        let res = this.kategorier.filter((e) => e.kategorinavn === this.kategori);
        kategorid = res.hendelseskategori_id;

        nyhendelse = {
            hendelseskategori_id: kategorid,
            kommune_id: 1,
            overskrift: this.overskrift,
            tid: datotid,
            beskrivelse: this.beskrivelse,
            sted: this.adresse,
            bilde: "lofoten.jpg",
            lengdegrad: 0,
            breddegrad: 0
        }
        
        hendelse.lagNyHendelse(nyhendelse);
    }

    async mounted(){
        let res = await hendelseService.hentAlleHovedkategorier();
        this.kategorier = await res.data; 
        await console.log(this.kategorier);
    }
}