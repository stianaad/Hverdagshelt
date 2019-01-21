import * as React from 'react';
import {Component} from 'react-simplified';
import {brukerService} from '../../services/brukerService';
import {PageHeader} from '../../Moduler/header/header';

export class GlemtPassord extends Component {
  epost = '';
  eksisterendeEpost = [];

  render() {
    return (
      <>
        <PageHeader history={this.props.history} location={this.props.location} />
        <div className="container">
          <h1 className="text-center">Glemt passord</h1>
          <p className="font-weight-bold" />
          <div className="card">
            <div className="card-body">
              <form className>
                <div className="row">
                  <div className="col">
                    <div className="form-group row">
                      <label className="control-label m-2"> Epost:</label>
                      <div className="col-sm-10">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Epost"
                          id="epost"
                          onChange={(e) => (this.epost = e.target.value)}
                          required={true}
                        />
                        <small className="form-text text-muted">
                          Skriv inn din mail for å få tilsendt link til å resette ditt passord.
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-success border border-dark"
                  type="button"
                  onClick={() => {
                    this.lagre();
                  }}
                >
                  Send mail
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }

  lagre() {
    let epost = this.epost;
    if (epost) {
      brukerService.glemtPassord({epost: epost}).catch((error) => Alert.danger(error.message));
    }
  }
}
