import express from 'express';
const router = express.Router();
import mysql from 'mysql';
import bodyParser from 'body-parser';
import HendelseDao from '../dao/hendelsedao.js';
import path from 'path';
import multer from 'multer';
var upload = multer({ dest: path.join(__dirname, '/../../temp') });
import BildeOpplasting from '../opplasting/bildeopplasting.js';
import { pool } from '../../test/poolsetup';
import { checkToken } from '../middleware';
import Epost from '../epost.js';

let epostTjener = new Epost();
let hendelseDao = new HendelseDao(pool);
let bildeOpplasting = new BildeOpplasting();

router.get('/api/hendelser', (req, res) => {
	console.log('Fikk GET-request fra klienten');
	hendelseDao.hentAlleHendelser((status, data) => {
		res.status(status);
		res.json(data);
		console.log('/hentAlleHendelser lengde' + data.length);
	});
});

router.get('/api/kommuner/hendelser/:kommune_id', (req, res) => {
	console.log('Fikk GET-request fra klienten');
	hendelseDao.hentHendelseForKommune(req.params.kommune_id, (status, data) => {
		res.status(status);
		res.json(data);
	});
});

router.get('/api/hendelser/:hendelse_id', (req, res) => {
	console.log('Fikk GET-request fra klienten');
	hendelseDao.hentEnHendelse(req.body, (status, data) => {
		res.status(status);
		res.json(data);
		console.log('/hentEnHendelse gir:' + data);
	});
});

//Dette endepunktet krever multipart/form-data istedet for json for å håndtere bildeopplasting
router.post('/api/hendelser', upload.array('bilder', 1), checkToken, (req, res) => {
  console.log('Fikk POST-request fra klienten');
  let rolle = req.decoded.role;

  if (rolle == 'ansatt' || rolle == 'admin') {
    let a = {
      bruker_id: req.decoded.user.bruker_id,
      hendelseskategori_id: req.body.hendelseskategori_id,
      kommune_id: (rolle == 'ansatt') ? req.decoded.user.kommune_id : req.body.kommune_id,
      overskrift: req.body.overskrift,
      tid: req.body.tid,
      beskrivelse: req.body.beskrivelse,
      sted: req.body.sted,
      billett: req.body.billett,
    };
    if (req.files && req.files.length > 0) {
      bildeOpplasting.lastOpp(req.files, (bilder) => {
        a.bilde = bilder[0];
        laghendelse(a, res);
      });
    } else {
      laghendelse(a, res);
    }
  } else {
    res.status(403);
    res.json({ result: false });
  }
});

const laghendelse = (a, res) => {
  hendelseDao.lagNyHendelse(a, (status, data) => {
    console.log('Opprettet en ny hendelse');
    let hendelse_id = data.insertId;

    res.status(status);
    res.json({ "resultat": (status == 200) ? "vellykket" : "feilet" });

    if (status == 200) {
      hendelseDao.hentVarsledeBrukere({ hendelse_id: hendelse_id }, (status, data) => {
        if (data.length > 0) {
          console.log('Fant brukere');
          let eposter = data.map((eposten) => (
            eposten.epost
          ));
          epostTjener.hendelse(a.overskrift, a.tid, a.beskrivelse, a.sted, a.bilde, eposter);
        } else {
          console.log('Fant ikke brukere');
        }
      });
    }
  });
};

router.put('/api/hendelser/:hendelse_id', checkToken, (req, res) => {
	if (!(req.body instanceof Object)) return res.sendStatus(400);
	console.log('Fikk POST-request fra klienten');
	let role = req.decoded.role;

	if ((role == 'ansatt' && req.decoded.user.kommune_id == req.body.kommune_id) || role == 'admin') {
		let a = {
			hendelseskategori_id: req.body.hendelseskategori_id,
			kommune_id: req.body.kommune_id,
			overskrift: req.body.overskrift,
			tid: req.body.tid,
			beskrivelse: req.body.beskrivelse,
			sted: req.body.sted,
			bilde: req.body.bilde,
			billett: req.body.billett,
			hendelse_id: req.body.hendelse_id
		};

		hendelseDao.oppdaterHendelse(a, (status, data) => {
			console.log('Oppdatert en hendelse');
			res.status(status);
		});
	} else {
		res.status(403);
		res.json({ result: false });
	}
});

