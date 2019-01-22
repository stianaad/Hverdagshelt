import Dao from './dao.js';

// 5 av 9 testes
module.exports = class HendelseDao extends Dao {
  //testes
  hentAlleHendelser(callback) {
    super.query(
      "SELECT hendelse_id,overskrift,DATE_FORMAT(tid, '%Y-%m-%d %H:%i') AS tid,beskrivelse,sted,bilde, lengdegrad, breddegrad,kategorinavn FROM hendelser,hendelseskategori WHERE hendelser.hendelseskategori_id = hendelseskategori.hendelseskategori_id",
      null,
      callback
    );
  }

  hentHendelseForKommune(kommune_id, callback) {
    super.query('SELECT * FROM hendelser WHERE kommune_id = ?', [kommune_id], callback);
  }

  //testes
  hentEnHendelse(json, callback) {
    var id = json.hendelse_id;
    super.query('SELECT * FROM hendelser WHERE hendelse_id = ?', [id], callback);
  }

  //testes
  lagNyHendelse(json, callback) {
    var hendelse = [
      json.bruker_id,
      json.hendelseskategori_id,
      json.kommune_id,
      json.overskrift,
      json.tid,
      json.beskrivelse,
      json.sted,
      json.bilde,
      json.lengdegrad,
      json.breddegrad,
    ];
    super.query(
      'INSERT INTO hendelser (bruker_id, hendelseskategori_id, kommune_id, overskrift, tid, beskrivelse, sted, bilde, lengdegrad, breddegrad) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      hendelse,
      callback
    );
  }

  oppdaterHendelse(json, callback) {
    var hendelse = [
      json.hendelseskategori_id,
      json.kommune_id,
      json.overskrift,
      json.tid,
      json.beskrivelse,
      json.sted,
      json.bilde,
      json.lengdegrad,
      json.breddegrad,
      json.hendelse_id,
    ];
    super.query(
      'UPDATE feil SET hendelseskategori_id = ?, SET kommune_id = ?, SET overskrift = ?, SET tid = ?, SET beskrivelse = ?, SET sted = ?, SET bilde = ?, SET lengdegrad = ?, SET breddegrad = ? WHERE kategori_id = ?',
      hendelse,
      callback
    );
  }

  slettHendelse(json, callback) {
    var id = json.hendelse_id;
    super.query('DELETE FROM hendelser WHERE hendelse_id = ?', [id], callback);
  }

  //testes
  filtrerHendelserPaaKategori(json, callback) {
    var kat = json.hendelseskategori_id;
    super.query(
      "SELECT hendelse_id, overskrift, DATE_FORMAT(tid, '%Y-%m-%d %H:%i') AS tid, sted, bilde FROM hendelser WHERE hendelseskategori_id = ?",
      [kat],
      callback
    );
  }

  filtrerHendelserPaaTid(callback) {
    super.query(
      "SELECT hendelse_id, overskrift, DATE_FORMAT(tid, '%Y-%m-%d %H:%i') AS tid, sted, bilde FROM hendelser ORDER BY tid ASC",
      null,
      callback
    );
  }

  //testes
  filtrerHendelserPaaKommune(json, callback) {
    var k_id = json.kommune_id;
    super.query(
      "SELECT hendelse_id, overskrift, DATE_FORMAT(tid, '%Y-%m-%d %H:%i') AS tid, sted, bilde FROM hendelser WHERE kommune_id = ? ORDER BY tid ASC",
      [k_id],
      callback
    );
  }

  hentAlleHovedkategorier(callback) {
    super.query('SELECT * FROM hovedkategori', null, callback);
  }

  hentAlleKategorier(callback){
    super.query('SELECT * FROM hendelseskategori', null, callback);
  }

  abonnerHendelse(json, callback) {
    super.query("INSERT INTO hendfolg (hendelse_id, bruker_id) VALUES (?, ?)", [json.hendelse_id, json.bruker_id], callback);
  }

  ikkeAbonnerHendelse(json, callback) {
    super.query("DELETE FROM hendfolg WHERE hendelse_id=? AND bruker_id=?", [json.hendelse_id, json.bruker_id], callback);
  }

}
