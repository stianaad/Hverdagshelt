import api from './api';

class FeilService {
	hentAlleFeil() {
		let token = sessionStorage.getItem('pollett');
		if (token) {
			return api.get('/api/feil', { headers: { 'x-access-token': 'Bearer ' + token } });
		} else {
			return [];
		}
	}

	hentEnFeil(feil_id) {
		return api.get('/api/feil/' + feil_id);
	}

	hentFeilForKommune(kommune_id) {
		let token = sessionStorage.getItem('pollett');
		if (token) {
			return api.get('/api/kommuner/' + kommune_id + '/feil', {
				headers: { 'x-access-token': 'Bearer ' + token }
			});
		} else {
			return [];
		}
	}

	hentGodkjenteFeilForKommune(kommune_id) {
		return api.get('/api/kommuner/' + kommune_id + '/godkjentefeil');
	}

	hentBilderTilFeil(feil_id) {
		return api.get('/api/feil/' + feil_id + '/bilder');
	}

	oppdaterFeil(oppdatertFeil, feil_id) {
		let token = sessionStorage.getItem('pollett');
		if (token) {
			return api.put('/api/feil/' + feil_id, oppdatertFeil, { headers: { 'x-access-token': 'Bearer ' + token } });
		} else {
			return [];
		}
	}

	slettFeil(feil_id) {
		let token = sessionStorage.getItem('pollett');
		if (token) {
			return api.delete('/api/feil/' + feil_id, { headers: { 'x-access-token': 'Bearer ' + token } });
		} else {
			return [];
		}
	}

	hentFeilFiltrertKategori(hk_id) {
		return api.get('/api/feil/' + hk_id);
	}

	lagOppdatering(nyOpp) {
		let token = sessionStorage.getItem('pollett');
		if (token) {
			return api.post('/api/feil/oppdateringer/bedrift', nyOpp, {
				headers: { 'x-access-token': 'Bearer ' + token }
			});
		} else {
			return [];
		}
	}

	hentAlleOppdateringerPaaFeil(feil_id) {
		return api.get('/api/feil/' + feil_id + '/oppdatering');
	}

	slettOppdatering(oppdatering_id) {
		return api.get('api/oppdateringer/' + oppdatering_id);
	}

	hentEnStatus(status_id) {
		return api.get('/api/statuser/' + status_id);
	}

	hentAlleStatuser() {
		return api.get('/api/statuser');
	}

	hentAlleHovedkategorier() {
		return api.get('/api/hovedkategorier');
	}

	hentAlleSubkategorierPaaHovedkategori(hk_id) {
		return api.get('/api/hovedkategorier/' + hk_id + '/subkategorier');
	}

	hentAlleSubkategorier() {
		return api.get('/api/hovedkategorier/subkategorier');
	}

	slettBildeFraFeil(json) {
		let token = sessionStorage.getItem('pollett');
		if (token) {
			return api.delete('/api/feil/' + json.feil_id + '/bilder/' + json.bilde_id, {
				headers: { 'x-access-token': 'Bearer ' + token }
			});
		} else {
			return [];
		}
	}

	hentNyeFeilTilBedrift() {
		let token = sessionStorage.getItem('pollett');
		if (token) {
			return api.get('/api/feil/bedrift/nyeOppgaver', { headers: { 'x-access-token': 'Bearer ' + token } });
		} else {
			return [];
		}
	}

	hentUnderBehandlingFeilTilBedrift() {
		let token = sessionStorage.getItem('pollett');
		if (token) {
			return api.get('api/feil/bedrift/underBehandling', { headers: { 'x-access-token': 'Bearer ' + token } });
		} else {
			return [];
		}
	}

	hentFerdigeFeilTilBedrift() {
		let token = sessionStorage.getItem('pollett');
		if (token) {
			return api.get('/api/bedrift/feil/ferdig', { headers: { 'x-access-token': 'Bearer ' + token } });
		} else {
			return [];
		}
	}

