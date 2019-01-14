import mysql from 'mysql';

export var pool = mysql.createPool({
    connectionLimit: 5,
    host: 'mysql.stud.iie.ntnu.no',
    user: 'bjornost',
    password: 'bjornost',
    database: 'bjornost',
    debug: false,
    multipleStatements: true,
  });
