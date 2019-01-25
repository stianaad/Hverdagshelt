import Dao from './dao.js';

// 0 av 17 funksjoner testes
module.exports = class StatistikkDao extends Dao {

  /**
   * Finner antallet feil per kommune
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
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

  /**
   * Teller alle feilene og returnerer antallet. 
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentAlleFeil(callback) {
    super.query(
      'SELECT COUNT(*) as antall FROM feil', null, callback
    );
  }

  /**
   * Teller alle feilene i en valgt kommune. 
   * @param {number} kommune_id - Iden til kommunen du vil finne feilene til.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentFeilPaaKommune(kommune_id, callback) {
    super.query(
      'SELECT COUNT(*) as antall FROM feil WHERE feil.kommune_id = ?', [kommune_id], callback
    );
  }

  /**
   * Teller alle feilene i et valgt fylke.
   * @param {string} fylke_navn - Navnet på fylket du vil ha antall feil fra.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentFeilPaaFylkenavn(fylke_navn, callback) {
    super.query(
      'SELECT COUNT(*) as antall FROM feil JOIN kommuner ON feil.kommune_id = kommuner.kommune_id WHERE kommuner.fylke_navn = ?', [fylke_navn], callback
    );
  }

  /**
   * Teller alle feilene på en valgt hovedkategori
   * @param {string} kategorinavn - Navnet på hovedkategorien du vil ha antall feil fra.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentFeilPaaHovedkategori(kategorinavn, callback) {
    super.query(
      'SELECT COUNT(*) as antall FROM feil JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id WHERE hovedkategori.kategorinavn = ?', [kategorinavn], callback
    );
  }

  /**
   * Teller alle feilene på en valgt subkategori
   * @param {string} kategorinavn - Navnet på subkategorien du vil ha antall feil fra.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentFeilPaaEnSubkategori(kategorinavn, callback) {
    super.query(
      'SELECT COUNT(*) as antall FROM feil JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id WHERE subkategori.kategorinavn = ?', [kategorinavn], callback
    );
  }

  /**
   * Henter alle feil som er registrerte innenfor et intervall, altså feil med status_id 1 - opprettet.
   * @param {number} intervall - Intervallet du vil begrense søket med
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentRegistrerteFeilPaaIntervall(intervall, callback) {
    super.query(
      'SELECT COUNT(DISTINCT feil.feil_id) as antall FROM feil JOIN oppdatering ON feil.feil_id = oppdatering.feil_id WHERE oppdatering.status_id = 1 AND oppdatering.tid > CURRENT_TIMESTAMP - INTERVAL ? day', [intervall], callback
    );
  }

  /**
   * Henter alle feil som er blitt behandlet innenfor et intervall, altså feil med status_id større enn 1.
   * @param {number} intervall - Intervallet du vil begrense søket med
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentBehandledeFeilPaaIntervall(intervall, callback) {
    super.query(
      'SELECT COUNT(DISTINCT feil.feil_id) as antall FROM feil JOIN oppdatering ON feil.feil_id = oppdatering.feil_id WHERE oppdatering.status_id > 1 AND oppdatering.tid > CURRENT_TIMESTAMP - INTERVAL ? day', [intervall], callback
    );
  }

  /**
   * Henter alle feil som er blitt behandlet innenfor et intervall, altså feil med status_id større enn 1.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentBehandledeFeilPaaIntervall(callback) {
    super.query(
      'SELECT COUNT(DISTINCT feil.feil_id) as antall FROM feil JOIN oppdatering ON feil.feil_id = oppdatering.feil_id WHERE oppdatering.status_id > 1', [intervall], callback
    );
  }

  /**
   * Henter og teller alle feilene som blir gjort per fylke. 
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  feilPerFylke(callback) {
    super.query(
      'SELECT kommuner.fylke_navn, COUNT(*) as antall FROM feil JOIN kommuner ON feil.kommune_id = kommuner.kommune_id GROUP BY kommuner.fylke_navn ORDER BY kommuner.fylke_navn ASC', null, callback
    );
  }

  /**
   * Skriver ut alle subkategoriene med antall feil.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentFeilPerSubkategori(callback) {
    super.query(
      'SELECT subkategori.kategorinavn, COUNT(*) as antall FROM feil JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id GROUP BY subkategori.kategorinavn ORDER BY subkategori.kategorinavn ASC', null, callback
    );
  }

  /**
   * Henter antallet feil per subkategori på et valgt intervall.
   * @param {number} intervall - Antall dager bakover i tid intervallet skal være.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentFeilPerSubkategoriPaaIntervall(intervall, callback) {
    super.query(
      'SELECT subkategori.kategorinavn, COUNT(*) as antall FROM feil JOIN oppdatering ON feil.feil_id = oppdatering.feil_id JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id WHERE oppdatering.tid > CURRENT_TIMESTAMP - INTERVAL 1 day GROUP BY subkategori.kategorinavn ORDER BY subkategori.kategorinavn ASC', [intervall], callback
    );
  }

  /**
   * Skriver ut alle hovedkategoriene med antall feil.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentFeilPerHovedkategori(callback) {
    super.query(
      'SELECT hovedkategori.kategorinavn, COUNT(*) as antall FROM feil JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id GROUP BY hovedkategori.kategorinavn ORDER BY hovedkategori.kategorinavn ASC', null, callback
    );
  }

  /**
   * Henter antallet feil per hovedkategori på et valgt intervall.
   * @param {number} intervall - Antall dager bakover i tid intervallet skal være.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentFeilPerHovedkategoriPaaIntervall(intervall, callback) {
    super.query(
      'SELECT hovedkategori.kategorinavn, COUNT(DISTINCT feil.feil_id) as antall FROM feil JOIN oppdatering ON feil.feil_id = oppdatering.feil_id JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id WHERE oppdatering.tid > CURRENT_TIMESTAMP - INTERVAL ? day GROUP BY hovedkategori.kategorinavn ORDER BY hovedkategori.kategorinavn', [intervall], callback
    );
  }

  /**
   * Henter antall feil i alle fylker i et valgt intervall. 
   * @example
   * statistikkDao.hentFeilPerFylkePaaIntervall(365, (status, data) => {dinFunksjon})
   * @param {number} intervall - antall dager intervallet skal gå bakover i tid.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentFeilPerFylkePaaIntervall(intervall, callback) {
    super.query(
      'SELECT kommuner.fylke_navn, COUNT(DISTINCT feil.feil_id) as antall FROM feil JOIN kommuner ON feil.kommune_id = kommuner.kommune_id JOIN oppdatering ON feil.feil_id = oppdatering.feil_id WHERE oppdatering.tid > CURRENT_TIMESTAMP - INTERVAL ? day GROUP BY kommuner.fylke_navn ORDER BY kommuner.fylke_navn ASC', [intervall], callback
    );
  }
  
  /**
   * Henter antall feil i alle kommuner i et valgt intervall. 
   * @example
   * statistikkDao.hentFeilPerKommunePaaIntervall(7, (status, data) => {dinFunksjon})
   * @param {number} intervall - antall dager intervallet skal gå tilbake i tid.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentFeilPerKommunePaaIntervall(intervall, callback) {
    super.query(
      'SELECT kommuner.kommune_navn, COUNT(DISTINCT feil.feil_id) as antall FROM feil JOIN kommuner ON feil.kommune_id = kommuner.kommune_id JOIN oppdatering ON feil.feil_id = oppdatering.feil_id WHERE oppdatering.tid > CURRENT_TIMESTAMP - INTERVAL ? day GROUP BY kommuner.kommune_navn ORDER BY kommuner.kommune_navn ASC', [intervall], callback
    );
  }

  /**
   * Teller hver unike feil som ligger i oppdateringstabellen med valgt status
   * @param {number} status_id - Iden til statusen du vil filtrere på.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentFeilPaaStatus(status_id, callback) {
    super.query(
      'SELECT COUNT(DISTINCT feil.feil_id) as antall FROM feil JOIN oppdatering ON feil.feil_id = oppdatering.feil_id WHERE oppdatering.status_id = ?', [status_id], callback
    );
  }
}
