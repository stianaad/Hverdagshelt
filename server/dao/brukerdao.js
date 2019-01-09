import Dao from './dao.js';

module.exports = class BrukerDao extends Dao {
  lagNyBruker(json, callback) {
    const tabell = [json.epost, json.passord, json.kommune_id];
    super.query('INSERT INTO bruker VALUES(DEFAULT,?,?,?)', tabell, callback);
  }

  hentBruker(json,callback){
      const epost = [json.epost];
      console.log(epost);
      super.query("SELECT passord FROM bruker WHERE epost=?",epost,callback);
  }

  endrePassord(json,callback){
      const tabell = [json.nyttPassord, json.epost];
      super.query("UPDATE bruker SET passord=? WHERE epost=?",tabell,callback);
  }
};
