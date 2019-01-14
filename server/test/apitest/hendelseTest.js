import mysql from 'mysql2';

import HendelseDao from '../../src/dao/hendelsedao.js';
import runsqlfile from '../runsqlfile.js';
//import {Hendelse} from '../../../client/src/services/hendelseService';

var pool = mysql.createPool({
    connectionLimit: 1,
    host: 'mysql',
    user: 'root',
    password: '123',
    database: 'oivindhl',
    debug: false,
    multipleStatements: true
});

let hendelseDao = new HendelseDao(pool);

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
