import * as React from 'react';
import {Component} from 'react-simplified';

export class InfoBoks extends Component {
    open = false;

    render() {
        return (
            <div className="infoWrapper">
                <div className="infoKnapp" onClick={() => {this.open = !this.open}}/>
                <div className={this.open ? "infoBoks infoVisible" : "infoBoks"}>
                    <div className="infoArrow" />
                    <div className="infoArrowBorder" />
                    <p className="infoTekst">{this.props.tekst}</p>
                </div>
            </div>
        );
    }
}