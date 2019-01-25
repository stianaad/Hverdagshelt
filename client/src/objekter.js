//objekter for lagring/oppdatering/oppretting

/**
 * Fylke dataobjekt
 */
export class Fylke {
  constructor(fylke_navn) {
    this.fylke_navn = fylke_navn;
  }
}

/**
 * Kommune dataobjekt
 */
export class Kommune {
  constructor(kommune_id, kommune_navn, fylke_navn) {
    this.kommune_id = kommune_id;
    this.kommune_navn = kommune_navn;
    this.fylke_navn = fylke_navn;
  }
}

/**
 * Bruker dataobjekt
 */
class Bruker {
  /**
   * @param {number} bruker_id 
   * @param {string} epost 
   * @param {string} passord 
   * @param {number} kommune_id 
   */
  constructor(bruker_id, epost, passord, kommune_id) {
    /**
     * @type {number}
     */
    this.bruker_id = bruker_id;

    /**
     * @type {string}
     */
    this.epost = epost;

    /**
     * @type {string}
     */
    this.passord = passord;

    /**
     * @type {number}
     */
    this.kommune_id = kommune_id;
  }
}


/**
 * Privatbruker dataobjekt
 */
export class Privat extends Bruker {
  /**
   * @param {number} bruker_id 
   * @param {string} epost 
   * @param {string} passord 
   * @param {number} kommune_id 
   * @param {string} fornavn 
   * @param {string} etternavn 
   * @param {boolean} hendelsevarsling - Hvis bruker skal følge alle hendelser i sitt fylke
   */
  constructor(bruker_id, epost, passord, kommune_id, fornavn, etternavn, hendelsevarsling) {
    super(bruker_id, epost, passord, kommune_id);
    /**
     * @type {string}
     */
    this.fornavn = fornavn;

    /**
     * @type {string}
     */
    this.etternavn = etternavn;

    /**
     * @type {boolean}
     */
    this.hendelsevarsling = hendelsevarsling;
  }
}

/**
 * Ansatt-bruker dataobjekt
 */
export class Ansatt extends Bruker {
  /**
   * @param {number} bruker_id 
   * @param {string} epost 
   * @param {string} passord 
   * @param {number} kommune_id 
   * @param {string} fornavn 
   * @param {string} etternavn 
   * @param {string} telefon 
   */
  constructor(bruker_id, epost, passord, fornavn, etternavn, telefon) {
    super(bruker_id, epost, passord, kommune_id);

    /**
     * @type {string}
     */
    this.fornavn = fornavn;

    /**
     * @type {string}
     */
    this.etternavn = etternavn;

    /**
     * @type {string}
     */
    this.telefon = telefon;
  }
}

/**
 * Bedrift-bruker dataobjekt
 */
export class Bedrift extends Bruker {
  /**
   * @param {number} bruker_id 
   * @param {string} epost 
   * @param {string} passord 
   * @param {number} kommune_id 
   * @param {number} orgnr - Organisasjonsnummeret til bedriften
   * @param {string} navn - Navnet på bedriften
   * @param {string} telefon - Kontaktnummer til bedriften
   */
  constructor(bruker_id, epost, passord, kommune_id, orgnr, navn, telefon) {
    super(bruker_id, epost, passord, kommune_id);

    /**
     * @type {number}
     */
    this.orgnr = orgnr;

    /**
     * @type {string}
     */
    this.navn = navn;

    /**
     * @type {string}
     */
    this.telefon = telefon;
  }
}

/**
 * Admin-bruker dataobjekt
 */
export class Admin extends Bruker {
  /**
   * @param {number} bruker_id 
   * @param {string} epost 
   * @param {string} passord 
   * @param {number} kommune_id 
   * @param {string} navn - Navnet på adminkontoen
   * @param {string} telefon - Kontaktnummer til adminbruker
   */
  constructor(bruker_id, epost, passord, kommune_id, telefon, navn) {
    super(bruker_id, epost, passord, kommune_id);

    /**
     * @type {string}
     */
    this.telefon = telefon;

    /**
     * @type {string}
     */
    this.navn = navn;
  }
}

