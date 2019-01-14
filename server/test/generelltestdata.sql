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
    kommune_id INT(11) NOT NULL,
    subkategori_id INT(11) NOT NULL,
    overskrift VARCHAR(255) NOT NULL,
    beskrivelse TEXT NOT NULL,
    lengdegrad DOUBLE NOT NULL,
    breddegrad DOUBLE NOT NULL,
    PRIMARY KEY (feil_id),
    FOREIGN KEY (kommune_id) REFERENCES kommuner(kommune_id),
    FOREIGN KEY (subkategori_id) REFERENCES subkategori(subkategori_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE feilbilder (
    bilde_id INT(11) NOT NULL AUTO_INCREMENT,
    feil_id INT(11) NOT NULL,
    url VARCHAR(255) NOT NULL,
    PRIMARY KEY (bilde_id),
    FOREIGN KEY (feil_id) REFERENCES feil(feil_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE oppdatering (
    feil_id INT(11) NOT NULL,
    tid TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    kommentar TEXT,
    status_id INT(1) NOT NULL DEFAULT 1,
    bruker_id INT(11),
    PRIMARY KEY (feil_id, tid),
    FOREIGN KEY (feil_id) REFERENCES feil(feil_id),
    FOREIGN KEY (bruker_id) REFERENCES bruker(bruker_id),
    FOREIGN KEY (status_id) REFERENCES status(status_id)
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
  overskrift VARCHAR(255) NOT NULL,
  tid TIMESTAMP NOT NULL,
  beskrivelse TEXT,
  sted VARCHAR(255) NOT NULL,
  bilde VARCHAR(255),
  lengdegrad DOUBLE,
  breddegrad DOUBLE,
  PRIMARY KEY (hendelse_id),
  FOREIGN KEY (bruker_id) REFERENCES bruker(bruker_id),
  FOREIGN KEY (hendelseskategori_id) REFERENCES hendelseskategori(hendelseskategori_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO bruker (epost, passord, kommune_id) VALUES
  ('epost1@hotmail.com', 'passord1', 12),
  ('epost2@hotmail.com', 'passord2', 24),
  ('epost3@hotmail.com', 'passord3', 333),
  ('epost4@hotmail.com', 'passord4', 351),
  ('epost5@hotmail.com', 'passord5', 51),
  ('epost6@hotmail.com', 'passord6', 67),
  ('epost7@hotmail.com', 'passord7', 257),
  ('epost8@hotmail.com', 'passord8', 128),
  ('epost9@hotmail.com', 'passord9', 359),
  ('epost10@hotmail.com', 'passord10', 150);

INSERT INTO privat (bruker_id, fornavn, etternavn) VALUES
  (1, 'ForPrivat1', 'EtterPrivat1'),
  (2, 'ForPrivat2', 'EtterPrivat2'),
  (3, 'ForPrivat3', 'EtterPrivat3'),
  (4, 'ForPrivat4', 'EtterPrivat4');

INSERT INTO ansatt (bruker_id, fornavn, etternavn, telefon) VALUES
  (5, 'ForAnsatt5', 'EtterAnsatt5', 41000000),
  (6, 'ForAnsatt6', 'EtterAnsatt6', 41000001);

INSERT INTO bedrift (bruker_id, orgnr, navn, telefon) VALUES
  (7, 1200600, 'Bedrift7', 41000002),
  (8, 1200601, 'Bedrift8', 41000003);

INSERT INTO admin (bruker_id, telefon, navn) VALUES 
  (9, 41000004, 'Admin9'),
  (10, 41000005, 'Admin10');

INSERT INTO hovedkategori (kategorinavn) VALUES 
  ('Hovedkategori1'),
  ('Hovedkategori2'),
  ('Hovedkategori3'),
  ('Hovedkategori4');

INSERT INTO subkategori (kategorinavn, hovedkategori_id) VALUES
  ('Subkat1', 1),
  ('Subkat2', 1),
  ('Subkat3', 1),
  ('Subkat4', 2),
  ('Subkat5', 2),
  ('Subkat6', 3);

INSERT INTO status (status_id, status) VALUES 
  (1, 'Ikke godkjent'),
  (2, 'Under behandling'),
  (3, 'Ferdig');

INSERT INTO feil (kommune_id, subkategori_id, overskrift, beskrivelse, lengdegrad, breddegrad) VALUES
  (1, 1, 'Overskrift1', 'Beskrivelse1', 0.1, 0.0),
  (20, 2, 'Overskrift2', 'Beskrivelse2', 0.0, 0.2),
  (30, 2, 'Overskrift3', 'Beskrivelse3', 0.3, 0.3),
  (40, 4, 'Overskrift4', 'Beskrivelse4', 0.4, 4.0),
  (50, 3, 'Overskrift5', 'Beskrivelse5', 5.0, 5.0),
  (60, 6, 'Overskrift6', 'Beskrivelse6', 60.0, 6.0);

INSERT INTO feilbilder (feil_id, url) VALUES 
  (1, 'https://bjornost.tihlde.org/hverdagshelt/b25b28c741e520d695615dee3ac2dc4a'),
  (2, 'https://bjornost.tihlde.org/hverdagshelt/b013fad50c0d518f4384d842ab451547'),
  (3, 'https://bjornost.tihlde.org/hverdagshelt/ac78b6d904ceb783e9da802a5c84ea7b'),
  (4, 'https://bjornost.tihlde.org/hverdagshelt/135d6d0f44a6ba73e3782c243663b90a'),
  (5, 'https://bjornost.tihlde.org/hverdagshelt/19af4f8c745a62973e2cd615eaf329fa');

INSERT INTO oppdatering (feil_id, kommentar, status_id, bruker_id) VALUES
  (1, 'Kommentar1', 1, 5),
  (2, 'Kommentar2', 2, 5),
  (3, 'Kommentar3', 3, 6),
  (4, 'Kommentar4', 3, 6);

INSERT INTO hendelseskategori (kategorinavn) VALUES 
  ('HendelseKat1'),
  ('HendelseKat2');

INSERT INTO hendelser (bruker_id, hendelseskategori_id, overskrift, tid, beskrivelse, sted, bilde, lengdegrad, breddegrad) VALUES
  (5, 1, 'Overskrift1', ('2019-08-07'), 'Beskrivelse1', 'Sted1', 'https://bjornost.tihlde.org/hverdagshelt/135d6d0f44a6ba73e3782c243663b90a', 0.0, 0.0),
  (6, 2, 'Overskrift2', ('2019-12-20'), 'Beskrivelse2', 'Sted2', 'https://bjornost.tihlde.org/hverdagshelt/19af4f8c745a62973e2cd615eaf329fa', 1.0, 0.1);