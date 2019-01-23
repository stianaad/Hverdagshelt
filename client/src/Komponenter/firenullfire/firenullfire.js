import * as React from 'react';
import {Component} from 'react-simplified';
import { PageHeader } from '../../Moduler/header/header';

export class FireNullFire extends Component {
  render() {
    return (
      <>
        <PageHeader history={this.props.history} location={this.props.location} />
        <h3
          style={{
            position: 'absolute',
            top: '100px',
            left: '50px',
            margin: '0 auto',
            width: '400px',
            height: '300px',
            textAlign: 'center',
            fontFamily: "'Comic Sans MS'",
            fontSize: '40px',
          }}
        >
          404 Ingen mulighet for <span style={{color: 'green'}}>kommune-kasjon</span> på denne siden
        </h3>
        <div
          style={{
            position: 'relative',
            width: '700px',
            height: '100vh',
            margin: '0 400px',
          }}
        >
          <img src="/sicko.png" style={{zIndex: '-1', height: '100%'}} />
          <span
            style={{
              position: 'absolute',
              top: '250px',
              left: '80px',
              fontSize: '40px',
            }}
          >
            your request went
          </span>
          <span
            style={{
              position: 'absolute',
              top: '300px',
              left: '150px',
              fontSize: '80px',
              fontFamily: "'Comic Sans MS'",
              color: 'red',
            }}
          >
            SICKO MODE
          </span>
        </div>
      </>
    );
  }
}