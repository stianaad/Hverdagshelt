
/* eslint eqeqeq: "off" */

import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import L from 'leaflet';

class Feil {
  feil_id = null;
  kommune_id = null;
  kommune_navn = null;
  kategori_id = null;
  kategori_navn = null;
  status_id = null;
  status_navn = null;
  overskrift = null;
  beskrivelse = null;
  bilde = null;
  lengdegrad = null;
  breddegrad = null;

  constructor(feil_id, kommune_id, kommune_navn, kategori_id, kategori_navn,
              overskrift, beskrivelse, status_id, status_navn, bilde, lengdegrad,
              breddegrad) {
    this.feil_id = feil_id;
    this.kommune_id = kommune_id;
    this.kommune_navn = kommune_navn;
    this.kategori_id = kategori_id;
    this.kategori_navn = kategori_navn;
    this.status_id = status_id;
    this.status_navn = status_navn;
    this.overskrift = overskrift;
    this.beskrivelse = beskrivelse;
    this.bilde = bilde;
    this.lengdegrad = lengdegrad;
    this.breddegrad = breddegrad;
  }
}

export class Marker {
  marker = L.marker();
  hoverPopup = L.popup().setContent('<p>Hover popup</p>');
  clickPopup = L.popup().setContent('<p>Click popup</p>');

  constructor(overskrift, beskrivelse, bildeurl, status, tid, kategori, breddegrad, lengdegrad) {
    let iconName = status == 0 ? null : status == 1 ? "warningicon" : status == 2 ? "processingicon" : "successicon";
    this.marker.setLatLng(L.latLng(breddegrad, lengdegrad));
    if (status != 0) {
      this.marker.setIcon(new L.Icon({
        iconUrl: iconName+'.png',
        iconSize: [30, 30]
      }));
    }
    this.hoverPopup.setContent('<h3>'+kategori+'</h3>');
    this.clickPopup.setContent('<h3>'+overskrift+'</h3><br><p>'+beskrivelse+'</p>');
    this.marker.on('mouseover', (e) => {this.marker.bindPopup(this.hoverPopup).openPopup()});
    this.marker.on('mouseout', (e) => {this.marker.closePopup().unbindPopup();});
    this.marker.on('click', (e) => {
      this.marker.closePopup().unbindPopup();
      this.marker.removeEventListener('mouseout');
      this.marker.bindPopup(this.clickPopup).openPopup();
    });
    this.marker.on('popupclose', (e) => {
      this.marker.on('mouseout', (e) => {this.marker.closePopup().unbindPopup();})
    })
  }
}

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
      //this.props.markers[0].marker.addTo(this.map);
      for (let i = 0; i < m.length; i++) {
        m[i].marker.addTo(this.map);
      }
    });
  }

  render() {
    return (
      <div style={{width:this.props.width+"px", height:this.props.height+"px"}} id={this.props.id}></div>
    )
  }
}

export class PositionMap extends Component {
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
      <div style={{width:this.props.width+"px", height:this.props.height+"px"}} id={this.props.id}></div>
    )
  }
}

/**
 * Renders alert messages using Bootstrap classes.
 */

export class Alert extends Component {
  alerts = [];

  render() {
    return (
      <>
        {this.alerts.map((alert, i) => (
          <div key={i} className={'alert alert-' + alert.type} role="alert">
            {alert.text}
            <button
              className="close"
              onClick={() => {
                this.alerts.splice(i, 1);
              }}
            >
              &times;
            </button>
          </div>
        ))}
      </>
    );
  }

