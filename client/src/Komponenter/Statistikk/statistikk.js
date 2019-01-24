import * as React from 'react';
import {Component} from 'react-simplified';
import {statistikkService} from '../../services/statistikkService';
import {generellServices} from '../../services/generellServices.js';
import {feilService} from '../../services/feilService.js';
import {GronnKnapp, StatBar} from '../../widgets.js';
import * as html2canvas from 'html2canvas';

export class Statistikk extends Component {

  resultat = [];
  maks = 0;
  large = 0;

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
      if(runs === 1){
        let data = pdf.output('datauristring');
        console.log(data);
        //pdf.save(filename);

        fetch("http://localhost:3000/api/filstreng", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({"info": data})
        })
        .then(response => response.json())
        .then(json => JSON.stringify(json))
        .catch(error => console.error("Error " + error));
      }
    }

    //for(let i = 0; i < this.large; i++){
      let input = document.getElementById('barDiv' + 0);

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
    //}
  }

  render(){
    return(
      <>
        <div>
          <GronnKnapp onClick={this.print}>Last ned PDF</GronnKnapp>
        </div>
        <div id="bar">
        {this.resultat.map(e => (
          <StatBar maks={this.maks} text="Feil per kommune" label="Antall feil" elementID={e.id} text="Feil per kommune" labels={e.navn} data={e.antall} ></StatBar>
        ))}
        </div>
      </>
    );
  }

  async mounted(){
    let info = await statistikkService.hentFeilPerKommune();
    let kom = await generellServices.hentAlleKommuner();

    let informasjon =  {
      data: []
    }

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

    this.maks = largest + 5;

    let navnChunk =  this.chunkArray(navn, 15);
    let tallChunk = this.chunkArray(tall, 15);

    let stats = [];
    this.large = oppdeling.length;

    for(let i = 0; i < oppdeling.length; i++){
      stats.push({
        "id": i,
        "navn": navnChunk[i],
        "antall": tallChunk[i]
      })
    }

    this.resultat = stats;

  }
}
