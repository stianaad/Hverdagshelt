import express from 'express';
const router = express.Router();
import mysql from 'mysql';
import bodyParser from 'body-parser';
import BrukerDao from '../dao/brukerdao.js';
import passord from 'password-hash-and-salt';
import {callbackify} from 'util';
import {pool} from '../../test/poolsetup';
import Epost from '../epost.js';
import jwt from 'jsonwebtoken';
import secret from '../config.json';
import async from 'async';
import mdw from '../middleware.js';
import {checkToken} from '../middleware';

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
      epostTjener.registreringsBekreftelse(req.body.fornavn + " " + req.body.etternavn, req.body.epost);
    });
  });
});

router.post('/api/brukere/ansatt', checkToken, (req, res) => {
  let rolle = req.decoded.role;
  console.log('Fikk POST-request fra klienten');
  if (rolle == 'admin') {
    passord(req.body.passord).hash((error, hash) => {
      if (error) {
        throw new Error('Noe gikk galt');
      }
      req.body.passord = hash;
      brukerDao.lagNyAdminBruker(req.body, (status, data) => {
        res.status(status);
        res.json(data);
        console.log('Den nye IDen er:', data.insertId);
      });
    });
  } else {
    res.status(403);
    res.json({result: false});
  }
});

router.post('/api/brukere/bedrift', checkToken, (req, res) => {
  console.log('Fikk POST-request fra klienten');
  let rolle = req.decoded.role;

  if (rolle == 'admin' || rolle == 'ansatt') {
    passord(req.body.passord).hash((error, hash) => {
      if (error) {
        throw new Error('Noe gikk galt');
      }
      req.body.passord = hash;
      brukerDao.lagNyBedriftBruker(req.body, (status, data) => {
        res.status(status);
        res.json(data);
      });
    });
} else {
    res.status(403);
    res.json({result: false});
  }
});

router.post('/api/brukere/admin', checkToken, (req, res) => {
  console.log('Fikk POST-request fra klienten');
  let rolle = req.decoded.role;

  if (rolle == 'admin') {
    passord(req.body.passord).hash((error, hash) => {
      if (error) {
        throw new Error('Noe gikk galt');
      }
      req.body.passord = hash;
      brukerDao.lagNyAdminBruker(req.body, (status, data) => {
        res.status(status);
        res.json(data);
        console.log('Den nye IDen er:', data.insertId);
      });
    });
  } else {
    res.status(403);
    res.json({result: false});
  }
});

router.post('/api/brukere/nyttpassord', checkToken, (req, res) => {
  passord(req.body.passord).hash((error, hash) => {
    if (error) {
      throw new Error('Noe gikk galt');
    }
    req.body.passord = hash;
    brukerDao.endrePassord({passord: req.body.passord, epost: req.decoded.user.epost}, (status, data) => {
      res.status(status);
      res.json(data);
    });
    console.log('/nyttpassord, endret passord: OK');
  });
});

router.post('/api/brukere/glemtpassord', (req, res) => {
  brukerDao.hentBruker(req.body, (status, data) => {
    res.status(status);
    res.json(data);
    console.log('/glemtpassord - hentet bruker');
    if (data[0].epost === req.body.epost) {
      genenererEpostPollett(req.body.epost, (token) => {
        console.log('/glemtpassord - epost matcher, pollett generert');
        let link = 'http://localhost:3000/resett-passord/' + token;
        epostTjener.glemtPassord(req.body.epost, link);
      });
    } else {
      throw new Error('/glemtpassord - Fant ikke bruker');
    }
  });
});

router.get('/api/brukere/minside', checkToken, (req, res) => {
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
    res.json({result: false});
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
    res.json({result: false});
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
    res.json({result: false});
  }
});

router.get('/api/brukere/feil', checkToken, (req, res) => {
  console.log('/api/bruker/feil fikk get request fra klient');
  let role = req.decoded.role;
  let bruker_id = req.decoded.user.bruker_id;
  if (role == 'privat') {
    brukerDao.finnFolgteFeilTilBruker(bruker_id, (status, data) => {
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({result: false});
  }
});

router.get('/api/brukere/hendelser', checkToken, (req, res) => {
  console.log('/api/bruker/hendelser fikk get request fra klient');
  let role = req.decoded.role;
  let bruker_id = req.decoded.user.bruker_id;
  if (role == 'privat') {
    brukerDao.finnFolgteHendelserTilBruker(bruker_id, (status, data) => {
      res.status(status);
      res.json(data);
    });
  } else {
    res.status(403);
    res.json({result: false});
  }
});

router.put('/api/brukere', checkToken, (req, res) => {
  let rolle = {bruker_id: req.decoded.user.bruker_id, rolle: req.decoded.role};

  brukerDao.oppdaterSpesifisertBruker(req.body, rolle, (status, data) => {
    res.status(status);
    res.json(data);
    console.log('oppdater en bruker resultat:' + data);
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

module.exports = router;

const genenererEpostPollett = (epost, callback) => {
  console.log(secret.secret);
  jwt.sign({user: {epost: epost}}, secret.secret, {expiresIn: 900}, (err, token) => {
    console.log(err);
    callback(token);
  });
};