	sendFeilTilBedrift(k) {
		let token = sessionStorage.getItem('pollett');
		if (token) {
			return api.post('/api/bedrift/feil', k, { headers: { 'x-access-token': 'Bearer ' + token } });
		} else {
			return [];
		}
	}

	hentFerdigeFeilForAnsatt(orgnr) {
		let token = sessionStorage.getItem('pollett');
		if (token) {
			return api.get('/api/ansatt/bedrift/' + orgnr + '/feil/ferdig', {
				headers: { 'x-access-token': 'Bearer ' + token }
			});
		} else {
			return [];
		}
	}

	hentFeilUnderbehandlingForAnsatt(orgnr) {
		let token = sessionStorage.getItem('pollett');
		if (token) {
			return api.get('/api/ansatt/bedrift/' + orgnr + '/feil/underbehandling', {
				headers: { 'x-access-token': 'Bearer ' + token }
			});
		} else {
			return [];
		}
	}

	hentNyeFeilForAnsatt(orgnr) {
		let token = sessionStorage.getItem('pollett');
		if (token) {
			return api.get('/api/ansatt/bedrift/' + orgnr + '/feil/nyeoppgaver', {
				headers: { 'x-access-token': 'Bearer ' + token }
			});
		} else {;
			return [];
		}
	}

	oppdaterStatusFeilTilBedrift(jobbSoknadObjekt) {
		let token = sessionStorage.getItem('pollett');
		if (token) {
			return api.put('/api/bedrift/oppdater/feil/godta', jobbSoknadObjekt, {
				headers: { 'x-access-token': 'Bearer ' + token }
			});
		} else {
			return [];
		}
	}

	abonner(feil_id) {
		let token = sessionStorage.getItem('pollett');
		if (token) {
			return api.post('/api/feil/' + feil_id + '/abonnement', null, {
				headers: { 'x-access-token': 'Bearer ' + token }
			});
		} else {
			return null;
		}
	}

	ikkeAbonner(feil_id) {
		let token = sessionStorage.getItem('pollett');
		if (token) {
			return api.delete('/api/feil/' + feil_id + '/abonnement', {
				headers: { 'x-access-token': 'Bearer ' + token }
			});
		} else {
			return null;
		}
	}

	hentJobbSoknadStatus(feil_id) {
		return api.get('/api/ansatt/bedrifter/' + feil_id);
	}

	slettHovedkategori(hk_id) {
		let token = sessionStorage.getItem('pollett');
		if (token) {
			return api.delete('/api/hovedkategorier/' + hk_id, { headers: { 'x-access-token': 'Bearer ' + token } });
		} else {
			return null;
		}
	}

	slettSubkategori(sk_id) {
		let token = sessionStorage.getItem('pollett');
		if (token) {
			return api.delete('/api/subkategorier/' + sk_id, { headers: { 'x-access-token': 'Bearer ' + token } });
		} else {
			return null;
		}
	}

	opprettHovedkategori(nyHk) {
		let token = sessionStorage.getItem('pollett');
		if (token) {
			return api.post('/api/hovedkategorier', nyHk, { headers: { 'x-access-token': 'Bearer ' + token } });
		} else {
			return null;
		}
	}

	opprettSubkategori(nySk) {
		let token = sessionStorage.getItem('pollett');
		if (token) {
			return api.post('/api/subkategorier', nySk, { headers: { 'x-access-token': 'Bearer ' + token } });
		} else {
			return null;
		}
	}

	hentUnderBehandlingOgVenterPaaSvarAnsatt(kommune_id) {
		let token = sessionStorage.getItem('pollett');
		if (token) {
			return api.get('/api/ansatt/bedrift/'+kommune_id+'/behandling/godkjent', { headers: { 'x-access-token': 'Bearer ' + token } });
		} else {
			return null;
		}
	}


}

export let feilService = new FeilService();
