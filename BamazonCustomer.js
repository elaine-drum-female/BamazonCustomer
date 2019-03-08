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

// Prompt user by asking what h/she would like to do

function displayProducts(){
    inquirer.prompt({
        name:"action",
        type:"rawlist",
        message:"What would you like to do?",
        choices: [ "Choose an item", "Exit"
        ]
    }).then(function (answer) {
        // Another way to do If statements
        // User will "choose either item" or "exit"
        switch(answer.action) {
            case "Choose an item":
            displayProducts();
            break;

            case "Exit":
            connection.end();
            break;
        }
    });
}
