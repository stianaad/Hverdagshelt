import express from 'express';
const router = express.Router();
import mysql from 'mysql';
import bodyParser from 'body-parser';
import {pool} from '../../test/poolsetup.js';
import StatistikkDao from '../dao/statistikkdao.js';

const statistikkDao = new StatistikkDao(pool);

router.get('/api/feilperkommune', (req, res) => {
  statistikkDao.feilPerKommune((status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/feil', (req, res) => {
  statistikkDao.hentAlleFeil((status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/feil/:kommune_id', (req, res) => {
  statistikkDao.hentFeilPaaKommune(req.params.kommune_id, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/feil/:fylke_navn', (req, res) => {
  statistikkDao.hentFeilPaaFylkenavn(req.params.fylke_navn, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/feil/:kategorinavn', (req, res) => {
  statistikkDao.hentFeilPaaHovekategori(req.params.kategorinavn, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/feil/hovedkategori/:kategorinavn', (req, res) => {
  statistikkDao.hentFeilPaaSubkategori(req.params.kategorinavn, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/feil/dag', (req, res) => {
  statistikkDao.hentRegistrerteFeilPaaInterval('1 day', (status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/feil/uke', (req, res) => {
  statistikkDao.hentRegistrerteFeilPaaInterval('1 week', (status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/feil/maaned', (req, res) => {
  statistikkDao.hentRegistrerteFeilPaaInterval('1 month', (status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/feil/aar', (req, res) => {
  statistikkDao.hentRegistrerteFeilPaaInterval('1 year', (status, data) => {
    res.status(status);
    res.json(data);
  });
});


module.exports = router;