router.delete('/api/hendelser/:hendelse_id', checkToken, (req, res) => {
	console.log('Fikk POST-request fra klienten');
	if (req.decoded.role == 'admin' || req.decoded.role == 'ansatt') {
		hendelseDao.slettHendelse(req.params.hendelse_id, (status, data) => {
			console.log('Slettet en hendelse');
			res.status(status);
		});
	} else {
		res.status(403);
		res.json({ result: false });
	}
});

router.get('/api/hendelser/kategorier/:hendelseskategori_id', (req, res) => {
	console.log('Fikk GET-request fra klienten');
	hendelseDao.filtrerHendelserPaaKategori(req.params.hendelseskategori_id, (status, data) => {
		res.status(status);
		res.json(data);
		console.log('/hendelser/:hk_id lengde' + data.length);
	});
});

router.get('/api/hendelser/kommuner/:kommune_id', (req, res) => {
	console.log('Fikk GET-request fra klienten');
	hendelseDao.filtrerHendelserPaaKommune(req.params.kommune_id, (status, data) => {
		res.status(status);
		res.json(data);
		console.log('/hendelser/:k_id lengde' + data.length);
	});
});

router.get('/api/hendelser/hoved/kategorier', (req, res) => {
	if (!(req.body instanceof Object)) return res.sendStatus(400);
	console.log('Fikk GET-request fra klienten');
	hendelseDao.hentAlleHendelseskategorier((status, data) => {
		res.status(status);
		res.json(data);
		console.log('/hentAlleHendelseskategorier lengde: ' + data.length);
	});
});

router.get('/api/hendelseskat', (req, res) => {
	if (!(req.body instanceof Object)) return res.sendStatus(400);
	console.log('Fikk GET-request fra klienten (hent alle kategorier)');

	hendelseDao.hentAlleHendelseskategorier((status, data) => {
		res.status(status);
		res.json(data);
		console.log('/hentAlleKategorier lengde: ' + data.length);
	});
});

router.post('/api/hendelser/:hendelse_id/abonnement', checkToken, (req, res) => {
	let role = req.decoded.role;
	let bruker_id = req.decoded.user.bruker_id;
	if (role == 'privat') {
		hendelseDao.abonnerHendelse({ bruker_id: bruker_id, hendelse_id: req.params.hendelse_id }, (status, data) => {
			res.status(status);
			res.json(data);
		});
	} else {
		res.status(403);
		res.json({ result: false });
	}
});

router.delete('/api/hendelser/:hendelse_id/abonnement', checkToken, (req, res) => {
	let role = req.decoded.role;
	let bruker_id = req.decoded.user.bruker_id;
	if (role == 'privat' || role == 'admin') {
		hendelseDao.ikkeAbonnerHendelse(
			{ bruker_id: bruker_id, hendelse_id: req.params.hendelse_id },
			(status, data) => {
				res.status(status);
				res.json(data);
			}
		);
	} else {
		res.status(403);
		res.json({ result: false });
	}
});

router.post('/api/hendelser/hendelseskategorier', checkToken, (req, res) => {
	let role = req.decoded.role;
	if (role == 'admin') {
		hendelseDao.nyHendelseskategori(req.body, (status, data) => {
			res.status(status);
			res.json(data);
		});
	} else {
		res.status(403);
		res.json({ result: false });
	}
});

router.put('/api/hendelser/hendelseskategorier/:hendelseskategori_id', checkToken, (req, res) => {
	let role = req.decoded.role;
	let a = { hendelseskategori_id: req.params.hendelseskategori_id, kategorinavn: req.body.kategorinavn };
	if (role == 'admin') {
		hendelseDao.oppdaterHendelseskategori(a, (status, data) => {
			res.status(status);
			res.json(data);
		});
	} else {
		res.status(403);
		res.json({ result: false });
	}
});

router.delete('/api/hendelser/hendelseskategorier/:hendelseskategori_id', checkToken, (req, res) => {
	let role = req.decoded.role;
	console.log('tetetetetet');
	if (role == 'admin') {
		hendelseDao.slettHendelseskategori(req.params.hendelseskategori_id, (status, data) => {
			res.status(status);
			res.json(data);
		});
	} else {
		res.status(403);
		res.json({ result: false });
	}
});

module.exports = router;
