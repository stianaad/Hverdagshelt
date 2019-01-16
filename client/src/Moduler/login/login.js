//kjør boi

import * as React from 'react';
import { Component, sharedComponentData } from 'react-simplified';
import {brukerService} from '../../services/brukerService';
import {Link} from 'react-router-dom';

export class Login extends Component {
  advarsel = "";
  data = {
    epost: "",
    passord: "",
  }

  render() {
    return (
      <div className="dropdown">
        <button type="button" className="logginnbutton btn btn-light border border-dark" onClick={this.clickDrop}>
          Logg inn
        </button>
        <div className="dropdown-menu dropdown-menu-right dropdownbox" id="drops">
          <div className="arrow"></div>
          <div className="arrowborder"></div>
          <div className="form-group">
            <label htmlFor="epost">E-post:</label>
            <input type="text" value={this.data.epost} onChange={this.endre} name="epost" className="form-control" id="epost" placeholder="E-post"></input>
            <label htmlFor="passord">Passord:</label>
            <input type="password" value={this.data.passord} onChange={this.endre} name ="passord" className="form-control" id="passord" placeholder="Passord"></input>
            <Link to="/glemt-passord"><p className="glemtLink">Glemt passord?</p></Link>
            <p>{this.advarsel}</p>
          </div>
          
          <button className="myLoginButton" onClick={this.login}>Logg inn</button>
          <Link to="/registrering"><button style={{float:"right"}} className="myLoginButton">Registrer deg</button></Link>
          
        </div>
      </div>
    );
  }

  clickDrop(event) {
    let drop = document.getElementById("drops");
    if (drop.style.display == "none" || drop.style.display == "") {
      drop.style.display = "block";
      this.hideOnClickOutside(drop);
    }
    else {
      drop.style.display = "block";
    }
    
  }

  hideOnClickOutside(element) {
    const isVisible = elem => !!elem && !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length ); // source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js 
    const outsideClickListener = event => {
        if (!element.contains(event.target)) {
            if (isVisible(element)) {
                element.style.display = 'none'
                removeClickListener()
            }
        }
    }

    const removeClickListener = () => {
        document.removeEventListener('click', outsideClickListener)
    }
    
    document.addEventListener('click', outsideClickListener)
  }

  endre(e) {
    this.data[e.target.name] = e.target.value;
  }

  sjekkPassord(result){
    if(result){
      this.props.history.push('/hovedside/trondheim');
    } else {
      console.log(result)
      this.advarsel = "Feil brukernavn eller passord!";
    }
  }

  async login() {
    console.log(this.data);
   let res = await brukerService.loggInn(this.data);
   //await console.log(res.data.result);
   await this.sjekkPassord(res.data.result);
  }
}