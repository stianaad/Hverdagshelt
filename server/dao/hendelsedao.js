import Dao from './dao.js';

module.exports = class HendelseDao extends Dao {
  hentAlleHendelser(callback) {
    super.query('SELECT * FROM hendelse', null, callback);
  }

  hentEnHendelse(json, callback) {
    var id = json.hendelse_id;
    super.query('SELECT * FROM hendelse WHERE hendelse_id = ?', [id], callback);
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
      'INSERT INTO hendelse (overskrift, bruker_id, beskrivelse, sted, bilde, lengdegrad, breddegrad) VALUES (?, ?, ?, ?, ?, ?, ?)',
      hendelse,
      callback
    );
  }

  slettHendelse(json, callback) {
    var id = json.hendelse_id;
    super.query('DELETE FROM hendelse WHERE hendelse_id = ?', [id], callback);
  }
};
