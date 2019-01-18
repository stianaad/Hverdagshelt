DROP TABLE IF EXISTS feilfolg;
DROP TABLE IF EXISTS hendfolg;
DROP TABLE IF EXISTS hendelser;
DROP TABLE IF EXISTS hendelseskategori;
DROP TABLE IF EXISTS oppdatering;
DROP TABLE IF EXISTS feilbilder;
DROP TABLE IF EXISTS feil;
DROP TABLE IF EXISTS status;
DROP TABLE IF EXISTS subkategori;
DROP TABLE IF EXISTS hovedkategori;
DROP TABLE IF EXISTS admin;
DROP TABLE IF EXISTS bedrift;
DROP TABLE IF EXISTS ansatt;
DROP TABLE IF EXISTS privat;
DROP TABLE IF EXISTS bruker;
DROP TABLE IF EXISTS kommuner;
DROP TABLE IF EXISTS fylker;

CREATE TABLE fylker (
    fylke_navn VARCHAR(255) NOT NULL,
    PRIMARY KEY (fylke_navn)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE kommuner (
    kommune_id INT(11) NOT NULL AUTO_INCREMENT,
    kommune_navn VARCHAR(255) NOT NULL,
    fylke_navn VARCHAR(255) NOT NULL,
    PRIMARY KEY (kommune_id),
    FOREIGN KEY (fylke_navn) REFERENCES fylker(fylke_navn)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE bruker (
    bruker_id INT(11) NOT NULL AUTO_INCREMENT,
    epost VARCHAR(255) NOT NULL,
    passord TEXT(270) NOT NULL,
    kommune_id INT(11),
    PRIMARY KEY (bruker_id),
    FOREIGN KEY (kommune_id) references kommuner(kommune_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE privat (
    bruker_id INT(11) NOT NULL,
    fornavn VARCHAR(255) NOT NULL,
    etternavn VARCHAR(255) NOT NULL,
    PRIMARY KEY (bruker_id),
    FOREIGN KEY (bruker_id) REFERENCES bruker(bruker_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE ansatt (
    bruker_id INT(11) NOT NULL,
    fornavn VARCHAR(255) NOT NULL,
    etternavn VARCHAR(255) NOT NULL,
    telefon VARCHAR(20) NOT NULL,
    PRIMARY KEY (bruker_id),
    FOREIGN KEY (bruker_id) REFERENCES bruker(bruker_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE bedrift (
    bruker_id INT(11) NOT NULL,
    orgnr INT(9) NOT NULL,
    navn VARCHAR(255) NOT NULL,
    telefon VARCHAR(20) NOT NULL,
    PRIMARY KEY (bruker_id),
    FOREIGN KEY (bruker_id) REFERENCES bruker(bruker_id) 
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE admin (
    bruker_id INT(11) NOT NULL,
    telefon VARCHAR(20) NOT NULL,
    navn VARCHAR(255) NOT NULL,
    PRIMARY KEY (bruker_id),
    FOREIGN KEY (bruker_id) REFERENCES bruker(bruker_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE hovedkategori (
    hovedkategori_id INT(11) NOT NULL AUTO_INCREMENT,
    kategorinavn VARCHAR(255) NOT NULL,
    PRIMARY KEY (hovedkategori_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE subkategori (
    subkategori_id INT(11) NOT NULL AUTO_INCREMENT,
    kategorinavn VARCHAR(255) NOT NULL,
    hovedkategori_id INT(11) NOT NULL,
    PRIMARY KEY (subkategori_id),
    FOREIGN KEY (hovedkategori_id) REFERENCES hovedkategori(hovedkategori_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE status (
    status_id INT(1) NOT NULL,
    status VARCHAR(255) NOT NULL,
    PRIMARY KEY (status_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE feil (
    feil_id INT(11) NOT NULL AUTO_INCREMENT,
    bruker_id INT(11) NOT NULL,
    kommune_id INT(11) NOT NULL,
    subkategori_id INT(11) NOT NULL,
    overskrift VARCHAR(255) NOT NULL,
    beskrivelse TEXT NOT NULL,
    lengdegrad DOUBLE NOT NULL,
    breddegrad DOUBLE NOT NULL,
    PRIMARY KEY (feil_id),
    FOREIGN KEY (kommune_id) REFERENCES kommuner(kommune_id),
    FOREIGN KEY (bruker_id) REFERENCES bruker(bruker_id),
    FOREIGN KEY (subkategori_id) REFERENCES subkategori(subkategori_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE feilbilder (
    bilde_id INT(11) NOT NULL AUTO_INCREMENT,
    feil_id INT(11) NOT NULL,
    url VARCHAR(255) NOT NULL,
    PRIMARY KEY (bilde_id),
    FOREIGN KEY (feil_id) REFERENCES feil(feil_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE oppdatering (
    feil_id INT(11) NOT NULL,
    tid TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    kommentar TEXT,
    status_id INT(1) NOT NULL DEFAULT 1,
    bruker_id INT(11),
    PRIMARY KEY (feil_id, tid),
    FOREIGN KEY (feil_id) REFERENCES feil(feil_id) ON DELETE CASCADE,
    FOREIGN KEY (bruker_id) REFERENCES bruker(bruker_id) ON DELETE CASCADE , 
    FOREIGN KEY (status_id) REFERENCES status(status_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE hendelseskategori(
  hendelseskategori_id INT(11) NOT NULL AUTO_INCREMENT,
  kategorinavn VARCHAR(255) NOT NULL,
  PRIMARY KEY (hendelseskategori_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE hendelser(
    hendelse_id INT(11) NOT NULL AUTO_INCREMENT,
    bruker_id INT(11) NOT NULL,
    hendelseskategori_id INT(11) NOT NULL,
    kommune_id INT(11) NOT NULL,
    overskrift VARCHAR(255) NOT NULL,
    tid TIMESTAMP NOT NULL,
    beskrivelse TEXT,
    sted VARCHAR(255) NOT NULL,
    bilde VARCHAR(255),
    lengdegrad DOUBLE,
    breddegrad DOUBLE,
    PRIMARY KEY (hendelse_id),
    FOREIGN KEY (bruker_id) REFERENCES bruker(bruker_id),
    FOREIGN KEY (hendelseskategori_id) REFERENCES hendelseskategori(hendelseskategori_id),
    FOREIGN KEY (kommune_id) REFERENCES kommuner(kommune_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE feilfolg(
    feil_id INT(11) NOT NULL,
    bruker_id INT(11) NOT NULL,
    PRIMARY KEY (feil_id, bruker_id),
    FOREIGN KEY (feil_id) REFERENCES feil(feil_id) ON DELETE CASCADE,
    FOREIGN KEY (bruker_id) REFERENCES bruker(bruker_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE hendfolg(
    hendelse_id INT(11) NOT NULL,
    bruker_id INT(11) NOT NULL,
    PRIMARY KEY (hendelse_id, bruker_id),
    FOREIGN KEY (hendelse_id) REFERENCES hendelser(hendelse_id),
    FOREIGN KEY (bruker_id) REFERENCES bruker(bruker_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;