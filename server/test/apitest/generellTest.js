import mysql from 'mysql2';

import Generelldao from '../../src/dao/generelldao.js';
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

let generelldao = new Generelldao(pool);

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

test('hent alle kommuner', done => {
  function callback(status, data){
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    console.log(data.length);
    //expect(data.length).toBeGreaterThan(200);
    expect(data[1].kommune_navn).toBe('Halden');
  }
  generelldao.hentAlleKommuner(callback);
  done();
});