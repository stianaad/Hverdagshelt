import api from './api';

class StatistikkService {
  hentFeilPerKommune(){
    return api.get('/api/statistikk/feil/kommuner');
  }

  hentAlleFeilPerFylke() {
    return api.get('/api/statistikk/feil/fylker');
  }

  hentAlleFeil() {
    return api.get('/api/statistikk/feil');
  }

  hentFeilPaaKommune(kommune_id) {
    return api.get('/api/statistikk/feil/kommune/'+kommune_id);
  }

  hentFeilPaaFylkenavn(fylke_navn) {
    return api.get('/api/statistikk/feil/fylke/'+fylke_navn);
  }

  hentFeilPaaHovedkategori(hovedkategori) {
    return api.get('/api/statistikk/feil/hovedkategorier/'+kategorinavn);
  }

  hentFeilPaaSubkategori(subkategori) {
    return api.get('/api/statistikk/feil/subkategorier/'+kategorinavn);
  }

  hentRegistrerteFeilPaaIntervall(intervall) {
    return api.get('/api/statistikk/feil/registrert/'+intervall);
  }

  hentBehandledeFeilPaaIntervall(intervall) {
    return api.get('/api/statistikk/feil/behandlet/'+intervall);
  }

  hentFeilPerFylkePaaIntervall(intervall) {
    return api.get('/api/statistikk/feil/fylker/intervall/'+intervall);
  }

  hentFeilPerKommunePaaIntervall(intervall) {
    return api.get('/api/statistikk/feil/kommuner/intervall/'+intervall);
  }

  hentFeilPerHovedkategori() {
    return api.get('/api/statistikk/feil/hovedkategorier');
  }

  hentFeilPerHovedkategoriPaaIntervall(intervall) {
    return api.get('/api/statistikk/feil/hovedkategorier/'+intervall);
  }

  hentFeilPerSubkategori() {
    return api.get('/api/statistikk/feil/subkategorier');
  }

  hentFeilPerSubkategoriPaaIntervall(intervall) {
    return api.get('/api/statistikk/feil/subkategorier/'+intervall);
  }

  hentFeilPaaStatus(status_id) {
    return api.get('/api/statistikk/feil/status/'+status_id);
  }
}

export let statistikkService = new StatistikkService();
