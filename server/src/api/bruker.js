import express from 'express';
const router = express.Router();
import mysql from 'mysql';
import bodyParser from 'body-parser';
import BrukerDao from '../dao/brukerdao.js';
import passord from 'password-hash-and-salt';
import {callbackify} from 'util';
import {pool} from '../../test/poolsetup';
import Epost from '../../epost.js';
import jwt from 'jsonwebtoken';
import async from 'async';



let brukerDao = new BrukerDao(pool);
let glemt = new Epost();

/* 
* Generelle metoder brukt i endepunktene
 */

 // Metode for å lage et enkelt token med tidskvant på 1 time
const token = ()=>{
  return jwt.sign({
    
    exp: Math.floor(Date.now() / 1000) + (60 * 60)
  },'secret');
}

// Hashe passord

const hashPassord = (inputPassord) =>{
  return passord(inputPassord).hash((error, hash) => {
    if (error) {
      throw new Error('Noe gikk galt');
    }
    console.log(inputPassord);
    console.log(hash);
    inputPassord = hash;
  });
}

// Verifisere passord

const verifiserePassord = (inputPassord,eksisterendePassord)=>{
  return passord(inputPassord).verifyAgainst(eksisterendePassord, (error,verified) => {
    if(error)
      throw new Error('Noe gikk galt!');
    if(!verified) {
      console.log("Feil passord");
    } else {
      console.log("Sjekk ok!")
    }
  });
}

/**
 * Endepunkt
 */

router.get('/api/hentbrukere',(req,res)=>{
  brukerDao.hentBrukere((status,data)=>{
    res.status(status);
    res.json(data);
  });
})

router.post('/api/lagNyBruker', (req, res) => {
  console.log('Fikk POST-request fra klienten');
  passord(req.body.passord).hash((error, hash) => {
    if (error) {
      throw new Error('Noe gikk galt');
    }
    req.body.passord = hash;
    brukerDao.lagNyBruker(req.body, (status, data) => {
      res.status(status);
      res.json(data);
      console.log('Den nye IDen er:', data.insertId);
    });
  });
});

/* 
* Hasher først passordet, deretter kalles dao for å hente hash i database,
* deretter verifiseres passorded som er skrevet inn mot det i databasen.
*/

router.post("/sjekkPassord",(req,res)=>{
  console.log("Sjekk passord");
	passord(req.body.passord).hash((error,hash) => {
		if(error){
			throw new Error('Noge gjekk galt');
    }
    let info = {epost: req.body.epost, passord: hash};
    brukerDao.hentBruker(info,(status,data)=>{
      res.status(status);
      if (data.length > 0) {
        verifiserePassord(hash,data[0].passord);
      } else {
        res.json({res:"feil"});
      }
    });
  });
});


router.put("/endrePassord",(req, res)=>{
  passord(req.body.passord).hash((error, hash) => {
    if (error) {
      throw new Error('Noe gikk galt');
    }
    req.body.passord = hash;
    brukerDao.endrePassord(req.body,(status,data)=>{
      res.status(status);
      res.json(data);
    });
    console.log("Suksess");
  });
});

router.get("/api/glemt-passord",(req,res)=>{
  brukerDao.hentBruker(req.body,(status,data)=>{
    res.status(status);
    res.json(data);
    console.log('hele veien baby');
    if(data[0].epost === req.body.epost){
      let tTilBruker= token();
      let link = 'http://localhost:3000/resett-passord/' + tTilBruker;
      glemt.glemtPassord("r.vedoy@gmail.com",link);
    }else{
        throw new Error("Fant ikke bruker");
    }
  })
});

router.get("/reset-passord/:token", (req,res)=>{
  console.log("Reset passord");
  let naaTid = Date.now().valueOf()/1000;
  let dekodet = jwt.decode(req.params.token);
  let tidToken = dekodet.exp;
  if( naaTid < tidToken){
    brukerDao.endrePassord(req.body,(status,data)=>{
      res.status(status);
      res.json(data);
      glemt.resattPassord(req.body.epost,"http://localhost:3000/");
    });
  }
});

module.exports = router;
