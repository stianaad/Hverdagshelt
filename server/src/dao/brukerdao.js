import Dao from './dao.js';

module.exports = class BrukerDao extends Dao {
  lagNyBruker(json, callback) {
    const tabell = [json.epost, json.passord, json.kommune_id];
    super.query('INSERT INTO bruker VALUES(DEFAULT,?,?,?)', tabell, callback);
  }

  finnBrukerid(json, callback) {
    let epost = [json.epost];
    super.query('SELECT bruker_id FROM bruker WHERE epost=?', epost);
  }

  lagNyPrivatBruker(json, callback) {
    let self = this;
    self.lagNyBruker(json, (status, data) => {
      self.finnBrukerid(json, (status, data) => {
        super.query('INSERT INTO privat VALUES(?,?,?)', 
                    [res.json(data),
                    json.fornavn, 
                    json.etternavn],
                    callback
          );
      });
    });
  }

  lagNyAnsattBruker(json, callback) {
    lagNyBruker(json, (status, data) => {
      finnBrukerid(json, (status, data) => {
        super.query('INSERT INTO ansatt VALUES(?,?,?,?)', 
                    [res.json(data),
                    json.fornavn, 
                    json.etternavn,
                    json.telefon],
                    callback
          );
      });
    });
  }

  lagNyBedriftBruker(json, callback) {
    lagNyBruker(json, (status, data) => {
      finnBrukerid(json, (status, data) => {
        super.query('INSERT INTO bedrift VALUES(?,?,?)', 
                    [res.json(data),
                    json.orgnr, 
                    json.navn,
                    json.telefon],
                    callback
          );
      });
    });
  }

  lagNyAdminBruker(json, callback) {
    lagNyBruker(json, (status, data) => {
      finnBrukerid(json, (status, data) => {
        super.query('INSERT INTO admin VALUES(?,?,?)', 
                    [res.json(data),
                    json.telefon, 
                    json.navn],
                    callback
          );
      });
    });
  }

  hentBruker(json, callback) {
    let epost = [json.epost];
    console.log(epost);
    super.query('SELECT * FROM bruker WHERE epost=?', epost, callback);
  }

  endrePassord(json, callback) {
    const tabell = [json.passord, json.epost];
    super.query('UPDATE bruker SET passord=? WHERE epost=?', tabell, callback);
  }
};
