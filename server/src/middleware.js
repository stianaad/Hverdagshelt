let jwt = require('jsonwebtoken');
const config = require('./config.json');
import BrukerDao from './dao/brukerdao';
import {pool} from '../test/poolsetup';
import secret from './config.json'

let brukerdao = new BrukerDao(pool);

export let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

export let createToken = (req, res, next) => {
  console.log('Inne i createToken')
  let elele = { epost: req.body.epost };
  console.log(elele);
  brukerdao.hentBruker(elele, (status, info) => {
    let aa = { bruker_id: info[0].bruker_id };
    let user = {user: info};
    brukerdao.hentBrukerRolle(aa, (status, data) =>{
      let mordi = {
        admin: data[0].admin,
        ansatt: data[0].ansatt,
        bedrift: data[0].bedrift,
        privatbruker: data[0].privatbruker
      };
      let rolle = {role: ''};

      if      (mordi.privatbruker == 1)  { rolle.role = 'privatbruker'; }
      else if (mordi.ansatt == 1)        { rolle.role = 'ansatt'; }
      else if (mordi.bedrift == 1)       { rolle.role = 'bedrift'; }
      else                                           { rolle.role = 'admin'; }

      jwt.sign({user: user.user, role: rolle.role}, secret.secret, { expiresIn: '3m' }, (err, token) => {
        console.log(err);
        res.json({
          token: token
        });
      });
    });
  });
};