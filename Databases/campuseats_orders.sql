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
INSERT INTO `orders` VALUES (1,1,2,2555.00,'rejected','xyz location ',30.008603082365198,77.7636326245022,'pending','2024-12-19 14:42:35','910277'),(2,14,4,100.50,'accepted','123 Main St, City, Country',40.7128,-74.006,'success','2025-01-17 04:01:54',NULL),(4,15,4,100.50,'accepted','123 Main St, City, Country',40.7128,-74.006,'success','2025-01-17 04:33:25',NULL),(7,14,NULL,100.50,'pending','123 Main St, City, Country',40.7128,-74.006,'success','2025-01-17 04:51:39',NULL),(8,14,NULL,855.87,'pending','MDR19B, Kalpi, Jalaun, Uttar Pradesh, India',25.91599003638894,79.65920557002713,'success','2025-01-17 05:48:48',NULL),(9,14,NULL,9.90,'pending','Mahamaya Stadium Road, Ghaziabad, Uttar Pradesh, 201001, India',28.67114091923954,77.41282448143923,'success','2025-01-17 05:51:26',NULL),(10,14,4,21.97,'accepted','SH51, Sambhal, Uttar Pradesh, 244302, India',28.5738,78.5661,'success','2025-01-17 06:11:21',NULL),(11,14,NULL,58.99,'pending','Haldaur, Bijnor, Uttar Pradesh, 246726, India',29.2899,78.2825,'success','2025-01-17 06:41:42',NULL),(12,14,NULL,90.00,'pending','Mudiakhera, Thakurdwara, Moradabad, Uttar Pradesh, India',29.209713225868185,78.73352050781251,'success','2025-01-17 06:50:43',NULL),(13,14,NULL,48.99,'pending','Jugal, Sindhupalchowk, Bagamati Province, Nepal',28.06208821422725,85.72661506969241,'success','2025-01-17 07:03:43',NULL),(14,14,NULL,145.00,'pending','Haldaur, Bijnor, Uttar Pradesh, 246726, India',29.29042226990869,78.288982556895,'success','2025-01-17 07:05:09',NULL),(15,14,NULL,47.99,'pending','SH12, Haldaur, Bijnor, Uttar Pradesh, 246726, India',29.291320567583735,78.29808033223144,'success','2025-01-17 07:08:21',NULL),(23,14,NULL,85.00,'pending','Haldaur, Bijnor, Uttar Pradesh, 246726, India',29.2899,78.2825,'success','2025-01-17 07:53:56',NULL),(24,14,NULL,85.00,'pending','Haldaur, Bijnor, Uttar Pradesh, 246726, India',29.2899,78.2825,'success','2025-01-17 08:00:48',NULL),(25,14,NULL,140.00,'pending','Haldaur, Bijnor, Uttar Pradesh, 246726, India',29.2899,78.2825,'success','2025-01-17 08:06:02',NULL),(26,14,NULL,115.00,'pending','Haldaur, Bijnor, Uttar Pradesh, 246726, India',29.2899,78.2825,'success','2025-01-17 08:08:03',NULL),(27,14,NULL,90.00,'pending','Haldaur, Bijnor, Uttar Pradesh, 246726, India',29.2899,78.2825,'success','2025-01-17 08:09:12',NULL),(28,14,NULL,200.00,'pending','Haldaur, Bijnor, Uttar Pradesh, 246726, India',29.2899,78.2825,'success','2025-01-17 08:10:58',NULL),(29,15,NULL,280.00,'pending','Bathinda Road, Bhikhi, Mansa Tehsil, Mansa, Punjab, 148029, India',30.06668996211072,75.55035908318457,'success','2025-01-17 08:13:16',NULL),(30,15,NULL,260.00,'pending','SH51, Hasanpur, Amroha, Uttar Pradesh, 244241, India',28.714524284171006,78.30694691554035,'success','2025-01-17 16:39:34',NULL),(31,15,NULL,295.00,'pending','Sundarpur, Bilari, Moradabad, Uttar Pradesh, India',28.688044081133963,78.70423891229377,'success','2025-01-18 03:49:03',NULL),(32,14,4,249.90,'accepted','Jetia Sedullapur, Moradabad, Uttar Pradesh, India',28.75772443476124,78.80407826319662,'success','2025-01-18 04:50:27',NULL),(33,14,NULL,60.00,'pending','Dunhuang City, Jiuquan, Gansu, 736200, China',41.21099862850036,94.70294905245814,'success','2025-01-18 04:54:30',NULL),(34,14,NULL,85.00,'pending','Saharanpur, Uttar Pradesh, 247001, India',30.009129857749397,77.47510042926567,'success','2025-01-18 13:45:13',NULL),(35,14,NULL,60.00,'pending','Saharanpur, Uttar Pradesh, 247001, India',29.96207336100224,77.53944396972658,'success','2025-01-19 15:06:17',NULL),(36,14,NULL,80.00,'pending','NH709B, Thana Bhawan, Shamli, Uttar Pradesh, 247777, India',29.569438666666667,77.40563699999998,'success','2025-01-21 07:55:28',NULL),(37,14,NULL,41.00,'pending','NH709B, Thana Bhawan, Shamli, Uttar Pradesh, 247777, India',29.569623,77.40567800000001,'success','2025-01-21 08:40:41',NULL),(38,14,NULL,43.00,'pending','NH709B, Thana Bhawan, Shamli, Uttar Pradesh, 247777, India',29.569438666666667,77.40563699999998,'success','2025-01-21 08:44:10',NULL),(39,14,NULL,61.00,'pending','NH709B, Thana Bhawan, Shamli, Uttar Pradesh, 247777, India',29.569623,77.40567800000001,'success','2025-01-21 08:45:38',NULL),(40,14,4,481.00,'rejected','Muzaffarnagar, Uttar Pradesh, 251001, India',29.4725,77.7071,'success','2025-01-22 03:26:17',NULL),(41,14,NULL,290.00,'pending','Bhuni, Sardhana, Meerut, Uttar Pradesh, 250344, India',29.1465,77.5746,'success','2025-01-22 15:02:21',NULL),(42,14,NULL,165.00,'pending','Bhuni, Sardhana, Meerut, Uttar Pradesh, 250344, India',29.1465,77.5746,'success','2025-01-22 15:05:48',NULL),(43,14,4,90.00,'out for delivery','Bhuni, Sardhana, Meerut, Uttar Pradesh, 250344, India',29.1465,77.5746,'success','2025-01-22 15:11:11',NULL),(44,14,4,80.00,'delivered','Budhana Kalan, Muzaffarnagar, Uttar Pradesh, 251309, India',29.5741,77.6685,'success','2025-01-23 07:39:19','564399'),(45,14,4,100.00,'rejected','saingaon, JN1, Narendra Nagar, Tehri Garhwal, Uttarakhand, 249146, India',30.242,78.5176,'success','2025-01-23 16:20:45','293980'),(46,14,4,120.00,'accepted','saingaon, JN1, Narendra Nagar, Tehri Garhwal, Uttarakhand, 249146, India',30.242,78.5176,'success','2025-01-23 16:21:45',NULL),(47,14,4,140.00,'accepted','Manglaur, Roorkee, Haridwar, Uttarakhand, 247656, India',29.7936,77.8752,'success','2025-01-24 04:07:00',NULL),(48,14,4,66.00,'delivered','Kandhla, Kairana, Shamli, Uttar Pradesh, 247775, India',29.32,77.2722,'success','2025-01-24 12:37:35','163250'),(49,14,4,60.00,'rejected','NH334, Purkaji, Muzaffarnagar, Uttar Pradesh, India',29.6523,77.8173,'success','2025-01-24 17:49:09','501525');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
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

-- Dump completed on 2025-01-26 10:08:53
