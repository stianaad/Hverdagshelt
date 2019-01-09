const Dao = require("./dao.js");

module.exports = class Brukerdao extends Dao {
    lagNyBruker(json, callback){
        const tabell = [json.epost,json.passord,json.kommune_id];
        super.query(
            "INSERT INTO bruker VALUES(DEFAULT,?,?,?)", 
            tabell,
            callback
        );
    }
}