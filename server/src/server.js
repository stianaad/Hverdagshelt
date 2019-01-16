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
  // Mock user
  const user = {
    id: 1, 
    username: 'brad',
    email: 'brad@gmail.com'
  }

  jwt.sign({user: user}, secret.secret, { expiresIn: '1m' }, (err, token) => {
    console.log(err);
    res.json({
      token: token
    });
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '../../../client/public/index.html'));
});

app.listen(3000);
