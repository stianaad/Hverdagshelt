const express = require('express');
const router = express.Router();
var mysql = require("mysql");
var bodyParser = require("body-parser");
const Brukerdao = require("../dao/brukerdao.js");
//import {nyttPassord, sjekkPassord} from '../sikkerhet/hash';
import passord from 'password-hash-and-salt';



var pool = mysql.createPool({
    connectionLimit: 5,
    host: "mysql.stud.iie.ntnu.no",
    user: "jonathm",
    password: "tFSnz90b",
    database: "jonathm",
    debug: false,
    multipleStatements: true
});

let brukerdao = new Brukerdao(pool);

router.post('/lagNyBruker', (req, res) => {
    console.log('Fikk POST-request fra klienten');
    passord(req.body.passord).hash((error, hash) => {
      if (error) {
        throw new Error('Noe gikk galt');
      }
      console.log(req.body.passord);
      console.log(hash);
      req.body.passord = hash;
      brukerdao.lagNyBruker(req.body, (status, data) => {
        res.status(status);
        res.json(data);
        console.log('Den nye IDen er:', data.insertId);
      });
    });
  });
  

module.exports = router;