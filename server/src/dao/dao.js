/**
 * Superklasse for daoklassene. Har en konstruktør og en funksjon.
 * @example
 * let dao = new Dao(eksempelPool);
 */

module.exports = class Dao {
  constructor(pool) {
    // Dependency Injection
    this.pool = pool;
  }

  /**
   * Funksjon som kjører en sql setning mot databasepoolen definert i konstruktør.
   * @example 
   * dao.query('SELECT * FROM eksempel WHERE eksemple_id = ?', [12], (callback) => {})
   * @param {string} sql - din sql setning
   * @param {Array} params - dine parametere for sql setningen
   * @param {function} callback - den funksjonen som kalles etter gjennomført spørring
   */
  query(sql, params, callback) {
    this.pool.getConnection((err, connection) => {
      console.log('dao: connected to database');
      if (err) {
        console.log('dao: error connecting');
        callback && callback(500, {error: 'feil ved ved oppkobling'});
      } else {
        console.log('dao: running sql: ' + sql);
        connection.query(sql, params, (err, rows) => {
          connection.release();
          if (err) {
            console.log(err);
            callback && callback(500, {error: 'error querying'});
          } else {
            console.log('dao: returning rows');
            //console.log('rows: ' + JSON.stringify(rows));
            callback && callback(200, rows);
          }
        });
      }
    });
  }
};
