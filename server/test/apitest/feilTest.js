import mysql from 'mysql2';

import FeilDao from '../../dao/feildao';
import run from '../runsqlfile.js';
import Feil, Oppdatering from '../../../client/src/services/feilService';

var pool = mysql.createPool({
  connectionLimit: 5,
  host: 'mysql.stud.iie.ntnu.no',
  user: 'jonathm',
  password: 'tFSnz90b',
  database: 'jonathm',
  debug: false,
  multipleStatements: true,
});

let feilDao = new FeilDao(pool);

const testFeil1 = new Feil({
  kommune_id: 1,
  kategori_id: 1,
  status_id: 1, 
  beskrivelse: 'Jeg er kul', 
  bilde: 'https://i.imgur.com/6zidUsq.jpg',
  lengdegrad: 1,
  breddegrad: 1
});

const testOppdatering1 = new Oppdatering({
  feil_id: 1,
  tid: '1998-11-20 19:39:45',
  kommentar: 'Hei, skjer',
  status_id: 1,
  bruker_id: 1
});


beforeAll(done => {
  run('../lagtabeller.sql', pool, () => {
    run('dao/fylkekommunedata.sql',pool,done);
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
    //expect(data[0].title).toBe('ENDA MER MASSIV OVERSKRIFT');
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
    //expect(data[0].title).toBe('ENDA MER MASSIV OVERSKRIFT');
    //sjekk at feilen er som den burde være^
    done();
  }
  feilDao.hentEnFeil(1, callback);
});

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

test('hentAlleOppdateringerPaaFeil', done => {
  function callback(status, data){
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    expect(data.length).toBeGreaterThanOrEqual(1);
    //expect(data[1].status_id).toBe(1);
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
    //expect(data[1].status).toBe('Under behandling');
    done();
  }
  feilDao.hentEnStatus({status_id: 1}, callback);
});

test('Hent alle statuser', done => {
  function callback(status, data){
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    expect(data.length).toBeGreaterThanOrEqual(1);
    //expect(data[1].status).toBe('Under behandling');
    done();
  }
  feilDao.hentAlleStatuser(callback);
});

test('Hent alle hovedkategorier', done => {
  function callback(status, data){
    console.log(
      'Test callback: status ' + status + ', data= '+ JSON.stringify(data)
    );
    expect(data.length).toBeGreaterThanOrEqual(1);
    //expect(data[1].status).toBe('Vegarbeid');
    done();
  }
  feilDao.hentAlleHovedkategorier(callback);
});
