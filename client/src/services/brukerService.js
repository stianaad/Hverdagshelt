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
    let token = sessionStorage.getItem('pollett');
    if(token) {
      return api.post('/api/brukere/bedrift', nyBedriftBruker, {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
  }

  lagNyAdminBruker(nyAdminBruker) {
    let token = sessionStorage.getItem('pollett');
    if(token) {
      return api.post('/api/brukere/admin', nyAdminBruker, {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
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

  hentbrukere() {
    console.log('hente brukere');
    return api.get('/api/hentbrukere');
  }

  finnOppdaterteFeilTilBruker() {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.get('/api/brukere/minside', {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
  }

  finnIkkeOppdaterteFeilTilBruker() {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.get('/api/bruker/minside/gamle', {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
  }

  oppdaterSistInnloggetPrivat() {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.get('/api/bruker/minside/sist/innlogget', {headers: {'x-access-token': 'Bearer ' + token}});
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
