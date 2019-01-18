import * as React from 'react';
import {Component} from 'react-simplified';
import {brukerService} from '../../services/brukerService';
import {PageHeader} from '../../Moduler/header/header';
import {Bedrift} from '../../objekter.js';
import {KommuneInput} from '../../Moduler/kommuneInput/kommuneInput';

export class RegistrerBedrift extends Component {
  bedriftInput = {
    orgnr: '',
    navn: '',
    telefon: '',
    epost: '',
    passord: '',
    bekreftPass: '',
  };
  passAdvarsel = '';
  advarsel = '';
  kommune;

  constructor(props) {
    super(props);
    this.kommune = React.createRef();
  }

  render() {
    return (
      <div>
        <PageHeader
          history={this.props.history}
          location={this.props.location}
        />
        <div className="container">
          <h2 className="text-center text-capitalize display-4">
            Registrer en bedrift
          </h2>
          <div>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label>Organisasjonsnummer:</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="ex: 120060080"
                    value={this.bedriftInput.orgnr}
                    onChange={this.endreVerdi}
                    name="orgnr"
                    required={true}
                  />
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label>Telefonnummer:</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="ex: 41404040"
                    value={this.bedriftInput.telefon}
                    onChange={this.endreVerdi}
                    name="telefon"
                    required={true}
                  />
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label>Bedriftsnavn:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Bedriftsnavn"
                    value={this.bedriftInput.navn}
                    onChange={this.endreVerdi}
                    name="navn"
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
                    value={this.bedriftInput.epost}
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
                    value={this.bedriftInput.passord}
                    onChange={this.endreVerdi}
                    name="passord"
                    required={true}
                  />
                  <small id="passHjelp" className="form-text text-muted">
                    Passordet må være minst 8 tegn langt
                  </small>
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
                    value={this.bedriftInput.bekreftPass}
                    onChange={this.endreVerdi}
                    name="bekreftPass"
                  />
                  <label id="passordSjekk">{this.advarsel}</label>
                </div>
              </div>
            </div>
            <div className="row knappDiv">
              <button
                id="registrer"
                className="btn btn-primary"
                onClick={this.lagre}
              >
                Registrer deg
              </button>
              <button
                id="avbryt"
                onClick={this.reRoute}
                className="btn btn-secondary"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  reRoute() {
    //Her skal vi sjekke hvor de kom fra, men dette er en temporær løsning
    this.props.history.push('/');
  }

  lagre() {
    let valid = true;

    let bedrift = new Bedrift(
      0,
      this.bedriftInput.epost,
      this.bedriftInput.passord,
      this.kommune.current.verdi,
      this.bedriftInput.orgnr,
      this.bedriftInput.navn,
      this.bedriftInput.telefon
    );

    if (!bedrift.kommune_id) {
      this.advarsel = 'Vennligst oppgi gyldig kommune';
      console.log(bedrift.kommune_id);
      valid = false;
    }

    if (bedrift.navn === '') {
      this.advarsel = 'Fyll ut bedriftsnavn';
      console.log(bedrift.navn);
      valid = false;
    }

    if (!bedrift.orgnr || bedrift.orgnr.length != 9) {
      this.advarsel = 'Organisasjonsnummer må være 9 siffer langt';
      console.log(bedrift.orgnr.length);
      console.log(bedrift.orgnr);
      valid = false;
    }

    if (!bedrift.telefon || bedrift.telefon.length != 8) {
      this.advarsel = 'Telefonnummer må være 8 siffer langt';
      console.log(bedrift.telefon);
      console.log(bedrift.telefon.length);
      valid = false;
    }

    if (!bedrift.passord || bedrift.passord.length < 8) {
      this.passAdvarsel = 'Passord må være minst 8 tegn';
      console.log(bedrift.passord);
      valid = false;
    }

    if (this.bedriftInput.bekreftPass != bedrift.passord) {
      this.advarsel = 'Passord stemmer ikke overens';
      valid = false;
    }

    if (!bedrift.epost.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      this.advarsel = 'E-post er ikke gyldig';
      console.log(bedrift.epost);
      valid = false;
    }
    if (valid) {
      brukerService.lagNyBedriftBruker(bedrift).then((res) => {
        this.props.history.push('/');
      });
    }
  }

  endreVerdi(e) {
    const target = e.target;
    const value =
      target.type === 'checkbox' ? (target.checked ? 1 : 0) : target.value;
    const name = target.name;
    this.bedriftInput[name] = value;
  }
}
