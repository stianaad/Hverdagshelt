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

  endrePassord(nyInformasjon) {
    console.log('endre');
    return api.post('/api/resett-passord', nyInformasjon);
  }

  loggInn(informasjon) {
    //console.log(informasjon);
    return api.post('/api/innlogging', informasjon);
  }

  glemtPassord(input) {
    console.log('brukerservice');
    return api.get('/api/glemt-passord/', input);
  }

  hentbrukere() {
    console.log('hente brukere');
    return api.get('/api/hentbrukere');
  }

  finnFeilTilBruker(){
    let token = sessionStorage.getItem("pollett");
    if (token) {
      return api.get('/api/bruker/minside', {headers: {"x-access-token": "Bearer "+token}});
    } else {
      return [];
    }
  }

  finnFolgteFeilTilBruker(){
    let token = sessionStorage.getItem("pollett");
    if (token) {
    return api.get('/api/bruker/finnFolgteFeil', {headers: {"x-access-token": "Bearer "+token}});
  } else {
    return [];
  }
  }

  finnFolgteHendelserTilBruker(){
    let token = sessionStorage.getItem("pollett");
    if (token) {
    return api.get('/api/bruker/finnFolgteHendelser', {headers: {"x-access-token": "Bearer "+token}});
  } else {
    return [];
  }
  }
}

export let brukerService = new BrukerService();
