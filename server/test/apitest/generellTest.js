import mysql from 'mysql2';

import Generelldao from '../../src/dao/generelldao.js';
import BrukerDao from '../../src/dao/brukerdao.js';
import runsqlfile from '../runsqlfile.js';
import FeilDao from '../../src/dao/feildao';
//import {Hendelse} from '../../../client/src/services/hendelseService';

/*
const testFeil1 = new Feil(
  1, 1, 1, 'Jeg er kul', 'https://i.imgur.com/6zidUsq.jpg', 1, 1);

const testOppdatering1 = new Oppdatering( 
  1, '1998-11-20 19:39:45', 'Hei, skjer', 1, 1 );
*/

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
let feildao = new FeilDao(pool);
let brukerdao = new BrukerDao(pool);

let privatBruker1 = {
  epost: 'ø@g.com',
  passord: '1234567890',
  kommune_id: 1,
  fornavn: 'Øivind',
  etternavn: 'Larsson'
};

let oppdaterFeil1 = {
  kommune_id: 1,
  subkategori_id: 1,
  overskrift: 'HeiHei',
  beskrivelse: 'Kjør da pls',
  lengdegrad: 0.2,
  breddegrad: 0.3
};

beforeAll(done => {
  runsqlfile('lagtabeller.sql', pool, () => {
    runsqlfile('fylkekommunedata.sql', pool, () => {
      runsqlfile('datatest.sql', pool, done);
    });
  });
});

afterAll(() => {
  pool.end();
});

test('legg til ny privatbruker', done => {
  function callback(status, data) {
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    expect(data.affectedRows).toBe(1);
    done();
  }
  brukerdao.lagNyPrivatBruker(privatBruker1, callback);
});

test('oppdater feil', done => {
  function callback(status, data) {
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    expect(data.affectedRows).toBe(1);
    done();
  }
  feildao.oppdaterFeil(oppdaterFeil1, callback);
});



test('lag ny bruker', done => {
  function callback(status, data) {
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    expect(data.affectedRows).toBe(1);
    done();
  }
  brukerdao.lagNyBruker({epost: 'epost11@hotmail.com', passord: 'passord23495', kommune_id: 9}, callback);
});

test('hent brukerid', done => {
  function callback(status, data) {
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    expect(data.bruker_id).toBe(10);
    done();
  }
  brukerdao.finnBrukerid({epost: 'epost10@hotmail.com'}, callback);
});


test('hent alle kommuner', done => {
  function callback(status, data){
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    console.log(data.length);
    expect(data.length).toBeGreaterThan(200);
    done();
  }
  generelldao.hentAlleKommuner(callback);
});

test('hent alle feil', done => {
  function callback(status, data){
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    expect(data.length).toBeGreaterThan(1);
    done();
  }
  feildao.hentAlleFeil(callback);
});

test('hent en feil', done => {
  function callback(status, data){
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    expect(data.length).toBe(1);
    //expect(data.overskrift).toBe('Overskrift1');
    //sjekk at feilen er som den burde være^
    done();
  }
  feildao.hentEnFeil({feil_id: 1}, callback);
});

/*
test('Lag ny feil', done => {
  function callback(status, data){
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }
  feildao.lagNyFeil(testFeil1, callback);
});

test('Opprett ny oppdatering', done => {
  function callback(status, data){
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }
  feildao.lagOppdatering(testOppdatering1, callback);
});
*/

test('hentAlleOppdateringerPaaFeil', done => {
  function callback(status, data){
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    expect(data.length).toBe(1);
    done();
  }
  feildao.hentAlleOppdateringerPaaFeil({feil_id: 1}, callback);
});

test('Hent en status', done => {
  function callback(status, data){
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    expect(data.length).toBe(1);
    done();
  }
  feildao.hentEnStatus({status_id: 2}, callback);
});

test('Hent alle statuser', done => {
  function callback(status, data){
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    expect(data.length).toBeGreaterThanOrEqual(3);
    //expect(data[2].status).toBe('Ferdig');
    done();
  }
  feildao.hentAlleStatuser(callback);
});

test('Hent alle hovedkategorier', done => {
  function callback(status, data){
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    expect(data.length).toBeGreaterThanOrEqual(4);
    //expect(data[1].status).toBe('Hovedkategori2');
    done();
  }
  feildao.hentAlleHovedkategorier(callback);
});
