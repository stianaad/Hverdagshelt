const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');
import HendelseDao from '../dao/hendelsedao.js';

var pool = mysql.createPool({
  connectionLimit: 5,
  host: 'mysql.stud.iie.ntnu.no',
  user: 'jonathm',
  password: 'tFSnz90b',
  database: 'jonathm',
  debug: false,
  multipleStatements: true,
});

let hendelseDao = new HendelseDao(pool);

router.get('/api/hentAlleHendelser', (req, res) => {
  console.log('Fikk GET-request fra klienten');

  hendelseDao.hentAlleHendelser((status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hentAlleHendelser lengde' + data.length);
  });
});

router.get('/api/hentEnHendelse', (req, res) => {
  console.log('Fikk GET-request fra klienten');

  hendelseDao.hentEnHendelse(req.body.hendelse_id, (status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hentEnHendelse gir:' + data);
  });
});

router.post('/api/lagNyHendelse', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk POST-request fra klienten');

  let a = {
    req.body.overskrift,
    req.body.bruker_id,
    req.body.beskrivelse,
    req.body.sted,
    req.body.bilde,
    req.body.lengdegrad,
    req.body.breddegrad,
  };

  feilDao.lagNyHendelse(a, (status, data) => {
    console.log('Opprettet en ny hendelse');
    res.status(status);
  });
});

router.post('/api/slettHendelse', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk POST-request fra klienten');

  feilDao.slettHendelse(req.body.hendelse_id, (status, data) => {
    console.log('Slettet en hendelse');
    res.status(status);
  });
});