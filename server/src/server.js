import express from 'express';
import bodyParser from 'body-parser';
var app = express();
import path from 'path';
app.use(bodyParser.json()); // for å tolke JSON

const public_path = path.join(__dirname, '/../../client/public');
app.use(express.static(public_path));

import bruker from './api/bruker.js';
app.use(bruker);
import generell from './api/generell.js';
app.use(generell);
import feil from './api/feil.js';
app.use(feil);
const hendelse = require('./api/hendelse.js');
app.use(hendelse);

import jwt from 'jsonwebtoken';
import secret from './config.json';
import {checkToken} from './middleware.js';
import BrukerDao from './dao/brukerdao';
import {pool} from '../test/poolsetup';

let brukerdao = new BrukerDao(pool);

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  });
});

app.post('/api/posts', checkToken, (req, res) => {
  res.json({
    Message: 'Sugmeg'
  })
});

app.post('/api/login1', (req, res) => {
  let e = { epost: req.body.epost };
  brukerdao.hentBruker(e, (status, data) => {
    brukerdao.hentBrukerRolle(data, (status, data) =>{
      let rolle = { role: ''};

      if      (data.privatbruker == 1)  { rolle.role = 'privatbruker'; }
      else if (data.ansatt == 1)        { rolle.role = 'ansatt'; }
      else if (data.bedrift == 1)       { rolle.role = 'bedrift'; }
      else                              { rolle.role = 'admin'; }

      jwt.sign({user: user, role: rolle.role}, secret.secret, { expiresIn: '1m' }, (err, token) => {
        console.log(err);
        res.json({
          token: token
        });
      });
    });
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '../../../client/public/index.html'));
});

app.listen(3000);
