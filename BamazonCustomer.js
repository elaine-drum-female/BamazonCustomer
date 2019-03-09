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

function runSearch() {
    inquirer.prompt({
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: ["Choose an item", "Exit"]
    }).then(function (answer) {
        // Another way to do If statements
        // User will "choose either item" or "Exit"
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

            console.log("==================================");

            // Prompting user for the name on the ID of the product h/she would like to buy

            inquirer.prompt({
                name: "item_id",
                message: "What is the ID of the product you would like to purchase?",
                type: "input",
                validate: function (value) {

                    //Checking whether item_id is a number and if it exists
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        console.log("\n Please enter a valid item ID.");
                        return false;
                    }
                }
            }).then(function (answer) {
                    // Connect to Bamazon_db in order to select all items from products table and to filter out rows based on their conditions
                    connection.query("SELECT item_id, product_name, price FROM products WHERE ?", {
                            item_id: answer.item_id
                        }, function(err, res) {
                            for (var i = 0; i < res.length; i++) {
                                console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: " + res[i].price);
                            }
                        },

                        // Prompting user on the number of units based on the product they would like to purchase. 

                        inquirer.prompt({
                            name: "qty",
                            message: "How many units are you wanting to buy?",
                            type: "input",
                            validate: function (value) {
                                if (isNaN(value) === false) {
                                    return true;
                                } else {
                                    console.log("\n Please enter a valid quantity.");
                                    return false;
                                }
                            }
                        })

                    );
            });
    });
};