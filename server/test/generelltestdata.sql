INSERT INTO bruker (epost, passord, kommune_id) VALUES
  ('epost1@hotmail.com', 'passord1', 12),
  ('epost2@hotmail.com', 'passord2', 24),
  ('epost3@hotmail.com', 'passord3', 333),
  ('epost4@hotmail.com', 'passord4', 422),
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

INSERT INTO ansatt (bruker_id, fornavn, etternavn) VALUES
  (5, 'ForAnsatt5', 'EtterAnsatt5', 41000000),
  (6, 'ForAnsatt6', 'EtterAnsatt6', 41000001);

INSERT INTO bedrift (bruker_id, orgnr, navn, telefon) VALUES
  (7, 1200600, 'Bedrift7', 41000002),
  (8, 1200601, 'Bedrift8', 41000003);

INSERT INTO admin (bruker_id, telefon, navn) VALUES 
  (9, 41000004, 'Admin9'),
  (10, 41000005, 'Admin10');