const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');
const Generelldao = require('../dao/generelldao.js');

var pool = mysql.createPool({
  connectionLimit: 5,
  host: 'mysql.stud.iie.ntnu.no',
  user: 'jonathm',
  password: 'tFSnz90b',
  database: 'jonathm',
  debug: false,
  multipleStatements: true,
});

let generelldao = new Generelldao(pool);

router.get('/hentAlleKommuner', (req, res) => {
  console.log('Fikk get-request fra klienten');
  generelldao.hentAlleKommuner((status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/filtrer/:sok', (req, res) => {
  console.log('/filtrer/:sok fikk get request fra klienten');
  generelldao.filtrerKommuner(req.params.sok, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

module.exports = router;
