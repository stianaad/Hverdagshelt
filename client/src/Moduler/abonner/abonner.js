import * as React from 'react';
import {Component} from 'react-simplified';
import { feilService } from '../../services/feilService';
import { hendelseService } from '../../services/hendelseService';
import { brukerService } from '../../services/brukerService';

export class AbonnerKnapp extends Component {
    abonnert = null;

    render() {
        return (
            <>
                {this.abonnert != null && (
                    <button onClick={()=>{this.klikk()}} style={{width: "90px"}} className={this.abonnert ? "btn btn-success" : "btn btn-danger"}>{this.abonnert ? "Abonnerer" : "Abonner"}</button>
                )}
            </>
        );
    }

    klikk() {
        if (this.props.feil_id) {
            if (this.abonnert) feilService.ikkeAbonner(this.props.feil_id);
            else feilService.abonner(this.props.feil_id);
            this.mounted();
        } else if (this.props.hendelse_id) {
            if (this.abonnert) hendelseService.ikkeAbonner(this.props.hendelse_id);
            else hendelseService.abonner(this.props.hendelse_id);
            this.mounted();
        }
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