import api from './api';

class BrukerService {
  lagNyBruker(nyBruker) {
    let token = sessionStorage.getItem('pollett');
    if(token) {
      return api.post('/api/brukere', nyBruker, {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
  }

  lagNyPrivatBruker(nyPrivatBruker) {
    let token = sessionStorage.getItem('pollett');
    if(token) {
      return api.post('/api/brukere/privat', nyPrivatBruker, {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      return [];
    }
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

  hentBrukerPaaid(bruker_id) {
    return api.get('/api/brukere/'+ bruker_id);
  }

  endrePassord(passord) {
    console.log('endre');
    let token = sessionStorage.getItem('pollett');
    if (token) {
      console.log('token ok i endrepassord')
      return api.put('/api/brukere/endrepassord', passord, {headers: {'x-access-token': 'Bearer ' + token}});
    } else {
      console.log('token ikke ok i endrepassord');
      return [];
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

  loggInn(informasjon) {
    //console.log(informasjon);
    return api.post('/api/innlogging', informasjon);
  }

  glemtPassord(input) {
    console.log('brukerservice');
    return api.post('/api/brukere/glemtpassord', input);
  }

  hentbrukere() {
    console.log('hente brukere');
    return api.get('/api/hentbrukere');
  }

  finnOppdaterteFeilTilBruker() {
    let token = sessionStorage.getItem('pollett');
    if (token) {
      return api.get('/api/brukere/minside', {headers: {'x-access-token': 'Bearer ' + token}});
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
