import api from './api';

class HendelseService {
  hentAlleHendelser() {
    return api.get('/api/hendelser');
  }

  hentHendelserForKommune() {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.get('/api/kommuner/hendelser/din/kommune', {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
  }

  hentEnHendelse(hendelse_id) {
    return api.get('/api/hendelser/' + hendelse_id);
  }

  oppdaterHendelse(oppdatertHendelse) {
    return api.put('/api/hendelser/:hendelse_id', oppdatertHendelse);
  }

  lagNyHendelse(nyHendelse) {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.post('/api/hendelser', nyHendelse, {headers: {'x-access-token': 'Bearer ' + token}});
    }else{
      console.log('ikkje braa');
      return [];
    }
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
