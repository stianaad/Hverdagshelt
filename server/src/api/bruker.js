import express from 'express';
const router = express.Router();
import mysql from 'mysql';
import bodyParser from 'body-parser';
import BrukerDao from '../dao/brukerdao.js';
import passord from 'password-hash-and-salt';
import { callbackify } from 'util';
import { pool } from '../../test/poolsetup';
import Epost from '../epost.js';
import jwt from 'jsonwebtoken';
import secret from '../config.json';
import async from 'async';
import mdw from '../middleware.js';
import { checkToken } from '../middleware';

let brukerDao = new BrukerDao(pool);
let epostTjener = new Epost();

/**
 * Endepunkt
 */

router.post('/api/brukere/', (req, res) => {
  console.log('Fikk POST-request fra klienten');
  passord(req.body.passord).hash((error, hash) => {
    if (error) {
      throw new Error('Noe gikk galt');
    }
    req.body.passord = hash;
    brukerDao.lagNyBruker(req.body, (status, data) => {
      res.status(status);
      res.json(data);
      console.log('Den nye IDen er:', data.insertId);
    });
  });
});

router.post('/api/brukere/privat', (req, res) => {
  console.log('Fikk POST-request fra klienten');
  passord(req.body.passord).hash((error, hash) => {
    if (error) {
      throw new Error('Noe gikk galt');
    }
    req.body.passord = hash;
    brukerDao.lagNyPrivatBruker(req.body, (status, data) => {
      res.status(status);
      res.json(data);
      epostTjener.registreringsBekreftelse(req.body.fornavn + ' ' + req.body.etternavn, req.body.epost);
    });
  });
});

router.post('/api/brukere/ansatt', checkToken, (req, res) => {
  let rolle = req.decoded.role;
  console.log('Fikk POST-request fra klienten');
  if (rolle == 'admin') {
    req.body.passord = 'udefinert';
    brukerDao.lagNyAnsattBruker(req.body, (status, data) => {
      if (status == 200) {
        genenererEpostPollett(req.body.epost, '3d', (token) => {
          console.log('/Ny ansatt bruker, pollett generert');
          let link = 'https://localhost/resett-passord/' + token;
          epostTjener.glemtPassord(req.body.epost, link);
        });
      }
      res.status(status);
      res.json(data);
      console.log('Den nye IDen er:', data.insertId);
    });
  } else {
    res.status(403);
    res.json({ result: false });
  }
});

router.post('/api/bruker/passord', (req, res) => {
  passord(req.body.passord).hash((error, hash) => {
    if (error) {
      throw new Error('Noe gikk galt');
    }
    req.body.passord = hash;
  });
});

