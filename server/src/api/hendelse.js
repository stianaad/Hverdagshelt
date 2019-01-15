import express from 'express';
const router = express.Router();
import mysql from 'mysql';
import bodyParser from 'body-parser';
import HendelseDao from '../dao/hendelsedao.js';
import {pool} from '../../test/poolsetup';

let hendelseDao = new HendelseDao(pool);

router.get('/api/hendelser', (req, res) => {
  console.log('Fikk GET-request fra klienten');

  hendelseDao.hentAlleHendelser((status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hentAlleHendelser lengde' + data.length);
  });
});

router.get('/api/hendelser/:hendelse_id', (req, res) => {
  console.log('Fikk GET-request fra klienten');

  var a = {hendelse_id: req.body.hendelse_id}

  hendelseDao.hentEnHendelse(a ,(status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hentEnHendelse gir:' + data);
  });
});

router.post('/api/hendelser/:hendelse_id', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk POST-request fra klienten');

  let a = {
    bruker_id: req.body.bruker_id,
    hendelseskategori_id: req.body.hendelseskategori_id,
    kommune_id: req.body.kommune_id,
    overskrift: req.body.overskrift,
    tid: req.body.tid,
    beskrivelse: req.body.beskrivelse,
    sted: req.body.sted,
    bilde: req.body.bilde,
    lengdegrad: req.body.lengdegrad,
    breddegrad: req.body.breddegrad
  };

  hendelseDao.lagNyHendelse(a, (status, data) => {
    console.log('Opprettet en ny hendelse');
    res.status(status);
  });
});

router.put('/api/hendelser/:hendelse_id', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk POST-request fra klienten');

  let a = {
    hendelseskategori_id: req.body.hendelseskategori_id,
    kommune_id: req.body.kommune_id,
    overskrift: req.body.overskrift,
    tid: req.body.tid,
    beskrivelse: req.body.beskrivelse,
    bilde: req.body.bilde,
    lengdegrad: req.body.lengdegrad,
    breddegrad: req.body.breddegrad,
    hendelse_id: req.body.hendelse_id
  };

  hendelseDao.oppdaterHendelse(a, (status, data) => {
    console.log('Oppdatert en hendelse');
    res.status(status);
  });
});

router.delete('/api/hendelser/:hendelse_id', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk POST-request fra klienten');

  var a = {hendelse_id: req.body.hendelse_id}

  hendelseDao.slettHendelse(a, (status, data) => {
    console.log('Slettet en hendelse');
    res.status(status);
  });
});
module.exports = router;
