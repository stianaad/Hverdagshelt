import Dao from './dao.js';

// 1 av 4 funksjoner testes
module.exports = class Generelldao extends Dao {

  /**
   * Henter alle kommuner fra databasen
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentAlleKommuner(callback) {
    super.query('SELECT * FROM kommuner ORDER BY kommune_navn ASC ', [], callback);
  }

  /**
   * Filterer alle kommunene på en søkestreng
   * @param {string} kommune_navn - Navnet på kommunen du vil filtrere på.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  filtrerKommuner(kommune_navn, callback) {
    //console.log(kommune_navn);
    super.query('SELECT * FROM kommuner WHERE kommune_navn LIKE ?', [kommune_navn + '%'], callback);
  }

  /**
   * Henter alle fylkenavnene fra databasen.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentAlleFylker(callback){
    super.query('SELECT * FROM fylker ORDER BY fylke_navn ASC', [], callback);
  }
  
  /**
   * Brukes til å søke på kommunenavn i databasen. 
   * @param {string} kommune_navn - Navnet på kommunen du vil søke på.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  sokKommune(kommune_navn, callback) {
    //console.log(kommune_navn);
    super.query('SELECT * FROM kommuner WHERE kommune_navn LIKE ?', [kommune_navn], callback);
  }
};