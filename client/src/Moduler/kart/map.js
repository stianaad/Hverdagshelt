import L from 'leaflet';
import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Component } from 'react-simplified';

export function markerTabell(feiltabell, popup) {
  let tabell = [];
    for(let i = 0;i < feiltabell.length; i++){
      tabell[i] = new Marker(feiltabell[i], popup);
    }
    //console.log(tabell);
    return tabell;
}

class PopupContent extends Component {
    render() {
        return (
            <div>
                <h4>{this.props.overskrift}</h4>
                <p style={{ margin: '0' }}>
                    <span style={{ marginRight: '20px', color: 'grey', fontStyle: 'italic' }}>{this.props.kategori}</span>
                    <span style={{ color: 'grey', fontStyle: 'italic' }}>{this.props.tid}</span>
                    <span style={{ float: 'right' }}>{this.props.statusText}</span>
                </p>
                <p style={{ display: 'inline-block', maxWidth: '260px' }}>{this.props.beskrivelse.length > 300 ? this.props.beskrivelse.slice(0,300)+"... (Les mer via menyen)" : this.props.beskrivelse}</p>
                {!(this.props.bildeurl == undefined || this.bildeurl == "") &&
                    <img style={{ display: 'inline-block', maxWidth: '250px', maxHeight: '220px', margin: '0 0 0 20px', verticalAlign: 'text-bottom' }} src={this.props.bildeurl}></img>
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
    hoverPopup = L.popup({ maxWidth: 800 }).setContent('<p>Hover popup</p>');
    clickPopup = L.popup().setContent('<p>Click popup</p>');
    mouseover = (e) => { this.marker.bindPopup(this.hoverPopup).openPopup() };
    mouseout = (e) => { this.marker.closePopup().unbindPopup(); };
    markerclick = (e) => {
        this.marker.closePopup().unbindPopup();
        this.marker.removeEventListener('mouseout');
        this.marker.bindPopup(this.clickPopup, { maxWidth: 800 }).openPopup();
    };
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
    constructor(feil, popup) {
        this.popup = popup;
        let iconName = feil.status == 0 ? null : feil.status == "Ikke godkjent" ? "warningicon" : feil.status == "Under behandling" ? "processingicon" : "successicon";
        let statusText = feil.status == 0 ? "" : feil.status == "Ikke godkjent" ? <span style={{ color: 'red', fontStyle: 'italic' }}>Ikke godkjent</span> :
            feil.status == "Under behandling" ? <span style={{ color: 'orange', fontStyle: 'italic' }}>Under behandling</span> :
                <span style={{ color: 'green', fontStyle: 'italic' }}>Arbeid utført</span>;

        this.marker.setLatLng(L.latLng(feil.breddegrad, feil.lengdegrad));
        if (feil.status != 0) {
            this.marker.setIcon(new L.Icon({
                iconUrl: '/'+iconName + '.png',
                iconSize: [30, 30]
            }));
        }
        this.hoverPopup.setContent('<h4>' + feil.kategorinavn + '</h4>');
        this.clickPopup.setContent(ReactDOMServer.renderToString(<PopupContent tid={feil.tid} overskrift={feil.overskrift} statusText={statusText} beskrivelse={feil.beskrivelse} bildeurl={""} kategori={feil.kategorinavn}></PopupContent>));

        if (this.popup) {
            this.marker.on('mouseover', this.mouseover);
            this.marker.on('mouseout', this.mouseout);
            this.marker.on('click', this.markerclick);
            this.marker.on('popupclose', (e) => {
                this.marker.on('mouseout', (e) => { this.marker.closePopup().unbindPopup(); })
            });
        }
        
    }

    addTo(map) {
        this.marker.addTo(map);
    }

    updateMarker(feil) {
        let iconName = feil.status == 0 ? null : feil.status == "Ikke godkjent" ? "warningicon" : feil.status == "Under behandling" ? "processingicon" : "successicon";
        let statusText = feil.status == 0 ? "" : feil.status == "Ikke godkjent" ? <span style={{ color: 'red', fontStyle: 'italic' }}>Ikke godkjent</span> :
            feil.status == "Under behandling" ? <span style={{ color: 'orange', fontStyle: 'italic' }}>Under behandling</span> :
                <span style={{ color: 'green', fontStyle: 'italic' }}>Arbeid utført</span>;

        this.marker.setLatLng(L.latLng(feil.breddegrad, feil.lengdegrad));
        if (feil.status != 0) {
            this.marker.setIcon(new L.Icon({
                iconUrl: '/'+iconName + '.png',
                iconSize: [30, 30]
            }));
        }
        this.hoverPopup.setContent('<h4>' + feil.kategorinavn + '</h4>');
        this.clickPopup.setContent(ReactDOMServer.renderToString(<PopupContent tid={feil.tid} overskrift={feil.overskrift} statusText={statusText} beskrivelse={feil.beskrivelse} bildeurl={""} kategori={feil.kategorinavn}></PopupContent>));
        
        if (this.popup) {
            this.marker.on('mouseover', this.mouseover);
            this.marker.on('mouseout', this.mouseout);
            this.marker.on('click', this.markerclick);
            this.marker.on('popupclose', (e) => {
                this.marker.on('mouseout', (e) => { this.marker.closePopup().unbindPopup(); })
            });
        }
    }
}

/**
 * Kart for å vise feil. Feil ikoner kan trykkes på for å se videre informasjon. Bredde, høyde, id, markers, og stedsnavn sendes som props.
 * Må spesifisere props.center for å sentrere kartet på det gitte stedsnavnet.
 * For å flytte på kartet med nye breddegrad og lengdegrad tall må man inkludere onRef={ref => (this.kart = ref)}
 * Da kan man bruke this.kart.flyttKart(breddegrad, lengdegrad) for å flytte kartet.
 * @example
 * let myMarkers = [new Marker(), new Marker, new Marker()];
 * <MarkerMap width="1000px" height="500px" id="map3" markers={myMarkers} center="Trondheim,Trøndelag" onRef={ref => (this.kart = ref)}/>
 */
export class MarkerMap extends Component {
    map = null;

    componentDidMount() {
        this.props.onRef(this);

        let m = this.props.markers;
        
        let coords, map;

        fetch("https://nominatim.openstreetmap.org/?format=json&q=" + this.props.center + "&limit=1", {
            method: "GET"
        })
            .then(res => res.json())
            .then(json => {
                this.coords = [json[0].boundingbox[0], json[0].boundingbox[2], json[0].boundingbox[1], json[0].boundingbox[3]].map(el => parseFloat(el));
                this.coords = [[this.coords[0], this.coords[1]], [this.coords[2], this.coords[3]]];

                this.map = L.map(this.props.id, {
                    dragging: !L.Browser.mobile,
                    layers: [
                        L.tileLayer('https://maps.tilehosting.com/styles/streets/{z}/{x}/{y}.png?key=c1RIxTIz5D0YrAY6C81A', {
                            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        })
                    ]
                });
                this.map.on("load", () => {
                    this.props.callback();
                });
                this.map.fitBounds(this.coords).setZoom(10);
                //this.map.setView(L.latLng(this.props.bredde, this.props.lengde), 11);
                
                /*for (let i = 0; i < m.length; i++) {
                    m[i].marker.addTo(this.map);
                }*/
            });
    }

    componentWillUnmount() {
        this.props.onRef(null)
    }

    addMarkers(feil) {
        let marks = markerTabell(feil, true);
        for (let m of marks) {
            m.marker.addTo(this.map);
        }
    }

    flyttKart(bredde, lengde) {
        this.map.setView(L.latLng(bredde, lengde), 15);
    }

    render() {
        return (
            <div style={{ width: this.props.width, height: this.props.height }} id={this.props.id}></div>
        )
    }
}

/**
 * Trenger id, width, height, og feil obkjekt
 */
export class ShowMarkerMap extends Component {
    map = null;
    f = this.props.feil;
    m = null;

    componentDidMount() {
        console.log(this.f);
        this.map = L.map(this.props.id, {
            center: L.latLng(this.f.breddegrad, this.f.lengdegrad),
            zoom: 13,
            dragging: !L.Browser.mobile,
            layers: [
                L.tileLayer('https://maps.tilehosting.com/styles/streets/{z}/{x}/{y}.png?key=c1RIxTIz5D0YrAY6C81A', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                })
            ]
        });

        this.m = new Marker(this.f, false);
        this.m.marker.addTo(this.map);
    }

    updateMap(newFeil) {
        console.log(this.f);
        this.map = L.map(this.props.id, {
            center: L.latLng(this.f.breddegrad, this.f.lengdegrad),
            zoom: 13,
            dragging: !L.Browser.mobile,
            layers: [
                L.tileLayer('https://maps.tilehosting.com/styles/streets/{z}/{x}/{y}.png?key=c1RIxTIz5D0YrAY6C81A', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                })
            ]
        });

        this.m = new Marker(this.f).removePopup();
        this.m.marker.addTo(this.map);
    }

    shouldComponentUpdate(next) {
        let center = this.map.getCenter();
        if (center.lat != next.feil.breddegrad && center.lng != next.feil.lengdegrad) {
            this.map.setView(L.latLng(next.feil.breddegrad, next.feil.lengdegrad));
            this.m.updateMarker(next.feil);
            return true;
        }
        else {
            return false;
        }
    }

    render() {
        console.log("render");
        return (
            <div style={{ width: this.props.width, height: this.props.height }} id={this.props.id}></div>
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
        this.map.locate({ setView: true, maxZoom: 14 });
        this.map.on('locationfound', () => {
            if (this.marker == undefined) {
                this.marker = L.marker(this.map.getCenter(), {
                    draggable: !L.Browser.mobile
                }).addTo(this.map);
            }
        });
    }

    clicked(e) {
        if (this.marker == undefined) {
            this.marker = L.marker(e.latlng, {
                draggable: !L.Browser.mobile
            }).addTo(this.map);
        }
        else {
            this.marker.setLatLng(e.latlng);
        }
        this.props.position(this.marker.getLatLng());
    }

    componentDidMount() {
        let coords, map;
        fetch("https://nominatim.openstreetmap.org/?format=json&q=" + this.props.center + "&limit=1", {
            method: "GET"
        })
            .then(res => res.json())
            .then(json => {
                this.coords = [json[0].boundingbox[0], json[0].boundingbox[2], json[0].boundingbox[1], json[0].boundingbox[3]].map(el => parseFloat(el));
                this.coords = [[this.coords[0], this.coords[1]], [this.coords[2], this.coords[3]]];
                this.map = L.map(this.props.id, {
                    tap: false,
                    scrollWheelZoom: !L.Browser.mobile,
                    dragging: !L.Browser.mobile,
                    layers: [
                        L.tileLayer('https://maps.tilehosting.com/styles/streets/{z}/{x}/{y}.png?key=c1RIxTIz5D0YrAY6C81A', {
                            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        })
                    ]
                })
                .on('click', this.clicked)
                .fitBounds(this.coords)
                .setZoom(11);
            });
    }

    render() {
        return (
            <div style={{ width: this.props.width, height: this.props.height, position: 'relative' }}>
                <div style={{ width: "100%", height: "100%" }} id={this.props.id}></div>
                <button style={{ position: 'absolute', top: '10px', right: '10px', zIndex: '900', height: '35px', cursor: 'pointer' }} id="locatebtn" type="button" onClick={this.locateMe} onTouchStart={this.locateMe}>Finn Meg</button>
            </div>
        )
    }
}