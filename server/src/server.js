var express = require("express");
var bodyParser = require("body-parser");
var app = express();
import path from 'path';
app.use(bodyParser.json()); // for å tolke JSON
const public_path = path.join(__dirname, '/../../client/public');

app.use(express.static(public_path));
// const nyheter = require("../api/Nyheter.js");
//app.use('/nyheter', nyheter);
app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hellehheheheess' });
});

app.listen(3000);



