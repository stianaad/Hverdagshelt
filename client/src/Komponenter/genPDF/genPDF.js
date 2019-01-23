import * as React from 'react';
import {Component} from 'react-simplified';
import {genPDFService} from '../../services/genPDFService';
import {generellServices} from '../../services/generellServices.js';
import {feilService} from '../../services/feilService.js';
import {GronnKnapp, StatBar} from '../../widgets.js';
import * as html2canvas from 'html2canvas';

export class GenPDF extends Component {

  resultat = [];

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

  print(){

    const input = document.getElementById('ToRenderAsPDF');
    const filename = "Statistikk.pdf";

  	html2canvas(input, {
      scale: 1
    }
      ).then(canvas => {
      	 let pdf = new jsPDF('p', 'mm', 'a4');
      	 pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 200, 150);
      	 pdf.save(filename);
  	});
  }

  render(){
    return(
      <>
        <div id="ToRenderAsPDF">
          <h1>Dette er en html2canvas og jsPDF demo</h1>
        </div>
        <div>
          <GronnKnapp onClick={this.print}>Last ned PDF</GronnKnapp>
        </div>
        <div>
        {this.resultat.map(e => (
          <StatBar elementID={e.id} text="Feil per kommune" label={e.navn} data={e.antall} ></StatBar>
        ))}
        </div>
      </>
    );
  }

  async mounted(){
    let info = await genPDFService.hentFeilPerKommune();
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

    let navnChunk =  this.chunkArray(navn, 15);
    let tallChunk = this.chunkArray(tall, 15);

    let stats = [];

    for(let i = 0; i < oppdeling.length; i++){
      stats.push({
        "id": i,
        "navn": navnChunk[i],
        "antall": tallChunk[i]
      })
    }

    this.resultat = stats;

    //husk å endre suggestedMax til større verdi enn det største antallet i antalltabellen
    //endre tittel og hoverlabel til å bli variabla og ikke hardkodet

  }
}
