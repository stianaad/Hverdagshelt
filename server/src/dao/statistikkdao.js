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
}
