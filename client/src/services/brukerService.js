import api from './api';

class BrukerService {
  lagNyBruker(nyBruker) {
    console.log('lage');
    //return api.post('/api/lagNyBruker', nyBruker);
    return api.post('/api/brukere', nyBruker);
  }

  lagNyPrivatBruker(nyPrivatBruker) {
    return api.post('/api/brukere/privat', nyPrivatBruker);
  }

  lagNyAnsattBruker(nyAnsattBruker) {
    return api.post('/api/brukere/ansatt', nyAnsattBruker);
  }

  lagNyBedriftBruker(nyBedriftBruker) {
    return api.post('/api/brukere/bedrift', nyBedriftBruker);
  }

  lagNyAdminBruker(nyAdminBruker) {
    return api.post('/api/brukere/admin', nyAdminBruker);
  }

  hentBruker(bruker_id) {
    return api.get('/api/brukere/'+ bruker_id);
  }

  endrePassord(nyInformasjon) {
    console.log('endre');
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.post('/api/brukere/nyttpassord', nyInformasjon, {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
  }

  resettPassord(nyInformasjon, token) {
    console.log('reset');
    return api.post('/api/brukere/nyttpassord', nyInformasjon, {headers: {'x-access-token': 'Bearer ' + token}});
  }

  loggInn(informasjon) {
    //console.log(informasjon);
    return api.post('/api/innlogging', informasjon);
  }

  glemtPassord(input) {
    console.log('brukerservice');
    return api.post('/api/brukere/glemtpassord', input);
  }

  finnFeilTilBruker() {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.get('/api/brukere/minside', {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
  }

  finnFolgteFeilTilBruker() {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.get('/api/brukerfeil', {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
  }

  finnFolgteHendelserTilBruker() {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.get('/api/brukerhendelser', {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
  }

  hentBedrifter() {
    return api.get('/api/bedrifter');
  }
}

export let brukerService = new BrukerService();
