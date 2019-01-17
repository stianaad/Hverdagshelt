import Dao from './dao.js';

module.exports = class BrukerDao extends Dao {
  lagNyBruker(json, callback) {
    const tabell = [json.epost, json.passord, json.kommune_id];
    if (json.epost.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      super.query(
        'INSERT INTO bruker (bruker_id, epost, passord, kommune_id) VALUES(DEFAULT,?,?,?)',
        tabell,
        callback
      );
    } else {
      callback(403, {error: 'Ugyldig e-post.'});
    }
  }

  finnBruker_id(json, callback) {
    let epost = [json.epost];
    super.query('SELECT bruker_id FROM bruker WHERE epost=?', epost, callback);
  }

  finnFeilTilBruker(bruker_id, callback) {
    super.query(
      "SELECT feil.*, hovedkategori.kategorinavn,status.status, DATE_FORMAT(f.tid, '%Y-%m-%d %H:%i') AS tid FROM feil INNER JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id INNER JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id INNER JOIN (SELECT feil_id, min(tid) as tid from oppdatering group by feil_id) as f ON feil.feil_id = f.feil_id INNER JOIN (SELECT feil_id, ANY_VALUE(status_id) as status_id, max(tid) as tid from oppdatering group by feil_id) as s ON feil.feil_id = s.feil_id INNER JOIN status ON status.status_id = s.status_id WHERE bruker_id=?",
      [bruker_id],
      callback
    );
  }

  finnFolgteFeilTilBruker(bruker_id, callback) {
    super.query(
      "SELECT feil.overskrift, DATE_FORMAT(s.tid, '%Y-%m-%d %H:%i') AS tid, s.status_id, b.url FROM feil INNER JOIN (SELECT feil_id, ANY_VALUE(status_id) as status_id, max(tid) as tid from oppdatering group by feil_id) as s ON s.feil_id=feil.feil_id INNER JOIN (SELECT feil_id, ANY_VALUE(url) as url, min(bilde_id) as bilde_id from feilbilder group by feil_id) as b ON b.feil_id=feil.feil_id INNER JOIN feilfolg ON feilfolg.feil_id = feil.feil_id WHERE feilfolg.bruker_id = ?",
      [bruker_id],
      callback
    );
  }

  finnFolgteHendelserTilBruker(bruker_id, callback) {
    super.query(
      "SELECT hendelser.hendelse_id, DATE_FORMAT(hendelser.tid, '%Y-%m-%d %H:%i') AS tid,overskrift, beskrivelse,bilde,sted,lengdegrad,breddegrad,hendfolg.bruker_id FROM hendelser,hendfolg WHERE hendelser.hendelse_id=hendfolg.hendelse_id  and hendfolg.bruker_id=?",
      [bruker_id],
      callback
    );
  }

  lagNyPrivatBruker(json, callback) {
    let self = this;
    self.finnBruker_id(json, (status, data) => {
      if (data.length == 0) {
        self.lagNyBruker(json, (status, data) => {
          console.log(status);
          if (status == 200) {
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

  lagNyAnsattBruker(json, callback) {
    let self = this;
    self.lagNyBruker(json, (status, data) => {
      self.finnBrukerid(json, (status, data) => {
        super.query(
          'INSERT INTO ansatt VALUES(?,?,?,?)',
          [res.json(data), json.fornavn, json.etternavn, json.telefon],
          callback
        );
      });
    });
  }

  lagNyBedriftBruker(json, callback) {
    let self = this;
    self.lagNyBruker(json, (status, data) => {
      self.finnBrukerid(json, (status, data) => {
        super.query(
          'INSERT INTO bedrift VALUES(?,?,?)',
          [res.json(data), json.orgnr, json.navn, json.telefon],
          callback
        );
      });
    });
  }

  lagNyAdminBruker(json, callback) {
    let self = this;
    self.lagNyBruker(json, (status, data) => {
      self.finnBrukerid(json, (status, data) => {
        super.query(
          'INSERT INTO admin VALUES(?,?,?)',
          [res.json(data), json.telefon, json.navn],
          callback
        );
      });
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
};
