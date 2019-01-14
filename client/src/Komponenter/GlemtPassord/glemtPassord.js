import * as React from 'react';
import {Component} from 'react-simplified';

export class GlemtPassord extends Component{

  epost ='';

    render(){
      return(
      
        <div className="container">
        <h1 className="text-center" >Glemt passord</h1>
        <p className="font-weight-bold"></p>
         <div className="card">
          <div className="card-body">
            <form className>
              <div className="row">
                <div className="col">
                
                  <div className="form-group row">
                  <label className="control-label m-2"> Epost:</label>
                    <div className="col-sm-10">
                        <input
                          type = "text"
                          className="form-control"
                          placeholder = "Epost"
                          onChange = {(e)=>(this.epost = e.target.value)}
                          required ={true}
                        />
                        <small className="form-text text-muted">Skriv inn din mail under for å få tilsendt link til å resette ditt passord</small>
                      </div>
                    </div>
                    <button className="btn btn-success border border-dark">
                      Send mail
                    </button>
                  </div>
                </div>
            </form>
            </div>
          </div>
        </div>

      );
    }

    lagre(){

    }


}