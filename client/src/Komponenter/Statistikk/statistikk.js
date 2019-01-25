import * as React from 'react';
import {Component} from 'react-simplified';
import {FormGroup, FormControl} from 'react-bootstrap';
import {statistikkService} from '../../services/statistikkService';
import {generellServices} from '../../services/generellServices.js';
import {feilService} from '../../services/feilService.js';
import {GronnKnapp, StatBar} from '../../widgets.js';
import * as html2canvas from 'html2canvas';

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
          <div id="lastNedPDFBtn">
            <GronnKnapp onClick={() => {document.querySelector("#statMeny").style.display = "none"; setTimeout(() => {window.print(); document.querySelector("#statMeny").style.display = "inherit";},500);}}>Last ned som PDF</GronnKnapp>
          </div>
          <div>
            <FormGroup controlId="formControlsSelect">
              <FormControl
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
