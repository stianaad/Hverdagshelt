DROP TABLE IF EXISTS hendelser;
DROP TABLE IF EXISTS oppdatering;
DROP TABLE IF EXISTS status;
DROP TABLE IF EXISTS feil;
DROP TABLE IF EXISTS kategori;
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

CREATE TABLE kategori (
    kategori_id INT(11) NOT NULL AUTO_INCREMENT,
    hoved VARCHAR(255) NOT NULL,
    kategori VARCHAR(255) NOT NULL,
    PRIMARY KEY (kategori_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE feil (
    feil_id INT(11) NOT NULL AUTO_INCREMENT,
    kommune_id INT(11) NOT NULL,
    kategori_id INT(11) NOT NULL,
    overskrift VARCHAR(255) NOT NULL,
    beskrivelse TEXT NOT NULL,
    bilde VARCHAR(255) NOT NULL,
    lengdegrad DOUBLE NOT NULL,
    breddegrad DOUBLE NOT NULL,
    PRIMARY KEY (feil_id),
    FOREIGN KEY (kommune_id) REFERENCES kommuner(kommune_id),
    FOREIGN KEY (kategori_id) REFERENCES kategori(kategori_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE status (
    status VARCHAR(255) NOT NULL,
    PRIMARY KEY (status)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE oppdatering (
    feil_id INT(11) NOT NULL,
    tid TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    kommentar TEXT,
    status VARCHAR(255) NOT NULL,
    bruker_id INT(11),
    PRIMARY KEY (feil_id, tid),
    FOREIGN KEY (feil_id) REFERENCES feil(feil_id),
    FOREIGN KEY (bruker_id) REFERENCES bruker(bruker_id),
    FOREIGN KEY (status) REFERENCES status(status)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE hendelser(
    hendelse_id INT(11) NOT NULL AUTO_INCREMENT,
    bruker_id INT(11) NOT NULL,
    overskrift VARCHAR(255) NOT NULL,
    tid TIMESTAMP NOT NULL,
    beskrivelse TEXT,
    sted VARCHAR(255) NOT NULL,
    bilde VARCHAR(255),
    lengdegrad DOUBLE,
    breddegrad DOUBLE,
    PRIMARY KEY (hendelse_id),
    FOREIGN KEY (bruker_id) REFERENCES bruker(bruker_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;