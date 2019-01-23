import * as React from 'react';
import {Component} from 'react-simplified';
import { PageHeader } from '../../Moduler/header/header';
import {RegistrerBedrift} from '../Registrering/registrerBedrift';
import {RegistrerNyKategori} from './registrerNyKategori';

export class Administrasjon extends Component {
    render() {
        return (
            <div className="container">
                <PageHeader history={this.props.history} location={this.props.location} />
                <p>test</p>
                <RegistrerNyKategori overskrift="Registrer ny hendelseskategori" label="hendekseKat" placeholder="vann" id={3}/>
            </div>
        );
    }
}