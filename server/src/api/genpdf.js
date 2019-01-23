import express from 'express';
const router = express.Router();
import mysql from 'mysql';
import bodyParser from 'body-parser';
import {pool} from '../../test/poolsetup.js';
import GenPDFDao from '../dao/genpdfdao.js';

const genPDFDao = new GenPDFDao(pool);

router.get('/api/feilperkommune', (req, res) => {
  genPDFDao.feilPerKommune((status, data) => {
    res.status(status);
    res.json(data);
  });
});

module.exports = router;
