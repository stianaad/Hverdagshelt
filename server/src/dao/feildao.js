import Dao from './dao.js';

//DAO som omfatter alt som innebærer feil, det vil også si oppdateringer, statuser og kategorier
// 9 av 30 funksjoner testes
module.exports = class FeilDao extends Dao {

  /**
   * Henter alle godkjente feil i en spesifisert kommune fra databasen.
   * @example
   * feilDao.hentGodkjenteFeilForKommune(289, (status, data) => {});
   * @param {number} kommune_id - iden til kommunen du vil hente godkjente feil fra.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentGodkjenteFeilForKommune(kommune_id, callback) {
    super.query("SELECT feil.*, hovedkategori.kategorinavn, status.status, DATE_FORMAT(f.tid, '%Y.%m.%d %H:%i') AS tid, kommuner.kommune_navn, kommuner.fylke_navn FROM feil INNER JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id INNER JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id INNER JOIN(SELECT feil_id, MIN(tid) AS tid FROM oppdatering GROUP BY feil_id) AS f ON feil.feil_id = f.feil_id INNER JOIN (SELECT status_id, feil_id, tid FROM oppdatering WHERE (feil_id , tid) IN (SELECT feil_id, MAX(tid) AS tid FROM oppdatering GROUP BY feil_id)) AS s ON feil.feil_id = s.feil_id INNER JOIN status ON status.status_id = s.status_id INNER JOIN kommuner ON kommuner.kommune_id = feil.kommune_id WHERE feil.kommune_id = ? AND s.status_id > 1 ORDER BY f.tid DESC;", [kommune_id], callback);
  }

  //testes
  /**
   *Henter alle feil fra databasen
   * @param {function} callback - funksjonen som kalles når databasekallet har kjørt.
   */
  hentAlleFeil(callback) {
    super.query(
      "SELECT feil.*, hovedkategori.kategorinavn, status.status, DATE_FORMAT(f.tid, '%Y.%m.%d %H:%i') AS tid, kommuner.kommune_navn, kommuner.fylke_navn FROM feil INNER JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id INNER JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id INNER JOIN(SELECT feil_id, MIN(tid) AS tid FROM oppdatering GROUP BY feil_id) AS f ON feil.feil_id = f.feil_id INNER JOIN (SELECT status_id, feil_id, tid FROM oppdatering WHERE (feil_id , tid) IN (SELECT feil_id, MAX(tid) AS tid FROM oppdatering GROUP BY feil_id)) AS s ON feil.feil_id = s.feil_id INNER JOIN status ON status.status_id = s.status_id INNER JOIN kommuner ON kommuner.kommune_id = feil.kommune_id ORDER BY f.tid DESC;",
      null,
      callback
    );
  }

  /**
   * Henter alle feil i en spesifisert kommune fra databasen.
   * @example
   * feilDao.hentGodkjenteFeilForKommune(1, (callback) => {dinFunksjon});
   * @param {number} kommune_id - iden til kommunen du vil hente godkjente feil fra.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentFeilForKommune(kommune_id, callback) {
    super.query("SELECT feil.*, hovedkategori.kategorinavn, status.status, DATE_FORMAT(f.tid, '%Y.%m.%d %H:%i') AS tid, kommuner.kommune_navn, kommuner.fylke_navn FROM feil INNER JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id INNER JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id INNER JOIN(SELECT feil_id, MIN(tid) AS tid FROM oppdatering GROUP BY feil_id) AS f ON feil.feil_id = f.feil_id INNER JOIN (SELECT status_id, feil_id, tid FROM oppdatering WHERE (feil_id , tid) IN (SELECT feil_id, MAX(tid) AS tid FROM oppdatering GROUP BY feil_id)) AS s ON feil.feil_id = s.feil_id INNER JOIN status ON status.status_id = s.status_id INNER JOIN kommuner ON kommuner.kommune_id = feil.kommune_id WHERE feil.kommune_id = ? ORDER BY f.tid DESC;", [kommune_id], callback);
  }

  //testes
  /**
   * Henter all informasjonen til en spesifisert feil fra databasen.
   * @example
   * feilDao.hentEnFeil(7, (status, data) => {dinFunksjon});
   */
  hentEnFeil(feil_id, callback) {
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

  /**
   * Legger til opplastede bilder til databasen. De legges i en tabell med bilde_id, feil_id og url til bilde.
   * @example
   * feilDao.leggTilBilder(1, [dineBilder], (status, data) => {dinFunksjon});
   * @param {number} feil_id - iden til feilen bildene tilhører.
   * @param {array} bilder - en array av urlene til bildene.
   */
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

  /**
   * Funksjon som henter alle bildene som tilhører en feil.
   * @example
   * feilDao.hentBilderTilFeil(2, (status, data) => {dinFunksjon});
   * @param {number} feil_id - iden til feilen du vil hente bilder fra.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentBilderTilFeil(feil_id, callback) {
    super.query('SELECT * FROM feilbilder WHERE feil_id=?', [feil_id], callback);
  }

  //testes
  /**
   * Funksjon for å oppdatere en feil med nye verdier.
   * @example
   * feilDao.oppdaterFeil(dinOppdaterteFeil, (status, data) => {dinFunksjon});
   * @param {json} json - en json bestående av alle parameterne feilobjektet skal oppdateres med 
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  oppdaterFeil(json, callback) {
    var feil = [
      json.subkategori_id,
      json.overskrift,
      json.beskrivelse,
      json.lengdegrad,
      json.breddegrad,
      json.feil_id,
    ];
    super.query(
      'UPDATE feil SET subkategori_id = ?, overskrift = ?, beskrivelse = ?, lengdegrad = ?, breddegrad = ? WHERE feil_id = ?',
      feil,
      callback
    );
  }

  /**
   * Sjekker om personen opprettet feilen, brukes for å bestemme om brukeren skal gis mulighet til og redigere. 
   * @param {json} json - En json bestående av brukeriden og feiliden.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  sjekkFeilPaaBruker(json, callback) {
    super.query(
      'SELECT * FROM feil WHERE bruker_id = ? AND feil_id = ?',
      [json.bruker_id, json.feil_id],
      callback
    );
  }

  //testes, men trenger on delete cascade
  /**
   * Sletter en feil fra databasen, er forebeholdt ansatte og admins. 
   * @param {number} feil_id - Iden til feilen du vil slette
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  slettFeil(feil_id, callback) {
    console.log('Sletter en feil');
    super.query('DELETE FROM feil WHERE feil_id = ?', [feil_id], callback);
  }

  /**
   * Oppretter en ny feiloppdatering i databasen. 
   * @param {json} json - En json bestående av feilid, kommentar til oppdateringen, ny status og den ansvarliges brukerid. 
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  lagOppdatering(json, callback) {
    var oppdatering = [json.feil_id, json.kommentar, json.status_id, json.bruker_id];
    super.query(
      'INSERT INTO oppdatering (feil_id, kommentar, status_id, bruker_id) VALUES (?, ?, ?, ?)',
      oppdatering,
      callback
    );
  }

  //testes
  /**
   * Henter alle oppdateringene som er lagret på en feil fra databasen.
   * @param {number} feil_id - Iden til feilen du vil hente oppdateringer fra.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentAlleOppdateringerPaaFeil(feil_id, callback) {
    super.query("SELECT kommentar,status,DATE_FORMAT(tid, '%Y.%m.%d %H:%i') AS tid FROM oppdatering,status WHERE oppdatering.status_id=status.status_id AND feil_id = ? ORDER BY tid ASC", [feil_id], callback);
  }

  /**
   * Sletter en oppdatering fra databasen
   * @param {number} oppdatering_id - Iden til oppdateringen vi vil slette.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  slettOppdatering(oppdatering_id, callback) {
    super.query(
      'DELETE FROM oppdatering WHERE oppdatering_id = ?',
      [oppdatering_id],
      callback
    );
  }

  //testes
  /**
   * Finner en status på id
   * @param {json} json - En json som inneholder iden til statusen vi skal hente.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentEnStatus(status_id, callback) {
    super.query('SELECT * FROM status WHERE status_id = ?', [status_id], callback);
  }

  //testes
  /**
   * Henter all dataen som ligger i status tabellen.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentAlleStatuser(callback) {
    super.query('SELECT * FROM status', null, callback);
  }

  //testes
  /**
   * Henter all dataen som ligger i hovedkategorier tabellen
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentAlleHovedkategorier(callback) {
    super.query('SELECT * FROM hovedkategori', null, callback);
  }

  /**
   * Henter alle feil filtrert på hovedkategori
   * @param {number} hovedkategori_id - Hovedkategori iden vi skal filtrere på. 
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentFeilFiltrertKategori(hovedkategori_id, callback) {
    super.query(
      'SELECT feil.*,hovedkategori.hovedkategori_id,hovedkategori.kategorinavn AS kategorinavn FROM feil, subkategori,hovedkategori WHERE feil.subkategori_id=subkategori.subkategori_id AND subkategori.hovedkategori_id=hovedkategori.hovedkategori_id AND hovedkategori.hovedkategori_id=?',
      [hovedkategori_id],
      callback
    );
  }

  //testes
  /**
   * Henter alle subkategoriene filtrert på hovedkategori.
   * @param {number} hovedkategori_id - Iden til hovedkategorien vi vil finne subkategoriene til.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentAlleSubKategorierPaaHovedkategori(hovedkategori_id, callback) {
    super.query('SELECT * FROM subkategori WHERE hovedkategori_id = ?', [hovedkategori_id], callback);
  }

  //testes
  /**
   * Henter alle subkategoriene fra databasen.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentAlleSubkategorier(callback) {
    super.query('SELECT subkategori.*, hovedkategori.kategorinavn as hovednavn FROM subkategori JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id', null, callback);
  }

  //testes
  /**
   * Sletter et bilde som er registrert på feil.
   * @param {number} bilde_id - Iden til bildet som skal slettes.
   * @param {number} feil_id - Iden til feilen bildet skal slettes fra.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  slettBildeFraFeil(bilde_id, feil_id, callback) {
    var info = [bilde_id, feil_id];
    super.query('DELETE FROM feilbilder WHERE bilde_id = ? AND feil_id = ?', info, callback);
  }

  /**
   * Sletter en subkategori, eksplisitt for admin.
   * @param {number} subkategori_id - Iden til subkategorien som skal slettes.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  slettSubkategori(subkategori_id, callback) {
    super.query('DELETE FROM subkategori WHERE subkategori_id = ?', [subkategori_id], callback);
  }

  //testes
  /**
   * Oppretter en ny subkategori, eksplisitt for admin.
   * @param {json} json - En json med hovedkategori_id og subkategorinavnet.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  nySubkategori(json, callback) {
    var info = [json.kategorinavn, json.hovedkategori_id];
    super.query('INSERT INTO subkategori (kategorinavn, hovedkategori_id) VALUES (?,?)', info, callback);
  }

  /**
   * Oppretter en ny hovedkategori, eksplisitt for admin.
   * @param {string} json - En json med hovedkategorinavnet.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  nyHovedkategori(kategorinavn, callback) {
    super.query('INSERT INTO hovedkategori (kategorinavn) VALUES (?)', [kategorinavn], callback);
  }

  //testes
  /**
   * Sletter en hovedkategori, eksplisitt for admin.
   * @param {number} hovedkategori_id - Iden til hovedkategorien som skal slettes.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  slettHovedkategori(hovedkategori_id, callback) {
    super.query('DELETE FROM hovedkategori WHERE hovedkategori_id = ?', [hovedkategori_id], callback);
  }

  /**
   * Henter nye feil som er blitt sendt til en spesifikk bedrift.
   * @param {number} bruker_id - Iden til bedriftsbrukeren som skal hente sine nye oppgaver.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentNyeFeilTilBedrift(bruker_id, callback) {
    super.query(
      /*"SELECT feil.*, hovedkategori.kategorinavn, DATE_FORMAT(f.tid, '%Y.%m.%d %H:%i') AS tid, kommuner.kommune_navn, kommuner.fylke_navn FROM feil INNER JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id INNER JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id INNER JOIN(SELECT feil_id, MIN(tid) AS tid FROM oppdatering GROUP BY feil_id) AS f ON feil.feil_id = f.feil_id INNER JOIN (SELECT feil_id, ANY_VALUE(status_id) AS status_id, MAX(tid) AS tid FROM oppdatering GROUP BY feil_id) AS s ON feil.feil_id = s.feil_id INNER JOIN status ON status.status_id = s.status_id INNER JOIN kommuner ON kommuner.kommune_id = feil.kommune_id INNER JOIN jobbSoknad ON feil.feil_id=jobbSoknad.feil_id AND jobbSoknad.bruker_id=? AND jobbSoknad.status=3"*/
      "SELECT feil.*, hovedkategori.kategorinavn,status.status, DATE_FORMAT(f.tid, '%Y.%m.%d %H:%i') AS tid, kommuner.kommune_navn, kommuner.fylke_navn FROM feil INNER JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id INNER JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id INNER JOIN(SELECT feil_id, MAX(tid) AS tid FROM oppdatering GROUP BY feil_id) AS f ON feil.feil_id = f.feil_id INNER JOIN (SELECT feil_id, Max(status_id) AS status_id, MAX(tid) AS tid FROM oppdatering GROUP BY feil_id) AS s ON feil.feil_id = s.feil_id INNER JOIN status ON status.status_id = s.status_id INNER JOIN kommuner ON kommuner.kommune_id = feil.kommune_id INNER JOIN jobbSoknad ON feil.feil_id=jobbSoknad.feil_id AND jobbSoknad.bruker_id=? AND jobbSoknad.status=3",
      [bruker_id],
      callback
    );
  }

  /**
   * Henter infoen til en bedrift på orgnr. 
   * @param {number} orgnr - Organisasjonsnummeret til bedrifter.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentBedriftPaaOrgnr(orgnr, callback) {
    super.query('SELECT * FROM bedrift WHERE orgnr = ?', [orgnr], callback);
  }

  /**
   * Sender en feil til en bedrift.
   * @param {json} json - inneholder iden til bedriftsbrukeren og feilen som skal sendes.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  sendFeilTilBedrift(json, callback) {
    super.query(
      "INSERT INTO jobbSoknad (bruker_id, feil_id) VALUES (?,?)",
      [json.bruker_id, json.feil_id],
      callback
    );
  }

  /**
   * Henter statusen på en feil som er sendt til bedrift.
   * @param {number} feil_id - iden til feilen som vi skal statussjekke.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentJobbSoknadStatus(feil_id, callback) {
    super.query('SELECT * FROM jobbSoknad WHERE feil_id = ?', [feil_id], callback);
  }

  /**
   * Finner kommune-iden til en spesifisert feil.
   * @param {number} feil_id - Iden til feilen vi vil finne kommunen til. 
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  finnKommuneidPaaFeil(feil_id, callback) {
    super.query('SELECT kommune_id FROM feil WHERE feil_id = ?', [feil_id], callback);
  }

  /**
   * Henter alle feilene til en bedrift som er under behandling
   * @param {number} bruker_id - Iden til bedriftsbrukeren vi vil finne feilene til.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentUnderBehandlingFeilTilBedrift(bruker_id, callback) {
    super.query(
      "SELECT feil.*, hovedkategori.kategorinavn,status.status, DATE_FORMAT(f.tid, '%Y.%m.%d %H:%i') AS tid, kommuner.kommune_navn, kommuner.fylke_navn FROM feil INNER JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id INNER JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id INNER JOIN(SELECT feil_id, MAX(tid) AS tid FROM oppdatering GROUP BY feil_id) AS f ON feil.feil_id = f.feil_id INNER JOIN (SELECT feil_id, Max(status_id) AS status_id, MAX(tid) AS tid FROM oppdatering GROUP BY feil_id) AS s ON feil.feil_id = s.feil_id INNER JOIN status ON status.status_id = s.status_id INNER JOIN kommuner ON kommuner.kommune_id = feil.kommune_id INNER JOIN jobbSoknad ON feil.feil_id=jobbSoknad.feil_id AND jobbSoknad.bruker_id=? AND jobbSoknad.status=4 AND status.status_id=3",
      [bruker_id],
      callback
    );
  }

  //testes
  /**
   * Henter alle feilene til en bedrift som er ferdige.
   * @param {number} bruker_id - Iden til bedriftsbrukeren vi vil finne feilene til.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentFerdigeFeilTilBedrift(bruker_id, callback) {
    super.query(
      "SELECT feil.*, hovedkategori.kategorinavn,status.status, DATE_FORMAT(f.tid, '%Y.%m.%d %H:%i') AS tid, kommuner.kommune_navn, kommuner.fylke_navn FROM feil INNER JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id INNER JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id INNER JOIN(SELECT feil_id, MAX(tid) AS tid FROM oppdatering GROUP BY feil_id) AS f ON feil.feil_id = f.feil_id INNER JOIN (SELECT feil_id, Max(status_id) AS status_id, MAX(tid) AS tid FROM oppdatering GROUP BY feil_id) AS s ON feil.feil_id = s.feil_id INNER JOIN status ON status.status_id = s.status_id INNER JOIN kommuner ON kommuner.kommune_id = feil.kommune_id INNER JOIN jobbSoknad ON feil.feil_id=jobbSoknad.feil_id AND jobbSoknad.bruker_id=? AND jobbSoknad.status=4 AND status.status_id=4",
      [bruker_id],
      callback
    );
  }

  /**
   * Oppdaterer statusen til en feil som er sendt til bedrift.
   * @param {json} json - En json som inneholder statusen og feil-iden.
   * @param {number} bruker_id - Iden til bedriftsbrukeren som skal oppdatere status.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  oppdaterStatusFeilTilBedrift(json, bruker_id, callback) {
    let tabell = [json.status, bruker_id, json.feil_id];
    super.query('UPDATE jobbSoknad SET status=? WHERE bruker_id=? AND feil_id=?', tabell, callback);
  }

  //testes
  /**
   * Legger inn et abonnement på en feil for en bruker. 
   * @param {json} json - En json med feil-id og bruker-id.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  abonnerFeil(json, callback) {
    super.query("INSERT INTO feilfolg (feil_id, bruker_id) VALUES (?, ?)", [json.feil_id, json.bruker_id], callback);
  }

  //testes
  /**
   * Sletter ett abonnement på en feil for en bruker.
   * @param {json} json - En json med feil-id og bruker-id.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  ikkeAbonnerFeil(json, callback) {
    super.query("DELETE FROM feilfolg WHERE feil_id=? AND bruker_id=?", [json.feil_id, json.bruker_id], callback);
  }

  hentEpostFraFeilID(json, callback) {
    super.query('SELECT epost FROM bruker b INNER JOIN feil f ON b.bruker_id = f.bruker_id WHERE f.feil_id = ?', [json.feil_id], callback);
  }
  
  /**
   * Oppdaterer statusen til en feil som er sendt til bedrift.
   * @param {number} kommune_id - Iden til bedriftsbrukeren som skal oppdatere status.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
  hentUnderBehandlingOgVenterPaaSvarAnsatt(kommune_id,callback){
    super.query(
      "SELECT feil.*, hovedkategori.kategorinavn,status.status, navn, DATE_FORMAT(f.tid, '%Y.%m.%d %H:%i') AS tid, kommuner.kommune_navn, kommuner.fylke_navn FROM feil INNER JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id INNER JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id INNER JOIN(SELECT feil_id, MAX(tid) AS tid FROM oppdatering GROUP BY feil_id) AS f ON feil.feil_id = f.feil_id INNER JOIN (SELECT feil_id, Max(status_id) AS status_id, MAX(tid) AS tid FROM oppdatering GROUP BY feil_id) AS s ON feil.feil_id = s.feil_id INNER JOIN status ON status.status_id = s.status_id INNER JOIN kommuner ON kommuner.kommune_id = feil.kommune_id INNER JOIN jobbSoknad ON feil.feil_id=jobbSoknad.feil_id INNER JOIN bedrift ON jobbSoknad.bruker_id=bedrift.bruker_id AND ((jobbSoknad.status=3 AND status.status_id=2) OR (jobbSoknad.status=4 AND status.status_id=3) ) AND feil.kommune_id=?",
      [kommune_id],
      callback
    );
  }
};
