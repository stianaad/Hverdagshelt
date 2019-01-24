import Dao from './dao.js';

//DAO som omfatter alt som innebærer feil, det vil også si oppdateringer, statuser og kategorier
// 9 av 30 funksjoner testes
module.exports = class FeilDao extends Dao {

  hentGodkjenteFeilForKommune(kommune_id, callback) {
    super.query("SELECT feil.*, hovedkategori.kategorinavn, status.status, DATE_FORMAT(f.tid, '%Y.%m.%d %H:%i') AS tid, kommuner.kommune_navn, kommuner.fylke_navn FROM feil INNER JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id INNER JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id INNER JOIN(SELECT feil_id, MIN(tid) AS tid FROM oppdatering GROUP BY feil_id) AS f ON feil.feil_id = f.feil_id INNER JOIN (SELECT status_id, feil_id, tid FROM oppdatering WHERE (feil_id , tid) IN (SELECT feil_id, MAX(tid) AS tid FROM oppdatering GROUP BY feil_id)) AS s ON feil.feil_id = s.feil_id INNER JOIN status ON status.status_id = s.status_id INNER JOIN kommuner ON kommuner.kommune_id = feil.kommune_id WHERE feil.kommune_id = ? AND s.status_id > 1;", [kommune_id], callback);
  }


  //testes
  hentAlleFeil(callback) {
    super.query(
      "SELECT feil.*, hovedkategori.kategorinavn, status.status, DATE_FORMAT(f.tid, '%Y.%m.%d %H:%i') AS tid, kommuner.kommune_navn, kommuner.fylke_navn FROM feil INNER JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id INNER JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id INNER JOIN(SELECT feil_id, MIN(tid) AS tid FROM oppdatering GROUP BY feil_id) AS f ON feil.feil_id = f.feil_id INNER JOIN (SELECT status_id, feil_id, tid FROM oppdatering WHERE (feil_id , tid) IN (SELECT feil_id, MAX(tid) AS tid FROM oppdatering GROUP BY feil_id)) AS s ON feil.feil_id = s.feil_id INNER JOIN status ON status.status_id = s.status_id INNER JOIN kommuner ON kommuner.kommune_id = feil.kommune_id;",
      null,
      callback
    );
  }

  hentFeilForKommune(kommune_id, callback) {
    super.query("SELECT feil.*, hovedkategori.kategorinavn, status.status, DATE_FORMAT(f.tid, '%Y.%m.%d %H:%i') AS tid, kommuner.kommune_navn, kommuner.fylke_navn FROM feil INNER JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id INNER JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id INNER JOIN(SELECT feil_id, MIN(tid) AS tid FROM oppdatering GROUP BY feil_id) AS f ON feil.feil_id = f.feil_id INNER JOIN (SELECT status_id, feil_id, tid FROM oppdatering WHERE (feil_id , tid) IN (SELECT feil_id, MAX(tid) AS tid FROM oppdatering GROUP BY feil_id)) AS s ON feil.feil_id = s.feil_id INNER JOIN status ON status.status_id = s.status_id INNER JOIN kommuner ON kommuner.kommune_id = feil.kommune_id WHERE feil.kommune_id = ?", [kommune_id], callback);
  }

  //testes
  hentEnFeil(json, callback) {
    var feil_id = json.feil_id;
    super.query('SELECT * FROM feil WHERE feil_id = ?', [feil_id], callback);
  }

  //testes
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
    let gyldig = (json.kommune_id != null && json.bruker_id > 0 && json.subkategori_id != '-1' && json.overskrift != '' && json.beskrivelse != '' && json.lengdegrad != '0' && json.breddegrad != '0');
    if (gyldig) {
      super.query(
        'INSERT INTO feil (kommune_id, bruker_id, subkategori_id, overskrift, beskrivelse, lengdegrad, breddegrad) VALUES (?, ?, ?, ?, ?, ?, ?)',
        feil,
        callback
      );
    } else {
      callback(403, {error: 'Ugyldig input.'});
    }
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
    super.query('SELECT * FROM feilbilder WHERE feil_id=?', [feil_id], callback);
  }

  //testes
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

  //testes, men trenger on delete cascade
  slettFeil(json, callback) {
    super.query('DELETE FROM feil WHERE feil_id = ?', [json.feil_id], callback);
  }

  lagOppdatering(json, callback) {
    var oppdatering = [json.feil_id, json.kommentar, json.status_id, json.bruker_id];
    super.query(
      'INSERT INTO oppdatering (feil_id, kommentar, status_id, bruker_id) VALUES (?, ?, ?, ?)',
      oppdatering,
      callback
    );
  }

  //testes
  hentAlleOppdateringerPaaFeil(json, callback) {
    var feil_id = json.feil_id;
    super.query("SELECT kommentar,status,DATE_FORMAT(tid, '%Y.%m.%d %H:%i') AS tid FROM oppdatering,status WHERE oppdatering.status_id=status.status_id AND feil_id = ? ORDER BY tid ASC", [feil_id], callback);
  }

  /*slettOppdatering(json, callback) {
    var oppdatering_id = json.oppdatering_id;
    super.query(
      'DELETE FROM oppdatering WHERE oppdatering_id = ?',
      [oppdatering_id],
      callback
    );
  }*/

  //testes
  hentEnStatus(json, callback) {
    var status_id = json.status_id;
    super.query('SELECT * FROM status WHERE status_id = ?', [status_id], callback);
  }

  //testes
  hentAlleStatuser(callback) {
    super.query('SELECT * FROM status', null, callback);
  }

  //testes
  hentAlleHovedkategorier(callback) {
    super.query('SELECT * FROM hovedkategori', null, callback);
  }

  hentFeilFiltrertKategori(json, callback) {
    var kategori_id = json.hovedkategori_id;
    super.query(
      'SELECT feil.*,hovedkategori.hovedkategori_id,hovedkategori.kategorinavn AS kategorinavn FROM feil, subkategori,hovedkategori WHERE feil.subkategori_id=subkategori.subkategori_id AND subkategori.hovedkategori_id=hovedkategori.hovedkategori_id AND hovedkategori.hovedkategori_id=?',
      [kategori_id],
      callback
    );
  }

  //testes
  hentAlleSubKategorierPaaHovedkategori(json, callback) {
    var hovedkategori_id = json.hovedkategori_id;
    super.query('SELECT * FROM subkategori WHERE hovedkategori_id = ?', [hovedkategori_id], callback);
  }

  //testes
  hentAlleSubkategorier(callback) {
    super.query('SELECT * FROM subkategori', null, callback);
  }

  //testes
  slettBildeFraFeil(json, callback) {
    var info = [json.url, json.feil_id];
    super.query('DELETE FROM feilbilder WHERE url = ? AND feil_id = ?', info, callback);
  }

  oppdaterSubkategori(json, callback) {
    var info = [json.kategorinavn, json.hovedkategori_id, json.subkategori_id];
    super.query('UPDATE subkategori SET kategorinavn = ?, hovedkategori_id = ? WHERE subkategori_id = ?', info, callback);
  }

  slettSubkategori(json, callback) {
    super.query('DELETE FROM subkategori WHERE subkategori_id = ?', [json.subkategori_id], callback);
  }

  //testes
  nySubkategori(json, callback) {
    var info = [json.kategorinavn, json.hovedkategori_id];
    super.query('INSERT INTO subkategori (kategorinavn, hovedkategori_id) VALUES (?,?)', info, callback);
  }

  nyHovedkategori(json, callback) {
    super.query('INSERT INTO hovedkategori (kategorinavn) VALUES (?)', [json.kategorinavn], callback);
  }

  //testes
  oppdaterHovedkategori(json, callback) {
    var info = [json.kategorinavn, json.hovedkategori_id];
    super.query('UPDATE hovedkategori SET kategorinavn = ? WHERE hovedkategori_id = ?', info, callback);
  }

  //testes
  slettHovedkategori(json, callback) {
    super.query('DELETE FROM hovedkategori WHERE hovedkategori_id = ?', [json.hovedkategori_id], callback);
  }

  hentNyeFeilTilBedrift(bruker_id, callback) {
    super.query(
      /*"SELECT feil.*, hovedkategori.kategorinavn, DATE_FORMAT(f.tid, '%Y.%m.%d %H:%i') AS tid, kommuner.kommune_navn, kommuner.fylke_navn FROM feil INNER JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id INNER JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id INNER JOIN(SELECT feil_id, MIN(tid) AS tid FROM oppdatering GROUP BY feil_id) AS f ON feil.feil_id = f.feil_id INNER JOIN (SELECT feil_id, ANY_VALUE(status_id) AS status_id, MAX(tid) AS tid FROM oppdatering GROUP BY feil_id) AS s ON feil.feil_id = s.feil_id INNER JOIN status ON status.status_id = s.status_id INNER JOIN kommuner ON kommuner.kommune_id = feil.kommune_id INNER JOIN jobbSoknad ON feil.feil_id=jobbSoknad.feil_id AND jobbSoknad.bruker_id=? AND jobbSoknad.status=3"*/
      "SELECT feil.*, hovedkategori.kategorinavn, DATE_FORMAT(f.tid, '%Y.%m.%d %H:%i') AS tid, kommuner.kommune_navn, kommuner.fylke_navn FROM feil INNER JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id INNER JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id INNER JOIN(SELECT feil_id, MAX(tid) AS tid FROM oppdatering GROUP BY feil_id) AS f ON feil.feil_id = f.feil_id INNER JOIN (SELECT feil_id, Max(status_id) AS status_id, MAX(tid) AS tid FROM oppdatering GROUP BY feil_id) AS s ON feil.feil_id = s.feil_id INNER JOIN status ON status.status_id = s.status_id INNER JOIN kommuner ON kommuner.kommune_id = feil.kommune_id INNER JOIN jobbSoknad ON feil.feil_id=jobbSoknad.feil_id AND jobbSoknad.bruker_id=? AND jobbSoknad.status=3",
      [bruker_id],
      callback
    );
  }

  hentBedriftPaaOrgnr(orgnr, callback) {
    super.query('SELECT * FROM bedrift WHERE orgnr = ?', [orgnr], callback);
  }

  sendFeilTilBedrift(json, callback) {
    super.query(
      "INSERT INTO jobbSoknad (bruker_id, feil_id) VALUES (?,?)",
      [json.bruker_id, json.feil_id],
      callback
    );
  }

  hentUnderBehandlingFeilTilBedrift(bruker_id, callback) {
    super.query(
      "SELECT feil.*, hovedkategori.kategorinavn, DATE_FORMAT(f.tid, '%Y.%m.%d %H:%i') AS tid, kommuner.kommune_navn, kommuner.fylke_navn FROM feil INNER JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id INNER JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id INNER JOIN(SELECT feil_id, MAX(tid) AS tid FROM oppdatering GROUP BY feil_id) AS f ON feil.feil_id = f.feil_id INNER JOIN (SELECT feil_id, Max(status_id) AS status_id, MAX(tid) AS tid FROM oppdatering GROUP BY feil_id) AS s ON feil.feil_id = s.feil_id INNER JOIN status ON status.status_id = s.status_id INNER JOIN kommuner ON kommuner.kommune_id = feil.kommune_id INNER JOIN jobbSoknad ON feil.feil_id=jobbSoknad.feil_id AND jobbSoknad.bruker_id=? AND jobbSoknad.status=4 AND status.status_id=3",
      [bruker_id],
      callback
    );
  }

  //testes
  hentFerdigeFeilTilBedrift(bruker_id, callback) {
    super.query(
      "SELECT feil.*, hovedkategori.kategorinavn, DATE_FORMAT(f.tid, '%Y.%m.%d %H:%i') AS tid, kommuner.kommune_navn, kommuner.fylke_navn FROM feil INNER JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id INNER JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id INNER JOIN(SELECT feil_id, MAX(tid) AS tid FROM oppdatering GROUP BY feil_id) AS f ON feil.feil_id = f.feil_id INNER JOIN (SELECT feil_id, Max(status_id) AS status_id, MAX(tid) AS tid FROM oppdatering GROUP BY feil_id) AS s ON feil.feil_id = s.feil_id INNER JOIN status ON status.status_id = s.status_id INNER JOIN kommuner ON kommuner.kommune_id = feil.kommune_id INNER JOIN jobbSoknad ON feil.feil_id=jobbSoknad.feil_id AND jobbSoknad.bruker_id=? AND jobbSoknad.status=4 AND status.status_id=4",
      [bruker_id],
      callback
    );
  }

  oppdaterStatusFeilTilBedrift(json, bruker_id, callback) {
    let tabell = [json.status, bruker_id, json.feil_id];
    super.query('UPDATE jobbSoknad SET status=? WHERE bruker_id=? AND feil_id=?', tabell, callback);
  }

  sjekkFeilPaaBruker(json, callback) {
    super.query(
      'SELECT * FROM feil WHERE bruker_id = ? AND feil_id = ?',
      [json.bruker_id, json.feil_id],
      callback
    );
  }

  //testes
  abonnerFeil(json, callback) {
    super.query("INSERT INTO feilfolg (feil_id, bruker_id) VALUES (?, ?)", [json.feil_id, json.bruker_id], callback);
  }

  //testes
  ikkeAbonnerFeil(json, callback) {
    super.query("DELETE FROM feilfolg WHERE feil_id=? AND bruker_id=?", [json.feil_id, json.bruker_id], callback);
  }
};



/*
kategori(kategori_id, hoved, kategori)
feil(feil_id, kommune_id*, kategori_id*, status_id*, beskrivelse, bilde, lengdegrad, breddegrad)
status(status_id, status)
oppdatering(feil_id*, tid, kommentar, status*, bruker_id*)
*/
