import mysql from 'mysql2';

import HendelseDao from '../../dao/hendelsedao';
import run from '../runsqlfile.js';
import Hendelse from '../../../client/src/services/hendelseService';
import {pool} from '../poolsetup';

let hendelseDao = new HendelseDao(pool);

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
