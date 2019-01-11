import * as React from 'react';
import { Component,sharedComponentData } from 'react-simplified';
import {PositionMap} from '../../widgets';
import { HashRouter, Route, NavLink, Redirect,Switch } from 'react-router-dom';
import {feilService} from '../../services/feilService';
import {generellServices} from '../../services/generellServices';


export class Hovedside extends Component {
    visFeil = false;
    alleFeil = [];

    merInfo(){
        this.visFeil = !this.visFeil;
    }

    render() {
        return(
            <div>
                <h1 className='text-center'>{this.props.match.params.kommune}</h1>
                <div className="row mt-5">
                    <div className="col-sm-4 ">
                        <div className="ml-3">
                            <h5>Nylige feil og mangler</h5>
                            <br/>
                            <div className="kanter">
                            <nav>
                            <ul className="list-group">
                                <li className="kanter lister">
                                I dag</li>
                                <li className="kanter lister">
                                <NavLink to={'/hovedside/'+this.props.match.params.kommune} onClick={() => this.merInfo()}>
                                    Strømbrudd hjemme hos Stian
                                    <br/>
                                    <i>Strømbrudd</i>
                                    <span className='float-right'>19:20</span>
                                </NavLink>
                                </li>
                                
                            </ul>
                            </nav>
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-8'>
                    {(this.visFeil) ? (
                    <div className='mt-5 mr-5'>
                        <div className="card" >
                        <div className="card-body">
                        <h5 className="card-title">Strømbrudd hjemme hos Stian <span className="float-right mr-5">08.01.2019, 19:31</span></h5>
                        <h6 className="card-subtitle mb-2 mt-2 text-muted">Status: Avventer behandling<button type="button" className="btn btn-danger float-right mr-5 border border-dark">Abonner</button></h6>
                        <br></br>
                        <div>
                            <div className="row">
                                <div className="col-sm-4">
                                <h6>Beskrivelse:</h6>
                                I motsetning til hva mange tror, er ikke Lorem Ipsum bare tilfeldig tekst. Dets røtter springer helt tilbake til et stykke klassisk latinsk litteratur fra 45 år f.kr., hvilket gjør det over 2000 år gammelt. Richard McClintock -.
                                </div>
                                <div className="col-sm-4">
                                <h6>Posisjon</h6>
                                <PositionMap width="200" height="300" id="posmap" center="Oslo" position={this.posFunksjon}/>
                                </div>
                                <div className="col-sm-4">
                                <h6>Oppdateringer:</h6>
                                <div className="kanter oppdatering">
                                Sendt inn <span className="float-right mr-1 small">I dag 19:45</span>
                                <br></br>
                                Godkjent <span className="float-right mr-1 small">I dag 19:45</span>
                                <br></br>
                                d
                                <br></br>
                                dagd
                                <br></br>
                                dagd
                                <br></br>
                                dagd
                                <br></br>
                                dagd
                                <br></br>
                                dag
                                </div>
                                </div>

                            </div>
                         </div>
                    </div>
                  </div></div>
                    ): (
                    <div className='row'>
                        <div className="col-sm-6 text-center">
                        <button type="button" className="btn btn-danger border border-dark" >
                        Meld inn feil
                        </button>
                        <div className="mt-5">
                        <PositionMap width="300" height="300" id="posmap" center="Oslo" position={this.posFunksjon}/>
                        </div>
                        </div>
                        <div className="col-sm-6">
                        <h5>Kommende hendelser</h5>
                        </div>
                    </div>)}
                    </div>
                </div>
            </div>
        )
    }
    posFunksjon(){
        console.log("hei");
    }

    componentWillMount(){
       generellServices
            .hentAlleFeil()
            .then(alleFeil => {
                this.alleFeil = alleFeil;
                console.log(this.alleFeil[0].beskrivelse);
            });
            /*generellServices.hentAlleKommuner().then((kommuner) => {
                this.alleFeil = kommuner;
                this.alleFeil = kommuner;
                console.log(kommuner.length);
              });*/
    }
}