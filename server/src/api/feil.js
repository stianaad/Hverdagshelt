const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');
import FeilDao from '../dao/feildao.js';

var pool = mysql.createPool({
  connectionLimit: 5,
  host: 'mysql.stud.iie.ntnu.no',
  user: 'jonathm',
  password: 'tFSnz90b',
  database: 'jonathm',
  debug: false,
  multipleStatements: true,
});

let feilDao = new FeilDao(pool);

router.get('/api/hentAlleFeil', (req, res) => {
  console.log('Fikk GET-request fra klienten');

  feilDao.hentAlleFeil((status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hentAlleFeil lengde' + data.length);
  });
});

router.get('/api/hentEnFeil', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk GET-request fra klienten');

  feilDao.hentEnFeil(req.params.feil_id, (status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hentEnFeil resultat:' + data);
  });
});

router.get('/api/hentFeilStatus', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk GET-request fra klienten');

  feilDao.hentFeilStatus(req.params.status_id, (status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hentFeilStatus lengde:' + data.length);
  });
});

router.post('/api/lagNyFeil', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk POST-request fra klienten');

  let a = {
    'kommune_id': req.body.kommune_id,
    'kategori_id': req.body.kategori_id,
    'beskrivelse': req.body.beskrivelse,
    'bilde': req.body.bilde,
    'lengdegrad': req.body.lengdegrad,
    'breddegrad':req.body.breddegrad,
  };

  feilDao.lagNyFeil(a, (status, data) => {
    console.log('Opprettet en ny feil');
    res.status(status);
  });
});

router.post('/api/oppdaterFeil', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk POST-request fra klienten');

  let a = {
    'kategori_id': req.body.kategori_id,
    'beskrivelse': req.body.beskrivelse,
    'bilde': req.body.bilde,
    'lengdegrad': req.body.lengdegrad,
    'breddegrad': req.body.breddegrad,
    'feil_id': req.body.feil_id,
  };

  feilDao.oppdaterFeil(a, (status, data) => {
    console.log('Oppdatert feil med id =' + req.body.feil_id);
    res.status(status);
  });
});

router.post('/api/endreStatusFeil', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk POST-request fra klienten');

  let a = {
    'status_id': req.body.status_id,
    'feil_id': req.body.feil_id,
  };

  feilDao.endreStatusFeil(a, (status, data) => {
    console.log('Oppdatert en feil med ny status, feil_id = ' + req.body.feil_id);
    res.status(status);
  });
});

router.post('/api/slettFeil', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk POST-request fra klienten');

  feilDao.slettFeil(req.body.feil_id, (status, data) => {
    console.log('Slettet en feil');
    res.status(status);
  });
});

router.get('/api/hentEnKategori', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk GET-request fra klienten');

  feilDao.hentEnKategori(req.params.kategori_id, (status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hentEnKategori gir: ' + data);
  });
});

router.get('/api/hentAlleKategorier', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk GET-request fra klienten');

  feilDao.hentAlleKategorier((status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hentAlleKategorier lengde: ' + data.length);
  });
});

router.post('/api/lagOppdatering', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk POST-request fra klienten');

  let a = {
    'feil_id': req.body.feil_id,
    'kommentar': req.body.kommentar,
    'status_id': req.body.status_id,
    'bruker_id': req.body.bruker_id,
  };

  feilDao.lagOppdatering(a, (status, data) => {
    console.log('Ny oppdatering laget:');
    res.status(status);
  });
});

router.get('/api/hentAlleOppdateringerPaaFeil', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk GET-request fra klienten');

  let a = { 'feil_id': req.params.feil_id }

  feilDao.hentAlleOppdateringerPaaFeil(a, (status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hentAlleOppdateringerPaaFeil lengde: ' + data.length);
  });
});

router.get('/api/hentEnStatus', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk GET-request fra klienten');

  let a = { 'status_id': req.params.status_id }

  feilDao.hentEnStatus(a, (status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hentEnStatus gir:' + data);
  });
});

router.get('/api/hentAlleStatuser', (req, res) => {
  console.log('Fikk GET-request fra klienten');

  feilDao.hentAlleStatuser((status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hentAlleStatuser lengde:' + data.length);
  });
});