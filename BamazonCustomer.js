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
    database: "bamazon_DB"
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
                            connection.query("SELECT * FROM products WHERE ?", {
                                        item_id: answer.item_id
                                    }, function (err, res) {
                                        for (var i = 0; i < res.length; i++) {
                                            console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: " + res[i].price);
                                        }
                                
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
                                    }).then(function (answer) {
                                            for (var i = 0; i < res.length; i++) {
                                                //Capturing and storing the values of: prices, quantity, the users quantity and the total
                                                var price = res[i].price;

                                                //Converting the qty value to an integer
                                                var qty = parseInt(res[i].stock_quantity);
                                                var qtyNum = parseInt(answer.qty);
                                                var total;

                                                if (qty >= qtyNum) {
                                                    var quantityLeft = qty - qtyNum;

                                                    console.log("Updating all inquiries...\n");

                                                    connection.query("UPDATE products SET ? WHERE ?",
                                                        [{
                                                                stock_quantity: quantityLeft
                                                            },

                                                            {
                                                                item_id: res[i].item_id
                                                            }
                                                        ],

                                                        function () {
                                                            runSearch();
                                                        }

                                                    );

                                                    for (var i = 0; i < res.length; i++) {
                                                        total = parseInt(price * qtyNum);

                                                        console.log("Congrats! You bought " + res[i].item_id + " " + res[i].product_name + " for " + "$" + total.toFixed() + " successfully!");
                                                    }

                                                    console.log(goodbye);

                                                } else if (qtyNum === 0){
                                                    console.log("Please enter an ID");
                                                    runSearch();

                                                } else {
                                                    console.log("Insufficient quantity!");
                                                    runSearch();
                                                }
                                            
                                    };

                            });

                });
                                
            });
    });
};