import api from './api';

class BrukerService {

  lagNyBruker(nyBruker) {
    return api.post('/api/lagNyBruker', nyBruker);
  }

  endrePassord(nyInformasjon) {
    return api.post('/api/lagNyBruker', nyInformasjon);
  }

  loggInn(informasjon) {
    return api.post('/sjekkPassord', informasjon);
  }
  
}
export let brukerService = new BrukerService();