import express from 'express';
const router = express.Router();
import mysql from 'mysql';
import bodyParser from 'body-parser';
import Generelldao from '../dao/generelldao.js';
import {pool} from '../../test/poolsetup.js';

let generelldao = new Generelldao(pool);

router.get('/api/kommuner', (req, res) => {
  console.log('Fikk get-request fra klienten');
  generelldao.hentAlleKommuner((status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/filtrer/:sok', (req, res) => {
  console.log('/filtrer/:sok fikk get request fra klienten');
  generelldao.filtrerKommuner(req.params.sok, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get('/api/fylker', (req,res)=>{
  console.log("hahaha");
  generelldao.hentAlleFylker((status, data)=>{
    res.status(status);
    res.json(data);
  });
});

module.exports = router;
