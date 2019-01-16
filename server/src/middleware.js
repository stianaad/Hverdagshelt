let jwt = require('jsonwebtoken');
const config = require('./config.json');
import BrukerDao from './dao/brukerdao';
import {pool} from '../test/poolsetup';
import secret from './config.json'
import passord from 'password-hash-and-salt';
import verifiserePassord from './api/bruker.js';


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
  var bruker = [];
  console.log('Inne i createToken')
  let elele = { epost: req.body.epost };
  console.log(elele);
  brukerdao.hentBruker(elele, (status, info) => {
    let aa = { bruker_id: info[0].bruker_id };
    let user = {user: info};
    passord(req.body.passord).hash((error, hash) => {
      if (error) {
        throw new Error('Noe gikk galt!');
      }
      bruker.hash = hash;
      console.log(bruker.hash);
      console.log('test');
      if(!verifiserePassord(bruker.hash, info[0].passord)) {
        console.log('Fuck off');
      } else {
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
          else                               { rolle.role = 'admin'; }

          jwt.sign({user: user.user, role: rolle.role}, secret.secret, { expiresIn: '3m' }, (err, token) => {
            console.log(err);
            res.json({
              token: token
            });
          });
        });
      }
    });
  });
};

function sjekkPassord(json, callback) {
  console.log(json);
  brukerDao.hentBruker(json,(status,data) => {
    console.log(data[0].passord);
    console.log(json.passord);
    if(data.length >0){
      passord(json.passord).verifyAgainst(data[0].passord, (error,verified) => {
        if(error)
          throw new Error('Noe gikk galt!');
        if(!verified) {
          console.log("false1");
          res.json({"result": false});
        } else {
          console.log(data[0].bruker_id);
          res.json({"result": true,"bruker_id": data[0].bruker_id});
          callback;
        }
      });
    } else{
      console.log("false2");
      res.json({"result": false});
    }
    //res.status(status);
    //res.json(data);
  })
}