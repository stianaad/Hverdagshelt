import * as React from 'react';
import {Component} from 'react-simplified';
import { PageHeader } from '../../Moduler/header/header';

export class Administrasjon extends Component {
    render() {
        return (
            <div className="container">
                <PageHeader history={this.props.history} location={this.props.location} />
            </div>
        );
    }
}