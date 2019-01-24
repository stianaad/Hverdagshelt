import api from './api';

class StatistikkService {
  hentFeilPerKommune(){
    return api.get('/api/feilperkommune');
  }

}

export let statistikkService = new StatistikkService();
