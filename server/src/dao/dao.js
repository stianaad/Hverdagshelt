import * as mysql from 'mysql2';

module.exports = class Dao {
	pool;
	constructor(pool) {
		// Dependency Injection
		this.pool = pool;
	}
	query(sql, params, callback) {
		this.pool.getConnection((err, connection) => {
			console.log('dao: koblet til database');
			if (err) {
				console.log('dao: feil ved oppkobling');
				callback(500, { error: 'feil ved oppkobling' });
			} else {
				console.log('dao: kjører sql: ' + sql);
				connection.query(sql, params, (err, rows) => {
					connection.release();
					if (err) {
						console.log(err);
						callback(500, { error: 'error querying' });
					} else {
						console.log('dao: returning rows');
						callback(200, rows);
					}
				});
			}
		});
	}
};
