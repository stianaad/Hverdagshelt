import * as React from 'react';
import {Component} from 'react-simplified';
import {brukerService} from '../../services/brukerService';
import {PageHeader} from '../../Moduler/header/header';
import {Footer} from '../../Moduler/footer/footer';
import {Privat} from '../../objekter.js';
import {KommuneInput} from '../../Moduler/kommuneInput/kommuneInput';

export class Registrering extends Component {
  brukerInput = {
    fornavn: '',
    etternavn: '',
    epost: '',
    passord: '',
    bekreftPass: '',
    hendelsevarsling: 0,
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
        <PageHeader history={this.props.history} location={this.props.location} />
        <Footer/>
        <h1 className="text-center text-capitalize display-4" id="regTittel">Registrering</h1>
        <div className="regContainer">
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
                  value={this.brukerInput.bekreftPass}
                  onChange={this.endreVerdi}
                  name="bekreftPass"
                />
                <label id="passordSjekk">{this.advarsel}</label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group row">
                <div className="form-check checkMinSide">
                  <input 
                  className="form-check-input checkVarsling" 
                  type="checkbox" 
                  id ="hendelsevarsling" 
                  checked={!!this.brukerInput.hendelsevarsling} 
                  onChange={this.endreVerdi}
                  name="hendelsevarsling"/>
                  <label className="form-check-label labelVarsling" htmlFor="hendelsevarsling">
                    Hendelsesvarsling i fylket ditt
                  </label>
                </div>
              </div>
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

  async lagre() {
    let gyldig = true;

    let bruker = new Privat(
      0,
      this.brukerInput.epost,
      this.brukerInput.passord,
      this.kommune.current.verdi,
      this.brukerInput.fornavn,
      this.brukerInput.etternavn,
      this.brukerInput.hendelsevarsling,
    );

    if (!bruker.kommune_id) {
      this.advarsel = 'Vennligst oppgi gyldig kommune';
      gyldig = false;
    }

    if (bruker.fornavn === '' || bruker.etternavn === '') {
      this.advarsel = 'Fyll ut begge navnboksene';
      gyldig = false;
    }

    if (bruker.passord.length < 8) {
      this.passAdvarsel = 'Passord må være minst 8 tegn';
      gyldig = false;
    }

    if (this.brukerInput.bekreftPass != bruker.passord) {
      this.advarsel = 'Passord stemmer ikke overens';
      gyldig = false;
    }

    if (!bruker.epost.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      this.advarsel = 'E-post er ikke gyldig';
      gyldig = false;
    }
    if (gyldig) {
      let res = await brukerService.lagNyPrivatBruker(bruker);
      await this.sjekkPassord(res.data);
    }
  }

  sjekkPassord(res) {
    if (res.result) {
      let base64Url = res.token.split('.')[1];
      let base64 = base64Url.replace('-', '+').replace('_', '/');
      global.payload = JSON.parse(window.atob(base64));
      sessionStorage.setItem('pollett', res.token);
      
      let p = window.location.pathname;
      if (p.startsWith("/hovedside/") || p.startsWith("/hendelser")) {
          global.sideRefresh(true);
      } else {
        if (global.payload.role == 'privat') {
          global.sidePush('/minside', true);
        } else if (global.payload.role == 'ansatt') {
          global.sidePush('/ansatt/oversikt', true);
        } else if (global.payload.role == 'bedrift') {
          global.sidePush('/mineoppgaver', true);
        } else if (global.payload.role == 'admin') {
          global.sidePush('/admin/startside', true);
        }
      }
    } else {
      this.advarsel = 'Noe gikk galt under registreringen';
    }
  }

  endreVerdi(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target.checked ? 1 : 0) : target.value;
    const name = target.name;
    this.brukerInput[name] = value;
  }
}
