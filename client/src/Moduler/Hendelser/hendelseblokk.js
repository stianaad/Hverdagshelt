import * as React from 'react';
import {Component} from 'react-simplified';
import {generellServices} from '../../services/generellServices';
import {Link} from 'react-router-dom';

<div className="col-sm">
  <NavLink
    activeStyle={{color: 'darkblue'}}
    to={'/category/' + hendelse.category + '/' + hendelse.headline + '/' + hendelse.id}
  >
    <div className="card">
      <img className="card-img-top" src={hendelse.bilde} alt={hendelse.beskrivelse} />
      <div className="card-body">
        <h5 className="card-title">{hendelse.overskrift}</h5>
        <p className="card-text">{hendelse.beskrivelse}</p>
        {hendelse.tid}
      </div>
    </div>
  </NavLink>
</div>;
