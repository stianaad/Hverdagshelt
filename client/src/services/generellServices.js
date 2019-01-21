import api from './api';

class GenerellServices {
  hentAlleKommuner() {
    return api.get('/api/kommuner');
  }

  hentAlleFylker(){
    return api.get('/api/fylker');
  }

  filtrerKommuner(sokeord) {
    return api.get('/api/filtrer/' + sokeord);
  }

  hentAlleFeil() {
    // denne skal egentlig ikkje ligge her (feilservice)
    return api.get('/api/hentAlleFeil');
  }

  hentAlleKategorier() {
    // hørre ikkje til her (feilservice)
    return api.get('/api/hentAlleHovedkategorier');
  }

  hentFeilFiltrertKategori(kategori_id) {
    // hørre ikkje til her (feilservice)
    return api.get('/api/filtrerKategori/' + kategori_id);
  }

  hentAlleHendelser() {
    // hører til i (hendelseservice)
    return api.get('/api/hentAlleHendelser');
  }

  hentBilderTilFeil(feil_id) {
    return api.get('/api/hentBilder/' + feil_id);
  }
}

export let generellServices = new GenerellServices();
