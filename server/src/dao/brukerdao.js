import Dao from './dao.js';

//  14 av 27 funksjoner testes
module.exports = class BrukerDao extends Dao {
	/**
   * Metode for å kontrollere organisasjonsnummer.
   * @example
   * brukerDao.kontrollOrgnr(123456785) 
   * @param {number} tall - Organisasjonsnummeret som skal sjekkes.
   */
	kontrollOrgnr(tall) {
		var sum = 0;
		tall = tall.toString();
		sum += (parseInt(tall.charAt(0)) + parseInt(tall.charAt(6))) * 3;
		sum += (parseInt(tall.charAt(1)) + parseInt(tall.charAt(7))) * 2;
		sum += parseInt(tall.charAt(2)) * 7;
		sum += parseInt(tall.charAt(3)) * 6;
		sum += parseInt(tall.charAt(4)) * 5;
		sum += parseInt(tall.charAt(5)) * 4;

		var rest = sum % 11;

		var kontroll = -1;

		if (rest != 1) {
			kontroll = 11 - rest;
		}

		return kontroll == parseInt(tall.charAt(8));
	}

	/**
   * Metode for å slette en bruker fra brukertabellen i databasen.
   * @param {number} bruker_id - Iden til brukeren du vil slette.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
	slettBruker(bruker_id, callback) {
		super.query('DELETE FROM bruker WHERE bruker_id = ?', [ bruker_id ], callback);
	}

	/**
   * Metode for å kunne søke på en vilkårlig tekst blant alle brukere i databasen.
   * @param {string} sokTekst - Teksten det skal søkes på.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
	sokBrukere(sokTekst, callback) {
		const tabell = Array(13).fill(sokTekst + '%');
		super.query(
			'SELECT bruker.bruker_id, bruker.epost, bruker.kommune_id, privat.fornavn as pfnavn, privat.etternavn as penavn, privat.hendelsevarsling, ansatt.fornavn as afnavn, ansatt.etternavn as aenavn, ansatt.telefon as atlf, bedrift.navn as bnavn, bedrift.orgnr, bedrift.telefon as btlf, admin.navn as anavn, admin.telefon as adtlf, rolle.admin, rolle.privat, rolle.bedrift, rolle.ansatt FROM bruker LEFT OUTER JOIN admin ON admin.bruker_id = bruker.bruker_id LEFT OUTER JOIN ansatt ON ansatt.bruker_id = bruker.bruker_id LEFT OUTER JOIN bedrift ON bedrift.bruker_id = bruker.bruker_id LEFT OUTER JOIN privat ON privat.bruker_id = bruker.bruker_id LEFT OUTER JOIN kommuner ON bruker.kommune_id = kommuner.kommune_id LEFT OUTER JOIN(SELECT bruker_id, EXISTS( SELECT * FROM admin WHERE admin.bruker_id = bruker.bruker_id) AS admin, EXISTS( SELECT * FROM ansatt WHERE ansatt.bruker_id = bruker.bruker_id) AS ansatt, EXISTS( SELECT * FROM bedrift WHERE bedrift.bruker_id = bruker.bruker_id) AS bedrift, EXISTS( SELECT * FROM privat WHERE privat.bruker_id = bruker.bruker_id) AS privat FROM bruker) AS rolle ON rolle.bruker_id = bruker.bruker_id WHERE privat.fornavn LIKE ? OR privat.etternavn LIKE ? OR ansatt.fornavn LIKE ? OR ansatt.etternavn LIKE ? OR epost LIKE ? OR ansatt.telefon LIKE ? OR admin.telefon LIKE ? OR bedrift.telefon LIKE ? OR bedrift.orgnr LIKE ? OR admin.navn LIKE ? OR bedrift.navn LIKE ? OR kommuner.kommune_navn LIKE ? OR kommuner.fylke_navn LIKE ?',
			tabell,
			callback
		);
	}

	//testes
	/**
   * Metode for å opprette en ny bruker.
   * @param {json} json - En json med epost, hashet passord og kommuneiden til brukeren.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
	lagNyBruker(json, callback) {
		const tabell = [ json.epost, json.passord, json.kommune_id ];
		let gyldig = json.epost.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && json.kommune_id != null;
		console.log(gyldig);
		if (gyldig) {
			super.query('INSERT INTO bruker (epost, passord, kommune_id) VALUES(?,?,?)', tabell, callback);
		} else {
			callback(403, { error: 'Ugyldig input.' });
		}
	}

	//testes
	/**
   * En metode for å finne bruker-iden til en bruker ved hjelp av eposten.
   * @param {json} json - En json som inneholde eposten til brukeren.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
	finnBruker_id(json, callback) {
		let e = [ json.epost ];
		super.query('SELECT bruker_id FROM bruker WHERE epost=?', e, callback);
	}

	//testes
	/**
   * En metode som finner alle feil en spesifisert bruker har opprettet.
   * @param {number} bruker_id - Iden til brukeren som vil finne sine feil.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
	finnFeilTilBruker(bruker_id, callback) {
		super.query(
			"SELECT feil.*, hovedkategori.kategorinavn,status.status, DATE_FORMAT(f.tid, '%Y-%m-%d %H:%i') AS tid FROM feil INNER JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id INNER JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id INNER JOIN (SELECT feil_id, min(tid) as tid from oppdatering group by feil_id) as f ON feil.feil_id = f.feil_id INNER JOIN (SELECT feil_id, ANY_VALUE(status_id) as status_id, max(tid) as tid from oppdatering group by feil_id) as s ON feil.feil_id = s.feil_id INNER JOIN status ON status.status_id = s.status_id INNER JOIN privat ON privat.bruker_id=feil.bruker_id WHERE privat.bruker_id=? AND f.tid > privat.sist_innlogget",
			[ bruker_id ],
			callback
		);
	}

	/**
   * En metode for å finne alle feil som en bruker har opprettet som har blitt oppdatert siden sist innlogging.
   * @param {number} bruker_id - Iden til brukeren som vil finne oppdaterte feil.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
	finnOppdaterteFeilTilBruker(bruker_id, callback) {
		super.query(
			"SELECT feil.*, hovedkategori.kategorinavn,status.status, DATE_FORMAT(f.tid, '%Y-%m-%d %H:%i') AS tid FROM feil INNER JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id INNER JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id INNER JOIN (SELECT feil_id, MAX(tid) as tid from oppdatering group by feil_id) as f ON feil.feil_id = f.feil_id INNER JOIN (SELECT feil_id, MAX(status_id) as status_id, max(tid) as tid from oppdatering group by feil_id) as s ON feil.feil_id = s.feil_id INNER JOIN status ON status.status_id = s.status_id INNER JOIN privat ON privat.bruker_id=feil.bruker_id WHERE privat.bruker_id=? AND f.tid > privat.sist_innlogget ORDER BY tid desc",
			[ bruker_id ],
			callback
		);
	}

	/**
   * Metode som finner alle feil som brukeren har opprettet som ikke har blitt oppdatert siden sist innlogging.
   * @param {number} bruker_id - Iden til brukeren.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
	finnIkkeOppdaterteFeilTilBruker(bruker_id, callback) {
		super.query(
			"SELECT feil.*, hovedkategori.kategorinavn,status.status, DATE_FORMAT(f.tid, '%Y-%m-%d %H:%i') AS tid FROM feil INNER JOIN subkategori ON feil.subkategori_id = subkategori.subkategori_id INNER JOIN hovedkategori ON subkategori.hovedkategori_id = hovedkategori.hovedkategori_id INNER JOIN (SELECT feil_id, MAX(tid) as tid from oppdatering group by feil_id) as f ON feil.feil_id = f.feil_id INNER JOIN (SELECT feil_id, MAX(status_id) as status_id, max(tid) as tid from oppdatering group by feil_id) as s ON feil.feil_id = s.feil_id INNER JOIN status ON status.status_id = s.status_id INNER JOIN privat ON privat.bruker_id=feil.bruker_id WHERE feil.bruker_id=? AND f.tid < privat.sist_innlogget ORDER BY tid desc",
			[ bruker_id ],
			callback
		);
	}

	/**
   * Metode som oppdaterer tidspunktet for innlogging i databasen. Brukes for å finne oppdaterte feil siden sist innlogging.
   * @param {number} bruker_id - Iden til brukeren.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
	oppdaterSistInnloggetPrivat(bruker_id, callback) {
		super.query('UPDATE privat SET sist_innlogget=now() WHERE bruker_id = ?', [ bruker_id ], callback);
	}

	//testes
	/**
   * Metode for å finne alle feilene som en bruker abonnerer på.
   * @param {number} bruker_id - Iden til brukeren
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
	finnFolgteFeilTilBruker(bruker_id, callback) {
		super.query(
			"SELECT feil.*, feilfolg.feil_id, feilfolg.bruker_id, feil.overskrift, DATE_FORMAT(s.tid, '%Y-%m-%d %H:%i') AS tid, status.status, b.url FROM feil LEFT JOIN (SELECT feil_id, MAX(status_id) as status_id, max(tid) as tid from oppdatering group by feil_id) as s ON s.feil_id=feil.feil_id LEFT JOIN (SELECT feil_id, ANY_VALUE(url) as url, min(bilde_id) as bilde_id from feilbilder group by feil_id) as b ON b.feil_id=feil.feil_id INNER JOIN feilfolg ON feilfolg.feil_id = feil.feil_id INNER JOIN status ON s.status_id=status.status_id WHERE feilfolg.bruker_id = ? ORDER BY s.tid DESC",
			[ bruker_id ],
			callback
		);
	}

	//testes
	/**
   * Finner alle hendelsene som en bruker abonnerer på.
   * @param {number} bruker_id - Iden til brukeren.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
	finnFolgteHendelserTilBruker(bruker_id, callback) {
		super.query(
			"SELECT hendfolg.hendelse_id, hendfolg.bruker_id, hendelser.hendelse_id, kommuner.kommune_navn ,DATE_FORMAT(hendelser.tid, '%Y-%m-%d %H:%i') AS tid,overskrift, beskrivelse,bilde,sted,billett,hendfolg.bruker_id FROM hendelser,hendfolg,kommuner WHERE hendelser.hendelse_id=hendfolg.hendelse_id and hendelser.kommune_id=kommuner.kommune_id AND hendfolg.bruker_id=? ORDER BY hendelser.tid ASC",
			[ bruker_id ],
			callback
		);
	}

	//testes
	/**
   * Metode for å opprette en ny privatbruker.
   * @param {json} json - En json med all informasjonen til den nye privatbrukeren.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
	lagNyPrivatBruker(json, callback) {
		let self = this;
		self.finnBruker_id(json, (status, data) => {
			if (data.length == 0) {
				self.lagNyBruker(json, (status, data) => {
					console.log(status);
					let gyldig = json.fornavn != null && json.etternavn != null;
					if (status == 200 && gyldig) {
						super.query(
							'INSERT INTO privat (bruker_id, fornavn, etternavn, hendelsevarsling) VALUES(?,?,?,?)',
							[ data.insertId, json.fornavn, json.etternavn, json.hendelsevarsling ],
							callback
						);
					} else {
						callback(403, { error: 'Empty promise.' });
					}
				});
			} else {
				callback(403, { error: 'E-post eksisterer allerede.' });
			}
		});
	}

	//testes
	/**
   * Metode for å opprette en ny ansattbruker.
   * @param {json} json - En json med all informasjonen til den nye ansattbrukeren.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
	lagNyAnsattBruker(json, callback) {
		let self = this;
		self.finnBruker_id(json, (status, data) => {
			console.log(data);
			if (data.length == 0) {
				self.lagNyBruker(json, (status, data) => {
					console.log(status);
					if (status == 200) {
						super.query(
							'INSERT INTO ansatt (bruker_id, fornavn, etternavn, telefon) VALUES(?,?,?,?)',
							[ data.insertId, json.fornavn, json.etternavn, json.telefon ],
							callback
						);
					} else {
						callback(403, { error: 'Empty promise.' });
					}
				});
			} else {
				callback(403, { error: 'E-post eksisterer allerede.' });
			}
		});
	}

	//testes
	/**
   * Metode for å opprette en ny bedriftbruker.
   * @param {json} json - En json med all informasjonen til den nye bedriftbrukeren.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
	lagNyBedriftBruker(json, callback) {
		let self = this;
		self.finnBruker_id(json, (status, data) => {
			if (data.length == 0) {
				self.lagNyBruker(json, (status, data) => {
					let gyldig = self.kontrollOrgnr(json.orgnr) && json.navn != null;
					if (status == 200 && gyldig) {
						super.query(
							'INSERT INTO bedrift (bruker_id, orgnr, navn, telefon) VALUES(?,?,?,?)',
							[ data.insertId, json.orgnr, json.navn, json.telefon ],
							callback
						);
					} else {
						callback(403, { error: 'Empty promise.' });
					}
				});
			} else {
				callback(403, { error: 'E-post eksisterer allerede.' });
			}
		});
	}

	//testes
	/**
   * Metode for å opprette en ny adminbruker.
   * @param {json} json - En json med all informasjonen til den nye adminbrukeren.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
	lagNyAdminBruker(json, callback) {
		let self = this;
		self.finnBruker_id(json, (status, data) => {
			if (data.length == 0) {
				self.lagNyBruker(json, (status, data) => {
					console.log(status);
					if (status == 200) {
						super.query(
							'INSERT INTO admin (bruker_id, telefon, navn) VALUES(?,?,?)',
							[ data.insertId, json.telefon, json.navn ],
							callback
						);
					} else {
						callback(403, { error: 'Empty promise.' });
					}
				});
			} else {
				callback(403, { error: 'E-post eksisterer allerede.' });
			}
		});
	}

	/**
   * Metode for å finne en bruker ved å søke på eposten.
   * @param {json} json - en json med eposten til brukeren.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   * @deprecated Blir ikke brukt, bruker heller {@link hentBrukerPaaId}
   */
	hentBrukerPaaEpost(json, callback) {
		let tabell = [ json.epost ];
		console.log('hent bruker på epost, data:' + tabell);
		super.query('SELECT * FROM bruker WHERE epost = ?', tabell, callback);
	}

	//testes
	/**
   * Metode for å hente brukerinformasjon ved hjelp av bruker-iden.
   * @param {number} bruker_id - Iden til brukeren.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
	hentBrukerPaaid(bruker_id, callback) {
		super.query('SELECT * FROM bruker WHERE bruker_id = ?', [ bruker_id ], callback);
	}

	/**
   * Metode for å hente en liste med alle brukere.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
	hentBrukere(callback) {
		super.query('SELECT * FROM bruker', [], callback);
	}

	//testes
	/**
   * Metode for å endre passord for en bruker.
   * @param {json} json - En json med den nye hashede passordet og eposten til brukeren.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
	endrePassord(json, callback) {
		const tabell = [ json.passord, json.epost ];
		super.query('UPDATE bruker SET passord=? WHERE epost=?', tabell, callback);
	}

	/**
   * Metode for å hente rollen til en bruker.
   * @param {json} json - en json med eposten til brukeren.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   * @deprecated Henter heller rollen til brukere via payloaden i token.
   */
	hentBrukerRolle(json, callback) {
		let a = [ json.bruker_id ];
		console.log(a + 'hentBrukerRolle');
		super.query(
			'SELECT EXISTS( SELECT * FROM admin WHERE bruker_id = ?) AS admin, EXISTS( SELECT * FROM ansatt WHERE bruker_id = ?) AS ansatt, EXISTS( SELECT * FROM bedrift WHERE bruker_id = ?) AS bedrift, EXISTS( SELECT * FROM privat WHERE bruker_id = ?) AS privatbruker',
			[ a, a, a, a ],
			callback
		);
	}

	/**
   * Metode for adminbrukere så de kan oppdatere alle brukere. 
   * @param {json} json - Tar en json med rolle, og all annen informasjon som trengs for å oppdatere en bruker.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
	oppdaterSpesifisertBrukerAdmin(json, callback) {
		if (!!json.privat) {
			console.log('oppdaterer bruker');
			this.oppdaterAnnenBruker(json, (status, data) => {
				console.log('oppdaterer privat');
				super.query(
					'UPDATE privat SET fornavn = ?, etternavn = ?, hendelsevarsling = ? WHERE bruker_id = ?',
					[ json.pfnavn, json.penavn, json.hendelsevarsling, json.bruker_id ],
					callback
				);
			});
		} else if (!!json.bedrift) {
			console.log('oppdaterer bruker');
			this.oppdaterAnnenBruker(json, (status, data) => {
				console.log('oppdaterer bedrift');
				super.query(
					'UPDATE bedrift SET orgnr = ?, navn = ?, telefon = ? WHERE bruker_id = ?',
					[ json.orgnr, json.bnavn, json.btlf, json.bruker_id ],
					callback
				);
			});
		} else if (!!json.ansatt) {
			console.log('oppdaterer bruker');
			this.oppdaterAnnenBruker(json, (status, data) => {
				console.log('oppdaterer ansatt');
				super.query(
					'UPDATE ansatt SET fornavn = ?, etternavn = ?, telefon = ? WHERE bruker_id = ?',
					[ json.afnavn, json.aenavn, json.atlf, json.bruker_id ],
					callback
				);
			});
		} else if (!!json.admin) {
			console.log('oppdaterer bruker');
			this.oppdaterAnnenBruker(json, (status, data) => {
				console.log('oppdaterer admin');
				super.query(
					'UPDATE admin SET telefon = ?, navn = ? WHERE bruker_id = ?',
					[ json.adtlf, json.anavn, json.bruker_id ],
					callback
				);
			});
		}
	}

  //TESTES
	/**
   * Metode for en innlogget bruker så de kan oppdatere egne kontoinnstillinger.
   * @param {json} json - En json med all ny informasjon.
   * @param {json} rolle - En json med rollen og iden til brukeren.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
	oppdaterSpesifisertBruker(json, rolle, callback) {
		console.log('inne i oppdaterSpesifisertBruker');
		if (rolle.rolle == 'privat' || rolle.rolle == 'admin') {
			console.log('oppdaterer bruker');
			this.oppdaterBruker(json, rolle, (status, data) => {
				console.log('oppdaterer privat');
				super.query(
					'UPDATE privat SET fornavn = ?, etternavn = ?, hendelsevarsling = ? WHERE bruker_id = ?',
					[ json.fornavn, json.etternavn, json.hendelsevarsling, rolle.bruker_id ],
					callback
				);
			});
		} else if (rolle.rolle == 'bedrift' || rolle.rolle == 'admin') {
			console.log('oppdaterer bruker');
			this.oppdaterBruker(json, rolle, (status, data) => {
				console.log('oppdaterer bedrift');
				super.query(
					'UPDATE bedrift SET orgnr = ?, navn = ?, telefon = ? WHERE bruker_id = ?',
					[ json.orgnr, json.navn, json.telefon, rolle.bruker_id ],
					callback
				);
			});
		} else if (rolle.rolle == 'ansatt' || rolle.rolle == 'admin') {
			console.log('oppdaterer bruker');
			this.oppdaterBruker(json, rolle, (status, data) => {
				console.log('oppdaterer ansatt');
				super.query(
					'UPDATE ansatt SET fornavn = ?, etternavn = ?, telefon = ? WHERE bruker_id = ?',
					[ json.fornavn, json.etternavn, json.telefon, rolle.bruker_id ],
					callback
				);
			});
		} else {
			console.log('oppdaterer bruker');
			this.oppdaterBruker(json, rolle, (status, data) => {
				console.log('oppdaterer admin');
				super.query(
					'UPDATE admin SET telefon = ?, navn = ? WHERE bruker_id = ?',
					[ json.telefon, json.navn, rolle.bruker_id ],
					callback
				);
			});
		}
	}

	/**
   * Metode for å oppdatere brukertabellen. Blir brukt i {@link oppdaterSpesifisertBrukerAdmin}
   * @param {json} json - En json med all ny informasjon til brukeren.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
	oppdaterAnnenBruker(json, callback) {
		super.query(
			'UPDATE bruker SET epost = ?, kommune_id = ? WHERE bruker_id = ?',
			[ json.epost, json.kommune_id, json.bruker_id ],
			callback
		);
	}

	//TESTES
	/** 
   * Metode for å oppdatere brukertabellen. Blir brukt i {@link oppdaterSpesifisertBruker}
   * @param {json} json - En json med all ny informasjon til brukeren.
   * @param {json} rolle - En json med rollen og iden til brukeren.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
	oppdaterBruker(json, rolle, callback) {
		super.query(
			'UPDATE bruker SET epost = ?, kommune_id = ? WHERE bruker_id = ?',
			[ json.epost, json.kommune_id, rolle.bruker_id ],
			callback
		);
	}

	/**
   * Metode for å sjekke om en spesifisert feil er registrert i en spesifisert kommune.
   * @param {json} json - En json med iden til kommunen og feilen.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
	sjekkFeilPaaKommune(json, callback) {
		super.query(
			'SELECT * FROM feil WHERE kommune_id = ? AND feil_id = ?',
			[ json.kommnune_id, json.feil_id ],
			callback
		);
	}

	/**
   * En metode for å hente alle bedriftsbrukere.
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
	hentBedrifter(callback) {
		super.query("SELECT bedrift.*,bruker.epost FROM `bedrift`,bruker WHERE bedrift.bruker_id=bruker.bruker_id", [], callback);
	}

	/**
   * Metode for å hente all brukerinformasjonen til en spesifisert bruker med en spesifisert rolle.
   * @param {number} bruker_id - Iden til brukeren
   * @param {string} rolle - Rollen til brukeren
   * @param {function} callback - funksjonen som kalles når du har kjørt databasekallet.
   */
	hentBrukerInfo(bruker_id, rolle, callback) {
		switch (rolle) {
			case 'privat':
				super.query(
					'SELECT fornavn, etternavn, epost, kommune_id, kommune_navn, sist_innlogget, hendelsevarsling FROM bruker INNER JOIN privat USING (bruker_id) INNER JOIN kommuner USING(kommune_id) WHERE bruker_id = ?',
					[ bruker_id ],
					callback
				);
				break;
			case 'ansatt':
				super.query(
					'SELECT fornavn, etternavn, epost, telefon, kommune_id, kommune_navn FROM bruker INNER JOIN ansatt USING (bruker_id) INNER JOIN kommuner USING(kommune_id) WHERE bruker_id = ?',
					[ bruker_id ],
					callback
				);
				break;
			case 'bedrift':
				super.query(
					'SELECT epost, orgnr, navn, telefon, kommune_id, kommune_navn FROM bruker INNER JOIN bedrift USING (bruker_id) INNER JOIN kommuner USING(kommune_id) WHERE bruker_id = ?',
					[ bruker_id ],
					callback
				);
				break;
			case 'admin':
				super.query(
					'SELECT epost, telefon, navn, kommune_id, kommune_navn FROM bruker INNER JOIN admin USING (bruker_id) INNER JOIN kommuner USING(kommune_id) WHERE bruker_id = ?',
					[ bruker_id ],
					callback
				);
				break;
			default:
				callback(403, { resultat: 'feilet' });
		}
	}
};
