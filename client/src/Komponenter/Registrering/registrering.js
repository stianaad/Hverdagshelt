import React, { Component } from 'react';
import { Typeahead} from 'react-bootstrap';

export class Registrering extends Component{
    render(){
        return(
            <form>
                <div className='row'>
                    <div class='col'>
                        <div className='form-group'>
                            <label>Fornavn:</label>
                            <input type='text' className='form-control' placeholder='Fornavn'/>
                        </div>
                    </div>
                    <div className='col'>
                        <div className='form-group'>
                            <label>Etternavn:</label>
                            <input type='text' className='form-control' placeholder='Etternavn'/>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div class='col'>
                        <div className='form-group'>
                            <label>E-post:</label>
                            <input type='text' className='form-control' placeholder='E-post'/>
                        </div>
                    </div>
            
                </div>
                <div className='row'>   
                    <div class='col'>
                        <div className='form-group'>
                            <label>Passord:</label>
                            <input type='password' className='form-control'/>
                        </div>
                    </div>
                    <div className='col'>
                        <div className='form-group'>
                            <label>Bekreft passord:</label>
                            <input type='password' className='form-control'/>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
    
    visKommuner(){
        document.getElementById("nedtrekk").classList.toggle("show");
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