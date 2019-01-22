import api from './api';

class FeilService {
  hentAlleFeil() {
    return api.get('/api/feil');
  }

  hentEnFeil(feil_id) {
    return api.get('/api/feil/:feil_id', feil_id);
  }

  hentFeilForKommune(kommune_id) {
    return api.get('/api/kommuner/'+kommune_id+'/feil');
  }

  hentBilderTilFeil(feil_id) {
    return api.get('/api/feil/' + feil_id + '/bilder');
  }

  lagNyFeil(nyFeil) {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.post('/api/feil', nyFeil, {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      console.log('ny feil feilet');
      return [];
    }
  }

  oppdaterFeil(oppdatertFeil, feil_id) {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.put('/api/feil/' + feil_id, nyOpp, {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      console.log('oppdatertfeil, token feil');
      return [];
    }
  }

  slettFeil(feil_id) {
    let token = sessionStorage.getItem('pollett');
    if(token) {
      return api.delete('/api/feil/' + feil_id, {headers: {'x-access-token': 'Bearer ' + token}});
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
      return api.post('/api/feil/oppdateringer/bedrift', nyOpp, {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      console.log('oeifjeoif');
      return [];
    }
  }

  hentAlleOppdateringerPaaFeil(feil_id) {
    return api.get('/api/feil/'+feil_id+'/oppdatering');
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
    if(token) {
      return api.delete('/api/feil/' + feil_id + '/bilder/' + bilde_id, info, {headers: {'x-access-token': 'Bearer ' + token}});
    } else {

    }
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

  hentFerdigeFeilTilBedrift() {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.get('api/feil/bedrift/ferdig', {headers: {'x-access-token': 'Bearer ' + token}});
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

  abonner(feil_id) {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.post('/api/feil/' + feil_id + '/abonnement',null , {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return null;
    }
  }

  ikkeAbonner(feil_id) {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.delete('/api/feil/' + feil_id + '/abonnement', {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return null;
    }
  }

}

export let feilService = new FeilService();
