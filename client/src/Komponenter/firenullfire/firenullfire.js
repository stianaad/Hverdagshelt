import * as React from 'react';
import {Component} from 'react-simplified';
import { PageHeader } from '../../Moduler/header/header';

export class FireNullFire extends Component {
  render() {
    return (
      <React.Fragment>
        <PageHeader history={this.props.history} location={this.props.location} />
        <h3
          style={{
            margin: '100px auto',
            width: '400px',
            height: '300px',
            textAlign: 'center',
            fontFamily: "'Comic Sans MS'",
            fontSize: '40px',
          }}
        >
          404 Ingen mulighet for <span style={{color: 'rgb(80, 187, 230)'}}>kommune-kasjon</span> på denne siden
        </h3>
      </React.Fragment>
    );
  }
}