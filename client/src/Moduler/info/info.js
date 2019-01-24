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
                    {this.props.tekst.split("\n").map((tekst) => (
                        <p className="infoTekst">{tekst}</p>
                    ))}
                </div>
            </div>
        );
    }
}