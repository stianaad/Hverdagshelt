import * as React from 'react';
import {Component} from 'react-simplified';
import {hendelseService} from '../../services/hendelseService';
import {generellServices} from '../../services/generellServices';
import { HashRouter, Route, NavLink, Redirect,Switch,Link } from 'react-router-dom';
import {FeedEvent,FeedHendelse, Filtrer, Info, Hendelse} from '../../Moduler/cardfeed';
import {Card, Feed, Grid, Button, Header, Icon, Image, Modal,Dropdown} from 'semantic-ui-react';
import {PageHeader} from '../../Moduler/header/header';
import { KommuneVelger } from '../../Moduler/KommuneVelger/kommuneVelger';

export class Hendelser extends Component{
    hendelser = [];
    alleKategorier = [];
    aktiveHendelser = [];
    link = "/hendelser";
    tider=[];
    kommuner=[];
    navn=[];


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

    filterFraTid(e) {
        let fraTid = document.getElementById("fra").value+"0";
        if (fraTid==="0") {
            this.aktiveHendelser = this.hendelser;
        }else {
            this.aktiveHendelser= this.hendelser.filter(
                (kat) => kat.tid > fraTid
              );
        }
    }

    filterTilTid(e) {
        let tilTid = document.getElementById("til").value +"0";
        if (tilTid==="0") {
            this.aktiveHendelser = this.hendelser;
        }else {
          this.aktiveHendelser= this.hendelser.filter(
            (kat) => kat.tid < tilTid
          );
        }
    }

    filterKommune(e) {
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
  
  
    render() {
      return (
        <div className="container" >
        <PageHeader history={this.props.history}/>
        
            <h1 className="text-center b-5" >Hendelser</h1>
           
           <div className="row ml-1">
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
             {<input 
             onChange={this.filterFraTid}
             type="date" 
             style={{height: 30, width: 110}} 
             className="mt-2" 
             id="fra"
             /> }
             {<input 
             onChange={this.filterTilTid}
             type="date" 
             style={{height: 30, width: 110, marginLeft:4}} 
             className="mt-2"
             id = "til"
             />}

            <Dropdown placeholder='Velg kommune' fluid search selection options={this.navn.map(navn=>navn)} />
             
           </div>
           
           
            <Card.Group itemsPerRow={3}>
              {this.aktiveHendelser.map(hendelse => (
                 // <Link to="/hendelser/{h${hendelse.id}">
                <Hendelse
                    onClick={()=>location.href=this.link +"/"+ hendelse.hendelse_id}
                    bilde = {hendelse.bilde}
                    overskrift = {hendelse.overskrift}
                    sted = {hendelse.sted}
                    tid = {hendelse.tid}
                    beskrivelse = {hendelse.beskrivelse}
                />
               // </Link>
                    ))}

                   
                    
            
            {this.aktiveHendelser.map(hendelse => (
                <Hendelse
                    onClick={()=>location.href=this.link +"/"+ hendelse.hendelse_id}
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

        let res2 = await generellServices.hentAlleKommuner();
        this.kommuner = await res2.data;

        this.alleKategorier = this.aktiveHendelser.map(
            kat => kat.kategorinavn
        );

        this.tider = this.aktiveHendelser.map(
            kat => kat.tid
        );

        
        this.navn = this.kommuner.map(
            navn =>navn.kommune_navn
             );

        console.log(this.alleKategorier);
        console.log(this.tider);
        console.log(this.kommuner);
        console.log(this.navn);
        
      }
    
}
