import api from './api';

class HendelseService {
  hentAlleHendelser() {
    return api.get('/api/hendelser');
  }

  hentHendelserForKommune(kommune_id) {
    return api.get('/api/kommuner/'+kommune_id+'/hendelser');
  }

  hentEnHendelse(hendelse_id) {
    return api.get('/api/hendelser/' + hendelse_id);
  }

  oppdaterHendelse(oppdatertHendelse) {
    return api.put('/api/hendelser/:hendelse_id', oppdatertHendelse);
  }

  lagNyHendelse(nyHendelse) {
    return api.post('/api/hendelser', nyHendelse);
  }

  slettHendelse(hendelse) {
    return api.delete('/api/hendelser/:hendelse_id', hendelse);
  }

  filtrerHendelserPaaKategori(hek_id) {
    return api.get('/api/hendelser/kategorier/:hendelseskategori_id', hek_id);
  }

  filtrerHendelserPaaKommune(k_id) {
    return api.get('/api/hendelser/kommuner/:kommune_id', k_id);
  }

  hentAlleHovedkategorier() {
    return api.get('/api/hendelser/hovedkategorier');
  }

  hentAlleKategorier(){
    return api.get('api/hendelseskat');
  }
}

export let hendelseService = new HendelseService();
