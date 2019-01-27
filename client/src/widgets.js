/* eslint eqeqeq: "off" */

import * as React from 'react';
import {Component} from 'react-simplified';
import {NavLink} from 'react-router-dom';
import L from 'leaflet';
import {FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import ReactDOMServer from 'react-dom/server';

/**
 * En rød knapp
 * @reactProps {!function()} onClick - onClick funksjon må sendes som prop dersom man vil at knappen skal gjøre noe
 * @reactProps {React.Component[]} children 
 */
export class RodKnapp extends Component {
  render() {
    return (
      <button type="button" className="btn btn-danger" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

/**
 * En grønn knapp
 * @reactProps {!function()} onClick - onClick funksjon må sendes som prop dersom man vil at knappen skal gjøre noe
 * @reactProps {React.Component[]} children 
 */
export class GronnKnapp extends Component {
  render() {
    return (
      <button type="button" className="btn btn-success" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

export class StatBar extends Component <{text: string, label: string, maks: number, elementID: string, labels: string, data: number}> {

  render() {
    return (
      <React.Fragment>
        <div id={"barDiv" + this.props.elementID} style={{width: '2000px'}}>
          <canvas id={this.props.elementID}></canvas>
        </div>
      </React.Fragment>
    );
  }

  async mounted(){

    let myChart = document.getElementById(this.props.elementID).getContext('2d');

    Chart.defaults.global.defaultFontFamily = 'Lato';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';

    let barChart = new Chart(myChart, {
      type:'bar',
      data: {
        labels: this.props.labels,
        datasets: [{
          label: this.props.label,
          data: this.props.data,
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
          text: this.props.text,
          fontSize: 25
        },
        scales: {
          yAxes: [{
            ticks: {
              suggestedMax: this.props.maks,
              suggestedMin: 0
            }
          }]
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