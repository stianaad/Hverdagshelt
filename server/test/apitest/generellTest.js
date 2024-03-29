import mysql from 'mysql2';

import Generelldao from '../../src/dao/generelldao.js';
import BrukerDao from '../../src/dao/brukerdao.js';
import runsqlfile from '../runsqlfile.js';
import FeilDao from '../../src/dao/feildao';
import HendelseDao from '../../src/dao/hendelsedao';
import StatistikkDao from '../../src/dao/statistikkdao';

var pool = mysql.createPool({
  connectionLimit: 1,
  host: 'mysql',
  user: 'root',
  password: '123',
  database: 'oivindhl',
  debug: false,
  multipleStatements: true,
});

let generelldao = new Generelldao(pool);
let feildao = new FeilDao(pool);
let brukerdao = new BrukerDao(pool);
let hendelsedao = new HendelseDao(pool);
let statistikkdao = new StatistikkDao(pool);

let testprivatBruker = {
  epost: 'testprivat@test.com',
  passord: '1234567890',
  kommune_id: 1,
  fornavn: 'Øivind',
  etternavn: 'Larsson',
  hendelsevarsling: 1
};

let testBedriftbruker = {
  epost: 'testbedrift@test1.com',
  passord: 'qwertyui',
  kommune_id: 22,
  orgnr: 123456785,
  navn: 'testBedrift',
  telefon: 12345678, 
};

let testAnsattbruker = {
  epost: 'testansatt@test.com',
  passord: 'asdfghjk',
  kommune_id: 23,
  fornavn: 'test',
  etternavn: 'ansatt',
  telefon: 40302010,
};

let testAdminbruker = {
  epost: 'admin@test.com',
  passord: 'zxcvbnml',
  kommune_id: 24,
  telefon: 10101010,
  navn: 'testadmin',
};

let testoppdatering = {
  feil_id: 2,
  kommentar: 'testKommentar',
  status_id: 2,
  bruker_id: 2,
};

let oppdaterFeil1 = {
  bruker_id: 1,
  feil_id: 1,
  kommune_id: 1,
  subkategori_id: 1,
  overskrift: 'HeiHei',
  beskrivelse: 'Kjør da pls',
  lengdegrad: 0.2,
  breddegrad: 0.3,
};

let testhendelse = {
  hendelseskategori_id: 1,
  kommune_id: 54,
  overskrift: 'testoverskrift',
  tid: '2019-11-20',
  beskrivelse: 'testbeskrivelse',
  sted: 'teststed',
  bilde: 'https://bjornost.tihlde.org/hverdagshelt/19af4f8c745a62973e2cd615eaf329fa',
  billett: 'https://tihlde.hoopla.no/sales/bowlingkveld',
  hendelse_id: 1
};

let oppdaterBrukerTest = {
  epost: 'epost@test.com',
  kommune_id: 289
}

let oppdaterSpesifisertBrukerTest = {
  epost: 'test@epost.com',
  kommune_id: 290,
  fornavn: 'Testfor',
  etternavn: 'Testetter',
  hendelsevarsling: 1,
}

beforeAll((done) => {
  runsqlfile('bjornost.sql', pool, done);
});

afterAll(() => {
  pool.end();
});

//BRUKERTESTER

jest.setTimeout(30000);

test('legg til ny privatbruker', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }
  brukerdao.lagNyPrivatBruker(testprivatBruker, callback);
});

test('hent fulgte feil til bruker', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.length).toBeGreaterThanOrEqual(1);
    expect(data[0].overskrift).toBe('STIAN SPISER MAT TIL LUNSJ');
    done();
  }
  brukerdao.finnFolgteFeilTilBruker(17, callback);
});

test('hent ikke oppdaterte feil til bruker', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data[0].overskrift).toBe('Test2');
    expect(data.length).toBeGreaterThanOrEqual(1);
    done();
  }
  brukerdao.finnIkkeOppdaterteFeilTilBruker(1, callback);
});

test('legg til ny adminbruker', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.affectedRows).toBe(1);
    done();
  }
  brukerdao.lagNyAdminBruker(testAdminbruker, callback);
});

test('hent hendelser til bruker', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.length).toBe(1);
    expect(data[0].beskrivelse).toBe('Beskrivelse1');
    done();
  }
  brukerdao.finnFolgteHendelserTilBruker(17, callback);
});

test('hent bruker på id', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data[0].epost).toBe('epost3@hotmail.com');
    done();
  }
  brukerdao.hentBrukerPaaid(3, callback);
});

