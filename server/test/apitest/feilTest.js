import mysql from 'mysql2';

import FeilDao from '../../src/dao/feildao';
import runsqlfile from '../runsqlfile.js';
/*import {Feil, Oppdatering} from '../../../client/src/services/feilService';

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

let feilDao = new FeilDao(pool);

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

test('hent alle feil', done => {
  function callback(status, data){
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    expect(data.length).toBeGreaterThan(1);
    expect(data[1].title).toBe('Overskrift2');
    done();
  }
  feilDao.hentAlleFeil(callback);
});

test('hent en feil', done => {
  function callback(status, data){
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    expect(data.length).toBe(1);
    expect(data.overskrift).toBe('Overskrift1');
    //sjekk at feilen er som den burde være^
    done();
  }
  feilDao.hentEnFeil(1, callback);
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
  feilDao.lagNyFeil(testFeil1, callback);
});
*/

test('Slett feil', done => {
  function callback(status, data){
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }
  feilDao.slettFeil({feil_id: 1}, callback);
});

/*
test('Opprett ny oppdatering', done => {
  function callback(status, data){
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }
  feilDao.lagOppdatering(testOppdatering1, callback);
});
*/

test('hentAlleOppdateringerPaaFeil', done => {
  function callback(status, data){
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    expect(data.length).toBeGreaterThanOrEqual(4);
    expect(data[1].bruker_id).toBe(5);
    done();
  }
  feilDao.hentAlleOppdateringerPaaFeil({feil_id: 1}, callback);
});

test('Hent en status', done => {
  function callback(status, data){
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    expect(data.length).toBe(1);
    expect(data.status).toBe('Under behandling');
    done();
  }
  feilDao.hentEnStatus({status_id: 1}, callback);
});

test('Hent alle statuser', done => {
  function callback(status, data){
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    expect(data.length).toBeGreaterThanOrEqual(3);
    expect(data[2].status).toBe('Ferdig');
    done();
  }
  feilDao.hentAlleStatuser(callback);
});

test('Hent alle hovedkategorier', done => {
  function callback(status, data){
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    expect(data.length).toBeGreaterThanOrEqual(4);
    expect(data[1].status).toBe('Hovedkategori2');
    done();
  }
  feilDao.hentAlleHovedkategorier(callback);
});
