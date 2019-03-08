// Declare Variables
var mysql = require("mysql");
var inquirer = require("inquirer");

// Create connection to the MySQL Database
var connection = mysql.createConnection({

    // Your Host
    host: "localhost",

    // Port Number, if not 3306
    port: 3306,

    // Username
    user: "root",

    //Password
    password: "password",

    //Database
    database: "bamazon_db"
});

// Connect to the MySQL Server and Database

connection.connect(function (err) {
    //If error, throw err otherwise runSearch
    if (err) throw err;
    runSearch();
});