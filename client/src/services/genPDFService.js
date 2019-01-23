import api from './api';

class GenPDFService {
  hentFeilPerKommune(){
    return api.get('/api/feilperkommune');
  }

}

export let genPDFService = new GenPDFService();
