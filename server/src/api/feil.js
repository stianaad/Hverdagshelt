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
import {checkToken} from '../middleware';
import BrukerDao from '../dao/brukerdao.js';

let feilDao = new FeilDao(pool);
let brukerDao = new BrukerDao(pool);
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

  let a = {feil_id: req.body.feil_id};

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
router.post('/api/feil', upload.array('bilder', 10), checkToken, (req, res) => {
  //if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk POST-request fra klienten');
  let a = {
    kommune_id: req.body.kommune_id,
    bruker_id: 1, //dette skal serveren finne ut av selv ut i fra token
    subkategori_id: req.body.subkategori_id,
    overskrift: req.body.overskrift,
    beskrivelse: req.body.beskrivelse,
    lengdegrad: req.body.lengdegrad,
    breddegrad: req.body.breddegrad,
  };
  if (rolle == 'privat' || rolle == 'admin') {
    feilDao.lagNyFeil(a, (status1, data) => {
      console.log('Opprettet en ny feil');
      let feil_id = data.insertId;
      let o = {
        feil_id: feil_id,
        kommentar: 'Sak opprettet',
        status_id: 1,
        bruker_id: null,
      };
      feilDao.lagOppdatering(o, (status2, data) => {
        if (req.files && req.files.length > 0) {
          bildeOpplasting.lastOpp(req.files, (bilder) => {
            feilDao.leggTilBilder(feil_id, bilder, (status3, data) => {
              res.status(status3);
              res.send();
            });
          });
        } else {
          res.status(status2);
          res.send();
        }
      });
    });
  } else {
    res.status(403);
    res.json({result: false});
  }
});

router.put('/api/feil/:feil_id', checkToken, (req, res) => {
  let rolle = req.decoded.role;
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk POST-request fra klienten');
  let a = {
      kommune_id: req.body.kommune_id,
      subkategori_id: req.body.subkategori_id,
      beskrivelse: req.body.beskrivelse,
      lengdegrad: req.body.lengdegrad,
      breddegrad: req.body.breddegrad,
      feil_id: req.body.feil_id,
    };

  if (rolle == 'admin' || rolle == 'ansatt') {
    feilDao.oppdaterFeil(a, (status, data) => {
      console.log('Admin eller ansatt har oppdatert feil med id =' + req.body.feil_id);
      res.status(status);
    });
  } else if (rolle == 'privat') {
    let b = {bruker_id: req.decoded.user.bruker_id, feil_id: req.body.feil_id};
    feilDao.sjekkFeilPaaBruker(b, (status, data) => {
      if(data[0].length == 0) {
        res.status(403);
        res.json({result: false, message: 'Privatbruker har ikke registrert denne feilen'});
      } else {
        feilDao.oppdaterFeil(a, (status, data) => {
          console.log('Privatbruker har oppdatert feil med id =' + req.body.feil_id);
          res.status(status);
        });
      }
    });
  } else {
    res.status(403);
    res.json({result: false});
  }
});

router.delete('/api/feil/:feil_id', checkToken, (req, res) => {
  console.log('Fikk POST-request fra klienten');
  let rolle = req.decoded.rolle;

  let a = {
    kommune_id: req.body.kommune_id,
    subkategori_id: req.body.subkategori_id,
    overskrift: req.body.overskrift,
    beskrivelse: req.body.beskrivelse,
    lengdegrad: req.body.lengdegrad,
    breddegrad: req.body.breddegrad
  }

  if (rolle == 'admin') {
    feilDao.slettFeil(req.body.feil_id, (status, data) => {
      console.log('Slettet en feil');
      res.status(status);
      res.json(data);
    });
  } else if (rolle == 'privat') {
    let b = {bruker_id: req.decoded.bruker_id, feil_id: req.body.feil_id};
    feilDao.sjekkFeilPaaBruker(b, (status, data) => {
      if(data[0].length == 0) {
        res.status(403);
        res.json({result: false, message: 'Privatbruker har ikke registrert denne feilen'});
      } else {
        feilDao.oppdaterFeil(a, (status, data) => {
          console.log('Privatbruker har slettet feil med id =' + req.body.feil_id);
          res.status(status);
        });
      }
    });
  } else if (rolle == 'ansatt') {
    let c = {kommune_id: req.decoded.user.kommune_id, feil_id: req.body.feil_id};
    brukerDao.sjekkFeilPaaKommune(c, (status, data) => {
      if(data[0].length == 0) {
        res.status(403);
        res.json({result: false, message: 'Ansatt har ikke tilgang til feil i denne kommunen'});
      } else {
        feilDao.oppdaterFeil(a, (status, data) => {
          console.log('Ansatt har slettet feil med id =' + req.body.feil_id);
          res.status(status);
        });
      }
    });
  }
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

  feilDao.hentFeilFiltrertKategori(req.params.kategori_id, (status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hent feil filtrert på kategori lengde: ' + data.length);
  });
});

