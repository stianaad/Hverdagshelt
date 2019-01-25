import api from './api';

class BrukerService {
  lagNyBruker(nyBruker) {
    return api.post('/api/brukere', nyBruker);
  }

  lagNyPrivatBruker(nyPrivatBruker) {
    return api.post('/api/brukere/privat', nyPrivatBruker);
  }

  lagNyAnsattBruker(nyAnsattBruker) {
    let token = sessionStorage.getItem('pollett');
    if(token) {
      return api.post('/api/brukere/ansatt', nyAnsattBruker, {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
  }

  lagNyBedriftBruker(nyBedriftBruker) {
    let token = sessionStorage.getItem('pollett');
    if(token) {
      return api.post('/api/brukere/bedrift', nyBedriftBruker, {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
  }

  lagNyAdminBruker(nyAdminBruker) {
    let token = sessionStorage.getItem('pollett');
    if(token) {
      return api.post('/api/brukere/admin', nyAdminBruker, {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
  }

  endrePassord(passord) {
    console.log('endre');
    let token = sessionStorage.getItem('pollett');
    if (token) {
      console.log('token ok i endrepassord')
      return api.put('/api/brukere/endrepassord', passord, {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      console.log('token ikke ok i endrepassord');
      return false;
    }
  }

  resettPassord(nyInformasjon) {
    let token = sessionStorage.getItem('pollett');
    if(token) {
      return api.post('/api/brukere/nyttpassord', nyInformasjon, {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
  }

  oppdaterSpesifisertBruker(oppdatertBruker) {
    let token = sessionStorage.getItem('pollett');
    if(token) {
      return api.put('/api/brukere', oppdatertBruker, {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
  }

  oppdaterSpesifisertBrukerAdmin(oppdatertBruker) {
    let token = sessionStorage.getItem('pollett');
    if(token) {
      return api.put('/api/admin/brukere', oppdatertBruker, {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
  }

  slettBruker(bruker_id) {
    let token = sessionStorage.getItem('pollett');
    if(token) {
      return api.delete('/api/brukere/'+bruker_id, {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
  }

  loggInn(informasjon) {
    //console.log(informasjon);
    return api.post('/api/innlogging', informasjon);
  }

  glemtPassord(input) {
    console.log('brukerservice');
    return api.post('/api/brukere/glemtpassord', input);
  }

  sokBrukere(soktekst) {
    let token = sessionStorage.getItem('pollett');
    if(token) {
      return api.get('/api/brukere/sok/'+soktekst, {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
  }

  hentbrukere() {
    console.log('hente brukere');
    return api.get('/api/hentbrukere');
  }

  finnOppdaterteFeilTilBruker() {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.get('/api/brukere/minside/nye', {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
  }

  finnIkkeOppdaterteFeilTilBruker() {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.get('/api/bruker/minside/gamle', {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
  }

  oppdaterSistInnloggetPrivat() {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.get('/api/bruker/minside/sist/innlogget', {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
  }

  finnFolgteFeilTilBruker() {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.get('/api/brukerfeil', {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
  }

  finnFolgteHendelserTilBruker() {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.get('/api/brukerhendelser', {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
  }

  hentBedrifter() {
    return api.get('/api/bedrifter');
  }

  minInfo() {
    let token = sessionStorage.getItem('pollett');
    if(token) {
      return api.get('/api/mininfo', {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
  }
}

export let brukerService = new BrukerService();
