import api from './api';

module.exports = class Hendelse {
  
  constructor(
    overskrift,
    tid,
    beskrivelse,
    sted,
    bilde,
    lengdegrad,
    breddegrad,
    bruker_id
  ) {
    this.overskrift = overskrift; 
    this.tid = tid; 
    this.beskrivelse = beskrivelse; 
    this.sted = sted; 
    this.bilde = bilde;
    this.lengdegrad = lengdegrad;
    this.breddegrad = breddegrad;
    this.bruker_id = bruker_id;
  }
}

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
