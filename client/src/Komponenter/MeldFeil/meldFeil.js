import * as React from 'react';
import { Component } from 'react-simplified';
import { PositionMap } from '../../Moduler/kart/map';

export class MeldFeil extends Component {

    data = {
        kommune_id: 1,
        kategori_id: 1,
        subkategori_id: 1,
        overskrift: "",
        beskrivelse: "",
        lengdegrad: 0,
        breddegrad: 0
    }

    render() {
        return (
            <div align="center">
                <h1>Meld inn en feil/mangel</h1>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <label htmlFor="kom">Kommune:</label>
                                <br />
                                <select id="kom" value={this.data.kommune_id} name="kommune_id" onChange={this.endreVerdi}></select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="kat">Kategori:</label>
                                <br />
                                <select id="kat" value={this.data.kategori_id} name="kategori_id" onChange={this.endreVerdi}></select>
                            </td>

                            <td>
                                <label htmlFor="sub">Subkategori:</label>
                                <br />
                                <select id="sub" value={this.data.subkategori_id} name="subkategori_id" onChange={this.endreVerdi}></select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="ove">Overskrift:</label>
                                <br />
                                <input type="text" id="ove" value={this.data.overskrift} name="overskrift" onChange={this.endreVerdi} />
                            </td>
                            <td>
                                <label htmlFor="bil">Bilder:</label>
                                <br />
                                <input type="file" id="bil" accept="image/*" name="bil" multiple />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <label htmlFor="bes">Beskrivelse:</label>
                                <br />
                                <textarea type="text" id="bes" value={this.data.beskrivelse} name="beskrivelse" onChange={this.endreVerdi}></textarea>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <label htmlFor="pos">Posisjon:</label>
                                <button onClick={this.velgMinPosisjon}>Velg min nåverende posisjon</button>
                                <PositionMap id="pos" width="300" height="300" id="posmap" center="Trondheim" position={this.posFunksjon} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button onClick={this.send}>Send</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    send() {
        let formData = new FormData();

        formData.append("kommune_id", this.data.kommune_id);
        formData.append("subkategori_id", this.data.subkategori_id);
        formData.append("overskrift", this.data.overskrift);
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