router.post('/api/feil/oppdateringer/bedrift',checkToken, (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk POST-request fra klienten');
  rolle = req.decoded.role;

  let a = {
    feil_id: req.body.feil_id,
    kommentar: req.body.kommentar,
    status_id: req.body.status_id,
    bruker_id: req.decoded.user.bruker_id
  };
  let role = req.decoded.role;
  console.log("hehehehehehehehehhe");
  if (role == 'bedrift') {
    feilDao.lagOppdatering(a, (status, data) => {
      console.log('Ny oppdatering laget:');
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({result: false});
  }
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

  feilDao.hentAlleSubKategorierPaaHovedkategori(req.params.hovedkategori_id, (status, data) => {
    res.status(status);
    res.json(data);
    console.log('subkategorier under hovedkategori lengde:' + data.length);
  });
});

router.get('/api/hovedkategorier/subkategorier', (req, res) => {
  console.log('Fikk GET-request fra klienten');

  feilDao.hentAlleSubkategorier((status, data) => {
    res.status(status);
    res.json(data);
    console.log('Subkategoriene er: ' + data);
  });
});

router.delete('/api/feil/:feil_id/bilder/:bilde_id', checkToken, (req, res) => {
  console.log('Fikk DELETE-request fra klienten');
  let rolle = req.decoded.role;
  let a = {url: req.body.url, feil_id: req.body.feil_id};

  if(rolle == 'admin' || rolle == 'ansatt') {
    feilDao.slettBildeFraFeil(a, (status, data) => {
      res.status(status);
      res.json(data);
      console.log('Admin eller ansatt slettet bilde fra feil');
    });
  } else if (rolle == 'privat') {
    let b = {bruker_id: req.decoded.user.bruker_id, feil_id: req.body.feil_id};
    feilDao.sjekkFeilPaaBruker(b, (status, data) => {
      if(data[0].length == 0) {
        res.status(403);
        res.json({result: false});
      } else {
        feilDao.slettBildeFraFeil(a, (status, data) => {
          res.status(status);
          res.json(data);
          console.log('Privat slettet bilde fra feil');
        });
      }
    });
  }
});

router.get('/api/feil/bedrift/nyeOppgaver', checkToken, (req, res) => {
  console.log('Fikk GET-request fra klienten');
  let role = req.decoded.role;
  let bruker_id = req.decoded.user.bruker_id;
  console.log(bruker_id);
  if (role == 'bedrift') {
    feilDao.hentNyeFeilTilBedrift(bruker_id, (status, data) => {
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({result: false});
  }
});

router.get('/api/feil/bedrift/underBehandling', checkToken, (req, res) => {
  console.log('Fikk GET-request fra klienten');
  let role = req.decoded.role;
  let bruker_id = req.decoded.user.bruker_id;
  console.log(bruker_id);
  if (role == 'bedrift') {
    feilDao.hentUnderBehandlingFeilTilBedrift(bruker_id, (status, data) => {
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({result: false});
  }
});

router.get('/api/feil/bedrift/ferdig', checkToken, (req, res) => {
  console.log('Fikk GET-request fra klienten');
  let role = req.decoded.role;
  let bruker_id = req.decoded.user.bruker_id;
  console.log(bruker_id);
  if (role == 'bedrift') {
    feilDao.hentFerdigeFeilTilBedrift(bruker_id, (status, data) => {
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({result: false});
  }
});



router.put('/api/bedrift/oppdater/feil/godta',checkToken, (req, res) => {
  console.log('Fikk PUT-request fra klienten');
  let role = req.decoded.role;
  let bruker_id = req.decoded.user.bruker_id;
  console.log(bruker_id);
  if (role == 'bedrift') {
    feilDao.oppdaterStatusFeilTilBedrift(req.body,bruker_id, (status, data) => {
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({result: false});
  }
});

router.post("/api/feil/:feil_id/abonnement", checkToken, (req, res) => {
  let role = req.decoded.role;
  let bruker_id = req.decoded.user.bruker_id;
  if (role == 'privat') {
    feilDao.abonnerFeil({bruker_id: bruker_id, feil_id: req.params.feil_id}, (status, data) => {
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({result: false});
  }
});

router.delete("/api/feil/:feil_id/abonnement", checkToken, (req, res) => {
  let role = req.decoded.role;
  let bruker_id = req.decoded.user.bruker_id;
  if (role == 'privat') {
    feilDao.ikkeAbonnerFeil({bruker_id: bruker_id, feil_id: req.params.feil_id}, (status, data) => {
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({result: false});
  }
});




module.exports = router;