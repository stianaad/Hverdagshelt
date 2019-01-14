import * as React from 'react';
import {Component} from 'react-simplified';
//import {Privat, brukerService} from '../../services/brukerService';

export class Registrering extends Component {
  fornavn = '';
  etternavn = '';
  epost = '';
  passord = '';
  bekreftPass = '';
  passAdvarsel = '';
  advarsel = '';
  kommune = '';

  render() {
    return (
      <div className="container">
        <form>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label>Fornavn:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Fornavn"
                  onChange={(e) => (this.fornavn = e.target.value)}
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
                  onChange={(e) => (this.etternavn = e.target.value)}
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
                  onChange={(e) => (this.epost = e.target.value)}
                  required={true}
                />
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
                  onChange={(e) => (this.passord = e.target.value)}
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
                  onChange={(e) => (this.bekreftPass = e.target.value)}
                />
                <label id="passordSjekk">{this.advarsel}</label>
              </div>
            </div>
          </div>
          <div className="valg">
            <p>Hva ønsker du å bli varslet om i din kommune?</p>
            <br></br>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                <label className="form-check-label" for="defaultCheck1">
                    Planlagt strømbrudd
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="defaultCheck2"/>
                <label className="form-check-label" for="defaultCheck3">
                    Planlagt vann- og avløpsarbeid
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="defaultCheck3"/>
                <label className="form-check-label" for="defaultCheck3">
                    Konserter
                </label>
            </div>
            <br/>
            <p>Du kan endre varselinnstillinger på MinSide senere.</p>
          </div>
          <br></br>
          <div className="row knappDiv">
            <button type="submit" className="btn btn-primary" onClick={this.lagre}>Registrer deg</button>
            <button type="cancel" className="btn btn-secondary">Avbryt</button>
          </div>
        </form>
      </div>
    );
  }

  lagre() {
    console.log(this.fornavn);
    console.log(this.passord);
    console.log(this.bekreftPass);

    if (this.passord.length < 8) {
      this.passAdvarsel = 'Passord må være minst 8 karakterer';
    }

    if (this.bekreftPass === this.passord && this.passord.length >= 8) {
        this.advarsel = '';

        //bruker = new Privat(this.epost, this.passord, 1, this.fornavn, this.etternavn); 
        
        /*brukerService
            .lagNyBruker(bruker)
            .then(history.push('/'))
            .catch((error) => Alert.danger(error.message));*/
    } 
    
    else {
      this.advarsel = 'Passord stemmer ikke';
    }
  }

  visKommuner() {
    document.getElementById('nedtrekk').classList.toggle('show');
  }

  handterInput(e) {
    this.sok.innhold = e.target.value;
    console.log(this.sok.innhold);
    /*if (this.sok.innhold.length >0) {
          sakService
              .filtrerNyhetssaker(this.sok.innhold)
              .then(sak => (this.delt.nyhetssaker = sak))
              .catch();
        }
          
        else{
            sakService
              .getAlleNyhetssaker()
              .then(nyeste => (this.delt.nyhetssaker = nyeste))
              .catch();
        }*/
  }
}
