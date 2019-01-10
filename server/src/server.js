var express = require("express");
var bodyParser = require("body-parser");
var app = express();
import path from 'path';
app.use(bodyParser.json()); // for å tolke JSON
const public_path = path.join(__dirname, '/../../client/public');

app.use(express.static(public_path));
const bruker = require('./api/bruker.js');
app.use('/bruker', bruker);
const generell = require('./api/generell.js');
app.use('/api/generell', generell);

const feil = require('./api/feil.js');
app.use(feil);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+"../../../client/public/index.html"));
  });

app.listen(3000);




