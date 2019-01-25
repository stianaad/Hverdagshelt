import * as React from 'react';
import {Component} from 'react-simplified';

/**
 * Liten info-knapp som viser en popup med informasjon ved hover event
 * @reactProps {string} tekst - Teksten som skal vises av infoboksen
 */
export class InfoBoks extends Component {
    render() {
        return (
            <div className="infoWrapper">
                <div className="infoKnapp" />
                <div className="infoBoks">
                    <div className="infoArrow" />
                    <div className="infoArrowBorder" />
                    {this.props.tekst.split("\n").map((tekst) => (
                        <p key = {tekst} className="infoTekst">{tekst}</p>
                    ))}
                </div>
            </div>
        );
    }
}