import api from './api';

class HendelseService {
  hentAlleHendelser() {
    return api.get('/api/hentAlleHendelser');
  }

    hentEnHendelse(hendelse_id) {
    return api.get('/api/hentEnHendelse', hendelse_id);
  }

  lagNyHendelse(nyHendelse) {
    return api.post('/api/lagNyHendelse', nyHendelse);
  }

  slettHendelse(hendelse) {
    return api.post('/api/slettHendelse', hendelse);
  }
}

export let hendelseService = new HendelseService();