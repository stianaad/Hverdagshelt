import axios from 'axios';
axios.interceptors.response.use(response => response.data);

export class Kommuner {
  kommune_id;
  kommune_navn;
  fylke_navn;
}

class GenerellServices {
  hentAlleKommuner(){
    return axios.get('/api/generell/hentAlleKommuner');
  }
}

export let generellServices = new GenerellServices();