import * as React from 'react';
import { Component } from 'react-simplified';
import { brukerService } from '../../services/brukerService';
import { Modal, Button } from 'semantic-ui-react';

/**
 * En pop-up boks som lar brukeren endre passord
 * @reactProps {boolean} open - Bestemmer om boksen skal være åpen eller ikke
 * @reactProps {?function()} onClose - Event som kjører når boksen lukkes
 */
export class EndrePassordModal extends Component {
  /** 
   * Om boksen skal vises eller ikke 
   * @type {boolean} */
  open = false;

  /** 
   * Tekst som vises når brukeren har skrevet noe ugyldig
   * @type {string} */
  advarsel = '';

  /** 
   * Objekt som inneholder informasjonen fra input-feltene
   * @type {Object} */
  passord = {
    gammeltPass: '',
    nyttPass: '',
    nyttPassSjekk: '',
  }

  /** @ignore */
  async mounted() {
    this.open = this.props.open;
  }

  /** @ignore */
  async lagrePass() {
    if (this.passord.nyttPass.length < 8 || this.passord.nyttPass !== this.passord.nyttPassSjekk) {
      this.advarsel = 'Feil ved innsending. Nytt passord må være 8 tegn langt og passordene må være like.';
    } else {
      let res = await brukerService.endrePassord(this.passord);
      if (!res.data.result) {
        this.advarsel = 'Gammelt passord er ikke korrekt, eller noe gikk galt ved innmelding.';
      } else {
        alert('Passord er endret');
        this.props.onClose();
      }
    }
  }

  /** @ignore */
  endrePassVerdi(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target.checked ? 1 : 0) : target.value;
    const name = target.name;
    this.passord[name] = value;
  }

  render() {
    return (
      <React.Fragment>
        {this.open ? (
          <Modal open={true} onClose={this.props.onClose} size="small" centered>
            <Modal.Content>
              <div className="container">
                <h1 className="text-center">Endre passord</h1>
                <div className="card">
                  <div className="card-body">
                    <div className="form-group row">
                      <label htmlFor='gammeltPass' className="col-sm-4 col-form-label venstreForm"> Gammelt passord:</label>
                      <div className="col-sm-8">
                        <input
                          type="password"
                          id="gammeltPass"
                          name="gammeltPass"
                          className="form-control"
                          value={this.passord.gammeltPass}
                          required={true}
                          placeholder="Gammelt passord"
                          onChange={this.endrePassVerdi}
                        />
                        <small className="form-text text-muted">Skriv inn din ditt gamle passord</small>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label htmlFor='nyttPass' className="col-sm-4 col-form-label venstreForm"> Nytt passord:</label>
                      <div className="col-sm-8">
                        <input
                          type="password"
                          id="nyttPass"
                          name="nyttPass"
                          className="form-control"
                          value={this.passord.nyttPass}
                          required={true}
                          placeholder="Nytt passord"
                          onChange={this.endrePassVerdi}
                        />
                        <small className="form-text text-muted">Skriv inn din ditt nye passord. Minst 8 tegn langt</small>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label htmlFor='nyttPassSjekk' className="col-sm-4 col-form-label venstreForm"> Gjenta nytt passord:</label>
                      <div className="col-sm-8">
                        <input
                          type="password"
                          id="nyttPassSjekk"
                          name="nyttPassSjekk"
                          className="form-control"
                          value={this.passord.nyttPassSjekk}
                          placeholder="Gjenta passord"
                          required={true}
                          onChange={this.endrePassVerdi}
                        />
                        <small className="form-text text-muted">Gjenta ditt nye passord</small>
                      </div>
                    </div>
                    <Button basic color="green" onClick={this.lagrePass}>
                      Endre Passord
                    </Button>
                    <p>{this.advarsel}</p>
                  </div>
                </div>
              </div>
            </Modal.Content>
          </Modal>
        ) : null}
      </React.Fragment>
    );
  }
}