router.get('/api/brukere/sok/:soktekst', checkToken, (req, res) => {
  if (req.decoded.role == 'admin') {
    brukerDao.sokBrukere(req.params.soktekst, (status, data) => {
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({ result: false });
  }
});

router.post('/api/brukere/bedrift', checkToken, (req, res) => {
  console.log('Fikk POST-request fra klienten');
  let rolle = req.decoded.role;

  if (rolle == 'admin' || rolle == 'ansatt') {
    req.body.passord = 'udefinert';
    brukerDao.lagNyBedriftBruker(req.body, (status, data) => {
      if (status == 200) {
        genenererEpostPollett(req.body.epost, '3d', (token) => {
          console.log('/Ny bedrift bruker, pollett generert');
          let link = 'https://localhost/resett-passord/' + token;
          epostTjener.glemtPassord(req.body.epost, link);
        });
      }
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({ result: false });
  }
});

router.post('/api/brukere/admin', checkToken, (req, res) => {
  console.log('Fikk POST-request fra klienten');
  let rolle = req.decoded.role;

  if (rolle == 'admin') {
    req.body.passord = 'udefinert';
    brukerDao.lagNyAdminBruker(req.body, (status, data) => {
      if (status == 200) {
        genenererEpostPollett(req.body.epost, '3d', (token) => {
          console.log('/Ny admin bruker, pollett generert');
          let link = 'https://localhost/resett-passord/' + token;
          epostTjener.glemtPassord(req.body.epost, link);
        });
      }
      res.status(status);
      res.json(data);
      console.log('Den nye IDen er:', data.insertId);
    });
  } else {
    res.status(403);
    res.json({ result: false });
  }
});

router.get('/api/brukere/:bruker_id', (req, res) => {
  console.log('Fikk :) fra klienten');
  brukerDao.hentBrukerPaaid(req.params.bruker_id, (status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hentBrukerpaaid resultat:' + data);
  });
});

router.post('/api/brukere/nyttpassord', checkToken, (req, res) => {
  passord(req.body.passord).hash((error, hash) => {
    if (error) {
      throw new Error('Noe gikk galt');
    }
    req.body.passord = hash;
    brukerDao.endrePassord({ passord: req.body.passord, epost: req.decoded.user.epost }, (status, data) => {
      res.status(status);
      res.json(data);
    });
    console.log('/nyttpassord, endret passord: OK');
  });
});

router.put('/api/brukere/endrepassord', checkToken, (req, res) => {
  if (req.body.nyttPass === req.body.nyttPassSjekk && req.body.nyttPass.length >= 8) {
    brukerDao.hentBrukerPaaid(req.decoded.user, (status, info) => {
      if (info.length > 0) {
        passord(req.body.gammeltPass).verifyAgainst(info[0].passord, (error, verified) => {
          if (error) {
            throw new Error('/brukere/endrepassord - Error på verifisering');
          }
          if (verified) {
            console.log('passod verifisert');
            passord(req.body.nyttPass).hash((error, hash) => {
              if (error) {
                throw new Error('/brukere/endrepassord - Hashing feilet');
              }
              req.body.nyttPass = hash;
              brukerDao.endrePassord({ passord: req.body.nyttPass, epost: req.decoded.user.epost }, (status, data) => {
                res.status(status);
                res.json(data);
              });
            });
          }
          else {
            res.status(403);
            res.json({ result: false });
          }
        });
      }
    });
  } else {
    throw new Error('/brukere/endrepassord - Passord ikke like eller for korte')
  }
});

router.post('/api/brukere/glemtpassord', (req, res) => {
  brukerDao.hentBrukerPaaid(req.body, (status, data) => {
    res.status(status);
    res.json(data);
    console.log('/glemtpassord - hentet bruker');
    if (data[0].epost === req.body.epost) {
      genenererEpostPollett(req.body.epost, 900, (token) => {
        console.log('/glemtpassord - epost matcher, pollett generert');
        let link = 'https://localhost/resett-passord/' + token;
        epostTjener.glemtPassord(req.body.epost, link);
      });
    } else {
      throw new Error('/glemtpassord - Fant ikke bruker');
    }
  });
});

router.get('/api/brukere/minside/nye', checkToken, (req, res) => {
  console.log('/bruker/minside fikk get request fra klient');
  let role = req.decoded.role;
  let bruker_id = req.decoded.user.bruker_id;
  if (role == 'privat') {
    brukerDao.finnOppdaterteFeilTilBruker(bruker_id, (status, data) => {
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({ result: false });
  }
});

router.get('/api/bruker/minside/gamle', checkToken, (req, res) => {
  console.log('/bruker/minside fikk get request fra klient');
  let role = req.decoded.role;
  let bruker_id = req.decoded.user.bruker_id;
  if (role == 'privat') {
    brukerDao.finnIkkeOppdaterteFeilTilBruker(bruker_id, (status, data) => {
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({ result: false });
  }
});

router.get('/api/bruker/minside/sist/innlogget', checkToken, (req, res) => {
  console.log('/bruker/minside fikk get request fra klient');
  let role = req.decoded.role;
  let bruker_id = req.decoded.user.bruker_id;
  if (role == 'privat') {
    brukerDao.oppdaterSistInnloggetPrivat(bruker_id, (status, data) => {
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({ result: false });
  }
});

router.get('/api/brukerfeil', checkToken, (req, res) => {
  console.log('/api/brukerfeil fikk get request fra klient');
  let role = req.decoded.role;
  let bruker_id = req.decoded.user.bruker_id;
  if (role == 'privat') {
    brukerDao.finnFolgteFeilTilBruker(bruker_id, (status, data) => {
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({ result: false });
  }
});

router.get('/api/brukerhendelser', checkToken, (req, res) => {
  console.log('/api/brukerhendelser fikk get request fra klient');
  let role = req.decoded.role;
  let bruker_id = req.decoded.user.bruker_id;
  if (role == 'privat') {
    brukerDao.finnFolgteHendelserTilBruker(bruker_id, (status, data) => {
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({ result: false });
  }
});

router.put('/api/admin/brukere', checkToken, (req ,res) => {
  if (req.decoded.role == 'admin') {
    brukerDao.oppdaterSpesifisertBrukerAdmin(req.body, (status, data) => {
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({resultat: false});
  }
});

router.put('/api/brukere', checkToken, (req, res) => {
  let rolle = { bruker_id: req.decoded.user.bruker_id, rolle: req.decoded.role };
  console.log(rolle);

  brukerDao.oppdaterSpesifisertBruker(req.body, rolle, (status, data) => {
    let payload = req.decoded;
    payload.user.epost = req.body.epost;
    payload.user.kommune_id = req.body.kommune_id;
    jwt.sign({ user: payload.user, role: payload.role }, secret.secret, { expiresIn: '1d' }, (err, token) => {
      console.log(err);
      res.status(200);
      res.json({
        result: true,
        token: token,
      });
      console.log('oppdater en bruker resultat:' + data);
    });
  });
});

router.get('/api/bedrifter', (req, res) => {
  console.log('Fikk GET-request fra klienten');

  brukerDao.hentBedrifter((status, data) => {
    res.status(status);
    res.json(data);
    console.log('/hentAlleBedrifter lengde' + data.length);
  });
});

router.get('/api/mininfo', checkToken, (req, res) => {
  brukerDao.hentBrukerInfo(req.decoded.user.bruker_id, req.decoded.role, (status, data) => {
    res.status(status);
    res.json(data);
  });
});


router.delete('/api/brukere/:bruker_id', checkToken, (req, res) => {
  if (req.decoded.role == 'admin') {
    brukerDao.slettBruker(req.params.bruker_id, (status, data) => {
      res.status(status);
      res.json(data);
    })
  } else {
    res.status(403);
    res.json({resultat: false});
  }
});



module.exports = router;

const genenererEpostPollett = (epost, tid, callback) => {
  console.log(secret.secret);
  jwt.sign({ user: { epost: epost } }, secret.secret, { expiresIn: tid }, (err, token) => {
    console.log(err);
    callback(token);
  });
};
