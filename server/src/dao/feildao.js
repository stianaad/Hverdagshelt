import Dao from './dao.js';

//DAO som omfatter alt som innebærer feil, det vil også si oppdateringer, statuser og kategorier

module.exports = class FeilDao extends Dao {
  hentAlleFeil(callback) {
    super.query(
      "SELECT feil.*, hovedkategori.kategorinavn, status.status, DATE_FORMAT(f.tid, '%Y-%m-%d %H:%i') AS tid, kommuner.kommune_navn, kommuner.fylke_navn FROM feil INNER JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id INNER JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id INNER JOIN(SELECT feil_id, MIN(tid) AS tid FROM oppdatering GROUP BY feil_id) AS f ON feil.feil_id = f.feil_id INNER JOIN (SELECT feil_id, ANY_VALUE(status_id) AS status_id, MAX(tid) AS tid FROM oppdatering GROUP BY feil_id) AS s ON feil.feil_id = s.feil_id INNER JOIN status ON status.status_id = s.status_id INNER JOIN kommuner ON kommuner.kommune_id = feil.kommune_id;",
      null,
      callback
    );
  }

  hentEnFeil(json, callback) {
    var feil_id = json.feil_id;
    super.query('SELECT * FROM feil WHERE feil_id = ?', [feil_id], callback);
  }

  lagNyFeil(json, callback) {
    var feil = [
      json.kommune_id,
      json.bruker_id,
      json.subkategori_id,
      json.overskrift,
      json.beskrivelse,
      json.lengdegrad,
      json.breddegrad,
    ];
    super.query(
      'INSERT INTO feil (kommune_id, bruker_id, subkategori_id, overskrift, beskrivelse, lengdegrad, breddegrad) VALUES (?, ?, ?, ?, ?, ?, ?)',
      feil,
      callback
    );
  }

  leggTilBilder(feil_id, bilder, callback) {
    if (bilder.length > 0) {
      let query = 'INSERT INTO feilbilder (bilde_id, feil_id, url) VALUES';
      let params = [];
      for (let i = 0; i < bilder.length; i++) {
        query += ' (DEFAULT, ?, ?),';
        params.push(feil_id);
        params.push(bilder[i]);
      }
      query = query.slice(0, -1);
      query += ';';

      super.query(query, params, callback);
    }
  }

  hentBilderTilFeil(feil_id, callback) {
    super.query(
      'SELECT * FROM feilbilder WHERE feil_id=?',
      [feil_id],
      callback
    );
  }

  oppdaterFeil(json, callback) {
    var feil = [
      json.kommune_id,
      json.subkategori_id,
      json.overskrift,
      json.beskrivelse,
      json.lengdegrad,
      json.breddegrad,
      json.feil_id,
    ];
    super.query(
      'UPDATE feil SET kommune_id = ?, subkategori_id = ?, overskrift = ?, beskrivelse = ?, lengdegrad = ?, breddegrad = ? WHERE feil_id = ?',
      feil,
      callback
    );
  }

  slettFeil(feil_id, callback) {
    //var feil_id = json.feil_id;
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
      'SELECT * FROM oppdatering WHERE feil_id = ?',
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

  hentFeilFiltrertKategori(json,callback) {
    var kategori_id = json.kategori_id;
    super.query(
      'SELECT feil.*,hovedkategori.hovedkategori_id,hovedkategori.kategorinavn AS kategorinavn FROM feil, subkategori,hovedkategori WHERE feil.subkategori_id=subkategori.subkategori_id AND subkategori.hovedkategori_id=hovedkategori.hovedkategori_id AND hovedkategori.hovedkategori_id=?',
      [kategori_id],
      callback
      );
  }

  hentAlleSubKategorierPaaHovedkategori(json, callback) {
    var hovedkategori_id = json;
    super.query(
      'SELECT * FROM subkategori WHERE hovedkategori_id = ?',
      [hovedkategori_id],
      callback
    );
  }

  hentAlleSubkategorier(callback) {
    super.query('SELECT * FROM subkategori', null, callback);
  }

  slettBildeFraFeil(json, callback) {
    var info = [json.url, json.feil_id];
    super.query('DELETE FROM feil_bilder WHERE url = ? AND feil_id = ?', info, callback);
  }
};

/*
kategori(kategori_id, hoved, kategori)
feil(feil_id, kommune_id*, kategori_id*, status_id*, beskrivelse, bilde, lengdegrad, breddegrad)
status(status_id, status)
oppdatering(feil_id*, tid, kommentar, status*, bruker_id*)
*/
