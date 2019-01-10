import * as React from 'react';
import { Component } from 'react-simplified';
import { generellServices } from '../../services/generellServices';

export class KommuneVelger extends Component {
    sok = "";
    listesyn = false;
    kommuner = [];
    kommuner_filtrert = [];

    render() {
        return(
            <div className="komBoks">
                <input className="komSok form-control" value={this.sok} onChange={this.oppdaterSok} type="text"></input>
                <ul className="komListe" style={{display: this.listesyn ? "block" : "none"}}>
                    {this.kommuner_filtrert.map((kommune) => (
                        <li key={kommune.kommune_id} className="komElement"><a href={"/"+kommune.kommune_navn.toLowerCase()}>{kommune.kommune_navn}</a></li>
                    ))}
                </ul>
            </div>
        );
    }

    mounted() {
        generellServices.hentAlleKommuner().then((res) => {
            this.kommuner = res;
        });
    }

    oppdaterSok(e) {
        this.sok = e.target.value;

        if (this.sok.length > 0) {
            this.kommuner_filtrert = [];
            for (let i = 0; i < this.kommuner.length; i++) {
                let match = true;
                for (let j = 0; j < this.sok.length; j++) {
                    if (this.kommuner[i].kommune_navn.toLowerCase().charAt(j) != this.sok.toLowerCase().charAt(j)) {
                        match = false;
                    }
                }
                if (match) this.kommuner_filtrert.push(this.kommuner[i]);
            }



            this.listesyn = true;
        } else {
            this.listesyn = false;
        }
    }
}