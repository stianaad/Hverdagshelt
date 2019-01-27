import * as React from 'react';
import {Component} from 'react-simplified';
import {FormGroup, FormControl} from 'react-bootstrap';
import {statistikkService} from '../../services/statistikkService';
import {generellServices} from '../../services/generellServices.js';
import {feilService} from '../../services/feilService.js';
import {GronnKnapp, StatBar} from '../../widgets.js';
import {KommuneInput} from '../../Moduler/kommuneInput/kommuneInput';
import * as html2canvas from 'html2canvas';
import { PageHeader } from '../../Moduler/header/header';
import { Input } from 'semantic-ui-react';

export class Statistikk extends Component {

  resultat = [];
  total = 0;
  maks = 0;
  large = 0;
  ymse = [];
  mengde = 0;
  menyID = 0;
  menyValg = [];
  divNavn =  "";
  kommune_id = 0;
  kommune_navn = '';
  interval = 0;

  intervalDisabled = false;

  chunkArray(myArray, chunk_size){
    let index = 0;
    let arrayLength = myArray.length;
    let tempArray = [];

    for(index = 0; index < arrayLength; index += chunk_size){
      let myChunk = myArray.slice(index, index + chunk_size);
      tempArray.push(myChunk);
    }

    return tempArray;
  }

  handleChange(){
    this.large = this.ymse[this.menyID.value].resultat.large;
    this.maks = this.ymse[this.menyID.value].resultat.maks;
    this.resultat = this.ymse[this.menyID.value].resultat.resultat;
    let streng = this.menyValg[this.menyID.value].type;
    this.divNavn = streng.replace(/\s/g, "");
  }

  render(){
    return(
      <React.Fragment>
        <div id="statMeny">
          <PageHeader history={this.props.history} location={this.props.location}/>
          <div>
            <FormGroup style={{display:"inline"}} controlId="formControlsSelect">
            <div className="statKomBoks"><label>Statistikk:</label>
              <FormControl
                key={this.kommune_id}
                className="statSelect"
                componentClass="select"
                onChange={this.handleChange}
                inputRef={(node) => {
                  this.menyID = node;
                }}
              >
              {this.menyValg.map((values) => (
                <option key={values.id} value={values.id}>
                  {values.type}
                </option>
              ))}
              </FormControl>
              </div>
              <div className="statKomBoks"><label>Kommune:</label><KommuneInput onChange={(e) => {this.kommune_id = e.id; this.kommune_navn = e.navn; this.mounted()}} id="statKom"/></div>
              <div className="statKomBoks"><label>Intervall (dager):</label><Input disabled={this.intervalDisabled} id="intervall" type="number" value={this.interval} onChange={(e, {value}) => {this.interval = value; this.mounted(); this.intervalDisabled=true; setTimeout(()=>{this.intervalDisabled=false;},100)}} /></div>
              <GronnKnapp onClick={() => {document.querySelector("#statMeny").style.display = "none"; setTimeout(() => {window.print(); document.querySelector("#statMeny").style.display = "inherit";},500);}}>Last ned som PDF</GronnKnapp>
            </FormGroup>
          </div>
        </div>
        <div key={this.menyID.value} id={this.divNavn} style={{ zoom: '50%'}}>
        {this.resultat.map(e => (
          <StatBar key={e.id} maks={this.maks} text={this.menyValg[this.menyID.value].type} label="Antall feil" elementID={e.id} labels={e.navn} data={e.antall} ></StatBar>
        ))}
        </div>
      </React.Fragment>
    );
  }

