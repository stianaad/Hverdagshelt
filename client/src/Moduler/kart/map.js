import * as React from 'react';
import { Component } from 'react-simplified';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';

class PopupContent extends Component {
    render() {
      return (
        <div>
          <h4>{this.props.overskrift}</h4>
          <p style={{margin:'0'}}>
            <span style={{marginRight: '20px', color:'grey', fontStyle:'italic'}}>{this.props.kategori}</span>
            <span style={{color:'grey', fontStyle:'italic'}}>{this.props.tid}</span>
            <span style={{float:'right'}}>{this.props.statusText}</span>
          </p>
          <p style={{display:'inline-block', maxWidth:'260px'}}>{this.props.beskrivelse}</p>
          {!(this.props.bildeurl == undefined || this.bildeurl == "") &&
            <img style={{display:'inline-block',maxWidth:'250px', maxHeight:'220px', margin:'0 0 0 20px', verticalAlign:'text-bottom'}} src={this.props.bildeurl}></img>
          }
        </div>
      )
    }
  }
  
  /**
   * Marker for kart, må legges til i en MarkerMap. Sendes vanligvis til karter og den legger det til automatisk.
   * @example
   * let myMarker = new Marker("tittel", "beskrivelse", 1, "10/21/30", "kategori", 59.456, 10.712);
   * myMarker.addTo(map);
   */
  export class Marker {
    marker = L.marker();
    hoverPopup = L.popup({maxWidth: 800}).setContent('<p>Hover popup</p>');
    clickPopup = L.popup().setContent('<p>Click popup</p>');
    /**
     * 
     * @param {string} overskrift 
     * @param {string} beskrivelse 
     * @param {string} bildeurl 
     * @param {integer} status 
     * @param {string} tid 
     * @param {string} kategori 
     * @param {double} breddegrad 
     * @param {double} lengdegrad 
     */
    constructor(overskrift, beskrivelse, bildeurl, status, tid, kategori, breddegrad, lengdegrad) {
      let iconName = status == 0 ? null : status == 1 ? "warningicon" : status == 2 ? "processingicon" : "successicon";
      let statusText = status == 0 ? "" : status == 1 ? <span style={{color:'red', fontStyle:'italic'}}>Mottat</span> : 
                       status == 2 ? <span style={{color:'orange', fontStyle:'italic'}}>Under behandling</span> :
                                     <span style={{color:'green', fontStyle:'italic'}}>Arbeid utført</span>;
  
      this.marker.setLatLng(L.latLng(breddegrad, lengdegrad));
      if (status != 0) {
        this.marker.setIcon(new L.Icon({
          iconUrl: iconName+'.png',
          iconSize: [30, 30]
        }));
      }
      this.hoverPopup.setContent('<h4>'+kategori+'</h4>');
      this.clickPopup.setContent(ReactDOMServer.renderToString(<PopupContent tid={tid} overskrift={overskrift} statusText={statusText} beskrivelse={beskrivelse} bildeurl={bildeurl} kategori={kategori}></PopupContent>));
  
      this.marker.on('mouseover', (e) => {this.marker.bindPopup(this.hoverPopup).openPopup()});
      this.marker.on('mouseout', (e) => {this.marker.closePopup().unbindPopup();});
      this.marker.on('click', (e) => {
        this.marker.closePopup().unbindPopup();
        this.marker.removeEventListener('mouseout');
        this.marker.bindPopup(this.clickPopup, {maxWidth: 800}).openPopup();
      });
      this.marker.on('popupclose', (e) => {
        this.marker.on('mouseout', (e) => {this.marker.closePopup().unbindPopup();})
      })
    }
  
    addTo(map) {
      this.marker.addTo(map);
    }
  }
  
  /**
   * Kart for å vise feil. Feil ikoner kan trykkes på for å se videre informasjon. Bredde, høyde, id, markers, og stedsnavn sendes som props.
   * Må spesifisere props.center for å sentrere kartet på det gitte stedsnavnet.
   * @example
   * let myMarkers = [new Marker(), new Marker, new Marker()];
   * <MarkerMap width="1000px" height="500px" id="map3" markers={myMarkers} center="Trondheim,Trøndelag"/>
   */
  export class MarkerMap extends Component {
    componentDidMount() {
      let m = this.props.markers;
      let coords, map;
  
      fetch("https://nominatim.openstreetmap.org/?format=json&q="+this.props.center+"&limit=1", {
        method: "GET"
      })
      .then(res => res.json())
      .then(json => {
        this.coords = [json[0].boundingbox[0], json[0].boundingbox[2], json[0].boundingbox[1], json[0].boundingbox[3]].map(el => parseFloat(el));
        this.coords = [[this.coords[0], this.coords[1]], [this.coords[2], this.coords[3]]];
  
        this.map = L.map(this.props.id, {
          layers: [
            L.tileLayer('https://maps.tilehosting.com/styles/streets/{z}/{x}/{y}.png?key=c1RIxTIz5D0YrAY6C81A', {
              attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            })
          ]
        })
        .fitBounds(this.coords).setZoom(11);
        
        for (let i = 0; i < m.length; i++) {
          m[i].marker.addTo(this.map);
        }
      });
    }
  
    render() {
      return (
        <div style={{width:this.props.width, height:this.props.height}} id={this.props.id}></div>
      )
    }
  }
  
  /**
   * Kart for å velge posisjon for en hendelse/feil. Bredde, høyde, id, stedsnavn, og en callback funksjon for å sende posisjon, sendes som props.
   * @example 
   * let pos = [0, 0]; // [breddegrad, lengdegrad]
   * let posFunkjson = (posisjon) => pos = posisjon;
   * <PositionMap width="50%" height="500px" id="posmap" center="Oslo" position={posFunksjon}/>
   */
  export class PositionMap extends Component {
    map = null;
    marker = null;
    locateMe() {
      let pos = {...this.map.getCenter()};
      let check = () => {
        if (pos.lat == this.map.getCenter().lat) {
          setTimeout(check, 100);
        } else {
          this.marker.setLatLng(this.map.getCenter());
        }
      }
      this.map.locate({setView:true, maxZoom:14});
      if (this.marker == undefined) {
        this.marker = L.marker(L.latLng(0,0), {
          draggable: true
        }).addTo(this.map);
      }
      check();
    }
  
    clicked(e) {
      if (this.marker == undefined) {
        this.marker = L.marker(e.latlng, {
          draggable: true
        }).addTo(this.map);
      }
      else {
        this.marker.setLatLng(e.latlng);
      }
      this.props.position(this.marker.getLatLng());
    }
  
    componentDidMount() {
      let coords, map;
      fetch("https://nominatim.openstreetmap.org/?format=json&q="+this.props.center+"&limit=1", {
        method: "GET"
      })
      .then(res => res.json())
      .then(json => {
        this.coords = [json[0].boundingbox[0], json[0].boundingbox[2], json[0].boundingbox[1], json[0].boundingbox[3]].map(el => parseFloat(el));
        this.coords = [[this.coords[0], this.coords[1]], [this.coords[2], this.coords[3]]];
        this.map = L.map(this.props.id, {
          layers: [
            L.tileLayer('https://maps.tilehosting.com/styles/streets/{z}/{x}/{y}.png?key=c1RIxTIz5D0YrAY6C81A', {
              attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            })
          ]
        })
        .on('click', this.clicked)
        .fitBounds(this.coords).setZoom(11);
      });
    }
  
    render() {
      return (
        <div style={{width:this.props.width, height:this.props.height, position:'relative'}}>
          <div style={{width:"100%", height:"100%"}} id={this.props.id}></div>
          <button style={{position:'absolute', top:'10px',right:'10px', zIndex:'10000', height:'35px'}} type="button" onClick={this.locateMe}>Locate Me</button>
        </div>
      )
    }
  }