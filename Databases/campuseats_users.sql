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
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-26 10:08:26
