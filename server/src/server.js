import express from 'express';
import bodyParser from 'body-parser';
import https from 'https';
import http from 'http';
import fs from 'fs';
var app = express();
import path from 'path';
app.use(bodyParser.json()); // for å tolke JSON
//app.use(bodyParser.json({limit: '1000mb', extended: true}))
//app.use(bodyParser.urlencoded({limit: '1000mb', extended: true}))

const public_path = path.join(__dirname, '/../../client/public');
app.use(express.static(public_path));

import bruker from './api/bruker.js';
app.use(bruker);
import generell from './api/generell.js';
app.use(generell);
import feil from './api/feil.js';
app.use(feil);
import hendelse from './api/hendelse.js';
app.use(hendelse);
import statistikk from './api/statistikk.js';
app.use(statistikk);

import jwt from 'jsonwebtoken';
import secret from './config.json';
import {checkToken, createToken} from './middleware.js';

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API',
  });
});

app.post('/api/posts', checkToken, (req, res) => {
  res.json({
    Message: 'Token ok!',
  });
});

app.post('/api/innlogging', createToken, (req, res) => {
  res.json({Message: 'login ok', token});
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '../../../client/public/index.html'));
});

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)
.listen(443, function () {
  console.log('HverdagsHelt: http://localhost:3000/')
})

http.createServer(function (req, res) {
  res.writeHead(301, { "Location": "https://" + req.headers['host'].slice(0,-5) + req.url });
  res.end();
}).listen(3000);