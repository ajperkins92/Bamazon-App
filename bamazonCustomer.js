// Reference the external applications we'll be using
require('dotenv').config();
const inquirer = require("inquirer");
const mysql = require("mysql");
require("console.table");

console.log("Welcome to Bamazon!");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) {
        console.error("Error Connecting: " + err.stack);
    };
    console.log("Bamazon Database is loaded!".blue);
    loadProducts();
});


// Function to load the products table from the database and print results to the console
function loadProducts() {
    connection.query("SELECT * FROM products",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            promptCustomerForItem(res);
        });
};


// Prompt the customer for a product ID
function promptCustomerForItem(inventory) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "choice",
                message: "What is the ID of the item you would like to purchase? [Quit with Q]",
                validate: function (val) {
                    return !isNaN(val) || val.toLowerCase() === "q";
                }
            }
        ])
        .then(function (val) {
            checkIfShouldExit(val.choice);
            var choiceId = parseInt(val.choice);
            var product = checkInventory(choiceId, inventory);

            if (product) {
                promptCustomerForQuanity(product);
            }
            else {
                console.log("\nThat item is not in the inventory.");
                loadProducts();
            };
        });
};

// Prompt the customer for a product quantity
function promptCustomerForQuantity(product) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "quantity",
                message: "How many would you like? [Quit with Q]",
                validate: function (val) {
                    return val > 0 || val.toLowerCase() === "q";
                }
            }
        ])
        .then(function (val) {
            checkIfShouldExit(val.quantity);
            var quantity = parseInt(val.quantity);
            // Let user know if there isn't sufficient quantity
            if (quantity > product.stock_quantity) {
                console.log("\nInsufficient quantity!");
                loadProducts();
            } else {
                // Run makePurchase
                makePurchase(product, quantity);
            }
        });
};

function makePurchase(product, quantity) {
    connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", [quantity, product.item_id], function (err, res) {
            console.log("\nSuccessfully purchased " + quantity + " " + product.product_name + "'s!");
            loadProducts();
        }
    );
};

// Function to check if the product exists in inventory
function checkInventory(choiceId, inventory) {
    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i].item_id === choiceId) {
            // If a matching product is found, return the product
            return inventory[i];
        }
    }
    // Otherwise return null 
    return null;
};

// Quit function
function checkIfShouldExit(choice) {
    if (choice.toLowerCase() === "q") {
        console.log("Goodbye!");
        process.exit(0);
    }
}