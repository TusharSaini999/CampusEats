-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: campuseats-owube-7e62.c.aivencloud.com    Database: campuseats
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '753b858e-d168-11ef-81c1-16d815805ca9:1-972';

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vendor_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `image_url` text,
  `availability` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `vendor_id` (`vendor_id`),
  CONSTRAINT `menu_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (1,1,'Pizza Margherita','Classic Italian pizza with mozzarella ',9.90,'Snacks','/images/pizza.jpg',0,'2024-12-16 01:04:32'),(2,2,'Cheeseburger','Juicy beef burger with cheddar cheese',7.99,'Fast Food','/images/cheeseburger.jpg',1,'2024-12-16 01:04:32'),(4,3,'Pasta Alfredo','Creamy Alfredo sauce with fettuccine',8.99,'Main Course','/images/pasta-alfredo.jpg',1,'2024-12-16 01:04:32'),(5,2,'Chocolate Cake','Rich chocolate sponge cake',4.99,'Desserts','/images/chocolate-cake.jpg',1,'2024-12-16 01:04:32'),(7,2,'Fries','Tasty baked fries',120.00,'Indian','',100,'2024-12-16 01:04:32'),(10,5,'Banana Shake','bsdcbs sgjhsdg gyhsa dcgsuyg',50.00,'Shake','',10,'2024-12-16 01:04:32'),(12,5,'Burger','fjsda gfygsd dys fgh d',100.00,'Burger','',15,'2024-12-16 01:04:32'),(13,5,'Pizza','dfadshfd usdsdfy bxyte76 ',120.00,'Pizza','',20,'2024-12-16 01:04:32'),(15,1,'Dish Name','Dish Description',100.00,'Category','images/1737015295051.png',0,'2024-12-16 01:04:32'),(17,21,'pizza','cnbadkjc',20.00,'pizaa','images/1737016941577.png',0,'2024-12-16 01:04:32'),(19,21,'Dal makni','jbnakbjhb hkbcdajbhd asdvagdba',20.00,'Food','images/1737020567307.png',5,'2024-12-16 01:04:32'),(20,21,'Coffie','njckjbnkjbndasc',60.00,'Coffie','images/1737020845004.png',4,'2024-12-16 01:04:32'),(21,21,'Milk','sbnxbhs smBA xShsBX  bnXS',25.00,'MIlK','images/1737021760960.png',95,'2024-12-16 01:04:32'),(22,21,'Dish','dncksdc',25.00,'xn zxs','images/1737024061754.png',4,'2024-12-16 01:04:32'),(23,1,'Dish Name','Dish Description',100.00,'Category','images/1737258448502.png',0,'2005-04-23 00:00:00'),(24,21,'palag Panir','Jna mazb njak nzn',20.00,'Panir','images/1737258735376.png',0,'2025-01-19 03:52:17'),(25,21,'Veg','ashdk asdbnk',100.00,'Veg','images/1737258845310.png',5,'2025-01-19 03:54:07'),(27,22,'pizaa','by v3 food',1.00,'pizza','images/1737448764858.jpg',4,'2025-01-21 08:39:31'),(28,21,'Bugar','Make by V1',20.00,'Bugar','images/1737557239800.jpg',10,'2025-01-22 14:47:27'),(29,21,'Dish Rise','SJKnsd',50.00,'rise','images/1737557770453.png',0,'2025-01-22 14:56:18');
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-26 10:09:28
