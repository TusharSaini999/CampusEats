CREATE DATABASE  IF NOT EXISTS "campuseats" /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `campuseats`;
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

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '753b858e-d168-11ef-81c1-16d815805ca9:1-993';

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `image_url` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery`
--

DROP TABLE IF EXISTS `delivery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL,
  `moble_no` varchar(15) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userType` varchar(15) NOT NULL DEFAULT 'delivery_boy',
  `revenue` int DEFAULT '0',
  `total_delivery` int DEFAULT '0',
  `image` varchar(45) NOT NULL DEFAULT '/profile/main.jpg',
  `address` varchar(80) DEFAULT NULL,
  `current` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery`
--

LOCK TABLES `delivery` WRITE;
/*!40000 ALTER TABLE `delivery` DISABLE KEYS */;
INSERT INTO `delivery` VALUES (2,'Ansh','ansh@gmail.com','$2a$10$WC3ID52NVgEy3r.eTeV5y.m9D/V3/bP2KSKsSJ7A/h4V79TtGfCWm','9876543210','2024-12-19 06:10:22','delivery_boy',180,3,'/profile/main.jpg',NULL,0),(3,'John','johnexample.com','$2a$10$z.UVokdmdAnvdOk93VGN7O7Mp3Po4NrDjMrdBqsisEhWwUgL0ngx2','','2024-12-20 02:58:42','delivery_boy',0,0,'/profile/main.jpg',NULL,0),(4,'d1','d1@gmail.com','$2a$10$Tg/EWHFK3nwmqVroFaMTreTFgC6RD1TE1j5IWXT8BNa3i1lztPvWW','0123456789','2025-01-20 03:04:03','delivery_boy',100,2,'/profile/1737343208887_1737020845004.png','Uttar Pradesh,India',0),(5,'d2','d2@gmail.com','$2a$10$Mxr2O6fTjXT/RR.SRhH1n.HneETkirDlEitkPmtYnLmmUhLcxnY3q',NULL,'2025-01-20 04:12:19','delivery_boy',0,0,'/profile/main.jpg',NULL,0),(6,'d3','d3@gmail.com','$2a$10$YaBxhJlAHiCuP5cDHAVOOuK4zIaQf.TabqyoniqN88qk83EPkGbgS','0123456789','2025-01-20 04:15:08','delivery_boy',0,0,'/profile/main.jpg',NULL,0),(7,'d4','d4@gmail.com','$2a$10$43X7qoG0Xxt/0CLQw9qlX.o9LipWRjXK0ZBV0YZEYvCn0dbM20luq','9615252322','2025-01-20 05:02:23','delivery_boy',0,0,'/profile/main.jpg',NULL,0),(8,'d5','d5@gmail.com','$2a$10$E37PpRAgQ.oRzoEaDtAF8.M0Bor9ZR0EgPMAUrDivMOF/sDGBcOAm','0123456789','2025-01-20 05:03:31','delivery_boy',0,0,'/profile/1737353196309_image.png','hhb kjbgjhybgj',1),(9,'d5','d6@gmail.com','$2a$10$wT0FKDynEhLR52/wKKGgW.3ANh26aQZei30BK3Zdyz0zQnVWem1zC','0123456789','2025-01-20 05:32:54','delivery_boy',0,0,'/profile/main.jpg',NULL,0),(10,'d10','d10@gmail.com','$2a$10$DOE4pLBeaG1hivAozscn4Ob.9aAOeNOt55EZKg9OUrbTgwxbMFD.S','0123456789','2025-01-29 16:16:55','delivery_boy',0,0,'/profile/main.jpg',NULL,1);
/*!40000 ALTER TABLE `delivery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery_boy`
--

DROP TABLE IF EXISTS `delivery_boy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_boy` (
  `id` int NOT NULL AUTO_INCREMENT,
  `delivery_latitude` double DEFAULT '29.963661',
  `delivery_longitude` double DEFAULT '77.546028',
  PRIMARY KEY (`id`),
  CONSTRAINT `delivery_boy_ibfk_1` FOREIGN KEY (`id`) REFERENCES `delivery` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_boy`
--

LOCK TABLES `delivery_boy` WRITE;
/*!40000 ALTER TABLE `delivery_boy` DISABLE KEYS */;
INSERT INTO `delivery_boy` VALUES (2,29.569438666666667,77.40563699999998),(3,29.963661,77.546028),(4,29.3623,78.1033),(5,29.963661,77.546028),(6,29.963661,77.546028),(7,29.963661,77.546028),(8,29.963661,77.546028),(9,29.963661,77.546028),(10,29.963661,77.546028);
/*!40000 ALTER TABLE `delivery_boy` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (1,1,'Pizza Margherita','Classic Italian pizza with mozzarella ',9.90,'Snacks','/images/pizza.jpg',0,'2024-12-16 01:04:32'),(2,2,'Cheeseburger','Juicy beef burger with cheddar cheese',7.99,'Fast Food','/images/cheeseburger.jpg',1,'2024-12-16 01:04:32'),(4,3,'Pasta Alfredo','Creamy Alfredo sauce with fettuccine',8.99,'Main Course','/images/pasta-alfredo.jpg',1,'2024-12-16 01:04:32'),(5,2,'Chocolate Cake','Rich chocolate sponge cake',4.99,'Desserts','/images/chocolate-cake.jpg',1,'2024-12-16 01:04:32'),(7,2,'Fries','Tasty baked fries',120.00,'Indian','',100,'2024-12-16 01:04:32'),(10,5,'Banana Shake','bsdcbs sgjhsdg gyhsa dcgsuyg',50.00,'Shake','',10,'2024-12-16 01:04:32'),(12,5,'Burger','fjsda gfygsd dys fgh d',100.00,'Burger','',15,'2024-12-16 01:04:32'),(13,5,'Pizza','dfadshfd usdsdfy bxyte76 ',120.00,'Pizza','',20,'2024-12-16 01:04:32'),(15,1,'Dish Name','Dish Description',100.00,'Category','images/1737015295051.png',0,'2024-12-16 01:04:32'),(19,21,'Dal makni','jbnakbjhb hkbcdajbhd asdvagdba',20.00,'Food','images/1737020567307.png',5,'2024-12-16 01:04:32'),(20,21,'Coffie','njckjbnkjbndasc',60.00,'Coffie','images/1737020845004.png',4,'2024-12-16 01:04:32'),(21,21,'Milk','sbnxbhs smBA xShsBX  bnXS',25.00,'MIlK','images/1737021760960.png',95,'2024-12-16 01:04:32'),(22,21,'Dish','dncksdc',25.00,'xn zxs','images/1737024061754.png',4,'2024-12-16 01:04:32'),(23,1,'Dish Name','Dish Description',100.00,'Category','images/1737258448502.png',0,'2005-04-23 00:00:00'),(24,21,'palag Panir','Jna mazb njak nzn',20.00,'Panir','images/1737258735376.png',0,'2025-01-19 03:52:17'),(25,21,'Veg','ashdk asdbnk',100.00,'Veg','images/1737258845310.png',5,'2025-01-19 03:54:07'),(27,22,'pizaa','by v3 food',1.00,'pizza','images/1737448764858.jpg',4,'2025-01-21 08:39:31'),(28,21,'Bugar','Make by V1',20.00,'Bugar','images/1737557239800.jpg',10,'2025-01-22 14:47:27'),(29,21,'Dish Rise','SJKnsd',50.00,'rise','images/1737557770453.png',56,'2025-01-22 14:56:18');
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` double NOT NULL,
  `menu_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `user_id` int NOT NULL,
  `o_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `menu_id` (`menu_id`),
  KEY `order_id` (`order_id`),
  KEY `o_id_to_order_idx` (`o_id`),
  CONSTRAINT `o_id_to_order` FOREIGN KEY (`o_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (4,101,1,1,9.90,'Pizza Margherita',1,NULL),(18,1737007428666,1,12,9.90,'Pizza Margherita',15,4),(19,1737010908382,1,5,9.90,'Pizza Margherita',15,4),(25,1737029917079,4,1,8.99,'Pasta Alfredo',14,2),(26,1737029966397,22,3,25.00,'Dish',14,2),(27,1737030098280,22,5,25.00,'Dish',14,2),(28,1737030101962,1,1,9.90,'Pizza Margherita',14,2),(29,1737089427232,4,1,8.99,'Pasta Alfredo',14,7),(30,1737089431035,10,2,50.00,'Banana Shake',14,7),(32,1737090153905,2,1,7.99,'Cheeseburger',14,8),(33,1737090164535,12,3,100.00,'Burger',14,8),(34,1737090169276,13,1,120.00,'Pizza',14,8),(35,1737092984613,1,1,9.90,'Pizza Margherita',14,9),(36,1737094265079,4,1,8.99,'Pasta Alfredo',14,10),(37,1737094268106,5,1,4.99,'Chocolate Cake',14,10),(38,1737094270670,2,1,7.99,'Cheeseburger',14,10),(39,1737096058510,4,1,8.99,'Pasta Alfredo',14,11),(40,1737096062261,10,1,50.00,'Banana Shake',14,11),(41,1737096179912,22,2,25.00,'Dish',14,12),(43,1737097358489,4,1,8.99,'Pasta Alfredo',14,13),(44,1737097455204,20,1,60.00,'Coffie',14,14),(45,1737097458531,19,1,20.00,'Dal makni',14,14),(46,1737097461628,22,1,25.00,'Dish',14,14),(47,1737097677574,2,1,7.99,'Cheeseburger',14,15),(52,1737100299620,22,1,25.00,'Dish',14,24),(54,1737101142969,22,4,25.00,'Dish',14,25),(55,1737101255754,22,3,25.00,'Dish',14,26),(56,1737101337741,22,2,25.00,'Dish',14,27),(57,1737101439329,20,2,60.00,'Coffie',14,28),(58,1737101442988,19,2,20.00,'Dal makni',14,28),(59,1737101559677,20,3,60.00,'Coffie',15,29),(60,1737101563124,19,3,20.00,'Dal makni',15,29),(63,1737172101311,21,3,25.00,'Milk',15,31),(64,1737172104641,20,3,60.00,'Coffie',15,31),(65,1737175520216,1,1,9.90,'Pizza Margherita',14,32),(66,1737175533384,15,1,100.00,'Dish Name',14,32),(70,1737207830543,21,1,25.00,'Milk',14,34),(77,1737448820293,27,1,1.00,'pizaa',14,37),(78,1737449031801,27,3,1.00,'pizaa',14,38),(80,1737449113724,27,1,1.00,'pizaa',14,39),(86,1737516098730,27,1,1.00,'pizaa',14,40),(94,1737558100020,29,5,50.00,'Dish Rise',14,41),(95,1737558315044,21,5,25.00,'Milk',14,42),(96,1737558647827,29,1,50.00,'Dish Rise',14,43),(98,1737617937179,24,1,20.00,'palag Panir',14,44),(99,1737649223019,20,1,60.00,'Coffie',14,45),(101,1737649489895,23,1,100.00,'Dish Name',14,47),(102,1737722225013,27,1,1.00,'pizaa',14,48),(103,1737722231233,22,1,25.00,'Dish',14,48),(104,1737740920589,19,1,20.00,'Dal makni',14,49);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_vender`
--

DROP TABLE IF EXISTS `order_vender`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_vender` (
  `order_id` int NOT NULL,
  `v_id` int NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `mes` varchar(100) DEFAULT NULL,
  `otp` int DEFAULT NULL,
  PRIMARY KEY (`order_id`,`v_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_vender`
--

LOCK TABLES `order_vender` WRITE;
/*!40000 ALTER TABLE `order_vender` DISABLE KEYS */;
INSERT INTO `order_vender` VALUES (2,21,'Completed',NULL,787141),(12,21,'Completed',NULL,642306),(14,21,'Out for Pickup',NULL,189446),(24,21,'Accepted',NULL,NULL),(25,21,'Rejected','Order metrial is not found',NULL),(26,21,'Out for Pickup',NULL,NULL),(27,21,'Out for Pickup',NULL,NULL),(29,21,'Accepted',NULL,NULL),(30,21,'Out for Pickup',NULL,NULL),(31,21,'Accepted',NULL,NULL),(36,21,'Accepted',NULL,NULL),(37,22,'Out for Pickup',NULL,NULL),(38,22,'Rejected','Order is not pickup ',NULL),(39,21,'Prepared',NULL,NULL),(40,21,'Rejected','Rejected without accap',NULL),(40,22,'Completed',NULL,185599),(41,21,'Prepared',NULL,NULL),(42,21,'Rejected','rejected duo to unvalbal',NULL),(43,21,'Completed',NULL,848797),(44,21,'Completed',NULL,942270),(45,21,'Completed',NULL,637180),(46,21,'Prepared',NULL,NULL),(48,21,'Completed',NULL,943880),(48,22,'Completed',NULL,970934),(49,21,'Completed',NULL,901169);
/*!40000 ALTER TABLE `order_vender` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `delivery_boy_id` int DEFAULT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `delivery_address` text NOT NULL,
  `customer_latitude` double DEFAULT NULL,
  `customer_longitude` double DEFAULT NULL,
  `payment_status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `delivery_otp` varchar(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `delivery_boy_id` (`delivery_boy_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`delivery_boy_id`) REFERENCES `delivery_boy` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,2,2555.00,'rejected','xyz location ',30.008603082365198,77.7636326245022,'pending','2024-12-19 14:42:35','910277'),(2,14,4,100.50,'accepted','123 Main St, City, Country',40.7128,-74.006,'success','2025-01-17 04:01:54',NULL),(4,15,4,100.50,'accepted','123 Main St, City, Country',40.7128,-74.006,'success','2025-01-17 04:33:25',NULL),(7,14,NULL,100.50,'pending','123 Main St, City, Country',40.7128,-74.006,'success','2025-01-17 04:51:39',NULL),(8,14,NULL,855.87,'pending','MDR19B, Kalpi, Jalaun, Uttar Pradesh, India',25.91599003638894,79.65920557002713,'success','2025-01-17 05:48:48',NULL),(9,14,NULL,9.90,'pending','Mahamaya Stadium Road, Ghaziabad, Uttar Pradesh, 201001, India',28.67114091923954,77.41282448143923,'success','2025-01-17 05:51:26',NULL),(10,14,4,21.97,'accepted','SH51, Sambhal, Uttar Pradesh, 244302, India',28.5738,78.5661,'success','2025-01-17 06:11:21',NULL),(11,14,NULL,58.99,'pending','Haldaur, Bijnor, Uttar Pradesh, 246726, India',29.2899,78.2825,'success','2025-01-17 06:41:42',NULL),(12,14,NULL,90.00,'pending','Mudiakhera, Thakurdwara, Moradabad, Uttar Pradesh, India',29.209713225868185,78.73352050781251,'success','2025-01-17 06:50:43',NULL),(13,14,NULL,48.99,'pending','Jugal, Sindhupalchowk, Bagamati Province, Nepal',28.06208821422725,85.72661506969241,'success','2025-01-17 07:03:43',NULL),(14,14,NULL,145.00,'pending','Haldaur, Bijnor, Uttar Pradesh, 246726, India',29.29042226990869,78.288982556895,'success','2025-01-17 07:05:09',NULL),(15,14,NULL,47.99,'pending','SH12, Haldaur, Bijnor, Uttar Pradesh, 246726, India',29.291320567583735,78.29808033223144,'success','2025-01-17 07:08:21',NULL),(23,14,NULL,85.00,'pending','Haldaur, Bijnor, Uttar Pradesh, 246726, India',29.2899,78.2825,'success','2025-01-17 07:53:56',NULL),(24,14,NULL,85.00,'pending','Haldaur, Bijnor, Uttar Pradesh, 246726, India',29.2899,78.2825,'success','2025-01-17 08:00:48',NULL),(25,14,NULL,140.00,'pending','Haldaur, Bijnor, Uttar Pradesh, 246726, India',29.2899,78.2825,'success','2025-01-17 08:06:02',NULL),(26,14,NULL,115.00,'pending','Haldaur, Bijnor, Uttar Pradesh, 246726, India',29.2899,78.2825,'success','2025-01-17 08:08:03',NULL),(27,14,NULL,90.00,'pending','Haldaur, Bijnor, Uttar Pradesh, 246726, India',29.2899,78.2825,'success','2025-01-17 08:09:12',NULL),(28,14,NULL,200.00,'pending','Haldaur, Bijnor, Uttar Pradesh, 246726, India',29.2899,78.2825,'success','2025-01-17 08:10:58',NULL),(29,15,NULL,280.00,'pending','Bathinda Road, Bhikhi, Mansa Tehsil, Mansa, Punjab, 148029, India',30.06668996211072,75.55035908318457,'success','2025-01-17 08:13:16',NULL),(30,15,NULL,260.00,'pending','SH51, Hasanpur, Amroha, Uttar Pradesh, 244241, India',28.714524284171006,78.30694691554035,'success','2025-01-17 16:39:34',NULL),(31,15,NULL,295.00,'pending','Sundarpur, Bilari, Moradabad, Uttar Pradesh, India',28.688044081133963,78.70423891229377,'success','2025-01-18 03:49:03',NULL),(32,14,4,249.90,'accepted','Jetia Sedullapur, Moradabad, Uttar Pradesh, India',28.75772443476124,78.80407826319662,'success','2025-01-18 04:50:27',NULL),(33,14,NULL,60.00,'pending','Dunhuang City, Jiuquan, Gansu, 736200, China',41.21099862850036,94.70294905245814,'success','2025-01-18 04:54:30',NULL),(34,14,NULL,85.00,'pending','Saharanpur, Uttar Pradesh, 247001, India',30.009129857749397,77.47510042926567,'success','2025-01-18 13:45:13',NULL),(35,14,NULL,60.00,'pending','Saharanpur, Uttar Pradesh, 247001, India',29.96207336100224,77.53944396972658,'success','2025-01-19 15:06:17',NULL),(36,14,NULL,80.00,'pending','NH709B, Thana Bhawan, Shamli, Uttar Pradesh, 247777, India',29.569438666666667,77.40563699999998,'success','2025-01-21 07:55:28',NULL),(37,14,NULL,41.00,'pending','NH709B, Thana Bhawan, Shamli, Uttar Pradesh, 247777, India',29.569623,77.40567800000001,'success','2025-01-21 08:40:41',NULL),(38,14,NULL,43.00,'pending','NH709B, Thana Bhawan, Shamli, Uttar Pradesh, 247777, India',29.569438666666667,77.40563699999998,'success','2025-01-21 08:44:10',NULL),(39,14,NULL,61.00,'pending','NH709B, Thana Bhawan, Shamli, Uttar Pradesh, 247777, India',29.569623,77.40567800000001,'success','2025-01-21 08:45:38',NULL),(40,14,4,481.00,'rejected','Muzaffarnagar, Uttar Pradesh, 251001, India',29.4725,77.7071,'success','2025-01-22 03:26:17',NULL),(41,14,NULL,290.00,'pending','Bhuni, Sardhana, Meerut, Uttar Pradesh, 250344, India',29.1465,77.5746,'success','2025-01-22 15:02:21',NULL),(42,14,10,165.00,'rejected','Bhuni, Sardhana, Meerut, Uttar Pradesh, 250344, India',29.1465,77.5746,'success','2025-01-22 15:05:48',NULL),(43,14,4,90.00,'out for delivery','Bhuni, Sardhana, Meerut, Uttar Pradesh, 250344, India',29.1465,77.5746,'success','2025-01-22 15:11:11',NULL),(44,14,4,80.00,'delivered','Budhana Kalan, Muzaffarnagar, Uttar Pradesh, 251309, India',29.5741,77.6685,'success','2025-01-23 07:39:19','564399'),(45,14,4,100.00,'rejected','saingaon, JN1, Narendra Nagar, Tehri Garhwal, Uttarakhand, 249146, India',30.242,78.5176,'success','2025-01-23 16:20:45','293980'),(46,14,4,120.00,'accepted','saingaon, JN1, Narendra Nagar, Tehri Garhwal, Uttarakhand, 249146, India',30.242,78.5176,'success','2025-01-23 16:21:45',NULL),(47,14,4,140.00,'accepted','Manglaur, Roorkee, Haridwar, Uttarakhand, 247656, India',29.7936,77.8752,'success','2025-01-24 04:07:00',NULL),(48,14,4,66.00,'delivered','Kandhla, Kairana, Shamli, Uttar Pradesh, 247775, India',29.32,77.2722,'success','2025-01-24 12:37:35','163250'),(49,14,4,60.00,'rejected','NH334, Purkaji, Muzaffarnagar, Uttar Pradesh, India',29.6523,77.8173,'success','2025-01-24 17:49:09','501525');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `address` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `userType` enum('user') DEFAULT 'user',
  `image` varchar(45) DEFAULT '/profile/main.jpg',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'John Doe','john@example.com','password123','9876543210','123 College St, City A','2024-12-15 14:14:59','user','/profile/main.jpg'),(2,'Jane Smith','jane@example.com','securepass','9876543211','456 University Rd, City B','2024-12-15 14:14:59','user','profile/main.jpg'),(3,'Emily Johnson','emily@example.com','mypassword','9876543212','789 Campus Ave, City C','2024-12-15 14:14:59','user','profile/main.jpg'),(4,'Abdulla Gaur','abdulla13@gmail.com','$2a$10$0QkrZnoFp6rlE6mGpmwTheafRA7k8WKDUOGfIBjQm1CEtxM4XijLq','1524354564','Deoband Uttar Pardesh','2024-12-16 00:31:18','user','profile/main.jpg'),(5,'Pundir Guest House','saad12@gmail.com','$2a$10$ZcAyb70WmGZdyaCumIu0XueVm8CrrIe5ykRDG6GNiv2LCWAagG3zu','4546545645641','xcdsbnvcsdvgv ','2024-12-16 04:41:04','user','profile/main.jpg'),(6,'Namit','test@gmail.com','$2a$10$5INJymNcCp63rW39yBvEPOsE2iMXS8.xdFKsjIJ2JXtQN/jR1V.Nq','456','india','2024-12-17 18:00:17','user','profile/main.jpg'),(7,'Tushar Saini','tush@gmail.com','$2a$10$nkiIqDuerJU0XpJA5pASG.kTY8LOGw6cuv5IETU0Cb75oMVnUw1C6',NULL,NULL,'2024-12-18 13:00:55','user','profile/main.jpg'),(8,'Test User','test_user@gmail.com','$2a$10$KPFM7hFoUhosIdy8EUfsp.rysYsLv8ebiWAG2vFZOxb9UHqt93eFm',NULL,NULL,'2024-12-18 17:22:04','user','profile/main.jpg'),(9,'','','$2a$10$8NutpMD3Bmd82TCXrIEuFePod9dVG0BmwWoPJXpVJYDaQq.iDepii',NULL,NULL,'2024-12-18 17:29:38','user','profile/main.jpg'),(10,'test_user_2','test2@gmail.com','$2a$10$rcKaPSWvtbqhVAhCFKVzGu3.Sxo4SZRGef0wZXil1u5PNK9.gssGu',NULL,NULL,'2024-12-18 18:41:04','user','profile/main.jpg'),(11,'test_user_2','test_user_2@gmail.com','$2a$10$x/P/EdpBS9GKlEgKxRYLjumC4Fq1wDQc5wb4iVxIu6br1vAZct/2W',NULL,NULL,'2024-12-19 08:15:47','user','profile/main.jpg'),(12,'test_user_3','test_user_3@gmail.com','$2a$10$mFhoEbbg5uJI5550ZQz6luDNDLM3z1hD.M/e9Bh0hspnV2QRIrtIm',NULL,NULL,'2024-12-19 08:52:00','user','profile/main.jpg'),(13,'test_user_4','test_user_4@gmail.com','$2a$10$SZmBbSM1/9euqd5rpqY5YOfkxukZxm3eqZ66hTpVDk.zPEgZt9Eba',NULL,NULL,'2024-12-19 08:54:25','user','profile/main.jpg'),(14,'t1','t1@gmail.com','$2a$10$3w4MAPgNkhI8b2OCgHDrp.PMaplPabFCnMa9vAj9IzR3HvD.a9676','0123456789','null','2025-01-16 03:36:27','user','/profile/1737298961348_1737258198294.png'),(15,'t2','t2@gmail.com','$2a$10$6afOTrN9Ex4S1/DbvwPGvesrxwYEssBA5pP9nNPwu1Kjahic6Obju',NULL,NULL,'2025-01-16 03:37:11','user','/profile/main.jpg'),(20,'t6','t6@gmail.com','$2a$10$MbuFdgeJJ0E6dP.tpHrjpeblJFPeVJqWTg9uwgDDmeEStYQDA0q6i','0123456789',NULL,'2025-01-20 05:15:08','user','/profile/main.jpg'),(21,'t4','t4@gmail.com','$2a$10$uALtg.2ucnynk7l.pZqxEuL1N6Zquq95ns5fZMKdepu3DiIG/bmSm','0123456789',NULL,'2025-01-20 05:28:58','user','/profile/main.jpg'),(22,'t5','t5@gmail.com','$2a$10$XegZ9kQv55s1jt7tAP0aJOu1nWbHijGRHPkTGB4C7jjlbHFuOOYAy','0123456789',NULL,'2025-01-20 05:31:58','user','/profile/main.jpg');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendors`
--

DROP TABLE IF EXISTS `vendors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `address` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `userType` enum('vendor') DEFAULT 'vendor',
  `current` int DEFAULT '0',
  `image` varchar(45) NOT NULL DEFAULT '/profile/main.jpg',
  `total_en` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendors`
--

LOCK TABLES `vendors` WRITE;
/*!40000 ALTER TABLE `vendors` DISABLE KEYS */;
INSERT INTO `vendors` VALUES (1,'Pizza Place','pizza@example.com','vendorpass','9876543220','12 Market St, City A','2024-12-15 14:32:01','vendor',1,'',0),(2,'Burger Corner','burger@example.com','vendorsecure','9876543221','34 Food Court, City B','2024-12-15 14:32:01','vendor',0,'',0),(3,'Healthy Bites','healthy@example.com','healthypass','9876543222','56 Green Lane, City C','2024-12-15 14:32:01','vendor',0,'',0),(4,'Abdulla','abdulla12@gmail.com','$2a$10$.c4M2X3J3yil8CqL0i9PbeNuAG9x6ZalY49qfi8kohpGadUFtj2Gq',NULL,NULL,'2024-12-16 00:27:45','vendor',0,'',0),(5,'Pundir Guest House','pundir12@gmail.com','$2a$10$DhQuQDTruWT4X3HJkbd2F.7XSOoQrhMH7uf9i7DXTHDhU4MIaQo/a','132154564','Choli Near Quantum University','2024-12-16 04:10:33','vendor',0,'',0),(6,'Shivam Dhaba','shivam12@gmail.com','$2a$10$RIPWfHQNRhuR69nfpKZVXOo6ZJAKI/PruKVKAgGp.ZAHt7RV5Cx0e',NULL,NULL,'2024-12-16 04:31:00','vendor',0,'',0),(7,'Dastarkhan','dastarkhan12@gmail.com','$2a$10$q6e/3nzjH1NE1VDGC3vG/uZgMP2rRiiTi22dtnlagOPh1xGPxZity',NULL,NULL,'2024-12-16 04:33:54','vendor',0,'',0),(8,'Babbe Da Dhaba','babbe@gmail.com','$2a$10$hPIoS0gsZF5AxgzwX0PbiOYkj0DyAoDg1fXx6OOmUabBtylwyMnFK',NULL,NULL,'2024-12-18 10:28:30','vendor',0,'',0),(9,'Tushar Saini','tushar@gmail.com','$2a$10$qT.PNNnJ5Je2e2MLPfTXue7/yXVTdbVHbCpEjMgVnVEEHkq11hAyK',NULL,NULL,'2024-12-18 14:41:07','vendor',0,'',0),(10,'','','$2a$10$X7T1MTuiTFuLRQJNsBhJxuUr/MAIiNzMub3m8sPBral8edFdNGRlG',NULL,NULL,'2024-12-18 17:53:12','vendor',0,'',0),(11,'test_vendor','vendor@gmail.com','$2a$10$dwrWZpePm5K2ID.KPT8hGeXqfR1sxpn3Qma7hiiLAWBIMXc/OeuwK',NULL,NULL,'2024-12-18 18:04:47','vendor',0,'',0),(12,'Hello Restaurant','hello@gmail.com','$2a$10$wJgATMa6licryVzThV7r1ukwZLOvDfm1qUC/Kqt.sE3WYftMragQe',NULL,NULL,'2024-12-18 18:11:41','vendor',0,'',0),(13,'test_vendor','test_vendor@gmail.com','$2a$10$sYqmu6ogk3QrFBTYg3Z6GuvwktI57X35iUOMbD0GM6RC9N0YmvwZ6',NULL,NULL,'2024-12-19 07:08:29','vendor',0,'',0),(14,'test_vendor_2','test_vendor_2@gmail.com','$2a$10$nq/18s0uT/Vzwnqduy6B8uDrKyA56ZStbMWnlw50YfMNsF4DxCUvG',NULL,NULL,'2024-12-19 07:19:25','vendor',0,'',0),(15,'test_vendor_3','test_vendor_3@gmail.com','$2a$10$tAjmijgVxuhMtfZhHcCZx.GmtgbDXqFRO/sSA9xuYJmRZJu045WiW',NULL,NULL,'2024-12-19 08:18:23','vendor',0,'',0),(16,'test_vendor_4','test_vendor_4@gmail.com','$2a$10$xTqoiN1Vez7EjP8BlUhVFeZQDjqaUmQnBMco1bHTFBFA1Oo/vSm9S',NULL,NULL,'2024-12-19 08:20:12','vendor',0,'',0),(17,'test_vendor_5','test_vendor_5@gmail.com','$2a$10$qlen9PCsgJb2.LYddDlFeeZdrIIcU3ohXy2dEdS3Z2GtJEPhuxDp2',NULL,NULL,'2024-12-19 08:25:11','vendor',0,'',0),(18,'test_vendor_6','test_vendor_6@gmail.com','$2a$10$1U87AqxlA6b2358C4m3Qu.3R7jbQpL557j2gabFpx2pEpNWk1WjPy',NULL,NULL,'2024-12-19 08:26:12','vendor',0,'',0),(19,'test_vendor_7','test_vendor_7@gmail.com','$2a$10$sT/UB0fXNWblLCy0.Ep6Xus2XVhiVhyY2JNpLu6le.PgNjTRuYJ5q',NULL,NULL,'2024-12-19 08:26:42','vendor',0,'',0),(20,'test_vendor_10','test_vendor_10@gmail.com','$2a$10$jqOm68JBD4A73W.h0aTPYOKU2Px6zLjOwjCZ/uPdIm04BE7SDB7FS',NULL,NULL,'2024-12-19 11:10:34','vendor',0,'/profile/main.jpg',0),(21,'v1','v1@gmail.com','$2a$10$8ijkSKuVMbD0KiCZTurXEOnrc0jjxsNvXISCYOJ3ZILSmDXRIUD1.','0123456789','Uttar Pradesh,India','2025-01-16 07:04:39','vendor',0,'/profile/1737273452533_1737020845004.png',445),(22,'v3','v3@gmail.com','$2a$10$FokYn9H/vJENhhAieRxG5.VI8EyKJrMJv55bGtyOc9eGxr705cmbq',NULL,NULL,'2025-01-20 04:09:32','vendor',1,'/profile/main.jpg',2),(23,'v6','v6@gmail.com','$2a$10$fMftw9KsxSsM2VQv0yUZD.cGXbkcztMZ3rx2Hpipg7RGHEhmjpgGm',NULL,NULL,'2025-01-20 05:33:55','vendor',0,'/profile/main.jpg',0);
/*!40000 ALTER TABLE `vendors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'campuseats'
--

--
-- Dumping routines for database 'campuseats'
--
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-31 11:47:36
