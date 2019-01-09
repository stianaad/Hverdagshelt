import React, { Component } from 'react';
import * as React from 'react';

class Registrering extends Component{
    render(){
        return(
            <form>
                <div className='form-group'>
                    <label>E-post</label>
                    <input type='text' class='form-control' placeholder='E-post'/>
                </div>
            </form>
        );
    }   
}

export default Registrering; 