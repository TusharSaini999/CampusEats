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

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '753b858e-d168-11ef-81c1-16d815805ca9:1-183';

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendors`
--

LOCK TABLES `vendors` WRITE;
/*!40000 ALTER TABLE `vendors` DISABLE KEYS */;
INSERT INTO `vendors` VALUES (1,'Pizza Place','pizza@example.com','vendorpass','9876543220','12 Market St, City A','2024-12-15 14:32:01','vendor'),(2,'Burger Corner','burger@example.com','vendorsecure','9876543221','34 Food Court, City B','2024-12-15 14:32:01','vendor'),(3,'Healthy Bites','healthy@example.com','healthypass','9876543222','56 Green Lane, City C','2024-12-15 14:32:01','vendor'),(4,'Abdulla','abdulla12@gmail.com','$2a$10$.c4M2X3J3yil8CqL0i9PbeNuAG9x6ZalY49qfi8kohpGadUFtj2Gq',NULL,NULL,'2024-12-16 00:27:45','vendor'),(5,'Pundir Guest House','pundir12@gmail.com','$2a$10$DhQuQDTruWT4X3HJkbd2F.7XSOoQrhMH7uf9i7DXTHDhU4MIaQo/a','132154564','Choli Near Quantum University','2024-12-16 04:10:33','vendor'),(6,'Shivam Dhaba','shivam12@gmail.com','$2a$10$RIPWfHQNRhuR69nfpKZVXOo6ZJAKI/PruKVKAgGp.ZAHt7RV5Cx0e',NULL,NULL,'2024-12-16 04:31:00','vendor'),(7,'Dastarkhan','dastarkhan12@gmail.com','$2a$10$q6e/3nzjH1NE1VDGC3vG/uZgMP2rRiiTi22dtnlagOPh1xGPxZity',NULL,NULL,'2024-12-16 04:33:54','vendor'),(8,'Babbe Da Dhaba','babbe@gmail.com','$2a$10$hPIoS0gsZF5AxgzwX0PbiOYkj0DyAoDg1fXx6OOmUabBtylwyMnFK',NULL,NULL,'2024-12-18 10:28:30','vendor'),(9,'Tushar Saini','tushar@gmail.com','$2a$10$qT.PNNnJ5Je2e2MLPfTXue7/yXVTdbVHbCpEjMgVnVEEHkq11hAyK',NULL,NULL,'2024-12-18 14:41:07','vendor'),(10,'','','$2a$10$X7T1MTuiTFuLRQJNsBhJxuUr/MAIiNzMub3m8sPBral8edFdNGRlG',NULL,NULL,'2024-12-18 17:53:12','vendor'),(11,'test_vendor','vendor@gmail.com','$2a$10$dwrWZpePm5K2ID.KPT8hGeXqfR1sxpn3Qma7hiiLAWBIMXc/OeuwK',NULL,NULL,'2024-12-18 18:04:47','vendor'),(12,'Hello Restaurant','hello@gmail.com','$2a$10$wJgATMa6licryVzThV7r1ukwZLOvDfm1qUC/Kqt.sE3WYftMragQe',NULL,NULL,'2024-12-18 18:11:41','vendor'),(13,'test_vendor','test_vendor@gmail.com','$2a$10$sYqmu6ogk3QrFBTYg3Z6GuvwktI57X35iUOMbD0GM6RC9N0YmvwZ6',NULL,NULL,'2024-12-19 07:08:29','vendor'),(14,'test_vendor_2','test_vendor_2@gmail.com','$2a$10$nq/18s0uT/Vzwnqduy6B8uDrKyA56ZStbMWnlw50YfMNsF4DxCUvG',NULL,NULL,'2024-12-19 07:19:25','vendor'),(15,'test_vendor_3','test_vendor_3@gmail.com','$2a$10$tAjmijgVxuhMtfZhHcCZx.GmtgbDXqFRO/sSA9xuYJmRZJu045WiW',NULL,NULL,'2024-12-19 08:18:23','vendor'),(16,'test_vendor_4','test_vendor_4@gmail.com','$2a$10$xTqoiN1Vez7EjP8BlUhVFeZQDjqaUmQnBMco1bHTFBFA1Oo/vSm9S',NULL,NULL,'2024-12-19 08:20:12','vendor'),(17,'test_vendor_5','test_vendor_5@gmail.com','$2a$10$qlen9PCsgJb2.LYddDlFeeZdrIIcU3ohXy2dEdS3Z2GtJEPhuxDp2',NULL,NULL,'2024-12-19 08:25:11','vendor'),(18,'test_vendor_6','test_vendor_6@gmail.com','$2a$10$1U87AqxlA6b2358C4m3Qu.3R7jbQpL557j2gabFpx2pEpNWk1WjPy',NULL,NULL,'2024-12-19 08:26:12','vendor'),(19,'test_vendor_7','test_vendor_7@gmail.com','$2a$10$sT/UB0fXNWblLCy0.Ep6Xus2XVhiVhyY2JNpLu6le.PgNjTRuYJ5q',NULL,NULL,'2024-12-19 08:26:42','vendor'),(20,'test_vendor_10','test_vendor_10@gmail.com','$2a$10$jqOm68JBD4A73W.h0aTPYOKU2Px6zLjOwjCZ/uPdIm04BE7SDB7FS',NULL,NULL,'2024-12-19 11:10:34','vendor');
/*!40000 ALTER TABLE `vendors` ENABLE KEYS */;
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

-- Dump completed on 2025-01-13 18:15:38
