import axios from 'axios';
axios.interceptors.response.use((response) => response.data);

export class Hendelse {
  hendelse_id;
  overskrift;
  tid;
  beskrivelse;
  sted;
  bilde;
  lengdegrad;
  breddegrad;
  bruker_id;
}

class HendelseService {
  hentAlleHendelser() {
    return axios.get('/api/hentAlleHendelser');
  }

    hentEnHendelse(hendelse_id) {
    return axios.get('/api/hentEnHendelse', hendelse_id);
  }

  lagNyHendelse(nyHendelse) {
    return axios.post('/api/lagNyHendelse', nyHendelse);
  }

  slettHendelse(hendelse) {
    return axios.post('/api/slettHendelse', hendelse);
  }
}

export let hendelseService = new HendelseService();
