const Dao = require("./dao.js");

module.exports = class Generelldao extends Dao {
    hentAlleKommuner(callback){
        super.query(
            "SELECT * FROM kommuner ORDER BY kommune_navn ASC ", 
            [],
            callback
        );
    }
}