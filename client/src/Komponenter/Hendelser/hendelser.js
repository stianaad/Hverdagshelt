import * as React from 'react';
import {Component} from 'react-simplified';
import {hendelseService} from '../../services/hendelseService';
import { HashRouter, Route, NavLink, Redirect,Switch } from 'react-router-dom';
import {FeedEvent,FeedHendelse, Filtrer, Info} from '../../Moduler/cardfeed';
import {Card, Feed, Grid, Button, Header, Icon, Image, Modal} from 'semantic-ui-react';

export class Hendelser extends Component{
    hendelser = [];
    alleKategorier = [];

    hendelse = {
        overskrift: '',
        beskrivelse: '',
        sted: '',
        tid: '',
        url: ''
      }
  
  
    render() {
      return (
      <div className="container" id="ytreblokk">

      <h1 className="text-center">Hendelser</h1>

      {
                           <select
                           onChange={this.filter}
                           className="form-control right floated meta" 
                           style={{height: 30, width: 120}}>
                           <option hidden> Filter </option>
                           <option value="0"> Alle kategorier </option>
                           {this.alleKategorier.map(kategori => (
                             <option value={kategori.kategorinavn} key={kategori.kategorinavn}> {kategori.kategorinavn}</option>
                           ))}
                         </select>
      }

        {      
                             

            this.hendelser.map(hendelse => (
            <div className="row">
                <div className="col-sm">
                <NavLink  to={'/category/'+ hendelse.category+'/'+hendelse.headline+'/'+hendelse.id}>
                    <div className="card">
                    <img className ="card-img-top" src={hendelse.bilde} alt={hendelse.beskrivelse}/>
                        <div className="card-body">
                            <h5 className="card-title">{hendelse.overskrift}</h5>
                            <p className="card-text">{hendelse.beskrivelse}</p>
                            {hendelse.tid}
                        </div>
                    </div>
                </NavLink>
                </div>
                <div className="col-sm">
                <NavLink  to={'/category/'+ hendelse.category+'/'+hendelse.headline+'/'+hendelse.id}>
                    <div className="card">
                    <img className ="card-img-top" src={hendelse.bilde} alt={hendelse.beskrivelse}/>
                        <div className="card-body">
                            <h5 className="card-title">{hendelse.overskrift}</h5>
                            <p className="card-text">{hendelse.beskrivelse}</p>
                            {hendelse.tid}
                        </div>
                    </div>
                </NavLink>
                </div>
                <div className="col-sm">
                <NavLink  to={'/category/'+ hendelse.category+'/'+hendelse.headline+'/'+hendelse.id}>
                    <div className="card">
                    <img className ="card-img-top" src={hendelse.bilde} alt={hendelse.beskrivelse}/>
                        <div className="card-body">
                            <h5 className="card-title">{hendelse.overskrift}</h5>
                            <p className="card-text">{hendelse.beskrivelse}</p>
                            {hendelse.tid}
                        </div>
                    </div>
                </NavLink>
                </div>
            </div>
            
        ))}
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

      let res2 = await hendelseService.hent();
      this.alleKategorier = await res2.data;
      await console.log(res2.data);
    }
}