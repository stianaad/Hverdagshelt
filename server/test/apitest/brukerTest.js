import mysql from 'mysql2';

import BrukerDao from '../../dao/brukerdao';
import run from '../runsqlfile.js';
import Ansatt, Admin, Bedrift, Privat from '../../../client/src/services/feilService';
import {pool} from '../poolsetup';

let brukerDao = new BrukerDao(pool);

beforeAll(done => {
  run('../lagtabeller.sql', pool, () => {
    run('../fylkekommunedata.sql',pool, () => {
        run('../generelltestdata.sql', pool, done);
    });
  });
});

afterAll(() => {
  pool.end();
});
