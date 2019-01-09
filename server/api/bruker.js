const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');
const brukerdao = require('../dao/brukerdao.js');
import passord from 'password-hash-and-salt';
import { callbackify } from 'util';

var pool = mysql.createPool({
  connectionLimit: 5,
  host: 'mysql.stud.iie.ntnu.no',
  user: 'jonathm',
  password: 'tFSnz90b',
  database: 'jonathm',
  debug: false,
  multipleStatements: true,
});

let brukerDao = new brukerdao(pool);

router.post('/lagNyBruker', (req, res) => {
  console.log('Fikk POST-request fra klienten');
  passord(req.body.passord).hash((error, hash) => {
    if (error) {
      throw new Error('Noe gikk galt');
    }
    console.log(req.body.passord);
    console.log(hash);
    req.body.passord = hash;
    brukerDao.lagNyBruker(req.body, (status, data) => {
      res.status(status);
      res.json(data);
      console.log('Den nye IDen er:', data.insertId);
    });
  });
});

router.get("/sjekkPassord",(req,res)=>{
  console.log("Hente passord");
	passord(req.body.passord).hash((error,hash) => {
		if(error){
			throw new Error('Noge gjekk galt');
    }
    
    brukerDao.hentBruker(req.body,(status,data)=>{
      res.status(status);
      res.json(data);
      passord(req.body.passord).verifyAgainst(data[0].passord, (error,verified) => {
        if(error)
          throw new Error('Noe gikk galt!');
        if(!verified) {
          console.log("Feil passord");
        } else {
          console.log("Sjekk ok!")
        }
      }); 
    });
  });
});

router.put("/endrePassord",(req, res)=>{
  passord(req.body.nyttPassord).hash((error, hash) => {
    if (error) {
      throw new Error('Noe gikk galt');
    }
    req.body.nyttPassord = hash;
    brukerDao.endrePassord(req.body,(status,data)=>{
      res.status(status);
      res.json(data);
    });
    console.log("Suksess");
  });
});

module.exports = router;
