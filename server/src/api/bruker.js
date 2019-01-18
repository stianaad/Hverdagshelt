import express from 'express';
const router = express.Router();
import mysql from 'mysql';
import bodyParser from 'body-parser';
import BrukerDao from '../dao/brukerdao.js';
import passord from 'password-hash-and-salt';
import { callbackify } from 'util';
import { pool } from '../../test/poolsetup';
import Epost from '../../epost.js';
import jwt from 'jsonwebtoken';
import secret from '../config.json';
import async from 'async';
import mdw from '../middleware.js';
import { checkToken } from '../middleware';

let brukerDao = new BrukerDao(pool);
let epostTjener = new Epost();


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
  console.log('Fikk POST-request fra klienten');
  passord(req.body.passord).hash((error, hash) => {
    if (error) {
      throw new Error('Noe gikk galt');
    }
    req.body.passord = hash;
    brukerDao.lagNyAdminBruker(req.body, (status, data) => {
      res.status(status);
      res.json(data);
      console.log('Den nye IDen er:', data.insertId);
    });
  });
});

router.post('/api/brukere/bedrift', (req, res) => {
  console.log('Fikk POST-request fra klienten');
  passord(req.body.passord).hash((error, hash) => {
    if (error) {
      throw new Error('Noe gikk galt');
    }
    req.body.passord = hash;
    brukerDao.lagNyBedriftBruker(req.body, (status, data) => {
      res.status(status);
      res.json(data);
      console.log('Den nye IDen er:', data.insertId);
    });
  });
});

router.post('/api/brukere/admin', (req, res) => {
  cconsole.log('Fikk POST-request fra klienten');
  passord(req.body.passord).hash((error, hash) => {
    if (error) {
      throw new Error('Noe gikk galt');
    }
    req.body.passord = hash;
    brukerDao.lagNyAdminBruker(req.body, (status, data) => {
      res.status(status);
      res.json(data);
      console.log('Den nye IDen er:', data.insertId);
    });
  });
});

router.post('/api/brukere/nyttpassord', checkToken, (req, res) => {
  let epost = req.decoded.user.epost;
  passord(req.body.passord).hash((error, hash) => {
    if (error) {
      throw new Error('Noe gikk galt');
    }
    req.body.passord = hash;
    brukerDao.endrePassord({passord: req.body.passord, epost: epost}, (status, data) => {
      res.status(status);
      res.json(data);
    });
    console.log('Suksess');
  });
});

router.post('/api/brukere/glemtpassord', (req, res) => {
  brukerDao.hentBruker(req.body, (status, data) => {
    res.status(status);
    res.json(data);
    console.log('hele veien baby');
    if (data[0].epost === req.body.epost) {
      genenererEpostPollett(req.body.epost, (token) => {
        let link = 'http://localhost:3000/resett-passord/' + token;
        epostTjener.glemtPassord(req.body.epost, link);
      });
    } else {
      throw new Error('Fant ikke bruker');
    }
  });
});

router.get('/api/bruker/minside', checkToken, (req, res) => {
  console.log('/bruker/minside fikk get request fra klient');
  let role = req.decoded.role;
  let bruker_id = req.decoded.user.bruker_id;
  if (role == 'privat') {
    brukerDao.finnFeilTilBruker(bruker_id, (status, data) => {
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({ result: false })
  }
});

router.get('/api/bruker/finnFolgteFeil', checkToken, (req, res) => {
  console.log(
    '/api/bruker/finnFolgteFeil fikk get request fra klient'
  );
  let role = req.decoded.role;
  let bruker_id = req.decoded.user.bruker_id;
  if (role == 'privat') {
    brukerDao.finnFolgteFeilTilBruker(bruker_id, (status, data) => {
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({ result: false })
  }
});

router.get('/api/bruker/finnfolgteHendelser', checkToken, (req, res) => {
  console.log(
    '/api/bruker/finnfolgteHendelser fikk get request fra klient'
  );
  let role = req.decoded.role;
  let bruker_id = req.decoded.user.bruker_id;
  if (role == 'privat') {
    brukerDao.finnFolgteHendelserTilBruker(
      bruker_id,
      (status, data) => {
        res.status(status);
        res.json(data);
      }
    )
  } else {
    res.status(403);
    res.json({ result: false })
  }
});

router.get('/resetPassord/:token', (req, res) => {
  console.log('Reset passord');
  let naaTid = Date.now().valueOf() / 1000;
  let dekodet = jwt.decode(req.params.token);
  let tidToken = dekodet.exp;
  if (naaTid < tidToken) {
    brukerDao.endrePassord(req.body, (status, data) => {
      res.status(status);
      res.json(data);
      epostTjener.resattPassord(req.body.epost, 'http://localhost:3000/');
    });
  }
});

module.exports = router;

const genenererEpostPollett = (epost, callback) => {
  console.log(secret.secret);
  jwt.sign({user: {epost: epost}}, secret.secret, { expiresIn: 900 }, (err, token) => {
    console.log(err);
    callback(token);
  });
}