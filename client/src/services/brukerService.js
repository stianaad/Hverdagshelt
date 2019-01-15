import api from './api';

class Bruker {
  bruker_id;
  constructor(
    epost,
    passord,
    kommune_id
  ) {
    this.epost = epost;
    this.passord = passord;
    this.kommune_id = kommune_id;
  }
}

export class Privat extends Bruker {
  constructor(
    epost,
    passord,
    kommune_id,
    fornavn,
    etternavn
  ) {
    super(epost, passord, kommune_id);
    this.fornavn = fornavn;
    this.etternavn = etternavn; 
  }
}

export class Ansatt extends Bruker {
  constructor(
    epost,
    passord,
    fornavn, 
    etternavn,
    telefon
  ) {
    super(epost, passord, kommune_id);
    this.fornavn = fornavn;
    this.etternavn = etternavn; 
    this.telefon = telefon;
  }
}


export class Bedrift extends Bruker  {
  constructor(
    epost,
    passord,
    kommune_id,
    orgnr, 
    navn,
    telefon
  ) {
    super(epost, passord, kommune_id);
    this.orgnr = orgnr;
    this.navn = navn; 
    this.telefon = telefon;
  }
}

export class Admin extends Bruker  {
  constructor(
    epost,
    passord,
    kommune_id,
    telefon, 
    navn
  ) {
    super(epost, passord, kommune_id);
    this.telefon = telefon;
    this.navn = navn;
  }
}

class BrukerService {

  lagNyBruker(nyBruker) {
    console.log('lage');
    return api.post('/api/lagNyBruker', nyBruker);
  }

  endrePassord(nyInformasjon) {
    console.log('endre');
    return api.post('/api/resett-passord', nyInformasjon);
  }

  loggInn(informasjon) {
    console.log('asdad');
    return api.post('/api/sjekkPassord', informasjon);
  }

  glemtPassord(input){
    console.log('brukerservice');
    return api.get('/api/glemt-passord',input);
  }
  
}

export let brukerService = new BrukerService();