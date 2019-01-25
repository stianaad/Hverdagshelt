import * as React from 'react';
import {Component} from 'react-simplified';
import {brukerService} from '../../services/brukerService';
import {PageHeader} from '../../Moduler/header/header';
import {Footer} from '../../Moduler/footer/footer';

/**
 * @ignore
 */
export class GlemtPassord extends Component {
  epost = '';
  eksisterendeEpost = [];

  render() {
    return (
      <React.Fragment>
        <PageHeader history={this.props.history} location={this.props.location} />
        <Footer/>
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
      </React.Fragment>
    );
  }

  async lagre() {
    let epost = this.epost;
    if (epost) {
      let res1 = await brukerService.glemtPassord({epost: epost});
      console.log(res1.data.result);
      if(res1.data.result){
        await alert("Du har blitt tilsendt link på e-post.");
        await this.props.history.push('/');
      } else {
        await alert("Noe gikk galt, prøv på nytt");
        await window.location.reload();
      }
    }
  }
}
