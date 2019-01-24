import * as React from 'react';
import {Component} from 'react-simplified';
import {PageHeader} from '../../Moduler/header/header';
import {
  Grid,
  Button,
  Popup,
} from 'semantic-ui-react';
import {AnsattMeny} from './ansattMeny';
import {hendelseService} from '../../services/hendelseService'


export class NyHendelse extends Component{
    kategorier = [];
    overskrift = "";
    beskrivelse = ""; 
    adresse = ""; 
    dato = "";
    tid = ""; 
    url = "";
    valgtKategori = {
        hendelseskategori_id: "",
        kategorinavn: ""
    }; 

    handleKategori(navn){
        let res = this.kategorier.find(e => (e.kategorinavn === navn));
        this.valgtKategori = res; 
    }

    render(){
        return(
            <div>
                <PageHeader/>
                <div className="vinduansatt">
                    <AnsattMeny/>
                    <div className="row justify-content-md-center mt-3 mb-3">
                    <div className="col-sm-6 ansattContent">
                        <h1 className="mt-3">Ny hendelse</h1>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>Dato:</label>
                                <input type="date" className="form-control"
                                    required={true}
                                    onChange={(event) => (this.dato = event.target.value)}
                                />
                            </div>
                            <div className="form-group col-md-4">
                                <label>Start:</label>
                                <input type="time" className="form-control"
                                    required={true}
                                    onChange={(event) => (this.tid = event.target.value)}
                                />
                            </div>
                            <div className="form-group col-md-4">
                                <label>Kategori: </label>
                                <select
                                    className="form-control"
                                    onChange={(e) => this.handleKategori(e.target.value)}
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
                        </div>
                        <div className="form-group">
                            <label>Overskrift</label>
                            <input type="text" className="form-control" placeholder="Overskrift" 
                            required={true}
                            onChange={(event) => (this.overskrift = event.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label>Beskrivelse</label>
                            <textarea className="form-control" rows="3" placeholder="Fortell litt om ditt"
                                required={true}
                                onChange={(event) => (this.beskrivelse = event.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Adresse</label>
                            <input type="text" className="form-control" placeholder="Adresse"
                                required={true}
                                onChange={(event) => (this.adresse = event.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Link til billetter: </label>
                            <input type="text" className="form-control" placeholder="eks.billetter.com"
                                required={true}
                                onChange={(event) => (this.url = event.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <div>
                                <label >
                                    Bilder:
                                </label>
                                <br />
                                <Popup 
                                    trigger={<input type="file" id="bil" accept="image/*" name="bil"/>} 
                                    content='Velg ett bilde som beskriver hendelsen' />
                            </div>
                        </div>
                        <Button onClick={this.lagre} color="green">Lagre</Button>
                    </div>
                </div>
                </div>
            </div>
        );
    }

    async lagre(){
        console.log(this.overskrift);
        console.log(this.beskrivelse);
        console.log(this.adresse);
        console.log(this.dato);
        console.log(this.tid);
        console.log(this.kategori);

        let datotid = this.dato + " " + this.tid + ":00";
        console.log(datotid);

        let tull = this.kategorier.filter((e) => e.kategorinavn === this.kategori);
        let kategorid = tull.hendelseskategori_id;
        
        let svar = await hendelseService.lagNyHendelse({
            hendelseskategori_id: this.valgtKategori.hendelseskategori_id,
            kommune_id: global.payload.user.kommune_id,
            overskrift: this.overskrift,
            tid: datotid,
            beskrivelse: this.beskrivelse,
            sted: this.adresse,
            bilde: "lofoten.jpg",
            lengdegrad: 0,
            breddegrad: 0
        });
    }

    async mounted(){
        let kat = await hendelseService.hentAlleKategorier();
        this.kategorier = await kat.data; 
        await console.log(kat.data);
    }
}