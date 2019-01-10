import Dao from './dao.js';

//DAO som omfatter alt som innebærer feil, det vil også si oppdateringer, statuser og kategorier

module.exports = class FeilDao extends Dao {
  hentAlleFeil(callback) {
    super.query('SELECT * FROM feil', null, callback);
  }

  hentEnFeil(json, callback) {
    var feil_id = json.feil_id;
    super.query('SELECT * FROM feil WHERE feil_id = ?', [feil_id], callback);
  }

  hentFeilStatus(json, callback) {
    var status_id = json.status_id;
    super.query(
      'SELECT * from feil WHERE status_id = ?',
      [status_id],
      callback
    );
  }

  lagNyFeil(json, callback) {
    var feil = [
      json.kommune_id,
      json.subkategori_id,
      json.beskrivelse,
      json.bilde,
      json.lengdegrad,
      json.breddegrad,
    ];
    super.query(
      'INSERT INTO feil (kommune_id, subkategori_id, beskrivelse, bilde, lengdegrad, breddegrad) VALUES (?, ?, ?, ?, ?, ?)',
      feil,
      callback
    );
  }

  oppdaterFeil(json, callback) {
    var feil = [
      json.subkategori_id,
      json.status_id,
      json.beskrivelse,
      json.bilde,
      json.lengdegrad,
      json.breddegrad,
      json.feil_id,
    ];
    super.query(
      'UPDATE feil SET subkategori_id = ?, SET status_id = ?, SET beskrivelse = ?, SET bilde = ?, SET lengdegrad = ?, SET breddegrad = ? WHERE feil_id = ?',
      feil,
      callback
    );
  }

  /*endreStatusFeil(json, callback) {
    var idArray = [json.status_id, json.feil_id];
    super.query(
      'UPDATE feil SET status_id = ? WHERE feil_id = ?',
      idArray,
      callback
    );
  }*/

  slettFeil(json, callback) {
    var feil_id = json.feil_id;
    super.query('DELETE FROM feil WHERE feil_id = ?', [feil_id], callback);
  }

  lagOppdatering(json, callback) {
    var oppdatering = [
      json.feil_id,
      json.kommentar,
      json.status_id,
      json.bruker_id,
    ];
    super.query(
      'INSERT INTO oppdatering (feil_id, kommentar, status_id, bruker_id) VALUES (?, ?, ?, ?)',
      oppdatering,
      callback
    );
  }

  hentAlleOppdateringerPaaFeil(json, callback) {
    var feil_id = json.feil_id;
    super.query(
      'SELECT * WHERE oppdatering WHERE feil_id = ?',
      [feil_id],
      callback
    );
  }

  /*slettOppdatering(json, callback) {
    var oppdatering_id = json.oppdatering_id;
    super.query(
      'DELETE FROM oppdatering WHERE oppdatering_id = ?',
      [oppdatering_id],
      callback
    );
  }*/

  hentEnStatus(json, callback) {
    var status_id = json.status_id;
    super.query(
      'SELECT * FROM status WHERE status_id = ?',
      [status_id],
      callback
    );
  }

  hentAlleStatuser(callback) {
    super.query('SELECT * FROM status', null, callback);
  }

  hentAlleHovedkategorier(callback) {
    super.query('SELECT * FROM hovedkategori', null, callback);
  }

  hentAlleSubKategorierPaaHovedkategori(json, callback) {
    var hovedkategori_id = json.hovedkategori_id;
    super.query(
      'SELECT * FROM subkategori WHERE hovedkategori_id = ?',
      [hovedkategori_id],
      callback
    );
  }
};

/*
kategori(kategori_id, hoved, kategori)
feil(feil_id, kommune_id*, kategori_id*, status_id*, beskrivelse, bilde, lengdegrad, breddegrad)
status(status_id, status)
oppdatering(feil_id*, tid, kommentar, status*, bruker_id*)
*/
