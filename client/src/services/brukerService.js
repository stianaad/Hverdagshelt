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
  constructor(
    bruker_id,
    epost,
    passord,
    salt,
    kommune_id
  ) {
    this.bruker_id = bruker_id;
    this.epost = epost;
    this.passord = passord;
    this.salt = salt;
    this.kommune_id = kommune_id;
  }
}

export class Privat extends Bruker {
  constructor(
    bruker_id,
    epost,
    passord,
    salt,
    kommune_id,
    fornavn,
    etternavn
  ) {
    super(bruker_id, epost, passord, salt, kommune_id);
    this.fornavn = fornavn;
    this.etternavn = etternavn; 
  }
}

export class Ansatt extends Bruker {
  constructor(
    bruker_id,
    epost,
    passord,
    salt,
    kommune_id,
    fornavn, 
    etternavn,
    telefon
  ) {
    super(bruker_id, epost, passord, salt, kommune_id);
    this.fornavn = fornavn;
    this.etternavn = etternavn; 
    this.telefon = telefon;
  }
}

export class Bedrift extends Bruker () {
  constructor(
    bruker_id,
    epost,
    passord,
    salt,
    kommune_id,
    orgnr, 
    navn,
    telefon
  ) {
    super(bruker_id, epost, passord, salt, kommune_id);
    this.orgnr = orgnr;
    this.navn = navn; 
    this.telefon = telefon;
  }
}

export class Admin extends Bruker () {
  constructor(
    bruker_id,
    epost,
    passord,
    salt,
    kommune_id,
    telefon, 
    navn
  ) {
    super(bruker_id, epost, passord, salt, kommune_id);
    this.telefon = telefon;
    this.navn = navn;
  }
}