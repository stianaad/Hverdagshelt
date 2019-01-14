import mysql from 'mysql2';

import BrukerDao from '../../src/dao/brukerdao';
import runsqlfile from '../runsqlfile.js';
//import {Ansatt, Admin, Bedrift, Privat} from '../../../client/src/services/feilService';

var pool = mysql.createPool({
  connectionLimit: 1,
  host: 'mysql',
  user: 'root',
  password: '123',
  database: 'oivindhl',
  debug: false,
  multipleStatements: true
});

let brukerDao = new BrukerDao(pool);

beforeAll(done => {
  runsqlfile('lagtabeller.sql', pool, () => {
    runsqlfile('fylkekommunedata.sql',pool, () => {
      runsqlfile('generelltestdata.sql', pool, done);
    });
  });
});

afterAll(() => {
  pool.end();
});
