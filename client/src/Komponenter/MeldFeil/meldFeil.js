import * as React from 'react';
import { Component } from 'react-simplified';
import { FormInput, Droppboks, Droppbokss, GronnKnapp } from '../../widgets';
import { KommuneInput } from '../../Moduler/KommuneInput/KommuneInput';
import { PositionMap } from '../../Moduler/kart/map';
import { feilService } from '../../services/feilService';

export class MeldFeil extends Component {
  data = {
    kommune_id: 1,
    kategori_id: 1,
    subkategori_id: 1,
    overskrift: '',
    beskrivelse: '',
    lengdegrad: 0,
    breddegrad: 0,
  };

    kategoriene= [];
    subkategoriene = [];
    kominput = React.createRef();

    data = {
        overskrift: "",
        kommune_id: 1,
        kategori_id: 1,
        subkategori_id: 1,
        beskrivelse: "",
        lengdegrad: 0,
        breddegrad: 0,
        avsjekket: 0
    }

    render() {
        return (
            <div id="blokk">
              <div>
                <h1 id="overskrift" >Meld inn feil</h1>
              </div>
              <div>
                <div id="kommuneblokk">
                  <label id="kommunelbl" htmlFor="kom">Kommune:</label>
                  <KommuneInput onChange={this.getKom} ref={this.kominput}/>
                </div>
                <div id="overskriftblokk">
                  <FormInput
                    type="text"
                    label="Overskrift:"
                    onChange={event => (this.data.overskrift = event.target.value)}
                    required
                   />
                </div>
              </div>
              <div>
                <div id="kategoriblokk">
                  <label id="kategorilbl" htmlFor="kat">Kategori:</label>
                  <Droppboks id="dropp" onChange={this.handleChange} value={this.kategoriene} inputRef={node => {this.data.kategori_id = node}}/>
                </div>
                <div id="subkategoriblokk">
                  <label id="subkategorilbl" htmlFor="kat">Underkategori:</label>
                  <Droppbokss id="subdropp" value={this.subkategoriene} inputRef={node => {this.data.subkategori_id = node}}/>
                </div>
              </div>
              <div>
                <div id="beskblokk">
                  <label id="beskrivelselbl" htmlFor="bes">Beskrivelse:</label>
                  <br />
                  <textarea type="text" id="bes" value={this.data.beskrivelse} onChange={this.skrivefelt}></textarea>
                </div>
                  <div id="bilete">
                    <label id="billbl" htmlFor="bil">Bilder:</label>
                    <br />
                    <input type="file" id="bil" accept="image/*" name="bil" multiple />
                  </div>
              </div>
              <div id="posblokk">
                <label id="poslbl" htmlFor="pos">Posisjon:</label>
                <button onClick={this.velgMinPosisjon}>Velg min nåverende posisjon</button>
                <PositionMap width="100%" height="500px" id="posmap" center="Trondheim" position={this.posFunksjon}/>
              </div>
              <div id="sjekkboks">
                <div id="boksen">
                  <input onChange={this.endreVerdi} type="checkbox" name="Abonner" value="Abonner"/>
                </div>
                <div id="boksenlbl">
                  <label>Abonner på denne saken</label>
                </div>
              </div>
              <div id="meldinnknapp">
                <GronnKnapp onClick={this.testknapp}>Meld inn</GronnKnapp>
              </div>
            </div>
        );
    }

    async mounted() {
        let hkat = await feilService.hentAlleHovedkategorier();
        this.kategoriene = await hkat.data;
        let skat = await feilService.hentAlleSubkategorierPaaHovedkategori(this.data.kategori_id.value);
        this.subkategoriene = await skat.data;
    }

    async handleChange(e){
      this.data.kategori_id = e.target.value;
      let skat = await feilService.hentAlleSubkategorierPaaHovedkategori(this.data.kategori_id);
      this.subkategoriene = await skat.data;
    }

    skrivefelt(e){
      this.data.beskrivelse = e.target.value;
    }

    testknapp(){
      this.data.kommune_id = this.kominput.current.verdi;
      console.log(
        this.data.avsjekket + ":" + this.data.kommune_id + ":" + this.data.overskrift + ":" + this.data.kategori_id.value + ":" + this.data.subkategori_id.value + ":" + this.data.beskrivelse + ":" + this.data.lengdegrad + ":" + this.data.breddegrad
      );
    }

    send() {
        let formData = new FormData();
        this.data.kommune_id = this.kominput.current.verdi;
        formData.append("kommune_id", this.data.kommune_id);
        formData.append("overskrift", this.data.overskrift);
        formData.append("kategori_id", this.data.kategori_id.value);
        formData.append("subkategori_id", this.data.subkategori_id.value);
        formData.append("beskrivelse", this.data.beskrivelse);
        formData.append("lengdegrad", this.data.lengdegrad);
        formData.append("breddegrad", this.data.breddegrad);
        formData.append("avsjekket", this.data.avsjekket);

    formData.append('kommune_id', this.data.kommune_id);
    formData.append('subkategori_id', this.data.subkategori_id);
    formData.append('overskrift', this.data.overskrift);
    formData.append('beskrivelse', this.data.beskrivelse);
    formData.append('lengdegrad', this.data.lengdegrad);
    formData.append('breddegrad', this.data.breddegrad);

    let files = document.querySelector('#bil').files;
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      if (!file.type.match('image.*')) {
        continue;
      }
      formData.append('bilder', file, file.name);
    }

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/lagNyFeil ', true);
    xhr.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        alert('Innmeldingen var vellykket!');
        document.location = '/min-side';
      }
    };
    xhr.send(formData);
  }

  velgMinPosisjon() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log(pos);
      },
      () => alert('Geolokasjon støttes ikke av din nettleser')
    );
  }

  posFunksjon(pos) {
    this.data.breddegrad = pos.lat;
    this.data.lengdegrad = pos.lng;
  }

    endreVerdi(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? (target.checked ? 1 : 0) : target.value;
        const name = target.name;
        this.data.avsjekket = value;
    }

}
