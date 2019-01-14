import api from './api';

module.exports = class Feil {

  constructor(
    kommune_id,
    kategori_id,
    status_id,
    beskrivelse,
    bilde,
    lengdegrad,
    breddegrad
  ) {
    this.kommune_id = kommune_id;
    this.kategori_id = kategori_id;
    this.status_id = status_id;
    this.beskrivelse = beskrivelse; 
    this.bilde = bilde;
    this.lengdegrad = lengdegrad; 
    this.breddegrad = breddegrad; 
  }
}

export class Oppdatering {

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

class FeilService {

  hentAlleFeil() {
    return api.get('/api/hentAlleFeil');
  }

  hentEnFeil(feil_id) {
    return api.get('/api/hentEnFeil', feil_id);
  }

  hentFeilFraStatus(status_id) {
    return api.get('/api/hentFeilStatus', status_id);
  }

  lagNyFeil(nyFeil) {
    return api.post('/api/lagNyFeil', nyFeil);
  }

  oppdaterFeil(oppdatertFeil) {
    return api.post('/api/oppdaterFeil', oppdatertFeil);
  }

  settNyStatusTilFeil(input) {
    return api.post('/api/endreStatusFeil', input);
  }

  slettFeil(feil_id) {
    return api.post('/api/slettFeil', feil_id);
  }

  hentEnKategori(kat_id) {
    return api.get('/api/hentEnKategori', kat_id);
  }

  hentAlleKategorier() {
    return api.get('/api/hentAlleKategorier');
  }

  nyOppdatering(nyOpp) {
    return api.post('/api/lagOppdatering', nyOpp);
  }

  hentAlleOppdateringerPaaFeil(feil_id) {
    return api.get('/api/hentAlleOppdateringerPaaFeil', feil_id);
  }

  hentEnStatus(status_id) {
    return api.get('/api/hentEnStatus', status_id);
  }

  hentAlleStatuser() {
    return api.get('/api/hentAlleStatuser');
  }

  hentAlleHovedkategorier() {
    return api.get('/api/hentAlleHovedkategorier');
  }

  hentAlleSubkategorierPaaHovedkategori(hk_id) {
    return api.get('/api/hentAlleSubKategorierPaaHovedkategori', hk_id)
  }
}

export let feilService = new FeilService();