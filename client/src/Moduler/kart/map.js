import L from 'leaflet';
import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import {Component} from 'react-simplified';

/**
 * Funksjon som tar en tabell med feil og gir en tabell med Marker for å vise feilene.
 * @param {!Feil[]} feiltabell - Tabell med feilobjekter
 * @param {!boolean} popup  - Boolean verdi som bestemmer om Marker objektene skal ha popup på hover
 * @return {Marker[]} Tabell med Marker objekter som representerer feilene
 */
export function markerTabell(feiltabell, popup) {
  let tabell = [];
  for (let i = 0; i < feiltabell.length; i++) {
    tabell[i] = new Marker(feiltabell[i], popup);
  }
  return tabell;
}

/**
 * Genererer HTML som skal vises i popups på markers
 * @access private
 * @param {!string} tid - Tiden som skal vises på popup
 * @param {!string} overskrift - Overskrift som skal vises på popup
 * @param {!string} statusText - Statusen som skal vises på popup
 * @param {!string} beskrivelse - Beskrivelsen som skal vises på popup
 * @param {!string} kategori - Kategorien som skal vises på popup
 */
class PopupContent extends Component {
  render() {
    return (
      <div>
        <h4>{this.props.overskrift}</h4>
        <p style={{margin: '0'}}>
          <span style={{marginRight: '20px', color: 'grey', fontStyle: 'italic'}}>{this.props.kategori}</span>
          <span style={{color: 'grey', fontStyle: 'italic'}}>{this.props.tid}</span>
          <span style={{float: 'right'}}>{this.props.statusText}</span>
        </p>
        <p style={{display: 'inline-block', maxWidth: '260px'}}>
          {this.props.beskrivelse.length > 300
            ? this.props.beskrivelse.slice(0, 300) + '... (Les mer via menyen)'
            : this.props.beskrivelse}
        </p>
        {!(this.props.bildeurl == undefined || this.bildeurl == '') && (
          <img
            style={{
              display: 'inline-block',
              maxWidth: '250px',
              maxHeight: '220px',
              margin: '0 0 0 20px',
              verticalAlign: 'text-bottom',
            }}
            src={this.props.bildeurl}
          />
        )}
      </div>
    );
  }
}

/**
 * Marker for kart, må legges til i en MarkerMap. Sendes vanligvis til karter og den legger det til automatisk.
 * @param {!Object} feil - Feilobjektet som skal representeres som marker
 * @param {!boolean} visPopup - Boolean verdi som bestemmer om markeren skal ha popup på hover event.
 * @example
 * let feil = {feil_id: 1, overskrift: "yo", ...};
 * let myMarker = new Marker(this.feil, true);
 * myMarker.addTo(map);
 */
export class Marker {
  marker = L.marker();
  hoverPopup = L.popup({maxWidth: 800}).setContent('<p>Hover popup</p>');
  clickPopup = L.popup().setContent('<p>Click popup</p>');
  mouseover = (e) => {
    this.marker.bindPopup(this.hoverPopup).openPopup();
  };
  mouseout = (e) => {
    this.marker.closePopup().unbindPopup();
  };
  markerclick = (e) => {
    this.marker.closePopup().unbindPopup();
    this.marker.removeEventListener('mouseout');
    this.marker.bindPopup(this.clickPopup, {maxWidth: 800}).openPopup();
  };

  constructor(feil, popup) {
    this.popup = popup;
    let iconName =
      feil.status == 0
        ? null
        : feil.status == 'Godkjent'
        ? 'warningicon'
        : feil.status == 'Under behandling'
        ? 'processingicon'
        : feil.status == 'Ferdig'
        ? 'successicon'
        : 'warningicon';
    let statusText =
      feil.status == 0 ? (
        ''
      ) : feil.status == 'Godkjent' ? (
        <span style={{color: 'red', fontStyle: 'italic'}}>Mottatt</span>
      ) : feil.status == 'Under behandling' ? (
        <span style={{color: 'orange', fontStyle: 'italic'}}>Under behandling</span>
      ) : (
        <span style={{color: 'green', fontStyle: 'italic'}}>Arbeid utført</span>
      );

    this.marker.setLatLng(L.latLng(feil.breddegrad, feil.lengdegrad));
    if (feil.status != 0) {
      this.marker.setIcon(
        new L.Icon({
          iconUrl: '/' + iconName + '.png',
          iconSize: [30, 30],
        })
      );
    }
    this.hoverPopup.setContent('<h4>' + feil.kategorinavn + '</h4>');
    this.clickPopup.setContent(
      ReactDOMServer.renderToString(
        <PopupContent
          tid={feil.tid}
          overskrift={feil.overskrift}
          statusText={statusText}
          beskrivelse={feil.beskrivelse}
          bildeurl={''}
          kategori={feil.kategorinavn}
        />
      )
    );

    if (this.popup) {
      this.marker.on('mouseover', this.mouseover);
      this.marker.on('mouseout', this.mouseout);
      this.marker.on('click', this.markerclick);
      this.marker.on('popupclose', (e) => {
        this.marker.on('mouseout', (e) => {
          this.marker.closePopup().unbindPopup();
        });
      });
    }
  }

