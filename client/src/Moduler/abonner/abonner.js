import * as React from 'react';
import {Component} from 'react-simplified';
import { feilService } from '../../services/feilService';
import { hendelseService } from '../../services/hendelseService';
import { brukerService } from '../../services/brukerService';

export class AbonnerKnapp extends Component {
    abonnert = null;

    render() {
        return (
            <button disabled={this.abonnert==null} onClick={()=>{this.klikk()}} style={this.props.style} className={this.abonnert ? "btn btn-success" : "btn btn-danger"}>{this.abonnert ? "Abonnerer" : "Abonner"}</button>
        );
    }

    klikk() {
        const t = () => {this.abonnert = true};
        const f = () => {this.abonnert = false};
        if (this.props.feil_id) {
            if (this.abonnert) {feilService.ikkeAbonner(this.props.feil_id).then(f).catch(f);}
            else {feilService.abonner(this.props.feil_id).then(t).catch(t);}
        } else if (this.props.hendelse_id) {
            if (this.abonnert) hendelseService.ikkeAbonner(this.props.hendelse_id).then(f).catch(f);
            else hendelseService.abonner(this.props.hendelse_id).then(t).catch(t);
        }
        this.abonnert = null;
    }

    async mounted() {
        if (this.props.feil_id) {
            let res = await brukerService.finnFolgteFeilTilBruker();
            this.abonnert = await (res.data.filter((a) => a.feil_id == this.props.feil_id).length > 0);
        } else if (this.props.hendelse_id) {
            let res = await brukerService.finnFolgteHendelserTilBruker();
            this.abonnert = await (res.data.filter((a) => a.hendelse_id == this.props.hendelse_id).length > 0);
        } else {
            console.log("ERROR VENNLIGST GI MEG EN ID");
        }
    }

}