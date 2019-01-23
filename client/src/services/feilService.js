import api from './api';

class FeilService {
  hentAlleFeil() {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.get('/api/feil');
    } else {
      return [];
    }
  }

  hentEnFeil(feil_id) {
    return api.get('/api/feil/:feil_id', feil_id);
  }

  hentFeilForKommune(kommune_id) {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.get('/api/kommuner/' + kommune_id + '/feil');
    } else {
      return [];
    }
  }

  hentGodkjenteFeilForKommune(kommune_id) {
      return api.get('/api/kommuner/' + kommune_id + '/godkjentefeil');
  }

  hentBilderTilFeil(feil_id) {
    return api.get('/api/feil/' + feil_id + '/bilder');
  }

  oppdaterFeil(oppdatertFeil, feil_id) {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.put('/api/feil/' + feil_id, oppdatertFeil, {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      console.log('oppdatertfeil, token feil');
      return [];
    }
  }

  slettFeil(feil_id) {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.delete('/api/feil/' + feil_id, { headers: { 'x-access-token': 'Bearer ' + token } });
    } else {
      return [];
      console.log('æsjebæsj, token dæsj');
    }
  }

  hentFeilFiltrertKategori(hk_id) {
    return api.get('/api/feil/' + hk_id);
  }

  lagOppdatering(nyOpp) {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.post('/api/feil/oppdateringer/bedrift', nyOpp, { headers: { 'x-access-token': 'Bearer ' + token } });
    } else {
      console.log('oeifjeoif');
      return [];
    }
  }

  hentAlleOppdateringerPaaFeil(feil_id) {
    return api.get('/api/feil/' + feil_id + '/oppdatering');
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

  slettBildeFraFeil(info, feil_id, bilde_id) {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.delete('/api/feil/' + feil_id + '/bilder/' + bilde_id, info, { headers: { 'x-access-token': 'Bearer ' + token } });
    } else {

    }
  }

  hentNyeFeilTilBedrift() {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.get('/api/feil/bedrift/nyeOppgaver', { headers: { 'x-access-token': 'Bearer ' + token } });
    } else {
      console.log('oeifjeoif');
      return [];
    }
  }

  hentUnderBehandlingFeilTilBedrift() {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.get('api/feil/bedrift/underBehandling', { headers: { 'x-access-token': 'Bearer ' + token } });
    } else {
      console.log('foeifj');
      return [];
    }
  }

  hentFerdigeFeilTilBedrift() {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.get('api/feil/bedrift/ferdig', { headers: { 'x-access-token': 'Bearer ' + token } });
    } else {
      console.log('foeifj');
      return [];
    }
  }

  oppdaterStatusFeilTilBedrift(jobbSoknadObjekt) {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.put('/api/bedrift/oppdater/feil/godta', jobbSoknadObjekt, { headers: { 'x-access-token': 'Bearer ' + token } });
    } else {
      return [];
    }
  }

  abonner(feil_id) {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.post('/api/feil/' + feil_id + '/abonnement', null, { headers: { 'x-access-token': 'Bearer ' + token } });
    } else {
      return null;
    }
  }

  ikkeAbonner(feil_id) {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.delete('/api/feil/' + feil_id + '/abonnement', { headers: { 'x-access-token': 'Bearer ' + token } });
    } else {
      return null;
    }
  }

  slettHovedkategori(hk_id) {
    let token = sessionStorage.getItem('pollett');
    console.log('Slett hovedkategori service:');
    if (token) {
      return api.delete('/api/hovedkategori/' + hk_id, { headers: { 'x-access-token': 'Bearer ' + token } });
    } else {
      return null;
    }
  }

  slettSubkategori(sk_id) {
    let token = sessionStorage.getItem('pollett');
    console.log('Slett subkategori service:');
    if (token) {
      return api.delete('/api/subkategori/' + sk_id, { headers: { 'x-access-token': 'Bearer ' + token } });
    } else {
      return null;
    }
  }

  oppdaterHovedkategori(hk_id) {
    let token = sessionStorage.getItem('pollett');
    console.log('Oppdater hovedkategorier service:');
    if (token) {
      return api.put('/api/hovedkategorier/' + hk_id, { headers: { 'x-access-token': 'Bearer ' + token } });
    } else {
      return null;
    }
  }

  oppdaterSubkategori(sk_id) {
    let token = sessionStorage.getItem('pollett');
    console.log('Oppdater subkategori service:');
    if (token) {
      return api.put('/api/subkategorier/' + sk_id, { headers: { 'x-access-token': 'Bearer ' + token } });
    } else {
      return null;
    }
  }

  opprettHovedkategori(nyHk) {
    let token = sessionStorage.getItem('pollett');
    console.log('Opprett ny hovedkategori service:');
    if (token) {
      return api.post('/api/hovedkategorier',nyHk, { headers: { 'x-access-token': 'Bearer ' + token } });
    }
  }

  opprettSubkategori(nySk) {
    let token = sessionStorage.getItem('pollett');
    console.log('Opprett ny subkategori service:');
    if (token) {
      return api.post('/api/subkategori',nySk, { headers: { 'x-access-token': 'Bearer ' + token } });
    }
  }
}

export let feilService = new FeilService();
