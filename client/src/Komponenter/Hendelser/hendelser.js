import * as React from 'react';
import {Component} from 'react-simplified';
import {hendelseService} from '../../services/hendelseService';
import { HashRouter, Route, NavLink, Redirect,Switch } from 'react-router-dom';
import {FeedEvent,FeedHendelse, Filtrer, Info, Hendelse} from '../../Moduler/cardfeed';
import {Card, Feed, Grid, Button, Header, Icon, Image, Modal} from 'semantic-ui-react';
import {PageHeader} from '../../Moduler/header/header';

export class Hendelser extends Component{
    hendelser = [];
    alleKategorier = [];
    aktiveHendelser = [];
    visHendelser=false;

    kategori='';
    
    filterKategori(e) {
        let verdi = e.target.value;
        console.log(verdi);
        if (verdi == 0) {
            this.aktiveHendelser = this.hendelser;
            console.log(this.hendelser);
        }else {
          console.log(this.alleKategorier);
          this.aktiveHendelser= this.hendelser.filter(
            (kat) => kat.kategorinavn === verdi
          );
        }
      }

    
    filterSted(e) {
        let verdi = e.target.value;
        console.log(verdi);
        if (verdi == 0) {
            this.aktiveHendelser = this.hendelser;
            console.log(this.hendelser);
        }else {
          console.log(this.alleKategorier);
          this.aktiveHendelser= this.hendelser.filter(
            (kat) => kat.sted === verdi
          );
        }
    }

    filterTid(e) {
        let verdi = e.target.value;
        console.log(verdi);
        if (verdi == 0) {
            this.aktiveHendelser = this.hendelser;
            console.log(this.hendelser);
        }else {
          console.log(this.alleKategorier);
          this.aktiveHendelser= this.hendelser.filter(
            (kat) => kat.tid === verdi
          );
        }
    }
  
    render() {
      return (
        <div className="container" >
        <PageHeader history={this.props.history}/>
        
            <h1 className="text-center b-5" >Hendelser</h1>
           
           <div className="row">
           <h5 className="mt-3">Filtrer på: </h5>
           <select
                onChange={this.filterKategori}
                className="form-control right floated meta m-2"
                style={{height: 30, width: 150}}
                >
                <option hidden> Kategori </option>
                <option value="0"> Alle kategorier </option>
                {this.hendelser.map((kategori) => (
                <option
                    value={kategori.kategorinavn}
                    key={kategori.kategorinavn}
                >
                    {' '}
                    {kategori.kategorinavn}
                </option>
                ))}
                
             </select>

             <select
                onChange={this.filterSted}
                className="form-control right floated meta m-2"
                style={{height: 30, width: 150}}
                >
                <option hidden> Sted </option>
                <option value="0"> Alle steder </option>
                {this.hendelser.map((sted) => (
                <option
                    value={sted.sted}
                    key={sted.sted}
                >
                    {' '}
                    {sted.sted}
                </option>
                ))}
                
             </select>

             <select
                onChange={this.filterTid}
                className="form-control right floated meta m-2"
                style={{height: 30, width: 150}}
                >
                <option hidden> Tid </option>
                <option value="0"> Alle tider </option>
                {this.hendelser.map((tid) => (
                <option
                  value={tid.tid}
                  key={tid.tid}
                 >
                    {' '}
                    {tid.tid}
                </option>
                ))}
             </select>
           </div>
           
            <Card.Group itemsPerRow={3}>
              {this.aktiveHendelser.map(hendelse => (
                <Hendelse
                    onClick={this.visEnHendelse}
                    bilde = {hendelse.bilde}
                    overskrift = {hendelse.overskrift}
                    sted = {hendelse.sted}
                    tid = {hendelse.tid}
                    beskrivelse = {hendelse.beskrivelse}
                />
                    ))}
            </Card.Group>
            
        </div>
        );
    }
    
      async mounted() {
  
        let res1= await hendelseService.hentAlleHendelser();
        this.hendelser = await res1.data;
        this.aktiveHendelser = await res1.data;

        this.alleKategorier = this.aktiveHendelser.map(
            kat => kat.kategorinavn
        );
        console.log(this.alleKategorier);
      }
    
}
