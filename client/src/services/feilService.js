import api from './api';

class FeilService {
  hentAlleFeil() {
    return api.get('/api/feil');
  }

  hentEnFeil(feil_id) {
    return api.get('/api/feil/:feil_id', feil_id);
  }

  hentBilderTilFeil(feil_id) {
    return api.get('/api/feil/' + feil_id + '/bilder');
  }

  lagNyFeil(nyFeil) {
    return api.post('/api/feil', nyFeil);
  }

  oppdaterFeil(oppdatertFeil) {
    return api.put('/api/feil/:feil_id', oppdatertFeil);
  }

  slettFeil(feil_id) {
    return api.delete('/api/feil/:feil_id', feil_id);
  }

  hentFeilFiltrertKategori(hk_id) {
    return api.get('/api/feil/:kategori_id', hk_id);
  }

  lagOppdatering(nyOpp) {
    return api.post('/api/feil/:feil_id/oppdateringer', nyOpp);
  }

  hentAlleOppdateringerPaaFeil(feil_id) {
    return api.get('/api/feil/:feil_id/oppdatering', feil_id);
  }

  hentEnStatus(status_id) {
    return api.get('/api/statuser/:status_id', status_id);
  }

  hentAlleStatuser() {
    return api.get('/api/statuser');
  }

  hentAlleHovedkategorier() {
    return api.get('/api/hovedkategorier');
  }

  hentAlleSubkategorierPaaHovedkategori(hk_id) {
<<<<<<< HEAD
    return api.get('/api/hovedkategorier/'+hk_id+'/subkategorier')
=======
    return api.get(
      '/api/hovedkategorier/:hovedkategori_id/subkategorier',
      hk_id
    );
  }

  slettBildeFraFeil(info) {
    return api.delete('/api/feil/:feil_id/bilder/:bilde_id', info);
>>>>>>> 98226fdf66e52bb6f97886568aa03d3e9adfdaae
  }
}

export let feilService = new FeilService();
