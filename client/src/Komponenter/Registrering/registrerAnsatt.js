import * as React from 'react';
import {Component} from 'react-simplified';
import {brukerService} from '../../services/brukerService';
import {PageHeader} from '../../Moduler/header/header';
import {Ansatt} from '../../objekter.js';
import {KommuneInput} from '../../Moduler/kommuneInput/kommuneInput';

export class RegistrerAnsatt extends Component {
  ansattInput = {
    fornavn: '',
    etternavn: '',
    epost: '',
    telefon: '',
  };

  advarsel = '';
  kommune;

  constructor(props) {
    super(props);
    this.kommune = React.createRef();
  }

  render() {
    return (
      <div>
        <PageHeader history={this.props.history} location={this.props.location} />
        <h1 className="text-center text-capitalize display-4" id="regTittel">
          Registrering
        </h1>
        <div className="regContainer">
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label>Fornavn:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Fornavn"
                  value={this.ansattInput.fornavn}
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
                  value={this.ansattInput.etternavn}
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
                  value={this.ansattInput.epost}
                  onChange={this.endreVerdi}
                  name="epost"
                  required={true}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Telefon:</label>
                <input
                  type="number"
                  className="form-control"
                  value={this.ansattInput.telefon}
                  onChange={this.endreVerdi}
                  name="telefon"
                  required={true}
                />
                <small id="passHjelp" className="form-text text-muted">
                  Telefonnummer er 8 tegn langt
                </small>
                <label>{this.passAdvarsel}</label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label>Skriv inn din kommune: </label>
                <KommuneInput ref={this.kommune} />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="row knappDiv">
                <button id="registrer" className="btn btn-primary" onClick={this.lagre}>
                  Registrer deg
                </button>
                <button id="avbryt" onClick={this.reRoute} className="btn btn-secondary">
                  Avbryt
                </button>
              </div>
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
    let gyldig = true;

    let ansatt = new Ansatt(
      0,
      this.ansattInput.epost,
      '',
      this.ansattInput.fornavn,
      this.ansattInput.etternavn,
      this.kommune.current.verdi,
      this.ansattInput.telefon
    );

    if (!ansatt.kommune_id) {
      this.advarsel = 'Vennligst oppgi gyldig kommune';
      gyldig = false;
    }

    if (ansatt.fornavn === '' || ansatt.etternavn === '') {
      this.advarsel = 'Fyll ut begge navnboksene';
      gyldig = false;
    }

    if (!bedrift.telefon || bedrift.telefon.length != 8) {
      this.advarsel = 'Telefonnummer må være 8 siffer langt';
      gyldig = false;
    }

    if (!ansatt.epost.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      this.advarsel = 'E-post er ikke gyldig';
      gyldig = false;
    }
    if (gyldig) {
      brukerService.lagNyAnsattBruker(ansatt).then((res) => {
        this.props.history.push('/');
      });
    }
  }

  endreVerdi(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target.checked ? 1 : 0) : target.value;
    const name = target.name;
    this.ansattInput[name] = value;
  }
}
