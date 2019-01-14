import axios from 'axios';
axios.interceptors.response.use((response) => response.data);

class BrukerService {

  lagNyBruker(nyBruker) {
    return axios.post('/api/lagNyBruker', nyBruker);
  }

  endrePassord(nyInformasjon) {
    return axios.post('/api/lagNyBruker', nyInformasjon);
  }
  
}

export let brukerService = new BrukerService();

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

export class Bedrift extends Bruker {
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

export class Admin extends Bruker {
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