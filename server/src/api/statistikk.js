import express from 'express';
const router = express.Router();
import mysql from 'mysql';
import bodyParser from 'body-parser';
import {pool} from '../../test/poolsetup.js';
import StatistikkDao from '../dao/statistikkdao.js';

const statistikkDao = new StatistikkDao(pool);

router.get('/api/statistikk/feil/kommuner', (req, res) => {
  statistikkDao.feilPerKommune((status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/statistikk/feil/fylker', (req, res) => {
  statistikkDao.feilPerFylke((status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/statistikk/feil', (req, res) => {
  statistikkDao.hentAlleFeil((status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/statistikk/feil/kommune/:kommune_id', (req, res) => {
  statistikkDao.hentFeilPaaKommune(req.params.kommune_id, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/statistikk/feil/fylke/:fylke_navn', (req, res) => {
  statistikkDao.hentFeilPaaFylkenavn(req.params.fylke_navn, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/statistikk/feil/hovedkategorier/:kategorinavn', (req, res) => {
  statistikkDao.hentFeilPaaHovekategori(req.params.kategorinavn, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/statistikk/feil/subkategorier/:kategorinavn', (req, res) => {
  statistikkDao.hentFeilPaaEnSubkategori(req.params.kategorinavn, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/statistikk/feil/registrert/:intervall', (req, res) => {
  statistikkDao.hentRegistrerteFeilPaaIntervall(req.params.intervall, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/statistikk/feil/behandlet/:intervall', (req, res) => {
  statistikkDao.hentBehandledeFeilPaaIntervall(req.params.intervall, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/statistikk/feil/fylker/intervall/:intervall', (req, res) => {
  statistikkDao.hentFeilPerFylkePaaIntervall(req.params.intervall, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/statistikk/feil/kommuner/intervall/:intervall', (req, res) => {
  statistikkDao.hentFeilPerKommunePaaIntervall(req.params.intervall, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/statistikk/feil/hovedkategorier', (req, res) => {
  statistikkDao.hentFeilPerHovedkategori((status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/statistikk/feil/hovedkategorier/:intervall', (req, res) => {
  statistikkDao.hentFeilPerHovedkategoriPaaIntervall(req.params.intervall, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/statistikk/feil/subkategorier', (req, res) => {
  statistikkDao.hentFeilPerSubkategori((status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/statistikk/feil/subkategorier/:intervall', (req, res) => {
  statistikkDao.hentFeilPerSubkategoriPaaIntervall(req.params.intervall, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/statistikk/feil/status/:status_id', (req, res) => {
  statistikkDao.hentFeilPaaStatus(req.params.status_id, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

module.exports = router;
