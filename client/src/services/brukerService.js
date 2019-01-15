import api from './api';

class BrukerService {

  lagNyBruker(nyBruker) {
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
    return api.post('/api/lagNyBruker', nyInformasjon);
  }

  loggInn(informasjon) {
    return api.post('/sjekkPassord', informasjon);
  }
  
}
export let brukerService = new BrukerService();