import * as React from 'react';
import {Component} from 'react-simplified';
import { PageHeader } from '../../Moduler/header/header';
import {RegistrerBedrift} from '../Registrering/registrerBedrift';
import {RegistrerNyKategori} from './registrerNyKategori';
import {SlettKategori} from './slettKategori';
import { Grid, Button, Input, Select } from 'semantic-ui-react';
import { KommuneInput } from '../../Moduler/kommuneInput/kommuneInput';

export class Administrasjon extends Component {
    kommune_navn = null;
    registrerBruker = '/registreransatt';
    registrerOptions = [
        {key: 'k', text: 'Kommuneansatt', value: '/registreransatt'},
        {key: 'b', text: 'Bedrift', value: '/registrerbedrift'},
        {key: 'a', text: 'Administrator', value: '/registreradmin'}];

    render() {
        return (
            <div className="container">
                <PageHeader history={this.props.history} location={this.props.location} />
                <h1 style={{textAlign: "center"}}>Administrasjon</h1>
                <Grid columns={3} centered>
                    <Grid.Column>
                        <h2>Kommuner</h2>
                        <h4>Administrer en kommune:</h4>
                        <KommuneInput style={{display: "inline-block", marginRight: "5px"}} onChange={(e)=>{this.kommune_navn = e.navn}} onInputChange={(e)=>{this.kommune_navn = e.id ? e.navn : null}} />
                        <Button color="blue" disabled={this.kommune_navn==null} onClick={() => this.props.history.push("/admin/"+this.kommune_navn.toLowerCase()+"/oversikt")}>Administrer</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <h2>Brukere</h2>
                        <h4>Registrer en ny bruker:</h4>
                        <Select style={{display: "inline-block", marginRight: "5px"}} value={this.registrerBruker} onChange={(e, { value })=>{this.registrerBruker=value}} options={this.registrerOptions} />
                        <Button color="blue" onClick={() => {this.props.history.push(this.registrerBruker)}}>Registrer</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <h2>Kategorier</h2>
                        <RegistrerNyKategori overskrift="Registrer ny hovedkat" label="hovedkat" placeholder="vann" id={3}/>
                        <SlettKategori overskrift="Slett hendelsekategori" visHendKat={"true"}/>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}