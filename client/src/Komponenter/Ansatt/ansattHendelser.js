import * as React from 'react';
import {Component} from 'react-simplified';
import {PageHeader} from '../../Moduler/header/header';
import {Card, Feed, Grid, Button, Header, Icon, Input, Image, Modal, List, CardContent, Popup} from 'semantic-ui-react';
import {FeedEvent, Filtrer, Info, Hendelse} from '../../Moduler/cardfeed';
import {feilService} from '../../services/feilService';
import {hendelseService} from '../../services/hendelseService';
import {generellServices} from '../../services/generellServices';
import {markerTabell, ShowMarkerMap} from '../../Moduler/kart/map';
import {NavLink} from 'react-router-dom';
import {AnsattMeny} from './ansattMeny';
import {AdminMeny} from '../Admin/adminMeny';
import { Footer } from '../../Moduler/footer/footer';

export class AnsattHendelser extends Component {
  open = false;
  hendelser = [];
  kategorier = [];
  valgtHendelse = {
    kategorinavn: '',
    kommune_id: '',
    overskrift: '',
    tid: '',
    beskrivelse: '',
    sted: '',
    bilde: '',
    lengdegrad: '',
    billett: '',
    hendelse_id: -1,
  };

  valgtKat = {
    hendelse_id: '',
    kategorinavn: '',
  };
  dato = '';
  kl = '';

  openHendelse(hendelse) {;
    this.valgtHendelse = {...hendelse};
    console.log(this.valgtHendelse);
    let tidHentet = this.valgtHendelse.tid;
    let res = tidHentet.split(' ');
    console.log(res);
    this.dato = res[0];
    this.kl = res[1];
    this.open = true;
    console.log(this.valgtHendelse);
    console.log('dato: ' + this.dato + ' tid: ' + this.kl);

    let kat = this.kategorier.find((e) => e.kategorinavn === this.valgtHendelse.kategorinavn);
    this.valgtKat = {...kat};
  }

  handleKategori(kategori) {
    let kat = this.kategorier.find((e) => e.kategorinavn === kategori);
    this.valgtKat = {...kat};
  }

  render() {
    return (
      <div>
        <PageHeader history={this.props.history} location={this.props.location} />
        <div className="container-fluid vinduansatt">
          {global.payload.role == 'ansatt' ? (
            <AnsattMeny />
          ) : global.payload.role == 'admin' ? (
            <AdminMeny kommune={this.kommune} />
          ) : null}
          <div className="ansattContent">
            <div className="row mt-3 mb-3 justify-content-md-center">
              <h1>Hendelser</h1>
            </div>
            <div className="hendelseContainer" id="ansattHendelser">
              <Card.Group stackable itemsPerRow={3}>
                {this.hendelser.map((hendelse) => (
                  <Hendelse
                    bilde={hendelse.bilde}
                    overskrift={hendelse.overskrift}
                    sted={hendelse.sted}
                    kommune_navn={hendelse.kommune_navn}
                    tid={hendelse.tid}
                    key={hendelse.hendelse_id}
                    hendelse_id={hendelse.hendelse_id}
                    rediger={() => this.openHendelse(hendelse)}
                  />
                ))}
              </Card.Group>
            </div>
            <Footer/>
          </div>
        </div>
        <Modal open={this.open} onClose={() => (this.open = false)} style={{height: '90vh'}}>
          <Modal.Content scrolling>
            <div className="row justify-content-md-center mt-3 mb-3">
              <div className="col-sm-6 ansattContent">
                <h1 className="mt-3">Rediger hendelse</h1>
                <div className="form-row">
                  <div className="form-group col-md-4">
                    <label>Dato:</label>
                    <input
                      type="date"
                      className="form-control"
                      required={true}
                      onChange={(event) => (this.dato = event.target.value)}
                      value={this.dato}
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label>Start:</label>
                    <input
                      type="time"
                      className="form-control"
                      required={true}
                      onChange={(event) => (this.tid = event.target.value)}
                      value={this.kl}
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label>Kategori: </label>
                    <select className="form-control" onChange={(e) => this.handleKategori(e.target.value)}>
                      <option hidden>{this.valgtKat.kategorinavn}</option>
                      {this.kategorier.map((kategori) => (
                        <option value={kategori.kategorinavn} key={kategori.kategorinavn}>
                          {' '}
                          {kategori.kategorinavn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Overskrift</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Overskrift"
                    required={true}
                    onChange={(event) => (this.valgtHendelse.overskrift = event.target.value)}
                    value={this.valgtHendelse.overskrift}
                  />
                </div>
                <div className="form-group">
                  <label>Beskrivelse</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Fortell litt om ditt"
                    required={true}
                    onChange={(event) => (this.valgtHendelse.beskrivelse = event.target.value)}
                    value={this.valgtHendelse.beskrivelse}
                  />
                </div>
                <div className="form-group">
                  <label>Adresse</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Adresse"
                    required={true}
                    onChange={(event) => (this.valgtHendelse.sted = event.target.value)}
                    value={this.valgtHendelse.sted}
                  />
                </div>
                <div className="form-group">
                  <label>Link til billetter: </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="eks.billetter.com"
                    required={true}
                    value={this.valgtHendelse.billett}
                    onChange={(event) => (this.valgtHendelse.billett = event.target.value)}
                  />
                </div>
                <div className="form-group">
                  <div>
                    <label>Bilder:</label>
                    <br />
                    <Popup
                      trigger={<input type="file" id="bil" accept="image/*" name="bil" />}
                      content="Velg et bilde som beskriver hendelsen"
                      onChange={(e) => (this.bilde = e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={this.lagre} color="green">
                  Lagre
                </Button>
              </div>
            </div>
          </Modal.Content>
        </Modal>
        
      </div>
    );
  }

  async lagre() {
    let datotid = this.dato + ' ' + this.kl + ':00';
    let file = document.querySelector('#bil').files[0];

    let formData = new FormData();
    formData.append('hendelseskategori_id', this.valgtKat.hendelseskategori_id);
    formData.append('overskrift', this.valgtHendelse.overskrift);
    formData.append('tid', datotid);
    formData.append('beskrivelse', this.valgtHendelse.beskrivelse);
    formData.append('sted', this.valgtHendelse.sted);
    formData.append('billett', this.valgtHendelse.billett);
    if (file){
      formData.append('bilder', file, file.name);
    }
    formData.append('hendelse_id', this.valgtHendelse.hendelse_id);
    formData.append('kommune_id', this.valgtHendelse.kommune_id);

    let token = sessionStorage.getItem('pollett');
    if (token) {
      let xhr = new XMLHttpRequest();
      xhr.open('PUT', '/api/hendelser/' + this.valgtHendelse.hendelse_id, true);
      xhr.setRequestHeader('x-access-token', 'Bearer ' + token);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          global.sideRefresh();
        }
      };
      xhr.send(formData);
    } else {
      global.sidePush('/', true);
    }
  }

  async mounted() {
    const load = async (kommune_id) => {
      let res = await hendelseService.hentHendelserForKommune(kommune_id);
      this.hendelser = await res.data;
      await console.log(this.hendelser);

      let kat = await hendelseService.hentAlleKategorier();
      this.kategorier = await kat.data;
    };

    if (global.payload.role == 'ansatt') load(global.payload.user.kommune_id);
    else if (global.payload.role == 'admin') {
      let res = await generellServices.sokKommune(this.props.match.params.kommune);
      await Promise.resolve(res.data).then(async () => {
        if (res.data.length > 0) {
          this.kommune = res.data[0];
          load(this.kommune.kommune_id);
        }
      });
    }
  }
}
