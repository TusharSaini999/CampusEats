-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: campuseats_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

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
  `image` text,
  `address` varchar(80) DEFAULT NULL,
  `current` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery`
--

LOCK TABLES `delivery` WRITE;
/*!40000 ALTER TABLE `delivery` DISABLE KEYS */;
INSERT INTO `delivery` VALUES (1,'Delivery Boy','delivery@campuseats.com','$2a$10$AKoawCq0Ih5brmAcN3Qvge55JNWGyk5Jv15tFFHoD3afe1Y8fucSW','0123456789','2026-06-23 07:24:41','delivery_boy',40,1,NULL,NULL,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_boy`
--

LOCK TABLES `delivery_boy` WRITE;
/*!40000 ALTER TABLE `delivery_boy` DISABLE KEYS */;
INSERT INTO `delivery_boy` VALUES (1,30.017388,77.463581);
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
  `delete` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `vendor_id` (`vendor_id`),
  CONSTRAINT `menu_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (1,1,'Paneer Butter Masala','Creamy North Indian curry made with soft paneer cubes cooked in a rich tomato-butter gravy and aromatic spices. Served best with naan or rice.',249.00,'Main Course / Indian','https://res.cloudinary.com/cloud451752/image/upload/v1782194832/menu_images/g8byb2mqergrejsko8ft.png',20,'2026-06-23 06:07:10',0),(2,1,'Veg Biryani','Fragrant basmati rice cooked with mixed vegetables and traditional spices.',199.00,'Rice','https://res.cloudinary.com/cloud451752/image/upload/v1782195843/menu_images/pl4btajvocuhmxjm9bhn.png',20,'2026-06-23 06:24:02',1),(3,1,'Veg Biryani','Fragrant basmati rice cooked with mixed vegetables and traditional spices.',149.00,'Rice','https://res.cloudinary.com/cloud451752/image/upload/v1782195984/menu_images/hzggpu8malggfpfjelwf.png',20,'2026-06-23 06:26:22',0),(4,1,'Margherita Pizza','Classic pizza topped with mozzarella cheese, tomato sauce, and fresh basil.',299.00,'Pizza','https://res.cloudinary.com/cloud451752/image/upload/v1782196077/menu_images/bjzzmrjf0dtdtm4tu1zq.png',14,'2026-06-23 06:27:55',0),(5,1,'Chicken Burger','Crispy chicken patty with lettuce, cheese, and special sauce.',179.00,'Burger','https://res.cloudinary.com/cloud451752/image/upload/v1782196350/menu_images/xxls4gxjuyer8sgz8crk.png',19,'2026-06-23 06:32:31',0),(6,1,'Hakka Noodles','Stir-fried noodles tossed with fresh vegetables and Asian sauces.',169.00,'Chinese','https://res.cloudinary.com/cloud451752/image/upload/v1782198431/menu_images/j3o4zzixnijfmv30hmkp.png',20,'2026-06-23 07:07:10',0),(7,1,'Grilled Sandwich','Toasted sandwich stuffed with vegetables, cheese, and herbs.',129.00,'Snacks','https://res.cloudinary.com/cloud451752/image/upload/v1782198542/menu_images/gdwnpy8dktixbpf7wrre.png',20,'2026-06-23 07:09:01',0),(8,1,'White Sauce Pasta','Creamy pasta cooked in a rich white sauce with vegetables.',229.00,'Pasta','https://res.cloudinary.com/cloud451752/image/upload/v1782198615/menu_images/tysuao4fhrbqutcdzykp.png',20,'2026-06-23 07:10:14',0),(9,1,'Veg Taco','Crispy taco shells filled with fresh vegetables and sauces.',149.00,'Mexican','https://res.cloudinary.com/cloud451752/image/upload/v1782198670/menu_images/vjojiuvmkmmohlik5fei.png',20,'2026-06-23 07:11:09',0),(10,1,'French Fries','Golden crispy potato fries served with ketchup.',99.00,'Sides','https://res.cloudinary.com/cloud451752/image/upload/v1782198737/menu_images/wtctoovifxpoltgbwb4z.png',20,'2026-06-23 07:12:17',0),(11,1,'Cold Coffee','Chilled coffee blended with milk, ice cream, and chocolate syrup.',119.00,'Beverages','https://res.cloudinary.com/cloud451752/image/upload/v1782198960/menu_images/sly4zkk9379afk6oolqt.png',20,'2026-06-23 07:15:59',0),(12,1,'Chocolate Brownie','Rich chocolate brownie served warm with chocolate sauce.',149.00,'Desserts','https://res.cloudinary.com/cloud451752/image/upload/v1782199201/menu_images/gcbgsdkyzrfdqnsozozl.png',20,'2026-06-23 07:20:00',0);
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1782199319312,4,1,299.00,'Margherita Pizza',1,1),(2,1782199323210,5,1,179.00,'Chicken Burger',1,1);
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
INSERT INTO `order_vender` VALUES (1,1,'Completed',NULL,536743);
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,1,518.00,'delivered','Saharanpur, Uttar Pradesh, 247001, India',30.017388,77.463581,'success','2026-06-23 07:22:40','419260');
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
  `image` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'User 1','User@campuseats.com','$2a$10$7ymQsqUIj/Z2UCQYANaBVOQfwS2..TcfXtHX/c2oSUeaNU0HQRT.C','0123456789',NULL,'2026-06-23 07:21:44','user',NULL);
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
  `image` text,
  `total_en` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendors`
--

LOCK TABLES `vendors` WRITE;
/*!40000 ALTER TABLE `vendors` DISABLE KEYS */;
INSERT INTO `vendors` VALUES (1,'Vender 1','vender@campuseats.com','$2a$10$6KCPthIKweSMrwKVdhMLA.yKFtjMPi305RwMyrPPKXa1yqyPlQnPm','1234567890',NULL,'2026-06-23 05:38:03','vendor',1,NULL,478);
/*!40000 ALTER TABLE `vendors` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-23  7:58:15
