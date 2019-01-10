import mysql from 'mysql2';

import FeilDao from '../../dao/feildao';
import run from '../runsqlfile.js';
import Ansatt, Admin, Bedrift,  from '../../../client/src/services/feilService';
import pool from '../poolsetup';