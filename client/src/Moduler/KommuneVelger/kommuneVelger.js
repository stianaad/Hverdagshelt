import * as React from 'react';
import { Component } from 'react-simplified';
import { generellServices } from '../../services/generellServices';

export class KommuneVelger extends Component {
    sok = "";
    listesyn = false;
    kommuner = [];
    kommuner_filtrert = [];
    valgt_index = 0;
    in;
    
    constructor(props) {
        super(props);
        this.in = React.createRef();
    }

    render() {
        return(
            <div className="komBoks">
                <input ref={this.in} className="komSok form-control" value={this.sok} onChange={this.oppdaterSok} type="text"></input>
                <ul className="komListe" style={{display: this.listesyn ? "block" : "none"}}>
                    {this.kommuner_filtrert.map((kommune, i) => (
                        <li key={kommune.kommune_id} className={(i==this.valgt_index) ? "komElement komValgt" : "komElement"}><a href={"/"+kommune.kommune_navn.toLowerCase()}>{kommune.kommune_navn}</a></li>
                    ))}
                </ul>
            </div>
        );
    }

    mounted() {
        this.in.current.addEventListener('keydown', (e) => {this.inputup(e)});
        generellServices.hentAlleKommuner().then((res) => {
            this.kommuner = res;
        });
    }

    inputup (e) {
        if (e.key == "Enter") { 
            this.props.history.push("/"+this.kommuner_filtrert[this.valgt_index].kommune_navn.toLowerCase());
        } else if (e.key == "ArrowDown") { //NED
            this.valgt_index++;
            if (this.valgt_index > this.kommuner_filtrert.length-1) this.valgt_index = this.kommuner_filtrert.length-1;
        } else if (e.key == "ArrowUp") { //OPP
            this.valgt_index--;
            if (this.valgt_index < 0) this.valgt_index = 0;
        }
        
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

            if (this.valgt_index < 0) this.valgt_index = 0;
            else if (this.valgt_index > this.kommuner_filtrert.length-1) this.valgt_index = this.kommuner_filtrert.length-1;

            

            this.listesyn = true;
        } else {
            this.listesyn = false;
        }
    }
}