  addTo(map) {
    this.marker.addTo(map);
  }

  updateMarker(feil) {
    let iconName =
      feil.status == 0
        ? null
        : feil.status == 'Godkjent'
        ? 'warningicon'
        : feil.status == 'Under behandling'
        ? 'processingicon'
        : feil.status == 'Ferdig'
        ? 'successicon'
        : 'warningicon';
    let statusText =
      feil.status == 0 ? (
        ''
      ) : feil.status == 'Ikke godkjent' ? (
        <span style={{color: 'red', fontStyle: 'italic'}}>Ikke godkjent</span>
      ) : feil.status == 'Under behandling' ? (
        <span style={{color: 'orange', fontStyle: 'italic'}}>Under behandling</span>
      ) : (
        <span style={{color: 'green', fontStyle: 'italic'}}>Arbeid utført</span>
      );

    this.marker.setLatLng(L.latLng(feil.breddegrad, feil.lengdegrad));
    if (feil.status != 0) {
      this.marker.setIcon(
        new L.Icon({
          iconUrl: '/' + iconName + '.png',
          iconSize: [30, 30],
        })
      );
    }
    this.hoverPopup.setContent('<h4>' + feil.kategorinavn + '</h4>');
    this.clickPopup.setContent(
      ReactDOMServer.renderToString(
        <PopupContent
          tid={feil.tid}
          overskrift={feil.overskrift}
          statusText={statusText}
          beskrivelse={feil.beskrivelse}
          bildeurl={''}
          kategori={feil.kategorinavn}
        />
      )
    );

    if (this.popup) {
      this.marker.on('mouseover', this.mouseover);
      this.marker.on('mouseout', this.mouseout);
      this.marker.on('click', this.markerclick);
      this.marker.on('popupclose', (e) => {
        this.marker.on('mouseout', (e) => {
          this.marker.closePopup().unbindPopup();
        });
      });
    }
  }
}

/**
 * Kart for å vise feil. Feil ikoner kan trykkes på for å se videre informasjon. Bredde, høyde, id, markers, og stedsnavn sendes som props.
 * Må spesifisere props.center for å sentrere kartet på det gitte stedsnavnet.
 * For å flytte på kartet med nye breddegrad og lengdegrad tall må man inkludere onRef={ref => (this.kart = ref)}
 * Da kan man bruke this.kart.flyttKart(breddegrad, lengdegrad) for å flytte kartet.
 * @param {!string} width - Bredden på kartet gitt som en CSS verdi
 * @param {!string} height - Høyden på kartet gitt som en CSS verdi
 * @param {!string} id - CSS id for kartet, brukes for å identifisere kartet
 * @param {!Marker[]} markers - Tabell med Marker objekter som skal vises på kartet
 * @param {!string} center - Stedsnavn som skal sentreres i kartet
 * @example
 * let myMarkers = [new Marker(), new Marker, new Marker()];
 * <MarkerMap width="1000px" height="500px" id="map3" markers={myMarkers} center="Trondheim,Trøndelag" onRef={ref => (this.kart = ref)}/>
 */
