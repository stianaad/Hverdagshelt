import * as React from 'react';
import { Component } from 'react-simplified';
import { hendelseService } from '../../services/hendelseService';
import { generellServices } from '../../services/generellServices';
import { HashRouter, Route, NavLink, Redirect, Switch, Link } from 'react-router-dom';
import { FeedEvent, FeedHendelse, Filtrer, Info, Hendelse, ModalHendelse } from '../../Moduler/cardfeed';
import { Card, Feed, Grid, Button, Header, Icon, Image, Modal, Dropdown, Popup, Label, Divider } from 'semantic-ui-react';
import { PageHeader } from '../../Moduler/header/header';
import {Footer} from '../../Moduler/footer/footer';
import { KommuneVelger } from '../../Moduler/KommuneVelger/kommuneVelger';
import { isNullOrUndefined, isUndefined, isNumber } from 'util';
import { brukerService } from '../../services/brukerService';
import { HendelseModal } from '../../Moduler/modaler/hendelsemodal';

/**
 * @ignore
 */
export class Hendelser extends Component {
  isOpen = false;
  hendelser = [];
  alleKategorier = [];
  skrivAlleKommuner = "Kommuner";
  skrivKategori = "Kategori";
  skrivFylke = "Fylke";
  skrivFraTid = "";
  skrivTilTid = "";
  skrivKommuneID = "";
  aktiveHendelser = [];
  link = "/hendelser";
  tider = [];
  hjemKommune = '';
  visFylke = false;
  kommuner = [];
  fylker = [];
  finnKommuneId = []

  hendelse = { hendelse_id: 0 };
  hendelseModal = false;



  tilbakestill() {
    this.aktiveHendelser = this.hendelser;
    this.skrivAlleKommuner = "Alle kommuner";
    this.skrivKategori = "Kategori"
    this.skrivKommuneID = "";
    this.skrivFraTid = ""
    this.skrivTilTid = ""
    this.skrivFylke = "Fylke";
    this.visFylke = false;
    document.getElementById("fylke").value = 0;
    document.getElementById("kategori").value = 0;
    document.getElementById("til").valueAsDate = null;
    document.getElementById("fra").valueAsDate = null;
    document.getElementById("kommuner").value = 0;
    this.filterAlle();
  }

  filterAlle() {
    this.aktiveHendelser = this.hendelser.filter((h) => ((h.kategorinavn === this.skrivKategori) || this.skrivKategori == "Kategori"))
      .filter(h => ((h.kommune_id === this.skrivKommuneID) || this.skrivKommuneID == "")).filter(h => ((h.tid >= this.skrivFraTid) || this.skrivFraTid == "")).filter(h => ((h.tid <= this.skrivTilTid) || this.skrivTilTid == ""))
      .filter(h => ((h.fylke_navn === this.skrivFylke) || this.skrivFylke == "Fylke"));
  }


  filterKategori(e) {
    this.skrivKategori = e.target.value;
    if (this.skrivKategori === "0") {
      this.skrivKategori = "Kategori";
      this.aktiveHendelser = this.hendelser;
      this.filterAlle();
    } else {
      this.filterAlle();
    }
  }

  filterFraTid(e) {
    let fraTid = document.getElementById("fra").value;
    if (fraTid === "0") {
      this.aktiveHendelser = this.hendelser;
      this.skrivFraTid = "";
      this.filterAlle()
    } else {
      this.skrivFraTid = fraTid;
      this.filterAlle();
      //this.aktiveHendelser= this.aktiveHendelser.filter((kat) => kat.tid > fraTid);
    }
  }

  filterTilTid(e) {
    let tilTid = document.getElementById("til").value;
    if (tilTid === "0") {
      this.aktiveHendelser = this.hendelser;
      this.skrivTilTid = "";
      this.filterAlle()
    } else {
      this.skrivTilTid = tilTid;
      this.filterAlle();
      //this.aktiveHendelser = this.aktiveHendelser.filter((kat) => kat.tid < tilTid);
    }
  }

  async filterKommune(e) {
    this.skrivKommuneID = parseInt(e.target.value);
    if (this.skrivKommuneID === 0) {
      this.aktiveHendelser = this.hendelser;
      this.visFylke = false;
      this.skrivAlleKommuner = "Alle kommuner";
      this.skrivKommuneID = "";
      this.filterAlle();
    } else {
      this.skrivAlleKommuner = this.kommuner.find(e => (e.kommune_id == this.skrivKommuneID)).kommune_navn;
      this.visFylke = true;
      this.skrivFylke = "Fylke";
      this.filterAlle();
      document.getElementById("fylke").value = 0;
    }
  }

  filterFylke(e) {
    this.skrivFylke = e.target.value;
    if (this.skrivFylke === "0") {
      this.skrivFylke = "Fylke";
      this.filterAlle();
    } else {
      this.filterAlle();
    }
  }

  handleOpen = () => {
    if (!this.isOpen) {
      this.isOpen = true;
    }
  };

  handleClose = () => {
    if (this.isOpen) {
      this.isOpen = false;
    }
  };

