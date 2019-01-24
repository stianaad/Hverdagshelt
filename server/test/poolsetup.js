import mysql from 'mysql';

/**
 * Pool brukt av dao klasser for å gi tilkobling til databasen - bruker mysql serveren gitt av ntnu
 */
export var pool = mysql.createPool({
  connectionLimit: 5,
  host: 'mysql.stud.iie.ntnu.no',
  user: 'bjornost',
  password: 'lOQEZcZM',
  database: 'bjornost',
  debug: false,
  multipleStatements: true,
});

/**
 * @deprecated ble kun brukt for å kjøre tester lokalt. 
 */
export var localTestPool = mysql.createPool({
  connectionLimit: 5,
  host: 'mysql.stud.iie.ntnu.no',
  user: 'oivindhl',
  password: 'ERvvcANcF',
  database: 'oivindhl',
  debug: false,
  multipleStatements: true,
});
