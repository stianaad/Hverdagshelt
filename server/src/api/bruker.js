import express from 'express';
const router = express.Router();
import mysql from 'mysql';
import bodyParser from 'body-parser';
import BrukerDao from '../dao/brukerdao.js';
import passord from 'password-hash-and-salt';
import {callbackify} from 'util';
import pool from '../../test/poolsetup';

let brukerDao = new BrukerDao(pool);

router.post('/api/lagNyBruker', (req, res) => {
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

router.get('/sjekkPassord', (req, res) => {
  console.log('Hente passord');
  passord(req.body.passord).hash((error, hash) => {
    if (error) {
      throw new Error('Noge gjekk galt');
    }

    brukerDao.hentBruker(req.body, (status, data) => {
      res.status(status);
      res.json(data);
      passord(req.body.passord).verifyAgainst(
        data[0].passord,
        (error, verified) => {
          if (error) throw new Error('Noe gikk galt!');
          if (!verified) {
            console.log('Feil passord');
          } else {
            console.log('Sjekk ok!');
          }
        }
      );
    });
  });
});

router.put('/endrePassord', (req, res) => {
  passord(req.body.nyttPassord).hash((error, hash) => {
    if (error) {
      throw new Error('Noe gikk galt');
    }
    req.body.nyttPassord = hash;
    brukerDao.endrePassord(req.body, (status, data) => {
      res.status(status);
      res.json(data);
    });
    console.log('Suksess');
  });
});

module.exports = router;