test('lag ny bruker', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.affectedRows).toBe(1);
    done();
  }
  brukerdao.lagNyBruker({epost: 'epost11@hotmail.com', passord: 'passord23495', kommune_id: 9}, callback);
});

test('hent brukerid', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data[0].bruker_id).toBe(10);
    done();
  }
  brukerdao.finnBruker_id({epost: 'epost10@hotmail.com'}, callback);
});

test('legg til ny bedriftbruker', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.affectedRows).toBe(1);
    done();
  }
  brukerdao.lagNyBedriftBruker(testBedriftbruker, callback);
});

test('endre passord', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.affectedRows).toBe(1);
    done();
  }
  brukerdao.endrePassord({epost: 'epost9@hotmail.com', passord: 'veldighemmelig'}, callback);
});

test('legg til ny ansattbruker', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.affectedRows).toBe(1);
    done();
  }
  brukerdao.lagNyAnsattBruker(testAnsattbruker, callback);
});

test('oppdater bruker', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.affectedRows).toBe(1);
    done();
  }
  brukerdao.oppdaterBruker(oppdaterBrukerTest, {bruker_id: 2}, callback);
});

test('oppdater spesifisert', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.affectedRows).toBe(1);
    done();
  }
  brukerdao.oppdaterSpesifisertBruker(oppdaterSpesifisertBrukerTest, {rolle: 'privat', bruker_id: 4} ,callback);
});

test('hent alle bedrifter', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.length).toBeGreaterThanOrEqual(1);
    done();
  }
  brukerdao.hentBedrifter(callback);
});




//FEILTESTER



test('oppdater feil', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.affectedRows).toBe(1);
    done();
  }
  feildao.oppdaterFeil(oppdaterFeil1, callback);
});

test('hent alle feil', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.length).toBeGreaterThan(1);
    done();
  }
  feildao.hentAlleFeil(callback);
});

test('hent en feil', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.length).toBeGreaterThanOrEqual(1);
    expect(data[0].overskrift).toBe('HeiHei');
    done();
  }
  feildao.hentEnFeil(1, callback);
});

test('Lag ny feil', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }
  feildao.lagNyFeil(oppdaterFeil1, callback);
});

test('slett feil', done => {
  function callback(status, data) {
    console.log('Test callback: status' + status + ', data: ' + JSON.stringify(data));
    expect(data.affectedRows).toBe(1);
    done();
  }
  feildao.slettFeil(1, callback);
})

test('hentAlleOppdateringerPaaFeil', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data[0].kommentar).toBe('Sak opprettet');
    done();
  }
  feildao.hentAlleOppdateringerPaaFeil(17, callback);
});

test('Hent en status', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.length).toBe(1);
    expect(data[0].status).toBe('Godkjent');
    done();
  }
  feildao.hentEnStatus(2, callback);
});

test('Hent alle statuser', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.length).toBeGreaterThanOrEqual(3);
    //expect(data[2].status).toBe('Ferdig');
    done();
  }
  feildao.hentAlleStatuser(callback);
});

test('Hent alle hovedkategorier', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.length).toBeGreaterThanOrEqual(4);
    //expect(data[1].status).toBe('Hovedkategori2');
    done();
  }
  feildao.hentAlleHovedkategorier(callback);
});

test('Hent alle subkategorier', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.length).toBeGreaterThanOrEqual(6);
    done();
  }
  feildao.hentAlleSubkategorier(callback);
});

test('Hent alle subkategorier på hovedkategori', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data[0].kategorinavn).toBe('Subkat6');
    done();
  }
  feildao.hentAlleSubKategorierPaaHovedkategori(3, callback);
});

test('opprett ny subkategori', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.affectedRows).toBe(1);
    done();
  }
  feildao.nySubkategori({kategorinavn: 'subkategoritest', hovedkategori_id: 3}, callback);
});

test('slett hovedkategori', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.affectedRows).toBe(1);
    done();
  }
  feildao.slettHovedkategori(2, callback);
});

test('hent ferdige feil til bedrift', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.length).toBeGreaterThanOrEqual(1);
    done();
  }
  feildao.hentFerdigeFeilTilBedrift(25, callback);
});

test('bruker oppretter abonnement', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.affectedRows).toBe(1);
    done();
  }
  feildao.abonnerFeil({feil_id: 2, bruker_id: 7}, callback);
});

test('bruker kansellerer abonnement', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.affectedRows).toBe(1);
    done();
  }
  feildao.ikkeAbonnerFeil({feil_id: 33, bruker_id: 16}, callback);
});

