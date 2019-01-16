import express from 'express';
const router = express.Router();
import path from 'path';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import multer from 'multer';
var upload = multer({dest: path.join(__dirname, '/../../temp')});
import FeilDao from '../dao/feildao.js';
import BildeOpplasting from '../opplasting/bildeopplasting.js';
router.use(bodyParser.json());
import {pool} from '../../test/poolsetup';

let feilDao = new FeilDao(pool);
let bildeOpplasting = new BildeOpplasting();

router.get('/api/feil', (req, res) => {
  console.log('Fikk GET-request fra klienten');

  feilDao.hentAlleFeil((status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hentAlleFeil lengde' + data.length);
  });
});

router.get('/api/feil/:feil_id', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk GET-request fra klienten');

  let a = {feil_id: req.body.feil_id}

  feilDao.hentEnFeil(a, (status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hentEnFeil resultat:' + data);
  });
});

router.get('/api/feil/:feil_id/bilder', (req, res) => {
  console.log('Fikk GET-request fra klienten');

  feilDao.hentBilderTilFeil(req.params.feil_id, (status, data) => {
    res.status(status);
    res.json(data);
    console.log('/feil/:feil_id/bilder resultat:' + data);
  });
});

//Dette endepunktet krever multipart/form-data istedet for json for å håndtere bildeopplasting
router.post('/api/feil', upload.array('bilder', 10), (req, res) => {
  //if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk POST-request fra klienten');

  let a = {
    kommune_id: req.body.kommune_id,
    subkategori_id: req.body.subkategori_id,
    overskrift: req.body.overskrift,
    beskrivelse: req.body.beskrivelse,
    lengdegrad: req.body.lengdegrad,
    breddegrad: req.body.breddegrad
  };

  feilDao.lagNyFeil(a, (status, data) => {
    console.log('Opprettet en ny feil');
    let feil_id = data.insertId;
    if (req.files && req.files.length > 0) {
      bildeOpplasting.lastOpp(req.files, (bilder) => {
        feilDao.leggTilBilder(feil_id, bilder, (status, data) => {
          res.status(status);
          res.send();
        });
      });
    } else {
      res.status(status);
      res.send();
    }
  });
});

router.put('/api/feil/:feil_id', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk POST-request fra klienten');

  let a = {
    subkategori_id: req.body.subkategori_id,
    status_id: req.body.status_id,
    beskrivelse: req.body.beskrivelse,
    lengdegrad: req.body.lengdegrad,
    breddegrad: req.body.breddegrad,
    feil_id: req.body.feil_id
  };

  feilDao.oppdaterFeil(a, (status, data) => {
    console.log('Oppdatert feil med id =' + req.body.feil_id);
    res.status(status);
  });
});

router.delete('/api/feil/:feil_id', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk POST-request fra klienten');

  let a = {feil_id: req.params.feil_id};

  feilDao.slettFeil(a, (status, data) => {
    console.log('Slettet en feil');
    res.status(status);
  });
});

router.get('/api/hovedkategorier', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk GET-request fra klienten');

  feilDao.hentAlleHovedkategorier((status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hentAlleHovedkategorier lengde: ' + data.length);
  });
});

router.get('/api/feil/:kategori_id', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk GET-request fra klienten');

  feilDao.hentFeilFiltrertKategori(req.params.kategori_id,(status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hent feil filtrert på kategori lengde: ' + data.length);
  });
});

router.post('/api/feil/:feil_id/oppdateringer', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk POST-request fra klienten');

  let a = {
    feil_id: req.body.feil_id,
    kommentar: req.body.kommentar,
    status_id: req.body.status_id,
    bruker_id: req.body.bruker_id
  };

  feilDao.lagOppdatering(a, (status, data) => {
    console.log('Ny oppdatering laget:');
    res.status(status);
  });
});

router.get('/api/feil/:feil_id/oppdatering', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk GET-request fra klienten');

  let a = {feil_id: req.params.feil_id};

  feilDao.hentAlleOppdateringerPaaFeil(a, (status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hentAlleOppdateringerPaaFeil lengde: ' + data.length);
  });
});

router.get('/api/statuser/:status_id', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk GET-request fra klienten');

  let a = {status_id: req.params.status_id};

  feilDao.hentEnStatus(a, (status, data) => {
    res.status(status);
    res.json(data);
    console.log('hent en status gir:' + data);
  });
});

router.get('/api/statuser', (req, res) => {
  console.log('Fikk GET-request fra klienten');

  feilDao.hentAlleStatuser((status, data) => {
    res.status(status);
    res.json(data);
    console.log('statuser lengde:' + data.length);
  });
});

router.get('/api/hovedkategorier', (req, res) => {
  console.log('Fikk GET-request fra klienten');

  feilDao.hentAlleHovedkategorier((status, data) => {
    res.status(status);
    res.json(data);
    console.log('hovedkategorier lengde:' + data.length);
  });
});

router.get('/api/hovedkategorier/:hovedkategori_id/subkategorier', (req, res) => {
  console.log('Fikk GET-request fra klienten');

  feilDao.hentAlleSubKategorierPaaHovedkategori(
    req.params.hovedkategori_id,
    (status, data) => {
      res.status(status);
      res.json(data);
      console.log(
        'subkategorier under hovedkategori lengde:' + data.length
      );
    }
  );
});
module.exports = router;
