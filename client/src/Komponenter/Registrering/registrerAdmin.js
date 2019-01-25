import * as React from 'react';
import {Component} from 'react-simplified';
import {brukerService} from '../../services/brukerService';
import {PageHeader} from '../../Moduler/header/header';
import {Admin} from '../../objekter.js';
import {KommuneInput} from '../../Moduler/kommuneInput/kommuneInput';

export class RegistrerAdmin extends Component {
  adminInput = {
    epost: '',
    navn: '',
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
        <div className="container">
          <h2 className="text-center text-capitalize display-4">Registrer en administrator</h2>
          <div>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label>E-post:</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="example@host.com"
                    value={this.adminInput.epost}
                    onChange={this.endreVerdi}
                    name="epost"
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
                    value={this.adminInput.telefon}
                    onChange={this.endreVerdi}
                    name="telefon"
                    required={true}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label>Administratornavn:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Brukernavn"
                    value={this.adminInput.navn}
                    onChange={this.endreVerdi}
                    name="navn"
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
            <div className="row knappDiv">
              <button id="registrer" className="btn btn-primary" onClick={this.lagre}>
                Registrer administrator
              </button>
              <button id="avbryt" onClick={this.reRoute} className="btn btn-secondary">
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
    let gyldig = true;

    let admin = new Admin(
      0,
      this.adminInput.epost,
      '',
      this.kommune.current.verdi,
      this.adminInput.telefon,
      this.adminInput.navn
    );

    console.log(admin)

    if (!admin.kommune_id) {
      this.advarsel = 'Vennligst oppgi gyldig kommune';
      gyldig = false;
    }

    if (admin.navn === '') {
      this.advarsel = 'Fyll ut administratornavn';
      gyldig = false;
    }

    if (!admin.telefon || admin.telefon.length != 8) {
      this.advarsel = 'Telefonnummer må være 8 siffer langt';
      gyldig = false;
    }

    if (!admin.epost.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      this.advarsel = 'E-post er ikke gyldig';
      gyldig = false;
    }

    if (gyldig) {
      brukerService.lagNyAdminBruker(admin).then((res) => {
        this.props.history.push('/admin/startside');
      });
    }
  }

  endreVerdi(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target.checked ? 1 : 0) : target.value;
    const name = target.name;
    this.adminInput[name] = value;
  }
}