test('hent epost fra feil_id', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.length).toBeGreaterThanOrEqual(1);
    expect(data[0].epost).toBe('epost@test.com');
    done();
  }
  feildao.hentEpostFraFeilID({feil_id: 2}, callback);
});

test('hente bedrift på orgnanisasjonsnummer', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.length).toBeGreaterThanOrEqual(1);
    expect(data[0].navn).toBe('Deodeodeo');
    done();
  }
  feildao.hentBedriftPaaOrgnr(120060080, callback);
});


//HENDELSETESTER



test('Hent alle hendelser', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.length).toBeGreaterThanOrEqual(2);
    expect(data[0].overskrift).toBe('Overskrift1');
    done();
  }
  hendelsedao.hentAlleHendelser(callback);
});

test('Hent en hendelse', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.length).toBe(1);
    expect(data[0].overskrift).toBe('Overskrift2');
    done();
  }
  hendelsedao.hentEnHendelse(2, callback);
});

test('Oppdater en hendelse', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.affectedRows).toBe(1);
    done();
  }
  hendelsedao.oppdaterHendelse(testhendelse, callback);
});

test('Filtrer hendelser på kategori', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.length).toBeGreaterThanOrEqual(1);
    expect(data[0].hendelse_id).toBe(1);
    done();
  }
  hendelsedao.filtrerHendelserPaaKategori({hendelseskategori_id: 1}, callback);
});

test('Filtrer hendelser kommune', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.length).toBeGreaterThanOrEqual(1);
    done();
  }
  hendelsedao.filtrerHendelserPaaKommune(12, callback);
});

test('hent alle hendelseskategorier', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.length).toBeGreaterThanOrEqual(2);
    done();
  }
  hendelsedao.hentAlleHendelseskategorier(callback);
});


test('opprett ny hendelseskategorier', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.affectedRows).toBe(1);
    done();
  }
  hendelsedao.nyHendelseskategori({kategorinavn: 'Testkategori'}, callback);
});

test('abonner på en hendelse', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.affectedRows).toBe(1);
    done();
  }
  hendelsedao.abonnerHendelse({hendelse_id: 1, bruker_id: 5}, callback);
});




// GENERELLTESTER



test('hent alle kommuner', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data[0]));
    expect(data.length).toBeGreaterThan(200);
    done();
  }
  generelldao.hentAlleKommuner(callback);
});

test('søk på kommune', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data[0]));
    expect(data[0].kommune_navn).toBe('Gran');
    done();
  }
  generelldao.sokKommune('Gran', callback);
});

// STATISTIKKTESTER


test('hent feil fra alle kommuner', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data.length).toBeGreaterThan(1);
    done();
  }
  statistikkdao.feilPerKommune(callback);
});

test('hent alle feil', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data[0].antall).toBeGreaterThan(30);
    done();
  }
  statistikkdao.hentAlleFeil(callback);
});

test('hent feil på kommune', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data[0].antall).toBeGreaterThanOrEqual(1);
    done();
  }
  statistikkdao.hentFeilPaaKommune(1, callback);
});

test('hent feil på fylkenavn', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data[0].antall).toBeGreaterThanOrEqual(1);
    done();
  }
  statistikkdao.hentFeilPaaFylkenavn('Trøndelag', callback);
});

test('hent feil per subkategori', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data[0].antall).toBeGreaterThanOrEqual(1);
    done();
  }
  statistikkdao.hentFeilPerSubkategori(callback);
});

test('hent feil per hovedkategori på intervall', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data[0].antall).toBeGreaterThanOrEqual(1);
    done();
  }
  statistikkdao.hentFeilPerHovedkategoriPaaIntervall(365, callback);
});

test('hent behandlede feil på intervall', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data[0].antall).toBeGreaterThanOrEqual(1);
    done();
  }
  statistikkdao.hentBehandledeFeilPaaIntervall(365, callback);
});

test('hent feil på subkategori', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data[0].antall).toBeGreaterThanOrEqual(1);
    done();
  }
  statistikkdao.hentFeilPaaEnSubkategori('Subkat1', callback);
});

test('hent feil på status', (done) => {
  function callback(status, data) {
    console.log('Test callback: status ' + status + ', data= ' + JSON.stringify(data));
    expect(data[0].antall).toBeGreaterThanOrEqual(1);
    done();
  }
  statistikkdao.hentFeilPaaStatus(3, callback);
});