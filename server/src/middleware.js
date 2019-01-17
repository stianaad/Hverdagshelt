let jwt = require('jsonwebtoken');
const config = require('./config.json');
import BrukerDao from './dao/brukerdao';
import {pool} from '../test/poolsetup';
import secret from './config.json'
import passord from 'password-hash-and-salt';

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
  console.log('Inne i createToken');
  brukerdao.hentBruker(req.body, (status, info) => {
    let aa = { bruker_id: info[0].bruker_id};
    let user = {bruker_id: info[0].bruker_id,
                epost: info[0].epost,
                kommune_id: info[0].kommune_id};
    
    passord(req.body.passord).verifyAgainst(info[0].passord, (error, verified) => {
        if (error) {
          throw new Error('Error på verifisering');
        }

        if (verified) {
          brukerdao.hentBrukerRolle(aa, (status, data) =>{
            let roller = {
              admin: data[0].admin,
              ansatt: data[0].ansatt,
              bedrift: data[0].bedrift,
              privatbruker: data[0].privatbruker
            };
            let rolle = {role: ''};

            if      (roller.privatbruker == 1)  { rolle.role = 'privat'; }
            else if (roller.ansatt == 1)        { rolle.role = 'ansatt'; }
            else if (roller.bedrift == 1)       { rolle.role = 'bedrift'; }
            else                               { rolle.role = 'admin'; }
            console.log(rolle.role);
            jwt.sign({user: user, role: rolle.role}, secret.secret, { expiresIn: '3m' }, (err, token) => {
              console.log(err);
              res.json({
                "result": true,
                "token": token
              });
            });
          });
        } else {
          res.json({"result":false});
        }
      });
  });
}

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