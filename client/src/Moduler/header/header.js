import * as React from 'react';
import { Component } from 'react-simplified';
import { KommuneVelger } from '../KommuneVelger/kommuneVelger';
import { Link } from 'react-router-dom';


export class Header extends Component {


    render() {
        return (
            <header className="pageHeader">
                <img className="pageHeaderLogo" src="hhlogotight.svg" alt="Hverdagshelt logo" />
                <div className="pageHeaderRight">
                    <div className="headKomWrapper">
                        <KommuneVelger history={this.props.history} />
                    </div>
                    <img className="profileIcon" src="user.svg" alt="Bruker ikon"></img>
                </div>
            </header>
        );
    }



}



