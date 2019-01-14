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