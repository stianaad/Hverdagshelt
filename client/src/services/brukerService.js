import axios from 'axios';
axios.interceptors.response.use((response) => response.data);

class BrukerService {

  lagNyBruker(nyBruker) {
    return axios.post('/api/lagNyBruker', nyBruker);
  }

  endrePassord(nyInformasjon) {
    return axios.post('/api/lagNyBruker', nyInformasjon);
  }
  
}

export let brukerService = new BrukerService();