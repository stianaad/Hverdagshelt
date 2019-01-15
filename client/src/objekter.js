//objekter for lagring/oppdatering/oppretting
module.exports = class Fylke {
  constructor(fylke_navn) { this.fylke_navn = fylke_navn; }
}

module.exports = class Kommune {
  constructor(
    kommune_id,
    kommune_navn,
    fylke_navn
  ) {
    this.kommune_id = kommune_id;
    this.kommune_navn = kommune_navn;
    this.fylke_navn = fylke_navn;
  }
}

class Bruker {
  constructor(
    bruker_id,
    epost,
    passord,
    kommune_id
  ) {
    this.bruker_id = bruker_id;
    this.epost = epost;
    this.passord = passord;
    this.kommune_id = kommune_id;
  }
}

module.exports = class Privat extends Bruker {
  constructor(
    bruker_id,
    epost,
    passord,
    kommune_id,
    fornavn,
    etternavn
  ) {
    super(bruker_id, epost, passord, kommune_id);
    this.fornavn = fornavn;
    this.etternavn = etternavn; 
  }
}

module.exports = class Ansatt extends Bruker {
  constructor(
    bruker_id,
    epost,
    passord,
    fornavn, 
    etternavn,
    telefon
  ) {
    super(bruker_id, epost, passord, kommune_id);
    this.fornavn = fornavn;
    this.etternavn = etternavn; 
    this.telefon = telefon;
  }
}

module.exports = class Bedrift extends Bruker () {
  constructor(
    bruker_id,
    epost,
    passord,
    kommune_id,
    orgnr, 
    navn,
    telefon
  ) {
    super(bruker_id, epost, passord, kommune_id);
    this.orgnr = orgnr;
    this.navn = navn; 
    this.telefon = telefon;
  }
}

module.exports = class Admin extends Bruker () {
  constructor(
    bruker_id,
    epost,
    passord,
    kommune_id,
    telefon, 
    navn
  ) {
    super(bruker_id, epost, passord, kommune_id);
    this.telefon = telefon;
    this.navn = navn;
  }
}

module.exports = class Hovedkategori {

  constructor(hovedkategori_id, kategorinavn) {
    this.hovedkategori_id = hovedkategori_id;
    this.kategorinavn = kategorinavn;
  }
}

module.exports = class Subkategori {
  constructor(subkategori_id, kategorinavn, hovedkategori_id) {
    this.subkategori_id = subkategori_id;
    this.kategorinavn = kategorinavn;
    this.hovedkategori_id = hovedkategori_id;
  }
}

module.exports = class Status {
  constructor(status_id, status) {
    this.status_id = status_id;
    this.status = status;
  }
}

module.exports = class Feil {

  constructor(
    feil_id,
    kommune_id,
    subkategori_id,
    overskrift,
    beskrivelse,
    lengdegrad,
    breddegrad
  ) {
    this.feil_id = feil_id;
    this.kommune_id = kommune_id;
    this.subkategori_id = subkategori_id;
    this.overskrift = overskrift;
    this.beskrivelse = beskrivelse; 
    this.lengdegrad = lengdegrad; 
    this.breddegrad = breddegrad; 
  }
}

module.exports = class Oppdatering {

  constructor(
  feil_id,
  tid,
  kommentar,
  status_id,
  bruker_id
  ) {
    this.feil_id = feil_id;
    this.tid = tid;
    this.kommentar = kommentar;
    this.status_id = status_id;
    this.bruker_id = bruker_id;
  }
}

module.exports = class Hendelseskategori {
  constructor(hendelseskategori_id, kategorinavn) {
    this.hendelseskategori_id = hendelseskategori_id;
    this.kategorinavn = kategorinavn;
  }
}

module.exports = class Hendelse {

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

