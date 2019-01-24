import * as React from 'react';
import {Component} from 'react-simplified';

export class InfoBoks extends Component {
    render() {
        return (
            <div className="infoWrapper">
                <div className="infoKnapp" />
                <div className="infoBoks">
                    <div className="infoArrow" />
                    <div className="infoArrowBorder" />
                    <p className="infoTekst">{this.props.tekst}</p>
                </div>
            </div>
        );
    }
}