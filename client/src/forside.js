import React, { Component } from 'react';
import { generellServices} from './generellServices';

export class Forside extends Component{
    sok = '';
    alleKommuner =[];
    sokteKommuner = [];
  
    handterSok(e) {
      this.sok = e.target.value;
      console.log(this.sok);
      if(this.sok.length>0){
      generellServices
        .filtrerKommuner(this.sok)
        .then(kommuner => {
          this.sokteKommuner = kommuner;
        })
      } else {
        this.sokteKommuner = this.alleKommuner;
      }
  
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
    render() {
      return(
        <div>
          <div>
            <img className='img-fluid w-50 ' src='Hverdagshelt.png' alt='Hverdagshelt logo'/>
            <button type="button" className="btn btn-secondary float-right mt-5 mr-3 border border-dark" >
              Logg inn
            </button>
            <button type="button" className="btn btn-danger float-right mt-5 mr-3 border border-dark" >
              Meld inn feil
            </button>
            <button type="button" className="btn btn-light float-right mt-5 mr-3 border border-dark" >
              Hendelser
            </button>
          </div>
          <div className='bilde'>
            <img className='img-fluid w-100 ' src='lofoten.jpg' alt='bilde av Lofoten'/> 
              <div className='centered'>
                  <h6 className='tekst'>Kommuniser direkte med din kommune </h6>
                  <section class="main">
              <form className="search" method="post" action="index.html" >
                <input type="text" name="q" placeholder="Søk..." onChange = {this.handterSok} />
                <ul className="results scroll" >
                <li><a href="index.html">Search Result #1<br /><span>Description...</span></a></li>
                  {this.sokteKommuner.map(kommune => (
                    <NavLink activeStyle={{ color: 'darkblue' }} to={"/"}>
                    <li className='text-dark' key={kommune.kommune_id} onClick={() => test}>
                      {kommune.kommune_navn}
                    </li>
                  </NavLink>
                  ))}
                </ul>
              </form>
            </section>
            </div>
          </div>
          <footer>
          <div className='m-5'>
          </div>
        </footer>
        </div>
      )
    }
  
    mounted(){
      generellServices.
        hentAlleKommuner()
        .then(
          kommuner => {
            this.sokteKommuner = kommuner;
            this.alleKommuner = kommuner;
            console.log(kommuner.length);
          });
    }
  }