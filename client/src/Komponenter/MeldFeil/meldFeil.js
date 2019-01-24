import * as React from 'react';
import {Component} from 'react-simplified';
import {FormGroup, FormControl} from 'react-bootstrap';
import {GronnKnapp} from '../../widgets';
import {KommuneInput} from '../../Moduler/kommuneInput/kommuneInput';
import {PositionMap} from '../../Moduler/kart/map';
import {feilService} from '../../services/feilService';
import {PageHeader} from '../../Moduler/header/header';
import queryString from 'query-string'

export class MeldFeil extends Component {
  kategoriene = [];
  subkategoriene = [];
  subkatfiltrert = [];
  defaultKommune = null;
  kommune = null;
  komin = React.createRef();

  data = {
    overskrift: '',
    kommune_id: -1,
    kategori_id: -1,
    subkategori_id: -1,
    beskrivelse: '',
    lengdegrad: 0,
    breddegrad: 0,
    abonner: 1,
  };

  advarsel = '';

  render() {
    return (
      <>
        <PageHeader history={this.props.history} location={this.props.location} />
        <div id="blokk">
          <div>
            <h1 id="overskrift">Meld inn feil</h1>
          </div>
          <div>
            <div id="kommuneblokk">
              <label id="kommunelbl" htmlFor="kom">
                Kommune:
              </label>
              <KommuneInput ref={this.komin} key={this.defaultKommune} kommune_id={this.defaultKommune} onChange={(e)=>{this.data.kommune_id = e.id; this.kommune = e.navn;}}/>
            </div>
            <div id="overskriftblokk">
            <label id="overskriftlbl" htmlFor="kom">
                Overskrift:
              </label>
              <input
                type="text"
                className="form-control"
                label="Overskrift:"
                name="overskrift"
                value={this.data.overskrift}
                onChange={this.endreVerdi}
                required
              />
            </div>
          </div>
          <div>
            <div id="kategoriblokk">
              <label id="kategorilbl" htmlFor="kat">
                Kategori:
              </label>
              <div>
                <FormGroup controlId="formControlsSelect">
                  <FormControl
                    componentClass="select"
                    onChange={this.handleChange}
                    inputRef={(node) => {
                      this.data.kategori_id = node;
                    }}
                  >
                    {this.kategoriene.map((katego) => (
                      <option key={katego.hovedkategori_id} value={katego.hovedkategori_id}>
                        {katego.kategorinavn}
                      </option>
                    ))}
                  </FormControl>
                </FormGroup>
              </div>
            </div>
            <div id="subkategoriblokk">
              <label id="subkategorilbl" htmlFor="kat">
                Underkategori:
              </label>
              <div>
                <FormGroup controlId="formControlsSelect">
                  <FormControl
                    componentClass="select"
                    inputRef={(node) => {
                      this.data.subkategori_id = node;
                    }}
                  >
                    {this.subkatfiltrert.map((subkatego) => (
                      <option key={subkatego.subkategori_id} value={subkatego.subkategori_id}>
                        {subkatego.kategorinavn}
                      </option>
                    ))}
                  </FormControl>
                </FormGroup>
              </div>
            </div>
          </div>
          <div>
            <div id="beskblokk">
              <label id="beskrivelselbl" htmlFor="bes">
                Beskrivelse:
              </label>
              <br />
              <textarea type="text" id="bes" value={this.data.beskrivelse} name="beskrivelse" onChange={this.endreVerdi} />
            </div>
            <div id="bilete">
              <label id="billbl" htmlFor="bil">
                Bilder:
              </label>
              <br />
              <input type="file" id="bil" accept="image/*" name="bil" multiple />
            </div>
          </div>
          <div id="posblokk">
            <label id="poslbl" htmlFor="pos">
              Posisjon:
            </label>
            {this.kommune && <PositionMap width="100%" height="500px" id="posmap" key={this.kommune} center={this.kommune} position={this.posFunksjon} />}
          </div>
          <div id="sjekkboks">
            <div id="boksen">
              <input onChange={this.endreVerdi} checked={!!this.data.abonner} name="abonner" type="checkbox" />
            </div>
            <div id="boksenlbl">
              <label>Abonner på denne saken</label>
            </div>
          </div>
          <div id="meldinnknapp">
            <GronnKnapp onClick={this.send}>Meld inn</GronnKnapp>
          </div>
          <label id="advarsel">{this.advarsel}</label>
        </div>
      </>
    );
  }

  async mounted() {
    let hkat = await feilService.hentAlleHovedkategorier();
    this.kategoriene = await hkat.data;
    let skat = await feilService.hentAlleSubkategorier();
    this.subkategoriene = await skat.data;
    this.subkatfiltrert = await skat.data.filter((kat) => 1 == kat.hovedkategori_id);

    const q = queryString.parse(this.props.location.search);
    if (q.k && Number.isInteger(parseInt(q.k))) {
      this.defaultKommune = parseInt(q.k);
    } else {
      this.defaultKommune = global.payload.user.kommune_id;
    }
  }

  async handleChange(e) {
    this.data.kategori_id = e.target.value;
    this.subkatfiltrert = this.subkategoriene.filter((kat) => this.data.kategori_id == kat.hovedkategori_id);
  }

  send() {
    let hjelpData = this.data;
    let gyldig = true;

    if (!this.komin.current.verdi) {
      this.advarsel = 'Vennligst oppgi gyldig kommune';
      gyldig = false;
    }

    if (hjelpData.overskrift === '') {
      this.advarsel = 'Vennligst oppgi overskrift';
      gyldig = false;
    }

    if (hjelpData.beskrivelse === '') {
      this.advarsel = 'Vennligst oppgi en beskrivelse';
      gyldig = false;
    }

    if (hjelpData.lengdegrad === 0 && hjelpData.breddegrad === 0) {
      this.advarsel = 'Vennligst oppgi en posisjon';
      gyldig = false;
    }

    if (hjelpData.kategori_id < 1 || hjelpData.subkategori_id < 1) {
      this.advarsel = 'Vennligst oppgi riktig kategori';
      gyldig = false;
    }

    if(gyldig){
      let formData = new FormData();
      this.data.kommune_id = this.komin.current.verdi;
      formData.append('kommune_id', this.data.kommune_id);
      formData.append('overskrift', this.data.overskrift);
      formData.append('kategori_id', this.data.kategori_id.value);
      formData.append('subkategori_id', this.data.subkategori_id.value);
      formData.append('beskrivelse', this.data.beskrivelse);
      formData.append('lengdegrad', this.data.lengdegrad);
      formData.append('breddegrad', this.data.breddegrad);
      formData.append('abonner', this.data.abonner);
      Array.from(document.querySelector('#bil').files).forEach((file) => {if (file.type.match('image.*')) formData.append('bilder', file, file.name);});

      let token = sessionStorage.getItem('pollett');
      if (token) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/feil ', true);
        xhr.setRequestHeader("x-access-token", 'Bearer ' + token)
        xhr.onreadystatechange = () => {
          if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            this.props.history.push('/');
          }
        };
        xhr.send(formData);
      } else {
        global.sidePush("/", true);
      }
    } else {

    }
  }

  posFunksjon(pos) {
    this.data.breddegrad = pos.lat;
    this.data.lengdegrad = pos.lng;
  }

  endreVerdi(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target.checked ? 1 : 0) : target.value;
    const name = target.name;
    this.data[name] = value;
  }
}