  toggleFilter() {
    let filter = document.querySelector("#hendelseFilter");
    if (filter.style.display == "none" || filter.style.display == "") {
      filter.style.display = "block";
    }
    else if (filter.style.display == "block") {
      filter.style.display = "none";
    }
  }

  render() {
    return (
      <div className="hendelseContainer" >
        <PageHeader history={this.props.history} />
        <HendelseModal abonner={true} key={this.hendelse.hendelse_id + this.hendelseModal} open={this.hendelseModal} hendelse={this.hendelse} onClose={() => { this.hendelseModal = false }} />
        <h1 className="text-center b-5" >Hendelser</h1>
        <div style={{width:"70vw", margin:"0 auto"}}>
          <button className="fluid ui button" onClick={()=>this.toggleFilter()}>Filtrer hendelser</button>
        </div>
        <form className="ui equal width form" id="hendelseFilter">
          <div className="two fields">
            <div className="field">
              <label>Kommune</label>
              <select 
                onChange={this.filterKommune}
                className="ui fluid dropdown"
                id="kommuner"
              >
                <option hidden> {this.skrivAlleKommuner}</option>
                <option value="0">Alle kommuner</option>
                {this.kommuner.map((sted) => (
                  <option
                    value={sted.kommune_id}
                    key={sted.kommune_navn}
                  >
                    {' '}
                    {sted.kommune_navn}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Fylke</label>
              <select
                onChange={this.filterFylke}
                className="ui fluid dropdown"
                disabled={this.visFylke}
                id="fylke"
              >
                <option hidden> {this.skrivFylke} </option>
                <option value="0"> Alle Fylker </option>
                {this.fylker.map((sted) => (
                  <option
                    value={sted.fylke_navn}
                    key={sted.fylke_navn}>
                    {' '}
                    {sted.fylke_navn}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="two fields">
            <div className="field">
              <label>Fra</label>
              <input
                onChange={this.filterFraTid}
                type="date"
                id="fra"
              />
            </div>
            <div className="field">
              <label>Til</label>
              <input
                onChange={this.filterTilTid}
                type="date"
                id="til"
              />
            </div>
          </div>
          <div className="fields">
            <div className="field"></div>
            <div className="field">
              <label>Kategori</label>
              <select
                onChange={this.filterKategori}
                className="ui fluid dropdown"
                id="kategori">
                <option hidden> {this.skrivKategori} </option>
                <option value="0"> Alle kategorier </option>
                {this.alleKategorier.map((kategori) => (
                  <option
                    value={kategori.kategorinavn}
                    key={kategori.kategorinavn}>
                    {' '}
                    {kategori.kategorinavn}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Tilbakestill filter</label>
              <Button
              type="button"
                primary
                onClick={() => {this.tilbakestill();}}>
                Tilbakestill
              </Button>
            </div>
            <div className="field"></div>
          </div>
        </form>
        {(this.aktiveHendelser.length >0) ? (<Card.Group stackable> 
          {this.aktiveHendelser.map(hendelse => (
            <Hendelse
              onClick={() => {
                this.hendelse = hendelse;
                this.hendelseModal = true;
              }}
              bilde={hendelse.bilde}
              overskrift={hendelse.overskrift}
              sted={hendelse.sted}
              kommune_navn={hendelse.kommune_navn}
              tid={hendelse.tid}
              key={hendelse.hendelse_id}
              hendelse_id={hendelse.hendelse_id}
            />))}
        </Card.Group>) : 
        (<Card centered>
          <Card.Content>
            <Header as="h4">Det er ingen hendelser i denne kommunen. Gå til filtrer hendelser for å skifte kommune.</Header>
          </Card.Content>
        </Card>)}
        <Footer/>
      </div>
    );
  }

  async hentData() {
    let res2 = await generellServices.hentAlleKommuner();
    this.kommuner = await res2.data;
    if (global.payload != null) {
      if (this.skrivAlleKommuner == "Kommuner") {
        this.skrivKommuneID = global.payload.user.kommune_id;
        let res1 = await res2.data.find(e => e.kommune_id == this.skrivKommuneID);
        this.skrivAlleKommuner = res1.kommune_navn;
      }
      if (this.skrivAlleKommuner != "Alle kommuner") {
        this.visFylke = true;
      }
      let res = await hendelseService.hentAlleHendelser();
      this.hendelser = await res.data;
      this.aktiveHendelser = await res.data;
      await this.filterAlle();
    }

    let res3 = await generellServices.hentAlleFylker();
    this.fylker = await res3.data;

    let res4 = await hendelseService.hentAlleKategorier();
    this.alleKategorier = await res4.data;
  }

  async mounted() {
    let res1 = '';
    if (global.payload == null) {
      res1 = await hendelseService.hentAlleHendelser();
    } else {
      res1 = await hendelseService.hentHendelserForKommune(global.payload.user.kommune_id);
    }
    this.hendelser = await res1.data;
    this.aktiveHendelser = await res1.data;
    console.log(this.hendelser);
    this.hentData();
  }
}
