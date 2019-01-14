import * as React from 'react';
import { Component } from 'react-simplified';
import { generellServices } from '../../services/generellServices';

export class KommuneVelger extends Component {
    sok = "";
    listesyn = false;
    kommuner = [];

    render() {
        return(
            <div>
                <input value={this.sok} onChange={this.oppdaterSok} type="text"></input>
                <ul>
                    <li>lol</li>
                    <li>lol</li>
                    <li>lol</li>
                    <li>lol</li>
                    <li>lol</li>
                </ul>
            </div>
        );
    }

    mounted() {
        generellServices.hentAlleKommuner().then((res) => {
            console.log(res);
        });
    }

    oppdaterSok(e) {
        this.sok = e.target.value;

        if (this.sok.length > 0) {
            this.listesyn = true;
        } else {
            this.listesyn = false;
        }
    }
}