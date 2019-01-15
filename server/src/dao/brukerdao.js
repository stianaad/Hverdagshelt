import Dao from './dao.js';

module.exports = class BrukerDao extends Dao {
  lagNyBruker(json, callback) {
    const tabell = [json.epost, json.passord, json.kommune_id];
    super.query('INSERT INTO bruker VALUES(DEFAULT,?,?,?)', tabell, callback);
  }

  hentBruker(json, callback) {
    let tabell = [json.epost];
    console.log(tabell + "bruker dao");
    super.query('SELECT * FROM bruker WHERE epost=?', tabell, callback);
  }

  hentBrukere(callback){
    super.query('SELECT * FROM bruker',[],callback);
  }

  endrePassord(json, callback) {
    const tabell = [json.passord, json.epost];
    super.query('UPDATE bruker SET passord=? WHERE epost=?', tabell, callback);
  }
};
