import axios from 'axios';
axios.interceptors.response.use((response) => response.data);

export class Test {
  tekst;
}

class SakService {
  getNyheter() {
    return axios.get('/api/hello');
  }
}

export let sakService = new SakService();
