import api from './api';

class HendelseService {
  hentAlleHendelser() {
    return api.get('/api/hendelser');
  }

  hentEnHendelse(hendelse_id) {
    return api.get('/api/hendelser/:hendelse_id', hendelse_id);
  }

  oppdaterHendelse(oppdatertHendelse) {
    return api.put('/api/hendelser/:hendelse_id', oppdatertHendelse);
  }

  lagNyHendelse(nyHendelse) {
    return api.post('/api/hendelser/:hendelse_id', nyHendelse);
  }

  slettHendelse(hendelse) {
    return api.delete('/api/hendelser/:hendelse_id', hendelse);
  }
}

export let hendelseService = new HendelseService();