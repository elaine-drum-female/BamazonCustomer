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

function displayProducts() {
    inquirer.prompt({
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: ["Choose an item", "Exit"]
    }).then(function (answer) {
        // Another way to do If statements
        // User will "choose either item" or "exit"
        switch (answer.action) {
            case "Choose an item":
                displayProducts();
                break;

            case "Exit":
                connection.end();
                break;
        }
    });
}

// Declare Global Variables

var welcome = "\n **********************************\n" +
    " ****     WELCOME TO BAMAZON   ***** \n" +
    " ****   Please let me know if you need any assistance.   **** \n" +
    " ****          Happy browsing!   **** \n\r"

var goodbye = "\n **********************************\n" +
    " ****     THANKS FOR SHOPPING AT BAMAZON   ***** \n" +
    " ****  Have a great day!   **** \n"

// Display Products to show all the items that are for sale

function displayProducts() {
    console.log(welcome);

    // Connect to Bamazon_db in order to select all items from products table

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        // Loop over how many response items are in its length
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id +
                " || Product Name: " + res[i].product_name + " || Price: " + res[i].price);
        }

    });
}