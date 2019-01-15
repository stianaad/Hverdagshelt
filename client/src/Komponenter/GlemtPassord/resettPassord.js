import * as React from 'react';
import {Component} from 'react-simplified';
import {brukerService} from '../../services/brukerService';


export class ResettPassord extends Component{

  passord ='';
  bekreftPassord ='';

    render(){
      return(
      
        <div className="container">
        <h1 className="text-center" >Resett passord</h1>
        <p className="font-weight-bold"></p>
         <div className="card">
          <div className="card-body">
            <form>
              <div className="row">
                <div className="col">
                
                  <div className="form-group row">
                  <label className="control-label m-2"> Nytt passord:</label>
                    <div className="col-sm-10">
                        <input
                          type = "password"
                          id="passord1"
                          className="form-control"
                          required={true}
                          placeholder = "Nytt passord"
                          onChange = {event => this.passord = event.target.value}
                        />
                        <small className="form-text text-muted">Skriv inn din ditt nye passord.</small>
                      </div>
                    </div>

                    <div className="form-group row">
                    <label className="control-label"> Gjenta passord:</label>
                      <div className="col-sm-10">
                        <input
                          type = "password"
                          id ="passord2"
                          className="form-control"
                          placeholder = "Gjenta passord"
                          required={true}
                          onChange = {event => this.bekreftPassord = event.target.value}
                        />
                        <small className="form-text text-muted">Gjenta ditt passord.</small>
                      </div>
                    </div>
                    
                    <div className="form-group row">
                        <div >
                        <input type="checkbox" onChange={this.visPassord} /> Vis passord
                        </div>
                    </div>
                    
                    <button 
                    className="btn btn-success border border-dark"
                    type="button" 
                    onClick={this.lagre}>
                      Resett passord
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
        console.log('lala');
        if(this.passord !== this.bekreftPassord){
            alert('Passordene er ikke like');
            return false;
        }else{
            brukerService.endrePassord(this.passord);
        }
    }

    visPassord(){
        let passord1 = document.getElementById("passord1");
        let passord2 = document.getElementById("passord2");
        if(passord1.type ==="password" && passord2.type=== "password"){
            passord1.type ="text";
            passord2.type = "text";
        }else{
            passord1.type ="password";
            passord2.type = "password";
        }
    }

}