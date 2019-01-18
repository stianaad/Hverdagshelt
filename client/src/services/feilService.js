import api from './api';

class FeilService {
  hentAlleFeil() {
    return api.get('/api/feil');
  }

  hentEnFeil(feil_id) {
    return api.get('/api/feil/:feil_id', feil_id);
  }

  hentBilderTilFeil(feil_id) {
    return api.get('/api/feil/' + feil_id + '/bilder');
  }

  lagNyFeil(nyFeil) {
    return api.post('/api/feil', nyFeil);
  }

  oppdaterFeil(oppdatertFeil) {
    return api.put('/api/feil/:feil_id', oppdatertFeil);
  }

  slettFeil(feil_id) {
    return api.delete('/api/feil/' + feil_id);
  }

  hentFeilFiltrertKategori(hk_id) {
    return api.get('/api/feil/:kategori_id', hk_id);
  }

  lagOppdatering(nyOpp) {
    let token = sessionStorage.getItem('pollett');
    if (token) {
    return api.post('/api/feil/oppdateringer/bedrift', nyOpp, {headers: {'x-access-token': 'Bearer ' + token}});
  } else {
    console.log('oeifjeoif');
    return [];
  }
  }

  hentAlleOppdateringerPaaFeil(feil_id) {
    return api.get('/api/feil/:feil_id/oppdatering', feil_id);
  }

  hentEnStatus(status_id) {
    return api.get('/api/statuser/:status_id', status_id);
  }

  hentAlleStatuser() {
    return api.get('/api/statuser');
  }

  hentAlleHovedkategorier() {
    return api.get('/api/hovedkategorier');
  }

  hentAlleSubkategorierPaaHovedkategori(hk_id) {
    return api.get('/api/hovedkategorier/' + hk_id + '/subkategorier');
  }

  hentAlleSubkategorier() {
    return api.get('/api/hovedkategorier/subkategorier');
  }

  slettBildeFraFeil(info) {
    return api.delete('/api/feil/:feil_id/bilder/:bilde_id', info);
  }

  hentNyeFeilTilBedrift() {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.get('/api/feil/bedrift/nyeOppgaver', {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      console.log('oeifjeoif');
      return [];
    }
  }

  hentUnderBehandlingFeilTilBedrift() {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.get('api/feil/bedrift/underBehandling', {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      console.log('foeifj');
      return [];
    }
  }

  oppdaterStatusFeilTilBedrift(jobbSoknadObjekt) {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.put('/api/bedrift/oppdater/feil/godta', jobbSoknadObjekt, {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
  }
}

export let feilService = new FeilService();