  static success(text) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      for (let instance of Alert.instances()) instance.alerts.push({ text: text, type: 'success' });
    });
  }

  static info(text) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      for (let instance of Alert.instances()) instance.alerts.push({ text: text, type: 'info' });
    });
  }

  static warning(text) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      for (let instance of Alert.instances()) instance.alerts.push({ text: text, type: 'warning' });
    });
  }

  static danger(text) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      for (let instance of Alert.instances()) instance.alerts.push({ text: text, type: 'danger' });
    });
  }
}
/*
/**
 * Renders an information card using Bootstrap classes
 
export class Card extends Component<{ title: React.Node,exact?: boolean,link: string,to: string, children?: React.Node }> {
  render() {
    return (
      <div className="card">
        <NavLink style={{ color: "black" }} exact={this.props.exact} to={this.props.to}>
          <img src={this.props.link} className={"card-img-top img-fluid"} />
          <div className="card-body">
            <h5 className="card-title text-center">{this.props.title}</h5>
            <div className="card-text"><i>{this.props.children}</i></div>
          </div>
        </NavLink>
      </div>
    );
  }
}

class ListGroupItem extends Component<{ to?: string, children: React.Node }> {
  render() {
    return this.props.to ? (
      <NavLink className="list-group-item" activeClassName="active" to={this.props.to}>
        {this.props.children}
      </NavLink>
    ) : (
        <li className="list-group-item">{this.props.children}</li>
      );
  }
}

/**
 * Renders a list group using Bootstrap classes
 
export class ListGroup extends Component<{
  children: React.Element<typeof ListGroupItem> | (React.Element<typeof ListGroupItem> | null)[] | null
}> {
  static Item = ListGroupItem;

  render() {
    return <ul className="list-group">{this.props.children}</ul>;
  }
}

class ListGroupItemInline extends Component<{ to: string, style?: Object, children: React.Node }> {
  render() {
    return (
      <NavLink className="list-inline-item mt-2 mr-5 ml-5" style={this.props.style} activeClassName="active" to={this.props.to}>
        {this.props.children}
      </NavLink>
    )
  }
}

export class ListGroupInline extends Component<{
  children: React.Element<typeof ListGroupItemInline> | (React.Element<typeof ListGroupItemInline> | null)[] | null
}> {
  static Item = ListGroupItemInline;

  render() {
    return <ul className="list-inline">{this.props.children}</ul>;
  }
}

export class CheckBox extends Component<{ checkBoxNavn: string, forandring: Object, disable?: boolean }> {
  render() {
    return (
      <div className={"form-check form-check-inline"}>
        <input className="form-check-input" type="checkbox" id={this.props.checkBoxNavn} disabled={this.props.disable} onChange={this.props.forandring} value={this.props.checkBoxNavn} />
        <label className="form-check-label" >{this.props.checkBoxNavn}</label>
      </div>
    )
  }
}

export class Overskrift extends Component<{ children: React.Node }> {
  render() {
    return <h1 className="text-center">{this.props.children}</h1>;
  }
}

export class ContainerFluid extends Component<{ children: React.Node }> {
  render() {
    return <div className={"container-fluid"}>{this.props.children}</div>;
  }
}

/**
 * Renders a row using Bootstrap classes
 
export class Row extends Component<{ children: React.Node, styles?: Object }> {
  render() {
    return <div className={"row"} style={this.props.styles}>{this.props.children}</div>;
  }
}

/**
 * Renders a column with specified width using Bootstrap classes
 
export class Column extends Component<{ bredde: number, children?: React.Node }> {
  render() {
    return <div className={'col-sm-' + this.props.bredde}>{this.props.children}</div>;
  }
}

class NavBarBrand extends Component<{ children?: React.Node }> {
  render() {
    if (!this.props.children) return null;
    return (
      <NavLink className="navbar-brand" style={{ font: "400 100px/1.5  Pacifico,Helvetica, sans-serif", textShadow: "3px 3px 0px rgba(0,0,0,0.1), 7px 7px 0px rgba(0,0,0,0.05)", fontSize: "40px" }} activeClassName="active" exact to="/nyheter">
        {this.props.children}
      </NavLink>
    );
  }
}

class NavBarLinkLeft extends Component<{ to: string, exact?: boolean, children?: React.Node }> {
  render() {
    if (!this.props.children) return null;
    return (
      <NavLink className="nav-link " style={{ fontSize: "20px" }} activeClassName="active" exact={this.props.exact} to={this.props.to}>
        {this.props.children}
      </NavLink>
    );
  }
}

class NavBarLinkRight extends Component<{ to: string, exact?: boolean, children?: React.Node }> {
  render() {
    if (!this.props.children) return null;
    return (
      <NavLink className="nav-link " style={{ fontSize: "20px" }} activeClassName="active" exact={this.props.exact} to={this.props.to}>
        {this.props.children}
      </NavLink>
    );
  }
}

/**
 * Renders a navigation bar using Bootstrap classes
 
export class NavBar extends Component<{ children: React.Element<typeof NavBarBrand | typeof NavBarLinkLeft | typeof NavBarLinkRight>[] }> {
  static Brand = NavBarBrand;
  static LinkLeft = NavBarLinkLeft;
  static LinkRight = NavBarLinkRight;

  render() {
    return (
      <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
        <div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
          <ul className="navbar-nav mr-auto">{this.props.children.filter(child => child.type == NavBarLinkLeft)}</ul>
        </div>
        <div className="mx-auto order-0">
          <NavLink className="navbar-brand mx-auto" to="#">{this.props.children.filter(child => child.type == NavBarBrand)}</NavLink>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse2">
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
        <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
          <ul className="navbar-nav ml-auto">
            {this.props.children.filter(child => child.type == NavBarLinkRight)}
          </ul>
        </div>
      </nav>
    );
  }
}

export class Oppsett extends Component<{ sideBredde: number, sideTekst?: React.Node, midtBredde: number, children: React.Node }>{
  render() {
    return (
      <ContainerFluid>
        <Row>
          <Column bredde={this.props.sideBredde}>
            <div className="text-center">
              {this.props.sideTekst}
            </div>
          </Column>
          <Column bredde={this.props.midtBredde}>
            {this.props.children}
          </Column>
          <Column bredde={this.props.sideBredde}>
            <div className="text-center">
              {this.props.sideTekst}
            </div>
          </Column>
        </Row>
      </ContainerFluid>
    )
  }
}

class ButtonSuccess extends Component<{
  onClick: () => mixed,
  children: React.Node
}> {
  render() {
    return (
      <button type="button" className="btn btn-success" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

export class Input extends Component<{ tittelInput: string, children: React.Node }>{
  render() {
    return (
      <div className="input-group mb-3 ">
        <div className="input-group-prepend">
          <span className="input-group-text">{this.props.tittelInput}</span>
        </div>
        {this.props.children}
      </div>
    )
  }
}
*/