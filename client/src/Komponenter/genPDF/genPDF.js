import * as React from 'react';
import {Component} from 'react-simplified';
import {genPDFService} from '../../services/genPDFService';
import {generellServices} from '../../services/generellServices.js';
import {feilService} from '../../services/feilService.js';
import {GronnKnapp} from '../../widgets.js';
import * as html2canvas from 'html2canvas';

export class GenPDF extends Component {

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
      </>
    );
  }

  async mounted(){
    let info = await genPDFService.hentFeilPerKommune();
    let kom = await generellServices.hentAlleKommuner();
    let feil = await feilService.hentAlleFeil();

    console.log(info.data);
    console.log(kom.data);

    let navn = [];
    let tall = [];
    let komnavn =  [];

    

    for(let i = 0; i < info.data.length; i++){
      navn[i] = info.data[i].kommune_navn;
      tall[i] = info.data[i].antall;
    }

    for(let i = 0; i < kom.data.length; i++){
      komnavn[i] = kom.data[i].kommune_navn;
    }

    let res = this.chunkArray(komnavn, 15);
    console.log(res);

    let myChart = document.getElementById('myChart').getContext('2d');

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
    });
  }
}
