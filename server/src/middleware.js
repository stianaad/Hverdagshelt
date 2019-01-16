let jwt = require('jsonwebtoken');
const config = require('./config.json');
import BrukerDao from './dao/brukerdao';
import {pool} from '../test/poolsetup';

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
  brukerdao.hentBruker(elele, (status, info) => {
    console.log(info)
    let aa = { bruker_id: info[0].bruker_id };
    let user = {user: info};
    console.log(aa);
    brukerdao.hentBrukerRolle(aa, (status, data) =>{
      console.log(data);
      console.log(data[3].privatbruker);
      let rolle = { role: ''};

      if      (parseInt(data[3].privatbruker) == 1)  { rolle.role = 'privatbruker'; }
      else if (parseInt(data[1].ansatt) == 1)        { rolle.role = 'ansatt'; }
      else if (parseInt(data[2].bedrift) == 1)       { rolle.role = 'bedrift'; }
      else                              { rolle.role = 'admin'; }

      jwt.sign({user: user.user, role: rolle.role}, secret.secret, { expiresIn: '1m' }, (err, token) => {
        console.log(err);
        res.json({
          token: token
        });
      });
    });
  });
};