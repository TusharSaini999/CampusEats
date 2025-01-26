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
INSERT INTO `order_vender` VALUES (2,21,'Completed',NULL,787141),(12,21,'Completed',NULL,642306),(14,21,'Out for Pickup',NULL,189446),(24,21,'Accepted',NULL,NULL),(25,21,'Rejected','Order metrial is not found',NULL),(26,21,'Out for Pickup',NULL,NULL),(29,21,'Accepted',NULL,NULL),(30,21,'Out for Pickup',NULL,NULL),(31,21,'Accepted',NULL,NULL),(36,21,'Accepted',NULL,NULL),(37,22,'Out for Pickup',NULL,NULL),(38,22,'Rejected','Order is not pickup ',NULL),(39,21,'Prepared',NULL,NULL),(40,21,'Rejected','Rejected without accap',NULL),(40,22,'Completed',NULL,185599),(41,21,'Prepared',NULL,NULL),(42,21,'Rejected','rejected duo to unvalbal',NULL),(43,21,'Completed',NULL,848797),(44,21,'Completed',NULL,942270),(45,21,'Completed',NULL,637180),(46,21,'Prepared',NULL,NULL),(48,21,'Completed',NULL,943880),(48,22,'Completed',NULL,970934),(49,21,'Completed',NULL,901169);
/*!40000 ALTER TABLE `order_vender` ENABLE KEYS */;
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

-- Dump completed on 2025-01-26 10:09:08
