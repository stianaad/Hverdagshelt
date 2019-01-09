const express = require('express');
const router = express.Router();
var mysql = require("mysql");
var bodyParser = require("body-parser");
const brukerdao = require("../dao/brukerdao.js");

var pool = mysql.createPool({
    connectionLimit: 5,
    host: "mysql.stud.iie.ntnu.no",
    user: "jonathm",
    password: "tFSnz90b",
    database: "jonathm",
    debug: false,
    multipleStatements: true
});

let brukerDao = new brukerdao(pool);

router.post("/test", (req, res) => {
  console.log("Fikk POST-request fra klienten");
  brukerDao.lagNyBruker(req.body, (status, data) => {
    res.status(status);
    res.json(data);
    console.log(data.insertId);
  });
});

module.exports = router;