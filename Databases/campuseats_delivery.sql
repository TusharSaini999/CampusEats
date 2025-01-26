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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery`
--

LOCK TABLES `delivery` WRITE;
/*!40000 ALTER TABLE `delivery` DISABLE KEYS */;
INSERT INTO `delivery` VALUES (2,'Ansh','ansh@gmail.com','$2a$10$WC3ID52NVgEy3r.eTeV5y.m9D/V3/bP2KSKsSJ7A/h4V79TtGfCWm','9876543210','2024-12-19 06:10:22','delivery_boy',180,3,'/profile/main.jpg',NULL,0),(3,'John','johnexample.com','$2a$10$z.UVokdmdAnvdOk93VGN7O7Mp3Po4NrDjMrdBqsisEhWwUgL0ngx2','','2024-12-20 02:58:42','delivery_boy',0,0,'/profile/main.jpg',NULL,0),(4,'d1','d1@gmail.com','$2a$10$Tg/EWHFK3nwmqVroFaMTreTFgC6RD1TE1j5IWXT8BNa3i1lztPvWW','0123456789','2025-01-20 03:04:03','delivery_boy',100,2,'/profile/1737343208887_1737020845004.png','Uttar Pradesh,India',1),(5,'d2','d2@gmail.com','$2a$10$Mxr2O6fTjXT/RR.SRhH1n.HneETkirDlEitkPmtYnLmmUhLcxnY3q',NULL,'2025-01-20 04:12:19','delivery_boy',0,0,'/profile/main.jpg',NULL,0),(6,'d3','d3@gmail.com','$2a$10$YaBxhJlAHiCuP5cDHAVOOuK4zIaQf.TabqyoniqN88qk83EPkGbgS','0123456789','2025-01-20 04:15:08','delivery_boy',0,0,'/profile/main.jpg',NULL,0),(7,'d4','d4@gmail.com','$2a$10$43X7qoG0Xxt/0CLQw9qlX.o9LipWRjXK0ZBV0YZEYvCn0dbM20luq','9615252322','2025-01-20 05:02:23','delivery_boy',0,0,'/profile/main.jpg',NULL,0),(8,'d5','d5@gmail.com','$2a$10$E37PpRAgQ.oRzoEaDtAF8.M0Bor9ZR0EgPMAUrDivMOF/sDGBcOAm','0123456789','2025-01-20 05:03:31','delivery_boy',0,0,'/profile/1737353196309_image.png','hhb kjbgjhybgj',0),(9,'d5','d6@gmail.com','$2a$10$wT0FKDynEhLR52/wKKGgW.3ANh26aQZei30BK3Zdyz0zQnVWem1zC','0123456789','2025-01-20 05:32:54','delivery_boy',0,0,'/profile/main.jpg',NULL,0);
/*!40000 ALTER TABLE `delivery` ENABLE KEYS */;
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

-- Dump completed on 2025-01-26 10:09:15