/**
 * @ignore
 */
export class Hovedkategori {
  constructor(hovedkategori_id, kategorinavn) {
    this.hovedkategori_id = hovedkategori_id;
    this.kategorinavn = kategorinavn;
  }
}

/**
 * @ignore
 */
export class Subkategori {
  constructor(subkategori_id, kategorinavn, hovedkategori_id) {
    this.subkategori_id = subkategori_id;
    this.kategorinavn = kategorinavn;
    this.hovedkategori_id = hovedkategori_id;
  }
}

/**
 * @ignore
 */
export class Status {
  constructor(status_id, status) {
    this.status_id = status_id;
    this.status = status;
  }
}

/**
 * Feil dataobjekt
 */
export class Feil {
  /**
   * @param {number} feil_id 
   * @param {number} bruker_id 
   * @param {number} kommune_id 
   * @param {number} subkategori_id 
   * @param {string} overskrift 
   * @param {string} beskrivelse 
   * @param {number} lengdegrad 
   * @param {number} breddegrad 
   * @param {string} tid 
   * @param {string} kategorinavn 
   * @param {string} status 
   * @param {string} fylke_navn 
   * @param {string} kommune_navn 
   */
  constructor(feil_id, bruker_id, kommune_id, subkategori_id, overskrift, beskrivelse, lengdegrad, breddegrad, tid, kategorinavn, status, fylke_navn, kommune_navn) {
    /**
     * @type {number}
     */
    this.feil_id = feil_id;

    /**
     * @type {number}
     */
    this.bruker_id = bruker_id;

    /**
     * @type {number}
     */
    this.kommune_id = kommune_id;

    /**
     * @type {number}
     */
    this.subkategori_id = subkategori_id;

    /**
     * @type {string}
     */
    this.overskrift = overskrift;

    /**
     * @type {string}
     */
    this.beskrivelse = beskrivelse;

    /**
     * @type {number}
     */
    this.lengdegrad = lengdegrad;

    /**
     * @type {number}
     */
    this.breddegrad = breddegrad;

    /**
     * @type {string}
     */
    this.tid = tid;

    /**
     * @type {string}
     */
    this.kategorinavn = kategorinavn;

    /**
     * @type {string}
     */
    this.status = status;

    /**
     * @type {string}
     */
    this.fylke_navn = fylke_navn;

    /**
     * @type {string}
     */
    this.kommune_navn = kommune_navn;
  }
}

/**
 * Dataobjekt for oppdateringer på feil. Hentet via feil_id og har kun informasjon om selve oppdateringen.
 */
export class Oppdatering {
  /**
   * @param {string} kommentar 
   * @param {string} status 
   * @param {string} tid 
   */
  constructor(kommentar, status, tid) {

    /**
     * @type {string}
     */
    this.tid = tid;

    /**
     * @type {string}
     */
    this.kommentar = kommentar;

    /**
     * @type {string}
     */
    this.status = status;
  }
}

export class Hendelseskategori {
  constructor(hendelseskategori_id, kategorinavn) {
    this.hendelseskategori_id = hendelseskategori_id;
    this.kategorinavn = kategorinavn;
  }
}

export class Hendelse {
  constructor(
    hendelse_id,
    bruker_id,
    hendelseskategori_id,
    overskrift,
    tid,
    beskrivelse,
    sted,
    bilde,
    lengdegrad,
    breddegrad
  ) {
    this.hendelse_id = hendelse_id;
    this.bruker_id = bruker_id;
    this.hendelseskategori_id = hendelseskategori_id;
    this.overskrift = overskrift;
    this.tid = tid;
    this.beskrivelse = beskrivelse;
    this.sted = sted;
    this.bilde = bilde;
    this.lengdegrad = lengdegrad;
    this.breddegrad = breddegrad;
  }
}
