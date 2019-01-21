import Dao from './dao.js';

//  7 av 13 funksjoner testes
module.exports = class BrukerDao extends Dao {
  kontrollOrgnr(tall) {
    var sum = 0;
    tall = tall.toString();
    sum += (parseInt(tall.charAt(0)) + parseInt(tall.charAt(6))) * 3;
    sum += (parseInt(tall.charAt(1)) + parseInt(tall.charAt(7))) * 2;
    sum += parseInt(tall.charAt(2)) * 7;
    sum += parseInt(tall.charAt(3)) * 6;
    sum += parseInt(tall.charAt(4)) * 5;
    sum += parseInt(tall.charAt(5)) * 4;

    var rest = sum % 11;

    var kontroll = -1;

    if (rest != 1) {
      kontroll = 11 - rest;
    }

    return kontroll == parseInt(tall.charAt(8));
  }

  lagNyBruker(json, callback) {
    const tabell = [json.epost, json.passord, json.kommune_id];
    let gyldig = json.epost.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    gyldig = json.kommune_id != null;
    if (gyldig) {
      super.query('INSERT INTO bruker (bruker_id, epost, passord, kommune_id) VALUES(DEFAULT,?,?,?)', tabell, callback);
    } else {
      callback(403, {error: 'Ugyldig input.'});
    }
  }

  //testes
  finnBruker_id(json, callback) {
    let epost = [json.epost];
    super.query('SELECT bruker_id FROM bruker WHERE epost=?', epost, callback);
  }

  finnOppdaterteFeilTilBruker(bruker_id, callback) {
    super.query(
      "SELECT feil.*, hovedkategori.kategorinavn,status.status, DATE_FORMAT(f.tid, '%Y-%m-%d %H:%i') AS tid FROM feil INNER JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id INNER JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id INNER JOIN (SELECT feil_id, min(tid) as tid from oppdatering group by feil_id) as f ON feil.feil_id = f.feil_id INNER JOIN (SELECT feil_id, ANY_VALUE(status_id) as status_id, max(tid) as tid from oppdatering group by feil_id) as s ON feil.feil_id = s.feil_id INNER JOIN status ON status.status_id = s.status_id INNER JOIN privat ON privat.bruker_id=feil.bruker_id WHERE feil.bruker_id=? AND f.tid > privat.sist_innlogget",
      [bruker_id],
      callback
    );
  }

  finnOppdaterteFeilTilBruker(bruker_id, callback) {
    super.query(
      "SELECT feil.*, hovedkategori.kategorinavn,status.status, DATE_FORMAT(f.tid, '%Y-%m-%d %H:%i') AS tid FROM feil INNER JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id INNER JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id INNER JOIN (SELECT feil_id, min(tid) as tid from oppdatering group by feil_id) as f ON feil.feil_id = f.feil_id INNER JOIN (SELECT feil_id, ANY_VALUE(status_id) as status_id, max(tid) as tid from oppdatering group by feil_id) as s ON feil.feil_id = s.feil_id INNER JOIN status ON status.status_id = s.status_id INNER JOIN privat ON privat.bruker_id=feil.bruker_id WHERE feil.bruker_id=? AND f.tid > privat.sist_innlogget ORDER BY tid desc",
      [bruker_id],
      callback
    );
  }

  finnIkkeOppdaterteFeilTilBruker(bruker_id, callback) {
    super.query(
      "SELECT feil.*, hovedkategori.kategorinavn,status.status, DATE_FORMAT(f.tid, '%Y-%m-%d %H:%i') AS tid FROM feil INNER JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id INNER JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id INNER JOIN (SELECT feil_id, min(tid) as tid from oppdatering group by feil_id) as f ON feil.feil_id = f.feil_id INNER JOIN (SELECT feil_id, ANY_VALUE(status_id) as status_id, max(tid) as tid from oppdatering group by feil_id) as s ON feil.feil_id = s.feil_id INNER JOIN status ON status.status_id = s.status_id INNER JOIN privat ON privat.bruker_id=feil.bruker_id WHERE feil.bruker_id=? AND f.tid < privat.sist_innlogget ORDER BY tid desc",
      [bruker_id],
      callback
    );
  }

  oppdaterSistInnloggetPrivat(bruker_id, callback){
    super.query(
      "UPDATE privat SET sist_innlogget=now() WHERE bruker_id = ?",
      [bruker_id],
      callback
    )
  }

  finnFolgteFeilTilBruker(bruker_id, callback) {
    super.query(
      "SELECT feil.*, feilfolg.feil_id, feilfolg.bruker_id, feil.overskrift, DATE_FORMAT(s.tid, '%Y-%m-%d %H:%i') AS tid, s.status_id, b.url FROM feil LEFT JOIN (SELECT feil_id, MAX(status_id) as status_id, max(tid) as tid from oppdatering group by feil_id) as s ON s.feil_id=feil.feil_id LEFT JOIN (SELECT feil_id, ANY_VALUE(url) as url, min(bilde_id) as bilde_id from feilbilder group by feil_id) as b ON b.feil_id=feil.feil_id INNER JOIN feilfolg ON feilfolg.feil_id = feil.feil_id WHERE feilfolg.bruker_id = ?",
      [bruker_id],
      callback
    );
  }

  finnFolgteHendelserTilBruker(bruker_id, callback) {
    super.query(
      "SELECT hendfolg.hendelse_id, hendfolg.bruker_id, hendelser.hendelse_id, DATE_FORMAT(hendelser.tid, '%Y-%m-%d %H:%i') AS tid,overskrift, beskrivelse,bilde,sted,lengdegrad,breddegrad,hendfolg.bruker_id FROM hendelser,hendfolg WHERE hendelser.hendelse_id=hendfolg.hendelse_id and hendfolg.bruker_id=?",
      [bruker_id],
      callback
    );
  }

  //testes
  lagNyPrivatBruker(json, callback) {
    let self = this;
    self.finnBruker_id(json, (status, data) => {
      if (data.length == 0) {
        self.lagNyBruker(json, (status, data) => {
          console.log(status);
          let gyldig = (json.fornavn != null) && (json.etternavn != null);
          if (status == 200 && gyldig) {
            super.query(
              'INSERT INTO privat (bruker_id, fornavn, etternavn) VALUES(?,?,?)',
              [data.insertId, json.fornavn, json.etternavn],
              callback
            );
          } else {
            callback(403, {error: 'Empty promise.'});
          }
        });
      } else {
        callback(403, {error: 'E-post eksisterer allerede.'});
      }
    });
  }

  //testes
  lagNyAnsattBruker(json, callback) {
    let self = this;
    self.finnBruker_id(json, (status, data) => {
      if (data.length == 0) {
        self.lagNyBruker(json, (status, data) => {
          console.log(status);
          if (status == 200) {
            super.query(
              'INSERT INTO ansatt (bruker_id, fornavn, etternavn, telefon) VALUES(?,?,?,?)',
              [data.insertId, json.fornavn, json.etternavn, json.telefon],
              callback
            );
          } else {
            callback(403, {error: 'Empty promise.'});
          }
        });
      } else {
        callback(403, {error: 'E-post eksisterer allerede.'});
      }
    });
  }

  //testes
  lagNyBedriftBruker(json, callback) {
    let self = this;
    self.finnBruker_id(json, (status, data) => {
      if (data.length == 0) {
        self.lagNyBruker(json, (status, data) => {

          console.log(status);
          let gyldig = (self.kontrollOrgnr(json.orgnr) && json.telefon.length == 8 && json.navn != null);
          console.log(gyldig);
          if (status == 200 && gyldig) {
            super.query(
              'INSERT INTO bedrift (bruker_id, orgnr, navn, telefon) VALUES(?,?,?,?)',
              [data.insertId, json.orgnr, json.navn, json.telefon],
              callback
            );
          } else {
            callback(403, {error: 'Empty promise.'});
          }
        });
      } else {
        callback(403, {error: 'E-post eksisterer allerede.'});
      }
    });
  }

  //testes
  lagNyAdminBruker(json, callback) {
    let self = this;
    self.finnBruker_id(json, (status, data) => {
      if (data.length == 0) {
        self.lagNyBruker(json, (status, data) => {
          console.log(status);
          if (status == 200) {
            super.query(
              'INSERT INTO admin (bruker_id, telefon, navn) VALUES(?,?,?)',
              [data.insertId, json.telefon, json.navn],
              callback
            );
          } else {
            callback(403, {error: 'Empty promise.'});
          }
        });
      } else {
        callback(403, {error: 'E-post eksisterer allerede.'});
      }
    });
  }

  hentBruker(json, callback) {
    let tabell = [json.epost];
    console.log(tabell + 'bruker dao');
    super.query('SELECT * FROM bruker WHERE epost=?', tabell, callback);
  }

  hentBrukere(callback) {
    super.query('SELECT * FROM bruker', [], callback);
  }

  //testes
  endrePassord(json, callback) {
    const tabell = [json.passord, json.epost];
    super.query('UPDATE bruker SET passord=? WHERE epost=?', tabell, callback);
  }

  hentBrukerRolle(json, callback) {
    let a = [json.bruker_id];
    console.log(a + 'hentBrukerRolle');
    super.query(
      'SELECT EXISTS( SELECT * FROM admin WHERE bruker_id = ?) AS admin, EXISTS( SELECT * FROM ansatt WHERE bruker_id = ?) AS ansatt, EXISTS( SELECT * FROM bedrift WHERE bruker_id = ?) AS bedrift, EXISTS( SELECT * FROM privat WHERE bruker_id = ?) AS privatbruker',
      [a, a, a, a],
      callback
    );
  }

  oppdaterSpesifisertBruker(json, rolle, callback) {
    console.log('inne i oppdaterSpesifisertBruker');
    if (rolle == 'privat') {
      console.log('oppdaterer bruker');
      this.oppdaterBruker(json, (status, data) => {
        console.log('oppdaterer privat');
        super.query(
          'UPDATE privat SET fornavn = ?, etternavn = ? WHERE bruker_id = ?',
          [json.fornavn, json.etternavn, rolle.bruker_id],
          callback
        );
      });
    } else if (rolle == 'bedrift') {
      console.log('oppdaterer bruker');
      this.oppdaterBruker(json, rolle, (status, data) => {
        console.log('oppdaterer bedrift');
        super.query(
          'UPDATE bedrift SET orgnr = ?, navn = ?, telefon = ? WHERE bruker_id = ?',
          [json.orgnr, json.navn, json.telefon, rolle.bruker_id],
          callback
        );
      });
    } else if (rolle == 'ansatt') {
      console.log('oppdaterer bruker');
      this.oppdaterBruker(json, rolle, (status, data) => {
        console.log('oppdaterer ansatt');
        super.query(
          'UPDATE ansatt SET fornavn = ?, etternavn = ?, telefon = ? WHERE bruker_id = ?',
          [json.fornavn, json.etternavn, json.telefon, rolle.bruker_id],
          callback
        );
      });
    } else {
      console.log('oppdaterer bruker');
      this.oppdaterBruker(json, rolle, (status, data) => {
        console.log('oppdaterer admin');
        super.query(
          'UPDATE admin SET telefon = ?, navn = ? WHERE bruker_id = ?',
          [json.telefon, json.navn, rolle.bruker_id],
          callback
        );
      });
    }
  }

  oppdaterBruker(json, rolle, callback) {
    super.query(
      'UPDATE bruker SET epost = ?, kommune_id = ? WHERE bruker_id = ?',
      [json.epost, json.kommune_id, rolle.bruker_id],
      callback
    );
  }

  sjekkFeilPaaKommune(json, callback) {
    super.query(
      'SELECT * FROM feil WHERE kommune_id = ? AND feil_id = ?',
      [json.kommnune_id, json.feil_id],
      callback
    );
  }

  hentBedrifter(callback) {
    super.query('SELECT * FROM bedrift', [], callback);
  }
};
