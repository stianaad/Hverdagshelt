import Dao from './dao.js';

// 9 av 15 funksjoner testes
module.exports = class HendelseDao extends Dao {
  //testes
  /**
   * Henter alle hendelser fra databasen. 
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentAlleHendelser(callback) {
    super.query(
      "SELECT hendelse_id,overskrift,kommune_navn, hendelser.kommune_id,fylke_navn,DATE_FORMAT(tid, '%Y-%m-%d %H:%i') AS tid,beskrivelse,sted,bilde, billett,kategorinavn FROM hendelser,hendelseskategori,kommuner WHERE hendelser.hendelseskategori_id = hendelseskategori.hendelseskategori_id AND kommuner.kommune_id=hendelser.kommune_id",
      null,
      callback
    );
  }

  /**
   * Henter alle hendelser fra en spesifisert kommune.
   * @param {number} kommune_id - Iden til kommunen du skal hente hendelser fra. 
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentHendelseForKommune(kommune_id, callback) {
    super.query("SELECT hendelse_id,overskrift,kommune_navn, hendelser.kommune_id,fylke_navn,DATE_FORMAT(tid, '%Y-%m-%d %H:%i') AS tid,beskrivelse,sted,bilde, billett,kategorinavn FROM hendelser,hendelseskategori,kommuner WHERE hendelser.hendelseskategori_id = hendelseskategori.hendelseskategori_id AND kommuner.kommune_id=hendelser.kommune_id AND hendelser.kommune_id=?",
     [kommune_id], 
     callback);
  }

  //testes
  /**
   * Henter en spesifisert hendelse fra databasen.
   * @param {number} hendelse_id - Iden til hendelsen du vil hente.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentEnHendelse(hendelse_id, callback) {
    super.query('SELECT * FROM hendelser WHERE hendelse_id = ?', [hendelse_id], callback);
  }

  //testes
  /**
   * Oppretter en ny hendelse i databasen.
   * @param {json} json - En json som inneholder alle verdiene til en hendelse.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
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
      json.billett
    ];
    super.query(
      'INSERT INTO hendelser (bruker_id, hendelseskategori_id, kommune_id, overskrift, tid, beskrivelse, sted, bilde, billett) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      hendelse,
      callback
    );
  }

  /**
   * Henter alle brukere som skal få varslinger når det opprettes en ny hendelse.
   * @param {number} hendelse_id - Iden til hendelsen som akkurat har blitt opprettet og som de andre skal varsles om.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentVarsledeBrukere(hendelse_id, callback) {
    super.query(
      'SELECT epost FROM privat p ' + 
      'INNER JOIN bruker b ON p.bruker_id = b.bruker_id ' +
      'INNER JOIN kommuner k ON b.kommune_id = k.kommune_id ' +
      'INNER JOIN fylker f ON k.fylke_navn = f.fylke_navn ' +
      'WHERE p.hendelsevarsling = 1 ' +
      'AND k.fylke_navn LIKE ' +
      '(SELECT f.fylke_navn from fylker f INNER JOIN kommuner k ON f.fylke_navn = k.fylke_navn INNER JOIN hendelser h ON h.kommune_id = k.kommune_id WHERE h.hendelse_id = ?)',
      [hendelse_id],
      callback
    );
  }

  /**
   * Oppdaterer en allerede eksisterende hendelse.
   * @param {json} json - En json bestående av de nye verdiene til hendelsen.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  oppdaterHendelse(json, callback) {
    var hendelse = [
      json.hendelseskategori_id,
      json.kommune_id,
      json.overskrift,
      json.tid,
      json.beskrivelse,
      json.sted,
      json.bilde,
      json.billett,
      json.hendelse_id
    ];
    super.query(
      'UPDATE hendelser SET hendelseskategori_id = ?, kommune_id = ?, overskrift = ?, tid = ?, beskrivelse = ?, sted = ?, bilde = ?, billett = ? WHERE hendelse_id = ?',
      hendelse,
      callback
    );
  }

  /**
   * Sletter en hendelse fra databasen. 
   * @param {number} h_id - Iden til hendelsen du skal slette.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  slettHendelse(h_id, callback) {
    super.query('DELETE FROM hendelser WHERE hendelse_id = ?', [h_id], callback);
  }

  //testes
  /**
   * Henter ut hendelser fra databasen filtrert på hendelseskategorier.
   * @param {number} hk_id - Iden til hendelseskategorien du vil filtrere hendelser på.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  filtrerHendelserPaaKategori(hk_id, callback) {
    super.query(
      "SELECT hendelse_id, overskrift, billett, DATE_FORMAT(tid, '%Y-%m-%d %H:%i') AS tid, sted, bilde FROM hendelser WHERE hendelseskategori_id = ?",
      [hk_id],
      callback
    );
  }

  /**
   * Metode for å hente ut hendelser filtrert på tid.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  filtrerHendelserPaaTid(callback) {
    super.query(
      "SELECT hendelse_id, overskrift, billett, DATE_FORMAT(tid, '%Y-%m-%d %H:%i') AS tid, sted, bilde FROM hendelser ORDER BY tid ASC",
      null,
      callback
    );
  }

  //testes
  /**
   * Metode for å hente ut hendelser filtrert på kommune.
   * @param {number} kommune_id - Iden til kommunen du vil filtrere hendelser på.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  filtrerHendelserPaaKommune(kommune_id, callback) {
    super.query(
      "SELECT hendelse_id, overskrift, billett, DATE_FORMAT(tid, '%Y-%m-%d %H:%i') AS tid, sted, bilde FROM hendelser WHERE kommune_id = ? ORDER BY tid ASC",
      [kommune_id],
      callback
    );
  }

  //testes
  /**
   * Metode som henter ut alle hendelseskategoriene
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentAlleHendelseskategorier(callback){
    super.query('SELECT * FROM hendelseskategori', null, callback);
  }

  //testes
  /**
   * Metode for å opprette en ny hendelseskategori.
   * @param {string} kategorinavn - Navnet på den nye hendelseskategorien.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  nyHendelseskategori(kategorinavn, callback) {
    super.query('INSERT INTO hendelseskategori (kategorinavn) VALUES (?)', [kategorinavn], callback);
  }

  /**
   * Metode for å slette en hendelseskategori.
   * @param {number} hendelseskategori_id - Iden til hendelseskategorien du vil slette
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  slettHendelseskategori(hendelseskategori_id, callback) {
    super.query('DELETE FROM hendelseskategori WHERE hendelseskategori_id = ?', [hendelseskategori_id], callback);
  }

  //testes
  /**
   * Metode for å opprette et abonnement på en hendelse for en bruker.
   * @param {json} json - En json med iden til hendelsen som skal følges og iden til brukeren som vil abonnere på den.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  abonnerHendelse(json, callback) {
    super.query("INSERT INTO hendfolg (hendelse_id, bruker_id) VALUES (?, ?)", [json.hendelse_id, json.bruker_id], callback);
  }

  /**
   * Metode for å avslutte abonnement på en hendelse.
   * @param {json} json - En json med iden til hendelsen og iden til brukeren.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  ikkeAbonnerHendelse(json, callback) {
    super.query("DELETE FROM hendfolg WHERE hendelse_id=? AND bruker_id=?", [json.hendelse_id, json.bruker_id], callback);
  }
}