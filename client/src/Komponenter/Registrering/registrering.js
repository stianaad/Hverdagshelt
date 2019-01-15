import * as React from 'react';
import { Component } from 'react-simplified';
import { brukerService } from '../../services/brukerService';
import { Privat } from '../../objekter.js';
import { KommuneInput } from '../../Moduler/kommuneInput/kommuneInput';

export class Registrering extends Component {
  brukerInput = {
    fornavn: '',
    etternavn: '',
    epost: '',
    passord: '',
    bekreftPass: '',
  };
  passAdvarsel = '';
  advarsel =  '';
  kommune = null;

  constructor(props) {
    super(props);
    this.kommune = React.createRef();
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>Fornavn:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Fornavn"
                value={this.brukerInput.fornavn}
                onChange={this.endreVerdi}
                name="fornavn"
                required={true}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>Etternavn:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Etternavn"
                value={this.brukerInput.etternavn}
                onChange={this.endreVerdi}
                name="etternavn"
                required={true}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>E-post:</label>
              <input
                type="text"
                className="form-control"
                placeholder="E-post"
                value={this.brukerInput.epost}
                onChange={this.endreVerdi}
                name="epost"
                required={true}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>Skriv inn din kommune: </label>
              <KommuneInput ref={this.kommune} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>Passord:</label>
              <input
                type="password"
                className="form-control"
                value={this.brukerInput.passord}
                onChange={this.endreVerdi}
                name="passord"
                required={true}
              />
              <label>{this.passAdvarsel}</label>
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>Bekreft passord:</label>
              <input
                type="password"
                className="form-control"
                required={true}
                value={this.brukerInput.bekreftPass}
                onChange={this.endreVerdi}
                name="bekreftPass"
              />
              <label id="passordSjekk">{this.advarsel}</label>
            </div>
          </div>
        </div>
        <div className="valg">
          <p>Hva ønsker du å bli varslet om i din kommune?</p>
          <br />
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
            <label className="form-check-label" htmlFor="defaultCheck1">
              Planlagt strømbrudd
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="defaultCheck2" />
            <label className="form-check-label" htmlFor="defaultCheck3">
              Planlagt vann- og avløpsarbeid
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="defaultCheck3" />
            <label className="form-check-label" htmlFor="defaultCheck3">
              Konserter
            </label>
          </div>
          <br />
          <p>Du kan endre varselinnstillinger på MinSide senere.</p>
        </div>
        <br />
        <div className="row knappDiv">
          <button id="registrer" className="btn btn-primary" onClick={this.lagre}>
            Registrer deg
          </button>
          <button id="avbryt" className="btn btn-secondary">
            Avbryt
          </button>
        </div>
      </div>
    );
  }

  lagre() {
    if (this.brukerInput.passord.length < 8) {
      this.passAdvarsel = 'Passord må være minst 8 tegn';
    }

    if (this.brukerInput.bekreftPass === this.brukerInput.passord && this.brukerInput.passord.length >= 8) {
      this.advarsel = '';
      let bruker = new Privat(this.epost, this.passord, 1, this.fornavn, this.etternavn);

      brukerService
        .lagNyBruker(bruker)
        .then(history.push('/'))
        .catch(error => Alert.danger(error.message));
    } else {
      this.advarsel = 'Passord stemmer ikke';
    }
  }

  endreVerdi(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target.checked ? 1 : 0) : target.value;
    const name = target.name;
    this.brukerInput[name] = value;
  }
}