  async mounted(){

    this.resultat = [];
    this.total = 0;
    this.maks = 0;
    this.large = 0;
    this.ymse = [];
    this.mengde = 0;
    this.menyID = 0;
    this.menyValg = [];
    this.divNavn =  "";

    //feil per kommune
    let kom = await generellServices.hentAlleKommuner();
    let feilperkommune = await statistikkService.hentFeilPerKommune();
    this.splittFeilPerKommune(feilperkommune, kom, 'Feil per kommune');

    //feil per fylker
    let feilperfylke  = await statistikkService.hentAlleFeilPerFylke();
    this.splitt(feilperfylke, 'Feil per fylke');

    //feil per hovedkategori
    let feilperhovedkat = await statistikkService.hentFeilPerHovedkategori();
    this.splitt(feilperhovedkat, 'Feil per hovedkategori');

    //feil per underkategori
    let feilpersubkat = await statistikkService.hentFeilPerSubkategori();
    this.splitt(feilpersubkat, 'Feil per underkategori');

    let feilstatus1 = await statistikkService.hentFeilPaaStatus(1);
    this.splitt(feilstatus1, 'Feil som har status "Ikke Godkjent"');

    let feilstatus2 = await statistikkService.hentFeilPaaStatus(2);
    this.splitt(feilstatus2, 'Feil som har status "Godkjent"');

    let feilstatus3 = await statistikkService.hentFeilPaaStatus(3);
    this.splitt(feilstatus3, 'Feil som har status "Under Behandling"');

    let feilstatus4 = await statistikkService.hentFeilPaaStatus(4);
    this.splitt(feilstatus4, 'Feil som har status "Ferdig"');

    if (this.kommune_id) {
      let feilPaaKommune = await statistikkService.hentFeilPaaKommune(this.kommune_id);
      this.splitt(feilPaaKommune, 'Feil i '+this.kommune_navn);
    }

    if (this.interval) {
      let res1 = await statistikkService.hentRegistrerteFeilPaaIntervall(this.interval);
      this.splitt(res1, 'Registrerte feil de siste ' + this.interval + ' dagene')
      let res2 = await statistikkService.hentBehandledeFeilPaaIntervall(this.interval);
      this.splitt(res2, 'Behandlede feil de siste ' + this.interval + ' dagene')
      let res3 = await statistikkService.hentFeilPerFylkePaaIntervall(this.interval);
      this.splitt(res3, 'Feil per fylke de siste ' + this.interval + ' dagene')
      let res4 = await statistikkService.hentFeilPerKommunePaaIntervall(this.interval);
      this.splitt(res4, 'Feil per kommune de siste ' + this.interval + ' dagene')
      let res5 = await statistikkService.hentFeilPerHovedkategoriPaaIntervall(this.interval);
      this.splitt(res5, 'Feil per hovedkategori de siste ' + this.interval + ' dagene')
      let res6 = await statistikkService.hentFeilPerSubkategoriPaaIntervall(this.interval);
      this.splitt(res6, 'Feil per subkategori de siste ' + this.interval + ' dagene')
    }

    this.maks = this.ymse[this.menyID.value].resultat.maks;
    this.large = this.ymse[this.menyID.value].resultat.large;
    this.resultat = this.ymse[this.menyID.value].resultat.resultat;
  }

  splitt(info, grafnavn){

    let verdier = [];
    let tags = [];

    let largest = 0;

    for(let i = 0; i < verdier.length; i++){
      if(verdier[i] > largest){
        largest = verdier[i];
      }
    }

    let deler = this.chunkArray(info.data, 15);

    for(let i = 0; i < info.data.length; i++){
      verdier[i] = info.data[i].antall;
      tags[i] = info.data[i].navn;
    }

    let verdierChunk = this.chunkArray(verdier, 15);
    let tagsChunk = this.chunkArray(tags, 15);

    let stats = [];

    for(let i = this.total; i < this.total + deler.length; i++){
      stats.push({
        "id": i,
        "navn": tagsChunk[i - this.total],
        "antall": verdierChunk[i - this.total]
      })
    }

    this.total += deler.length;

    let res =  {
      "maks": largest + 5,
      "large": deler.length,
      "resultat": stats
    };

    this.ymse.push({
      "id": this.mengde,
      "resultat": res
    });

    this.menyValg.push({
      "id": this.mengde,
      "type": grafnavn
    });

    this.mengde++;
  }

  splittFeilPerKommune(info, kom, grafnavn){
    let informasjon =  {
      data: []
    }

    let streng = grafnavn;
    this.divNavn = streng.replace(/\s/g, "");

    for(let i = 0; i < kom.data.length; i++){
      informasjon.data.push({
        "id": kom.data[i].kommune_id,
        "navn": kom.data[i].kommune_navn,
        "antall": 0
      });
    }

    for(let i = 0; i < informasjon.data.length; i++){
      for(let j = 0; j < info.data.length; j++){
        if(informasjon.data[i].id === info.data[j].kommune_id){
          informasjon.data[i].antall = info.data[j].antall;
        }
      }
    }

    let navn = [];
    let tall = [];

    let oppdeling = this.chunkArray(informasjon.data, 15);

    for(let i = 0; i < informasjon.data.length; i++){
      navn[i] = informasjon.data[i].navn;
      tall[i] = informasjon.data[i].antall;
    }

    let largest = 0;

    for(let i = 0; i < tall.length; i++){
      if(tall[i] > largest){
        largest = tall[i];
      }
    }

    let navnChunk =  this.chunkArray(navn, 15);
    let tallChunk = this.chunkArray(tall, 15);

    let stats = [];

    for(let i = this.total; i < this.total + oppdeling.length; i++){
      stats.push({
        "id": i,
        "navn": navnChunk[i],
        "antall": tallChunk[i]
      })
    }

    this.total += oppdeling.length;

    let res =  {
      "maks": largest + 5,
      "large": oppdeling.length,
      "resultat": stats
    };

    this.ymse.push({
      "id": this.mengde,
      "resultat": res
    });

    this.menyValg.push({
      "id": this.mengde,
      "type": grafnavn
    });

    this.mengde++;

  }
}
