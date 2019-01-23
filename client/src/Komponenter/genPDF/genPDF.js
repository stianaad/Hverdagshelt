import * as React from 'react';
import {Component} from 'react-simplified';
import {genPDFService} from '../../services/genPDFService';
import {generellServices} from '../../services/generellServices.js';
import {feilService} from '../../services/feilService.js';
import {GronnKnapp, StatBar} from '../../widgets.js';
import * as html2canvas from 'html2canvas';

export class GenPDF extends Component {

  res = [];

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
          <canvas id="myChart"></canvas>
        </div>
        <div>
          <GronnKnapp onClick={this.print}>Last ned PDF</GronnKnapp>
        </div>
        <div>
        {this.res.map(e => (
          <StatBar elementID={e.id} text="Feil per kommune" label={e.navn} data={e.antall} ></StatBar>
        ))}
        </div>
      </>
    );
  }

  async mounted(){
    //<StatBar elementID={e.id} text="Feil per kommune" label={json.navn} data={json.antall} ></StatBar>
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

    let resultat = this.chunkArray(informasjon.data, 15);

    for(let i = 0; i < informasjon.data.length; i++){
      navn[i] = informasjon.data[i].navn;
      tall[i] = informasjon.data[i].antall;
    }

    let navnChunk =  this.chunkArray(navn, 15);
    let tallChunk = this.chunkArray(tall, 15);

    console.log(navnChunk);
    console.log(tallChunk);

    let stats = [];

    for(let i = 0; i < resultat.length; i++){
      stats.push({
        "id": i,
        "navn": navnChunk[i],
        "antall": tallChunk[i]
      })
    }

    console.log(stats);
    console.log(stats.map(e => e.id));
    this.res = stats;

    /*let myChart = document.getElementById('myChart').getContext('2d');

    Chart.defaults.global.defaultFontFamily = 'Lato';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';

    let barChart = new Chart(myChart, {
      type:'bar',
      data: {
        labels: navn,
        datasets: [{
          label: 'Antall feil',
          data: tall,
          backgroundColor: '#777',
          borderWidth: 1,
          borderColor: '#777',
          hovedBorderWidth: 3,
          hoverBorderColor: '#000'
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Feil per kommune',
          fontSize: 25
        },
        legend: {
          display: false,
          position: 'right',
          labels: {
            fontColor: '#000'
          }
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
          }
        },
        tooltips: {
          enabled: true
        },
        hover: {
            animationDuration: 1
        },
        animation: {
            duration: 1,
            onComplete: function () {
                var chartInstance = this.chart,
                    ctx = chartInstance.ctx;
                ctx.textAlign = 'center';
                ctx.fillStyle = '#777';
                ctx.textBaseline = 'bottom';

                this.data.datasets.forEach(function (dataset, i) {
                    var meta = chartInstance.controller.getDatasetMeta(i);
                    meta.data.forEach(function (bar, index) {
                        var data = dataset.data[index];
                        ctx.fillText(data, bar._model.x, bar._model.y - 5);

                    });
                });
            }
        }
      }
    });*/
  }
}
