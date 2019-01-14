import axios from 'axios';
axios.interceptors.response.use((response) => response.data);
//import API from './api.js';

export class Kommuner {
  kommune_id;
  kommune_navn;
  fylke_navn;
}

class GenerellServices {
  
  hentAlleKommuner() {
    return axios.get('/api/generell/hentAlleKommuner');
  }

  filtrerKommuner(sokeord) {
    return axios.get('/api/generell/filtrer/' + sokeord);
  }

  hentAlleFeil() { // denne skal egentlig ikkje ligge her (feilservice)
    return axios.get('/api/hentAlleFeil');
  }

  hentAlleKategorier() { // hørre ikkje til her (feilservice)
    return axios.get('/api/hentAlleKategorier');
  }

  hentFeilFiltrertKategori(kategori_id) { // hørre ikkje til her (feilservice)
    return axios.get('/api/filtrerKategori/'+kategori_id);
  }

  hentAlleHendelser() { // hører til i (hendelseservice)
    return axios.get('/api/hentAlleHendelser');
  }

  hentBilderTilFeil(feil_id){
    return axios.get('/api/hentBilder/'+feil_id);
  }
}

export let generellServices = new GenerellServices();
