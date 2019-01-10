import * as React from 'react';
import {Component} from 'react-simplified';

export class BildeTest extends Component {
  render() {
    return (
      <div>
        <input id="kom" type="number" value="123" />
        <input id="kat" type="number" value="1" />
        <input id="ov" type="text" value="overskrift" />
        <input id="be" type="text" value="beskrivelse" />
        <input id="bi" type="text" value="bilde" />
        <input id="lat" type="number" value="1" />
        <input id="lng" type="number" value="1" />
        <input id="ph" type="file" multiple />
        <button onClick={this.send}>Send</button>
      </div>
    );
  }
  send() {
    let formData = new FormData();

    formData.append('kommune_id', document.querySelector('#kom').value);
    formData.append('kategori_id', document.querySelector('#kat').value);
    formData.append('overskrift', document.querySelector('#ov').value);
    formData.append('beskrivelse', document.querySelector('#be').value);
    formData.append('bilde', document.querySelector('#bi').value);
    formData.append('lengdegrad', document.querySelector('#lat').value);
    formData.append('breddegrad', document.querySelector('#lng').value);

    let fileSelect = document.querySelector('#ph');
    let files = fileSelect.files;
    console.log(files.length);
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
        let myArr = JSON.parse(this.responseText);
        document.location = myArr.url;
      }
    };
    xhr.send(formData);
  }
}
