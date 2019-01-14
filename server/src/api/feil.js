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

router.get('/api/hentBilder/:feil_id', (req, res) => {
  console.log('Fikk GET-request fra klienten');

  feilDao.hentBilderTilFeil(req.params.feil_id, (status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hentBilderTilFeil/:feil_id resultat:' + data);
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

//Dette endepunktet krever multipart/form-data istedet for json for å håndtere bildeopplasting
router.post('/api/lagNyFeil', upload.array('bilder', 10), (req, res) => {
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

router.post('/api/oppdaterFeil', (req, res) => {
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

router.post('/api/endreStatusFeil', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk POST-request fra klienten');

  let a = {
    status_id: req.body.status_id,
    feil_id: req.body.feil_id
  };

  feilDao.endreStatusFeil(a, (status, data) => {
    console.log(
      'Oppdatert en feil med ny status, feil_id = ' + a.feil_id
    );
    res.status(status);
  });
});

router.post('/api/slettFeil', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk POST-request fra klienten');

  let a = {feil_id: req.params.feil_id};

  feilDao.slettFeil(a, (status, data) => {
    console.log('Slettet en feil');
    res.status(status);
  });
});

/*
router.get('/api/hentEnKategori', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk GET-request fra klienten');

  feilDao.hentEnKategori(req.params.kategori_id, (status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hentEnKategori gir: ' + data);
  });
});
*/

router.get('/api/hentAlleHovedkategorier', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk GET-request fra klienten');

  feilDao.hentAlleHovedkategorier((status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hentAlleHovedkategorier lengde: ' + data.length);
  });
});

router.get('/api/filtrerKategori/:kategori_id', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk GET-request fra klienten');

  feilDao.hentFeilFiltrertKategori(req.params.kategori_id,(status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hent feil filtrert på kategori lengde: ' + data.length);
  });
});

router.post('/api/lagOppdatering', (req, res) => {
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

router.get('/api/hentAlleOppdateringerPaaFeil', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk GET-request fra klienten');

  let a = {feil_id: req.params.feil_id};

  feilDao.hentAlleOppdateringerPaaFeil(a, (status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hentAlleOppdateringerPaaFeil lengde: ' + data.length);
  });
});

router.get('/api/hentEnStatus', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk GET-request fra klienten');

  let a = {status_id: req.params.status_id};

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

router.get('/api/hentAlleHovedkategorier', (req, res) => {
  console.log('Fikk GET-request fra klienten');

  feilDao.hentAlleHovedkategorier((status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hentAlleHovedkategorier lengde:' + data.length);
  });
});

router.get('/api/hentAlleSubKategorierPaaHovedkategori', (req, res) => {
  console.log('Fikk GET-request fra klienten');

  feilDao.hentAlleSubKategorierPaaHovedkategori(
    req.params.hovedkategori_id,
    (status, data) => {
      res.status(status);
      res.json(data);
      console.log(
        '/hentAlleSubKategorierPaaHovedkategori lengde:' + data.length
      );
    }
  );
});
module.exports = router;