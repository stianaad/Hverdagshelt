import Dao from './dao.js';

module.exports = class HendelseDao extends Dao {
  hentAlleHendelser(callback) {
    super.query(
      "SELECT hendelse_id,overskrift,DATE_FORMAT(tid, '%Y-%m-%d %H:%i') AS tid,beskrivelse,sted,bilde, lengdegrad, breddegrad,kategorinavn FROM hendelser,hendelseskategori WHERE hendelser.hendelseskategori_id = hendelseskategori.hendelseskategori_id",
      null,
      callback
    );
  }

  hentEnHendelse(json, callback) {
    var id = json.hendelse_id;
    super.query(
      'SELECT * FROM hendelser WHERE hendelse_id = ?',
      [id],
      callback
    );
  }

  lagNyHendelse(json, callback) {
    var hendelse = [
      json.overskrift,
      json.bruker_id,
      json.beskrivelse,
      json.sted,
      json.bilde,
      json.lengdegrad,
      json.breddegrad,
    ];
    super.query(
      'INSERT INTO hendelser (overskrift, bruker_id, beskrivelse, sted, bilde, lengdegrad, breddegrad) VALUES (?, ?, ?, ?, ?, ?, ?)',
      hendelse,
      callback
    );
  }

  oppdaterHendelse(json, callback) {
    var hendelse = [
      json.overskrift,
      json.beskrivelse,
      json.bilde,
      json.lengdegrad,
      json.breddegrad,
      json.hendelse_id,
    ];
    super.query(
      'UPDATE feil SET overskrift = ?, SET beskrivelse = ?, SET bilde = ?, SET lengdegrad = ?, SET breddegrad = ? WHERE kategori_id = ?',
      hendelse,
      callback
    );
  }

  slettHendelse(json, callback) {
    var id = json.hendelse_id;
    super.query('DELETE FROM hendelser WHERE hendelse_id = ?', [id], callback);
  }
};
