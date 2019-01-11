import axios from 'axios';
axios.interceptors.response.use((response) => response.data);

export let feilService = new FeilService();

export class Feil {
  kommune_id;
  kategori_id;
  status_id;
  beskrivelse;
  bilde;
  lengdegrad;
  breddegrad;
  kategorinavn;
  
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
  feil_id;
  tid;
  kommentar;
  status_id;
  bruker_id;
  
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
    return axios.get('/api/hentAlleFeil');
  }

  hentEnFeil(feil_id) {
    return axios.get('/api/hentEnFeil', feil_id);
  }

  hentFeilFraStatus(status_id) {
    return axios.get('/api/hentFeilStatus', status_id);
  }

  lagNyFeil(nyFeil) {
    return axios.post('/api/lagNyFeil', nyFeil);
  }

  oppdaterFeil(oppdatertFeil) {
    return axios.post('/api/oppdaterFeil', oppdatertFeil);
  }

  settNyStatusTilFeil(input) {
    return axios.post('/api/endreStatusFeil', input);
  }

  slettFeil(feil_id) {
    return axios.post('/api/slettFeil', feil_id);
  }

  hentEnKategori(kat_id) {
    return axios.get('/api/hentEnKategori', kat_id);
  }

  hentAlleKategorier() {
    return axios.get('/api/hentAlleKategorier');
  }

  nyOppdatering(nyOpp) {
    return axios.post('/api/lagOppdatering', nyOpp);
  }

  hentAlleOppdateringerPaaFeil(feil_id) {
    return axios.get('/api/hentAlleOppdateringerPaaFeil', feil_id);
  }

  hentEnStatus(status_id) {
    return axios.get('/api/hentEnStatus', status_id);
  }

  hentAlleStatuser() {
    return axios.get('/api/hentAlleStatuser');
  }

  hentAlleHovedkategorier() {
    return axios.get('/api/hentAlleHovedkategorier');
  }

  hentAlleSubkategorierPaaHovedkategori(hk_id) {
    return axios.get('/api/hentAlleSubKategorierPaaHovedkategori', hk_id)
  }
}

export let feilService = new FeilService();