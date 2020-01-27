-- Drops the programming_db if it already exists --
DROP DATABASE IF EXISTS bamazon_db;
-- Create a database called programming_db --
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
  -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows. --
  item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(50),
  department_name VARCHAR(50),
  price INTEGER(11),
  stock_quantity INTEGER(11),
  -- with true when a new row is made and the value isn't otherwise defined. --
  PRIMARY KEY (item_id)
);

-- Creates new rows
INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES (123 , "Scythe", "Board Games", 75, 3);


INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES (234 , "Terraforming Mars", "Board Games", 60, 5);


INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES (345 , "Dale of Merchants", "Board Games", 25, 7);


INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES ("456", "Merchants and Marauders", "Board Games", 50, 3);


INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES ("567", "Settlers of Catan", "Board Games", 40, 20);


INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES ("678", "Dominion", "Board Games", 35, 5);


INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES ("789", "Pandemic", "Board Games", 20, 5);


INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES ("891", "Cat Lady", "Board Games", 15, 7);


INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES ("901", "Firefly: The Board Game", "Board Games", 50, 1);

SELECT*FROM products;
