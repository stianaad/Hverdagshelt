import * as React from 'react';
import {Component} from 'react-simplified';
import { PageHeader } from '../../Moduler/header/header';
import {RegistrerBedrift} from '../Registrering/registrerBedrift';
import {RegistrerNyKategori} from './registrerNyKategori';
import {SlettKategori} from './slettKategori';

export class Administrasjon extends Component {
    render() {
        return (
            <div className="container">
                <PageHeader history={this.props.history} location={this.props.location} />
                <p>test</p>
                <SlettKategori overskrift="Slett hovedkategori/subkategori"/>
            </div>
        );
    }
}