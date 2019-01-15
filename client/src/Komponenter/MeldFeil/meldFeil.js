import * as React from 'react';
import { Component } from 'react-simplified';
import { Droppboks, GronnKnapp } from '../../widgets';
import { KommuneVelger } from '../../Moduler/KommuneVelger/KommuneVelger';
import { PositionMap } from '../../Moduler/kart/map';

class kategori{
  id;
  navn;

  constructor(
    id,
    navn
  ){
    this.id = id;
    this.navn = navn;
  }
}

let kat = [
  new kategori(1, "Hull"), new kategori(2, "Strømbrudd")
];

/* legg til subkategori og overskrift */

export class MeldFeil extends Component {

    data = {
        kommune_id: 1,
        kategori_id: 1,
        subkategori_id: 1,
        beskrivelse: "",
        lengdegrad: 0,
        breddegrad: 0
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
                  <Droppboks value={kat} inputRef={node => {this.data.kommune_id = node}}/>
                </div>
                <div id="kategoriblokk">
                  <label id="kategorilbl" htmlFor="kat">Kategori:</label>
                  <Droppboks id="dropp" value={kat} inputRef={node => {this.data.kategori_id = node}}/>
                </div>
              </div>
              <div>
                <div id="beskblokk">
                  <label id="beskrivelselbl" htmlFor="bes">Beskrivelse:</label>
                  <br />
                  <textarea type="text" id="bes" value={this.data.beskrivelse} name="beskrivelse" onChange={this.endreVerdi}></textarea>
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
                <PositionMap id="posmap" center="Trondheim" position={this.posFunksjon} />
              </div>
              <div id="sjekkboks">
                <div id="boksen">
                  <input type="checkbox" name="Abonner" value="Abonner"/>
                </div>
                <div id="boksenlbl">
                  <label>Abonner på denne saken</label>
                </div>
              </div>
              <div id="meldinnknapp">
                <GronnKnapp onClick={this.testerino}>Meld inn</GronnKnapp>
              </div>
            </div>
        );
    }

    testerino(){
      console.log(
        this.data.kommune_id + ":" + this.data.kategori_id.value + ":" + this.data.beskrivelse + ":" + this.data.lengdegrad + ":" + this.data.breddegrad
      );
    }

    send() {
        let formData = new FormData();

        formData.append("kommune_id", this.data.kommune_id);
        formData.append("kategori_id", this.data.kategori_id.value);
        formData.append("beskrivelse", this.data.beskrivelse);
        formData.append("lengdegrad", this.data.lengdegrad);
        formData.append("breddegrad", this.data.breddegrad);

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
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                alert("Innmeldingen var vellykket!")
                document.location = "/min-side";
            }
        }
        xhr.send(formData);
    }

    velgMinPosisjon() {
        navigator.geolocation.getCurrentPosition((pos) => {
            console.log(pos);
        }, () => alert("Geolokasjon støttes ikke av din nettleser"))
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
