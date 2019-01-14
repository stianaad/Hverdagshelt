import express from 'express';
import bodyParser from 'body-parser';
var app = express();
import path from 'path';
app.use(bodyParser.json()); // for å tolke JSON

const public_path = path.join(__dirname, '/../../client/public');
app.use(express.static(public_path));


import bruker from './api/bruker.js';
app.use('/bruker', bruker);
import generell from './api/generell.js';
app.use('/api/generell', generell);
import feil from './api/feil.js';
app.use(feil);

const hendelse = require('./api/hendelse.js');
app.use(hendelse);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+"../../../client/public/index.html"));
  });

app.listen(3000);




