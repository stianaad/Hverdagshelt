import express from 'express';
const router = express.Router();
import path from 'path';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import multer from 'multer';
var upload = multer({ dest: path.join(__dirname, '/../../temp') });
import FeilDao from '../dao/feildao.js';
import BildeOpplasting from '../opplasting/bildeopplasting.js';
router.use(bodyParser.json());
import { pool } from '../../test/poolsetup';
import { checkToken } from '../middleware';
import BrukerDao from '../dao/brukerdao.js';

let feilDao = new FeilDao(pool);
let brukerDao = new BrukerDao(pool);
let bildeOpplasting = new BildeOpplasting();

router.get('/api/feil', checkToken, (req, res) => {
  console.log('Fikk GET-request fra klienten');
  if (req.decoded.role == 'admin' || req.decoded.role == 'ansatt' && req.decoded.user.kommune_id == req.params.kommune_id) {
    feilDao.hentAlleFeil((status, data) => {
      res.status(status);
      res.json(data);
      console.log('/hentAlleFeil lengde' + data.length);
    });
  } else {
    res.status(403);
    res.json({ resultat: "ingen tilgang" });
  }
});

router.get('/api/kommuner/:kommune_id/godkjentefeil', (req, res) => {
  feilDao.hentGodkjenteFeilForKommune(req.params.kommune_id, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/kommuner/:kommune_id/feil', checkToken, (req, res) => {
  if (req.decoded.role == 'admin' || req.decoded.role == 'ansatt' && req.decoded.user.kommune_id == req.params.kommune_id) {
    feilDao.hentFeilForKommune(req.params.kommune_id, (status, data) => {
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({ resultat: "ingen tilgang" });
  }
});

router.get('/api/feil/:feil_id', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk GET-request fra klienten');

  let a = { feil_id: req.body.feil_id };

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
  let rolle = req.decoded.role;
  console.log('Fikk POST-request fra klienten');
  let a = {
    kommune_id: req.body.kommune_id,
    bruker_id: req.decoded.user.bruker_id,
    subkategori_id: req.body.subkategori_id,
    overskrift: req.body.overskrift,
    beskrivelse: req.body.beskrivelse,
    lengdegrad: req.body.lengdegrad,
    breddegrad: req.body.breddegrad,
  };
  if (rolle == 'privat' || rolle == 'admin') {
    feilDao.lagNyFeil(a, (status, data) => {
      console.log('Opprettet en ny feil');
      let feil_id = data.insertId;

      res.status(status);
      res.json({ "resultat": (status == 200) ? "vellykket" : "feilet" });

      if (status == 200) {

        if (req.body.abonner == 1) {
          feilDao.abonnerFeil({ feil_id: feil_id, bruker_id: a.bruker_id });
        }

        let o = {
          feil_id: feil_id,
          kommentar: 'Sak opprettet',
          status_id: 1,
          bruker_id: a.bruker_id
        };
        feilDao.lagOppdatering(o);

        if (req.files && req.files.length > 0) {
          bildeOpplasting.lastOpp(req.files, (bilder) => {
            feilDao.leggTilBilder(feil_id, bilder);
          });
        }
      }

    });
  } else {
    res.status(403);
    res.json({ result: false });
  }
});

router.put('/api/feil/:feil_id', checkToken, (req, res) => {
  let rolle = req.decoded.role;
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk POST-request fra klienten');
  let a = {
    kommune_id: req.body.kommune_id,
    subkategori_id: req.body.subkategori_id,
    overskrift: req.body.overskrift,
    beskrivelse: req.body.beskrivelse,
    lengdegrad: req.body.lengdegrad,
    breddegrad: req.body.breddegrad,
    feil_id: req.body.feil_id,
  };

  if (rolle == 'ansatt' && req.decoded.user.kommune_id == req.body.kommune_id || rolle == 'admin') {
    feilDao.oppdaterFeil(a, (status, data) => {
      console.log('Admin eller ansatt har oppdatert feil med id =' + req.body.feil_id);
      res.status(status);
    });
  } else if (rolle == 'privat') {
    let b = { bruker_id: req.decoded.user.bruker_id, feil_id: req.body.feil_id };
    feilDao.sjekkFeilPaaBruker(b, (status, data) => {
      if (data[0].length == 0) {
        res.status(403);
        res.json({ result: false, message: 'Privatbruker har ikke registrert denne feilen' });
      } else {
        feilDao.oppdaterFeil(a, (status, data) => {
          console.log('Privatbruker har oppdatert feil med id =' + req.body.feil_id);
          res.status(status);
        });
      }
    });
  } else {
    res.status(403);
    res.json({ result: false });
  }
});

router.delete('/api/feil/:feil_id', checkToken, (req, res) => {
  console.log('Fikk POST-request fra klienten');
  let rolle = req.decoded.rolle;
  let feil_id = { feil_id: req.body.feil_id };

  if (rolle == 'admin') {
    feilDao.slettFeil(feil_id, (status, data) => {
      console.log('Slettet en feil');
      res.status(status);
      res.json(data);
    });
  } else if (rolle == 'privat') {
    let b = { bruker_id: req.decoded.bruker_id, feil_id: req.body.feil_id };
    feilDao.sjekkFeilPaaBruker(b, (status, data) => {
      if (data[0].length == 0) {
        res.status(403);
        res.json({ result: false, message: 'Privatbruker har ikke registrert denne feilen' });
      } else {
        feilDao.slettFeil(feil_id, (status, data) => {
          console.log('Privatbruker har slettet feil med id =' + req.body.feil_id);
          res.status(status);
        });
      }
    });
  } else if (rolle == 'ansatt' && req.decoded.user.kommune_id == req.body.kommune_id) {
    feilDao.slettFeil(feil_id, (status, data) => {
      console.log('Ansatt har slettet feil med id =' + req.body.feil_id);
      res.status(status);
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

  feilDao.hentFeilFiltrertKategori(req.body, (status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hent feil filtrert på kategori lengde: ' + data.length);
  });
});

router.post('/api/feil/oppdateringer/bedrift', checkToken, (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk POST-request fra klienten');

  let a = {
    feil_id: req.body.feil_id,
    kommentar: req.body.kommentar,
    status_id: req.body.status_id,
    bruker_id: req.decoded.user.bruker_id
  };
  let role = req.decoded.role;
  console.log("hehehehehehehehehhe");
  if (role == 'bedrift' || role == 'admin' || role == 'ansatt') {
    feilDao.lagOppdatering(a, (status, data) => {
      console.log('Ny oppdatering laget:');
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({ result: false });
  }
});

router.get('/api/feil/:feil_id/oppdatering', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk GET-request fra klienten');

  let a = { feil_id: req.params.feil_id };

  feilDao.hentAlleOppdateringerPaaFeil(a, (status, data) => {
    res.status(status);
    res.json(data);
    console.log('/oppdateringer med feil_id ' + a.feil_id + ' lengde: ' + data.length);
  });
});

router.get('/api/statuser/:status_id', (req, res) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  console.log('Fikk GET-request fra klienten');

  let a = { status_id: req.params.status_id };

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

  feilDao.hentAlleSubKategorierPaaHovedkategori(req.body, (status, data) => {
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
  let a = { url: req.body.url, feil_id: req.body.feil_id };

  if (rolle == 'admin' || rolle == 'ansatt' && req.decoded.user.kommune_id == req.body.kommune_id) {
    feilDao.slettBildeFraFeil(a, (status, data) => {
      res.status(status);
      res.json(data);
      console.log('Admin eller ansatt slettet bilde fra feil');
    });
  } else if (rolle == 'privat') {
    let b = { bruker_id: req.decoded.user.bruker_id, feil_id: req.body.feil_id };
    feilDao.sjekkFeilPaaBruker(b, (status, data) => {
      if (data[0].length == 0) {
        res.status(403);
        res.json({ result: false });
      } else {
        feilDao.slettBildeFraFeil(a, (status, data) => {
          res.status(status);
          res.json(data);
          console.log('Privat slettet bilde fra feil');
        });
      }
    });
  } else {
    res.status(403);
    res.json({ result: false });
  }
});

router.get('/api/feil/bedrift/nyeoppgaver', checkToken, (req, res) => {
  console.log('Fikk GET-request fra klienten');
  let rolle = req.decoded.role;
  let bruker_id = req.decoded.user.bruker_id;
  console.log(bruker_id);
  if (rolle == 'bedrift' || rolle == 'admin') {
    feilDao.hentNyeFeilTilBedrift(bruker_id, (status, data) => {
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({result: false});
  }
});

router.get('/api/feil/bedrift/underbehandling', checkToken, (req, res) => {
  console.log('Fikk GET-request fra klienten');
  let rolle = req.decoded.role;
  let bruker_id = req.decoded.user.bruker_id;
  console.log(bruker_id);
  if (rolle == 'bedrift' || rolle == 'admin') {
    feilDao.hentUnderBehandlingFeilTilBedrift(bruker_id, (status, data) => {
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({ result: false });
  }
});

router.get('/api/bedrift/feil/ferdig', checkToken, (req, res) => {
  console.log('Fikk GET-request fra klienten');
  let role = req.decoded.role;
  let bruker_id = req.decoded.user.bruker_id;
  console.log(bruker_id);
  if (role == 'bedrift' || role == 'admin') {
    feilDao.hentFerdigeFeilTilBedrift(bruker_id, (status, data) => {
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({ result: false });
  }
});

router.post('/api/bedrift/feil', checkToken, (req, res) => {
  console.log('Fikk POST-request fra klienten');
  console.log('Inne i post bedrift feil');
  let role = req.decoded.role;
  if (role == 'ansatt' || role == 'admin') {
    hentBedriftPaaOrgnr(req.body.orgnr, (status, data) => {
      let a = {bruker_id: data[0].bruker_id, feil_id: req.body.feil_id}
      console.log(a);
      feilDao.sendFeilTilBedrift(a, (status, data) => {
        res.status(status);
        res.json(data);
      });
    })

  } else {
    res.status(403);
    res.json({result: false});
  }
});

router.get('/api/ansatt/bedrift/:orgnr/feil/nyeoppgaver', checkToken, (req, res) => {
  console.log('Fikk POST-request fra klienten');
  console.log('Inne i post bedrift feil');
  let role = req.decoded.role;
  if (role == 'ansatt' || role == 'admin') {
    feilDao.hentBedriftPaaOrgnr(req.params.orgnr, (status, data) => {
      feilDao.hentNyeFeilTilBedrift(data[0].bruker_id, (status, data) => {
        res.status(status);
        res.json(data);
      });
    });
  } else {
    res.status(403);
    res.json({result: false});
  }
});

router.get('/api/ansatt/bedrift/:orgnr/feil/underbehandling', checkToken, (req, res) => {
  console.log('Fikk POST-request fra klienten');
  console.log('Inne i post bedrift feil');
  let role = req.decoded.role;
  if (role == 'ansatt' || role == 'admin') {
    feilDao.hentBedriftPaaOrgnr(req.params.orgnr, (status, data) => {
      feilDao.hentUnderBehandlingFeilTilBedrift(data[0].bruker_id, (status, data) => {
        res.status(status);
        res.json(data);
      });
    });
  } else {
    res.status(403);
    res.json({result: false});
  }
});

router.get('/api/ansatt/bedrift/:orgnr/feil/ferdig', checkToken, (req, res) => {
  console.log('Fikk POST-request fra klienten');
  console.log('Inne i post bedrift feil');
  let role = req.decoded.role;
  if (role == 'ansatt' || role == 'admin') {
    feilDao.hentBedriftPaaOrgnr(req.params.orgnr, (status, data) => {
      feilDao.hentFerdigeFeilTilBedrift(data[0].bruker_id, (status, data) => {
        res.status(status);
        res.json(data);
      });
    });
  } else {
    res.status(403);
    res.json({result: false});
  }
});

router.put('/api/bedrift/oppdater/feil/godta', checkToken, (req, res) => {
  console.log('Fikk PUT-request fra klienten');
  let role = req.decoded.role;
  let bruker_id = req.decoded.user.bruker_id;
  console.log(bruker_id);
  if (role == 'bedrift' || role == 'admin') {
    feilDao.oppdaterStatusFeilTilBedrift(req.body, bruker_id, (status, data) => {
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({ result: false });
  }
});

router.post("/api/feil/:feil_id/abonnement", checkToken, (req, res) => {
  let role = req.decoded.role;
  let bruker_id = req.decoded.user.bruker_id;
  if (role == 'privat' || rolle == 'admin') {
    feilDao.abonnerFeil({ bruker_id: bruker_id, feil_id: req.params.feil_id }, (status, data) => {
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({ result: false });
  }
});

router.delete("/api/feil/:feil_id/abonnement", checkToken, (req, res) => {
  let role = req.decoded.role;
  let bruker_id = req.decoded.user.bruker_id;
  if (role == 'privat' || role == 'admin') {
    feilDao.ikkeAbonnerFeil({ bruker_id: bruker_id, feil_id: req.params.feil_id }, (status, data) => {
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({ result: false });
  }
});

router.put('/api/hovedkategorier/:hovedkategori_id', checkToken, (req, res) => {
  let role = req.decoded.role;
  console.log('oppdater hovedkategori, rolle:' + role);
  let a = { kategorinavn: req.body.kategorinavn, hovedkategori_id: req.params.hovedkategori_id };
  if (role == 'admin') {
    feilDao.oppdaterHovedkategori(a, (status, data) => {
      console.log('Oppdater hovedkategori data: ' + data);
      res.status(status);
      res.json(data);
    })
  } else {
    res.status(403);
    res.json({ result: false });
  }
});

router.put('/api/subkategorier/:subkategori_id', checkToken, (req, res) => {
  let role = req.decoded.role;
  console.log('oppdater subkategori, rolle:' + role)
  let a = {
    kategorinavn: req.body.kategorinavn,
    hovedkategori_id: req.body.hovedkategori_id,
    subkategori_id: req.params.subkategori_id
  };
  if (role == 'admin') {
    feilDao.oppdaterSubkategori(a, (status, data) => {
      console.log('Oppdater subkategori data: ' + data);
      res.status(status);
      res.json(data);
    })
  } else {
    res.status(403);
    res.json({ result: false });
  }
});

router.post('/api/subkategorier', checkToken, (req, res) => {
  let role = req.decoded.role;
  console.log('ny subkategori, rolle:' + role)
  if (role == 'admin') {
    feilDao.nySubkategori(req.body, (status, data) => {
      console.log('ny subkategori data: ' + data);
      res.status(status);
      res.json(data);
    })
  } else {
    res.status(403);
    res.json({ result: false });
  }
});

router.post('/api/hovedkategorier', checkToken, (req, res) => {
  let role = req.decoded.role;
  console.log('ny hovedkategori, rolle:' + role)
  if (role == 'admin') {
    feilDao.nySubkategori(req.body, (status, data) => {
      console.log('ny hovedkategori data: ' + data);
      res.status(status);
      res.json(data);
    })
  } else {
    res.status(403);
    res.json({ result: false });
  }
});

router.delete('/api/hovedkategorier/:hovedkategori_id', checkToken, (req, res) => {
  let role = req.decoded.role;
  console.log('slette hovedkategori, rolle:' + role);
  if (role == 'admin') {
    feilDao.slettHovedkategori({ hovedkategori_id: req.params.hovedkategori_id }, (status, data) => {
      console.log('slett hovedkategori data:' + data);
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({ result: false });
  }
});

router.delete('/api/subkategorier/:subkategori_id', checkToken, (req, res) => {
  let role = req.decoded.role;
  console.log('slette subkategori, rolle:' + role);
  if (role == 'admin') {
    feilDao.slettSubkategori({ subkategori_id: req.params.subkategori_id }, (status, data) => {
      console.log('slett subkategori data:' + data);
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({ result: false });
  }
});
module.exports = router;