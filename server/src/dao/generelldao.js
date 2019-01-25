import Dao from './dao.js';

module.exports = class Generelldao extends Dao {
  hentAlleKommuner(callback) {
    super.query('SELECT * FROM kommuner ORDER BY kommune_navn ASC ', [], callback);
  }
  filtrerKommuner(kommune_navn, callback) {
    //console.log(kommune_navn);
    super.query('SELECT * FROM kommuner WHERE kommune_navn LIKE ?', [kommune_navn + '%'], callback);
  }

  hentAlleFylker(callback){
    super.query('SELECT * FROM fylker ORDER BY fylke_navn ASC', [], callback);
  }

  sokKommune(kommune_navn, callback) {
    //console.log(kommune_navn);
    super.query('SELECT * FROM kommuner WHERE kommune_navn LIKE ?', [kommune_navn], callback);
  }
};
