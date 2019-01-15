import * as React from 'react';
import { Component } from 'react-simplified';
import { KommuneVelger } from '../KommuneVelger/kommuneVelger';
import { Link } from 'react-router-dom';


export class PageHeader extends Component {


    render() {
        return (
            <header className="pageHeader">
                <Link to="/"><img className="pageHeaderLogo" src="/hhlogotight.svg" alt="Hverdagshelt logo" /></Link>
                <button type="button" className="pageHeaderButton btn btn-light border border-dark mr-4">Hendelser</button>
                <div className="pageHeaderRight">
                    <div className="headKomWrapper">
                        <KommuneVelger history={this.props.history} />
                    </div>
                    <img className="profileIcon" src="/profile.svg" alt="Bruker ikon"></img>
                </div>
            </header>
        );
    }



}



