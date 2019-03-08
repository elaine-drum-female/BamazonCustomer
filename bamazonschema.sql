CREATE DATABASE products_db;

USE products_gb;

CREATE TABLE `products` (
  `item_id` int(11) NOT NULL,
  `product_name` varchar(45) NOT NULL,
  `department_name` varchar(45) NOT NULL,
  `price` decimal(10,4) DEFAULT NULL,
  `stock_quantity` int(11) DEFAULT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