export class MarkerMap extends Component {
  map = null;
  loaded = false;
  componentDidMount() {
    this.props.onRef(this);

    let m = this.props.markers;

    let coords, map;

    fetch('https://nominatim.openstreetmap.org/?format=json&q=' + this.props.center + ' Norway&limit=1', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((json) => {
        this.coords = [
          json[0].boundingbox[0],
          json[0].boundingbox[2],
          json[0].boundingbox[1],
          json[0].boundingbox[3],
        ].map((el) => parseFloat(el));
        this.coords = [[this.coords[0], this.coords[1]], [this.coords[2], this.coords[3]]];

        this.map = L.map(this.props.id, {
          /*dragging: !L.Browser.mobile,*/
          layers: [
            L.tileLayer('https://maps.tilehosting.com/styles/streets/{z}/{x}/{y}.png?key=c1RIxTIz5D0YrAY6C81A', {
              attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            }),
          ],
        });
        this.map.on('load', () => {
          this.loaded = true;
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
    this.props.onRef(null);
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
    return <div style={{width: this.props.width, height: this.props.height, borderRadius:"5px"}} id={this.props.id} />;
  }
}

/**
 * Kart som viser en feil på et kart
 * @param {!string} width - Bredden på kartet gitt som en CSS verdi
 * @param {!string} height - Høyden på kartet gitt som en CSS verdi
 * @param {!string} id - CSS id for kartet, brukes for å identifisere kartet
 * @param {!Object} feil - Objektet av feilen som skal vises på kartet
 * @example
 * feil = {feil_id: 1, overskrift: "yo", ...};
 * <ShowMarkerMap width="50%" height="400px" id="visfeilkart" feil={this.feil} />
 */
export class ShowMarkerMap extends Component {
  map = null;
  f = this.props.feil;
  m = null;

  componentDidMount() {
    this.map = L.map(this.props.id, {
      center: L.latLng(this.f.breddegrad, this.f.lengdegrad),
      zoom: 13,
      dragging: !L.Browser.mobile,
      tap: !L.Browser.mobile,
      layers: [
        L.tileLayer('https://maps.tilehosting.com/styles/streets/{z}/{x}/{y}.png?key=c1RIxTIz5D0YrAY6C81A', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }),
      ],
    });

    this.m = new Marker(this.f, false);
    this.m.marker.addTo(this.map);
  }

  updateMap(newFeil) {
    this.map = L.map(this.props.id, {
      center: L.latLng(this.f.breddegrad, this.f.lengdegrad),
      zoom: 13,
      dragging: !L.Browser.mobile,
      tap: !L.Browser.mobile,
      layers: [
        L.tileLayer('https://maps.tilehosting.com/styles/streets/{z}/{x}/{y}.png?key=c1RIxTIz5D0YrAY6C81A', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }),
      ],
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
    } else {
      return false;
    }
  }

  render() {
    return <div style={{width: this.props.width, height: this.props.height, minHeight:"100px"}} id={this.props.id} />;
  }
}

/**
 * Kart for å velge posisjon for en hendelse/feil. Bredde, høyde, id, stedsnavn, og en callback funksjon for å sende posisjon, sendes som props.
 * @param {!string} width - Bredden på kartet gitt som en CSS verdi
 * @param {!string} height - Høyden på kartet gitt som en CSS verdi
 * @param {!string} id - CSS id for kartet, brukes for å identifisere kartet
 * @param {!string} center - Stedsnavn som skal sentreres i kartet
 * @param {function(posisjon: number[]): void} position - funksjon som kartet bruker for å sende posisjon.
 * @example
 * let pos = [0, 0]; // [breddegrad, lengdegrad]
 * let posFunkjson = (posisjon) => this.pos = posisjon;
 * <PositionMap width="50%" height="500px" id="posmap" center="Oslo" position={this.posFunksjon}/>
 */
export class PositionMap extends Component {
  map = null;
  marker = null;

  locateMe() {
    navigator.geolocation.getCurrentPosition((pos) => {
      //alert(pos.coords.latitude+":"+pos.coords.longitude);
      if (this.marker == undefined) {
        this.marker = L.marker({ lat: pos.coords.latitude, lng: pos.coords.longitude }, {
          draggable: !L.Browser.mobile,
        }).addTo(this.map);
      } else {
        this.marker.setLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      }
      this.props.position(this.marker.getLatLng());
      this.map.setView({ lat: pos.coords.latitude, lng: pos.coords.longitude }, 14)
    }, (err) => {
      //alert(err.code);
    });
  }

  clicked(e) {
    if (this.marker == undefined) {
      this.marker = L.marker(e.latlng, {
        draggable: !L.Browser.mobile,
      }).addTo(this.map);
    } else {
      this.marker.setLatLng(e.latlng);
    }
    this.props.position(this.marker.getLatLng());
  }

  componentDidMount() {
    let coords, map;
    fetch('https://nominatim.openstreetmap.org/?format=json&q=' + this.props.center + ' Norway&limit=1', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((json) => {
        this.coords = [
          json[0].boundingbox[0],
          json[0].boundingbox[2],
          json[0].boundingbox[1],
          json[0].boundingbox[3],
        ].map((el) => parseFloat(el));
        this.coords = [[this.coords[0], this.coords[1]], [this.coords[2], this.coords[3]]];
        this.map = L.map(this.props.id, {
          tap: false,
          scrollWheelZoom: !L.Browser.mobile,
          dragging: !L.Browser.mobile,
          layers: [
            L.tileLayer('https://maps.tilehosting.com/styles/streets/{z}/{x}/{y}.png?key=c1RIxTIz5D0YrAY6C81A', {
              attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            }),
          ],
        })
          .on('click', this.clicked)
          .fitBounds(this.coords)
          .setZoom(11);
      });
  }

  render() {
    return (
      <div style={{width: this.props.width, height: this.props.height, position: 'relative'}}>
        <div style={{width: '100%', height: '100%'}} id={this.props.id} />
        <button
          style={{position: 'absolute', top: '10px', right: '10px', zIndex: '900', height: '35px', cursor: 'pointer', backgroundColor:"white", borderRadius:"5px"}}
          
          id="locatebtn"
          onClick={this.locateMe}
          onTouchStart={this.locateMe}
          >
          Finn Meg
        </button>
      </div>
    );
  }
}
