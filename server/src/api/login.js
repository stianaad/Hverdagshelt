const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');
import BrukerDao from '../dao/brukerdao.js';
import passord from 'password-hash-and-salt';

var pool = mysql.createPool({
    connectionLimit: 5,
    host: 'mysql.stud.iie.ntnu.no',
    user: 'jonathm',
    password: 'tFSnz90b',
    database: 'jonathm',
    debug: false,
    multipleStatements: true,
  });
  
  let brukerDao = new BrukerDao(pool);

  router.post("/login", (req,res)=> {
      if
  });