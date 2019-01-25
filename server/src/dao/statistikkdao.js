import Dao from './dao.js';

module.exports = class StatistikkDao extends Dao {

  feilPerKommune(callback){
    super.query(
      "SELECT feil.kommune_id, kommuner.kommune_navn, COUNT(*) as antall FROM feil"
      + " JOIN kommuner ON"
      + " feil.kommune_id = kommuner.kommune_id"
      + " GROUP BY feil.kommune_id"
      + " ORDER BY kommuner.kommune_navn ASC",
      null,
      callback
    );
  }

  hentAlleFeil(callback) {
    super.query(
      'SELECT COUNT(*) as antall FROM feil', null, callback
    );
  }

  hentFeilPaaKommune(kommune_id, callback) {
    super.query(
      'SELECT COUNT(*) as antall FROM feil WHERE feil.kommune_id = ?', [kommune_id], callback
    );
  }

  hentFeilPaaFylkenavn(fylke_navn, callback) {
    super.query(
      'SELECT COUNT(*) FROM feil JOIN kommuner ON feil.kommune_id = kommuner.kommune_id WHERE kommuner.fylke_navn = ?', [fylke_navn], callback
    );
  }

  hentFeilPaaHovedkategori(kategorinavn, callback) {
    super.query(
      'SELECT COUNT(*) FROM feil JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id WHERE hovedkategori.kategorinavn = ?', [kategorinavn], callback
    );
  }

  hentFeilPaaSubkategori(kategorinavn, callback) {
    super.query(
      'SELECT COUNT(*) FROM feil JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id WHERE subkategori.kategorinavn = ?', [kategorinavn], callback
    );
  }

  /**
   * 
   *
   *
   */
  hentRegistrerteFeilPaaInterval(interval, callback) {
    super.query(
      'SELECT COUNT(*) FROM feil JOIN oppdatering ON feil.feil_id = oppdatering.feil_id WHERE oppdatering.status_id = 1 AND oppdatering.tid > CURRENT_TIMESTAMP - INTERVAL ?', [interval], callback
    );
  }
}
