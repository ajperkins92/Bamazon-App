// Reference the external applications we'll be using
require('dotenv').config();
const inquirer = require("inquirer");
const mysql = require("mysql");
require("console.table");
var colors = require('colors');

// Creates MYSQL bamazon database variable
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "bamazon_db"
});

// Creates connection with server and loads manager menu upon successful connection
connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack)
    };
    loadManagerMenu();
});

// Get product date from bamazon_db
function loadManagerMenu() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        loadManagerOptions(res);
    });
}

// Load manager options - pass product data to manager options
function loadManagerOptions(products) {
    inquirer
        .prompt({
            type: "list",
            name: "choice",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],
            message: "What would you like to do?".green
        })
        .then(function (val) {
            switch (val.choice) {
                case "View Products for Sale":
                    console.table(products);
                    loadManagerMenu();
                    break;
                case "View Low Inventory":
                    loadLowInventory();
                    break;
                case "Add to Inventory":
                    addToInventory(products);
                    break;
                case "Add New Product":
                    promptManagerForNewProduct(products);
                    break;
                default:
                    console.log("Goodbye!".yellow);
                    process.exit(0);
                    break;
            }
        });
};

// Function to query the bamazon_db for low inventory
function loadLowInventory() {
    // Selects all products with a quantity of 5 or less
    connection.query("SELECT * FROM products WHERE stock_quantity <=5", function (err, res) {
        if (err) throw err;
        console.table(res);
        loadManagerMenu();
    })
};

// Prompt the manager for a product to replenish
function addToInventory(inventory) {
    console.table(inventory);
    inquirer
        .prompt([
            {
                type: "input",
                name: "choice",
                message: "What is the ID of the item you would like to add to?".green,
                validate: function (val) {
                    return !isNaN(val);
                }
            }
        ])
        .then(function (val) {
            var choiceId = parseInt(val.choice);
            var product = checkInventory(choiceId, inventory);
            // If a product can be found with that ID pass it to promptCustomerForQuantity -> otherwise reload menu
            if (product) {
                promptManagerForQuantity(product);
            } else {
                console.log("\nThat item is not in the inventory".red);
                loadManagerMenu();
            }
        });
};

// Ask for quantity to add to a chosen product
function promptManagerForQuantity(product) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "quantity",
                message: "How many would you like to add?".green,
                validate: function (val) {
                    return val > 0;
                }
            }
        ])
        .then(function (val) {
            var quantity = parseInt(val.quantity);
            addQuantity(product, quantity);
        });
};

// Update quantity of a selected product
function addQuantity(product, quantity) {
    connection.query(
        "UPDATE products SET stock_quantity = ? WHERE item_id = ?", [product.stock_quantity + quantity, product.item_id],
        function (err, res) {
            console.log("\nSuccessfully added " + quantity + " " + product.product_name + "s!\n");
            loadManagerMenu();
        }
    );
};

// Function to add a new product to the store
function promptManagerForNewProduct(products) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "product_name",
                message: "What is the name of the product you would like to add?".green
            },
            {
                type: "list",
                name: "department_name",
                choices: getDepartments(products),
                message: "Which department does this product fall into?".green
            },
            {
                type: "input",
                name: "price",
                message: "How much does it cost?".green,
                validate: function (val) {
                    return val > 0;
                }
            },
            {
                type: "input",
                name: "quantity",
                message: "How many should we add?".green,
                validate: function (val) {
                    return !isNaN(val);
                }
            }
        ])
        .then(addNewProduct);
};

// Function to add the new product to the database
function addNewProduct(val) {
    connection.query(
        "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",
        [val.product_name, val.department_name, val.price, val.quantity],
        function (err, res) {
            if (err) throw err;
            console.log(val.product_name + " added to the store!\n")
            loadManagerMenu();
        }
    );
};

// Take array of product objects, return array of their departments
function getDepartments(products) {
    var departments = [];
    for (var i = 0; i < products.length; i++) {
        if (departments.indexOf(products[i].department_name) === -1) {
            departments.push(products[i].department_name);
        }
    }
    return departments;
};


// Validate inventory selection
function checkInventory(choiceId, inventory) {
    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i].item_id === choiceId) {
            return inventory[i];
        }
    }
    return null;
};