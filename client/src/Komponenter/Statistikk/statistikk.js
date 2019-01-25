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
  teller = 0;
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

  async print(){

    const filename = "Statistikk.pdf";
    let pdf = new jsPDF('p', 'mm', 'a4');

    let runs = 0;
    let big = this.large;

    function skriv(){
      if(runs === big){
        pdf.save(filename);
      }
    }

    for(let i = 0; i < this.large; i++){
      let input = document.getElementById('barDiv' + i);
      this.teller++;
      if(this.teller === this.total){
        this.teller = 0;
      }

      await html2canvas(input, {
        scale: 1
      }
        ).then(canvas => {
          runs++;
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 200, 150);
          if(runs != big){
            pdf.addPage();
          }
    	});

      skriv();
    }
  }

  hide(){

    this.maks = this.ymse[this.menyID.value].resultat.maks;
    this.large = this.ymse[this.menyID.value].resultat.large;
    this.resultat = this.ymse[this.menyID.value].resultat.resultat;
    let streng = this.menyValg[this.menyID.value].type;
    this.divNavn = streng.replace(/\s/g, "");

    let blokk = document.getElementById(this.divNavn);
    if(blokk.style.display === 'none'){
      blokk.style.display = "block";
    } else {
      blokk.style.display = "none";
    }

  }

  render(){
    return(
      <>
        <div id="statMeny">
          <div>
            <GronnKnapp onClick={this.hide}>Knapp</GronnKnapp>
          </div>
          <div>
            <progress value={this.teller} max={this.total} ></progress>
          </div>
          <div>
            <FormGroup controlId="formControlsSelect">
              <FormControl
                componentClass="select"
                onChange={this.hide}
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
        <div id={this.divNavn} style={{display: 'block', overflowX: 'scroll', zoom: '65%', marginLeft: '15%', marginRight: '10%'}}>
        {this.resultat.map(e => (
          <StatBar maks={this.maks} text={this.menyValg[this.menyID.value].type} label="Antall feil" elementID={e.id} labels={e.navn} data={e.antall} ></StatBar>
        ))}
        </div>
      </>
    );
  }

  async mounted(){

    //feil per kommune
    let info = await statistikkService.hentFeilPerKommune();
    let kom = await generellServices.hentAlleKommuner();

    this.splitt(info, kom, 'Feil per kommune');

    this.maks = this.ymse[this.menyID.value].resultat.maks;
    this.large = this.ymse[this.menyID.value].resultat.large;
    this.resultat = this.ymse[this.menyID.value].resultat.resultat;

    let feilPerAar = await statistikkService.hentFeilPerAar();
    console.log(feilPerAar.data);
  }

  splitt(info, kom, grafnavn){
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
