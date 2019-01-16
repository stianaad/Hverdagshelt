import * as React from 'react';
import {Component} from 'react-simplified';
import {hendelseService} from '../../services/hendelseService';
import { HashRouter, Route, NavLink, Redirect,Switch } from 'react-router-dom';
import {FeedEvent,FeedHendelse, Filtrer, Info, Hendelse} from '../../Moduler/cardfeed';
import {Card, Feed, Grid, Button, Header, Icon, Image, Modal} from 'semantic-ui-react';

export class Hendelser extends Component{
    hendelser = [];
    alleKategorier = [];
    aktiveHendelser = [];

    kategori='';


    filter(e) {
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
  
    render() {
      return (
        <div className="container" id="ytreblokk">

        
            <h1 className="text-center b-5" >Hendelser</h1>
           

            <select
                onChange={this.filter}
                className="form-control right floated meta mb-2"
                style={{height: 30, width: 120}}
                >
                <option hidden> Filter </option>
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
                {this.hendelser.map((sted) => (
                <option
                    value={sted.sted}
                    key={sted.sted}
                >
                    {' '}
                    {sted.sted}

                </option>
                ))}
                {this.hendelser.map((tid) => (
                <option
                    value={tid.tid}
                    key={tid.tid}
                >
                    {' '}
                    {tid.tid}

                </option>
                ))}
                {this.hendelser.map((kommune) => (
                <option
                    value={kommune.kommuneid}
                    key={kommune.kommune_navn}
                >
                    {' '}
                    {kommune.kommune_navn}

                </option>
                ))}
                
             </select>
        

            <Card.Group itemsPerRow={3}>
            {this.aktiveHendelser.map(hendelse => (
                <Hendelse
                bilde = {hendelse.bilde}
                overskrift = {hendelse.overskrift}
                sted = {hendelse.sted}
                tid = {hendelse.tid}
                beskrivelse = {hendelse.beskrivelse}
                
                >

                </Hendelse>
                    ))}
            </Card.Group>
        
        </div>
        );
    }
    
      async mounted() {
       /* hendelseervice
          .gethendelseImportance(this.props.match.params.importance)
          .then(hendelse => (this.hendelse = hendelse))
          .catch((error: Error) => Alert.danger(error.message));*/
  
        let res1= await hendelseService.hentAlleHendelser();
        this.hendelser = await res1.data;
        this.aktiveHendelser = await res1.data;

        this.alleKategorier = this.aktiveHendelser.map(
            kat => kat.kategorinavn
        );
        console.log(this.alleKategorier);

       // let res2 = await hendelseService.hentAlleHovedkategorier();
       // this.alleKategorier = await res2.data;
      }
    
}
