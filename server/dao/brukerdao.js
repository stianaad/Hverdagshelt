const Dao = require("./dao.js");

module.exports = class brukerdao extends Dao {

    lagNyBruker(sakNrStart, callback){
        super.query(
            "INSERT INTO bruker VALUES()", 
            [],
            callback
        );
    }
}