import api from './api';

class StatistikkService {
  hentFeilPerKommune(){
    return api.get('/api/feilperkommune');
  }

  hentFeilPerDag(){
    return api.get('/api/statfeil/dag');
  }

  hentFeilPerUke(){
    return api.get('/api/statfeil/uke');
  }

  hentFeilPerMaaned(){
    return api.get('/api/statfeil/maaned');
  }

  hentFeilPerAar(){
    return api.get('/api/statfeil/aar');
  }
}

export let statistikkService = new StatistikkService();
