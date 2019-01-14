import mysql from 'mysql';

export var pool = mysql.createPool({
    connectionLimit: 5,
    host: '10.24.75.138',
    user: 'bjornost',
    password: '-.,jegheter12345',
    database: 'bjornost',
    debug: false,
    multipleStatements: true,
  });
