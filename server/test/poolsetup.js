import mysql from 'mysql';

export var pool = mysql.createPool({
  connectionLimit: 5,
  host: 'mysql.stud.iie.ntnu.no',
  user: 'bjornost',
  password: 'lOQEZcZM',
  database: 'bjornost',
  debug: false,
  multipleStatements: true,
});

export var localTestPool = mysql.createPool({
  connectionLimit: 5,
  host: 'mysql.stud.iie.ntnu.no',
  user: 'oivindhl',
  password: 'ERvvcANcF',
  database: 'oivindhl',
  debug: false,
  multipleStatements: true,
});
