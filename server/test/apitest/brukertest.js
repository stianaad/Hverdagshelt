import BrukerDao from '../../src/dao/brukerdao.js';
import mysql from 'mysql2';

var pool = mysql.createPool({
  connectionLimit: 1,
  host: 'mysql',
  user: 'root',
  password: '123',
  database: 'oivindhl',
  debug: false,
  multipleStatements: true,
});

let brukerdao = new BrukerDao(pool);

test('hent fulgte feil til bruker', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.length).toBe(1);
    expect(data[0].overskrift).toBe('STIAN SPISER MAT TIL LUNSJ');
    done();
  }
  brukerdao.finnFolgteFeilTilBruker(17, callback);
});