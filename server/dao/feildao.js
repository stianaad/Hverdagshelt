import Dao from './dao.js';

module.exports = class FeilDao extends Dao {
  lagNyFeil(json, callback) {
    var feil = [
      json.kommune_id,
      json.kategori_id,
      json.beskrivelse,
      json.bilde,
      json.lengdegrad,
      json.breddegrad,
    ];
    super.query(
      'INTO feil (kommune_id, kategori_id, beskrivelse, bilde, lengdegrad, breddegrad) VALUES (?, ?, ?, ?, ?, ?)',
      feil,
      callback
    );
  }

  slettFeil(json, callback) {
    var id = json.feil_id;
    super.query('DELETE FROM feil WHERE feil_id = ?', [id], callback);
  }
};

//Feil(feil_id, kommune_id*, kategori_id*, beskrivelse, bilde, lengdegrad, breddegrad)
