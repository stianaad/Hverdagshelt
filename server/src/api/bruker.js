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
const token = () => {
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    'secret'
  );
};

// Hashe passord

const hashPassord = (inputPassord) => {
  return passord(inputPassord).hash((error, hash) => {
    if (error) {
      throw new Error('Noe gikk galt');
    }
    console.log(inputPassord);
    console.log(hash);
    inputPassord = hash;
  });
};

// Verifisere passord

export const verifiserePassord = (inputPassord, eksisterendePassord) => {
  return passord(inputPassord).verifyAgainst(
    eksisterendePassord,
    (error, verified) => {
      if (error) throw new Error('Noe gikk galt!');
      if (!verified) {
        console.log('Feil passord');
      } else {
        console.log('Sjekk ok!');
      }
    }
  );
};

/**
 * Endepunkt
 */

router.post('/api/brukere', (req, res) => {
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
/*
router.post("/sjekkPassord",(req,res)=>{
  console.log("Sjekk passord");
	passord(req.body.passord).hash((error,hash) => {
		if(error){
			throw new Error('Noge gjekk galt');
    }
    let info = {epost: req.body.epost, passord: hash};
    brukerDao.hentBruker(info, (status, data) => {
      res.status(status);
      if (data.length > 0) {
        verifiserePassord(hash, data[0].passord);
      } else {
        res.json({res: 'feil'});
      }
    });
  });
});*/

router.post("/api/sjekkPassord",(req,res) => {
  /*passord("passord1").hash((error, hash) => {
    if (error) {
      throw new Error('Noe gikk galt');
    }
    console.log(hash);
  })*/
  brukerDao.hentBruker(req.body,(status,data) => {
    //verifiserePassord(req.body.passord,data[0].passord);
    if(data.length >0){
      passord(req.body.passord).verifyAgainst(data[0].passord, (error,verified) => {
        if(error)
          throw new Error('Noe gikk galt!');
        if(!verified) {
          console.log("false1");
          res.json({"result": false});
        } else {
          console.log(data[0].bruker_id);
          res.json({"result": true,"bruker_id": data[0].bruker_id});
        }
      });
    } else{
      console.log("false2");
      res.json({"result": false});
    }
    //res.status(status);
    //res.json(data);
  })
})

router.post('/api/brukere/privat', (req, res) => {
  console.log('Fikk POST-request fra klienten');
  passord(req.body.passord).hash((error, hash) => {
    if (error) {
      throw new Error('Noe gikk galt');
    }
    req.body.passord = hash;
    brukerDao.lagNyPrivatBruker(req.body, (status, data) => {
      res.status(status);
      res.json(data);
      console.log('Den nye IDen er:', data.insertId);
    });
  });
});

router.post('/api/brukere/ansatt', (req, res) => {
  console.log('/brukere/ansatt fikk post request fra klienten');
  let info = {
    epost: req.body.epost,
    passord: req.body.passord,
    kommune_id: req.body.kommune_id,
    fornavn: req.body.fornavn,
    etternavn: req.body.etternavn,
    telefon: req.body.telefon,
  };
  brukerDao.lagNyPrivatBruker(info, (status, data) => {
    res.status(status);
  });
});

router.post('/api/brukere/bedrift', (req, res) => {
  console.log('/brukere/bedrift fikk post request fra klienten');
  let info = {
    epost: req.body.epost,
    passord: req.body.passord,
    kommune_id: req.body.kommune_id,
    orgnr: req.body.orgnr,
    navn: req.body.navn,
    telefon: req.body.telefon,
  };
  brukerDao.lagNyPrivatBruker(info, (status, data) => {
    res.status(status);
  });
});

router.post('/api/brukere/admin', (req, res) => {
  console.log('/brukere/admin fikk post request fra klienten');
  let info = {
    epost: req.body.epost,
    passord: req.body.passord,
    kommune_id: req.body.kommune_id,
    telefon: req.body.telefon,
    navn: req.body.navn,
  };
  brukerDao.lagNyPrivatBruker(info, (status, data) => {
    res.status(status);
  });
});

router.put('/brukere/:bruker_id/nyttpassord', (req, res) => {
  passord(req.body.passord).hash((error, hash) => {
    if (error) {
      throw new Error('Noe gikk galt');
    }
    req.body.passord = hash;
    brukerDao.endrePassord(req.body, (status, data) => {
      res.status(status);
      res.json(data);
    });
    console.log('Suksess');
  });
});

router.get('/brukere/:bruker_id/nyttpassord', (req, res) => {
  brukerDao.hentBruker(req.body, (status, data) => {
    res.status(status);
    res.json(data);
    console.log('hele veien baby');
    if (data[0].epost === req.body.epost) {
      let tTilBruker = token();
      let link = 'http://localhost:3000/resett-passord/' + tTilBruker;
      glemt.glemtPassord('r.vedoy@gmail.com', link);
    } else {
      throw new Error('Fant ikke bruker');
    }
  });
});

router.get('/api/bruker/minside/:bruker_id',(req,res)=> {
  console.log('/bruker/minside/:bruker_id fikk get request fra klient')
  brukerDao.finnFeilTilBruker(req.params.bruker_id,(status,data) => {
    res.status(status);
    res.json(data);
  })
})

router.get('/api/bruker/finnFolgteFeil/:bruker_id',(req,res)=> {
  console.log('/api/bruker/finnFolgteFeil/:bruker_id fikk get request fra klient')
  brukerDao.finnFolgteFeilTilBruker(req.params.bruker_id,(status,data) => {
    res.status(status);
    res.json(data);
  })
})

router.get('/api/bruker/finnfolgteHendelser/:bruker_id',(req,res)=> {
  console.log('/api/bruker/finnfolgteHendelser/:bruker_id fikk get request fra klient')
  brukerDao.finnFolgteHendelserTilBruker(req.params.bruker_id,(status,data) => {
    res.status(status);
    res.json(data);
  })
})



router.get('/resetPassord/:token', (req, res) => {
  console.log('Reset passord');
  let naaTid = Date.now().valueOf() / 1000;
  let dekodet = jwt.decode(req.params.token);
  let tidToken = dekodet.exp;
  if (naaTid < tidToken) {
    brukerDao.endrePassord(req.body, (status, data) => {
      res.status(status);
      res.json(data);
      glemt.resattPassord(req.body.epost, 'http://localhost:3000/');
    });
  }
});

module.exports = router;
