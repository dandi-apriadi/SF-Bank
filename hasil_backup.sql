-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: sf
-- ------------------------------------------------------
-- Server version	8.0.44-0ubuntu0.24.04.2

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
-- Table structure for table `Sessions`
--

DROP TABLE IF EXISTS `Sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Sessions` (
  `sid` varchar(36) NOT NULL,
  `expires` datetime DEFAULT NULL,
  `data` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sessions`
--

LOCK TABLES `Sessions` WRITE;
/*!40000 ALTER TABLE `Sessions` DISABLE KEYS */;
INSERT INTO `Sessions` VALUES ('5f34ab19375fb9be33ca3e1159042c2e','2025-12-10 16:09:24','{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-12-08T06:46:46.542Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"user\":{\"id\":501,\"user_id\":\"ADMIN-001\",\"name\":\"Diablo\",\"email\":\"admin@gmail.com\",\"role\":\"Admin\",\"status\":\"Active\"}}','2025-12-07 06:46:46','2025-12-09 16:09:24');
/*!40000 ALTER TABLE `Sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alliance_bank`
--

DROP TABLE IF EXISTS `alliance_bank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alliance_bank` (
  `id` int NOT NULL AUTO_INCREMENT,
  `alliance_id` int NOT NULL COMMENT 'Foreign key to alliances table',
  `bank_id` varchar(255) NOT NULL COMMENT 'Unique bank identifier',
  `bank_name` varchar(255) NOT NULL COMMENT 'Bank name',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `alliance_bank_bank_id` (`bank_id`),
  KEY `alliance_id` (`alliance_id`),
  CONSTRAINT `alliance_bank_ibfk_1` FOREIGN KEY (`alliance_id`) REFERENCES `alliances` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alliance_bank`
--

LOCK TABLES `alliance_bank` WRITE;
/*!40000 ALTER TABLE `alliance_bank` DISABLE KEYS */;
/*!40000 ALTER TABLE `alliance_bank` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alliance_resources`
--

DROP TABLE IF EXISTS `alliance_resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alliance_resources` (
  `id` int NOT NULL AUTO_INCREMENT,
  `alliance_id` int NOT NULL COMMENT 'Foreign key to alliances table',
  `food` bigint NOT NULL DEFAULT '0' COMMENT 'Food resources',
  `wood` bigint NOT NULL DEFAULT '0' COMMENT 'Wood resources',
  `stone` bigint NOT NULL DEFAULT '0' COMMENT 'Stone resources',
  `gold` bigint NOT NULL DEFAULT '0' COMMENT 'Gold resources',
  `total_rss` bigint NOT NULL DEFAULT '0' COMMENT 'Total resources (sum of all resources)',
  `weeks_donated` int NOT NULL DEFAULT '0' COMMENT 'Number of weeks donations recorded',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `alliance_resources_alliance_id` (`alliance_id`),
  CONSTRAINT `alliance_resources_ibfk_1` FOREIGN KEY (`alliance_id`) REFERENCES `alliances` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alliance_resources`
--

LOCK TABLES `alliance_resources` WRITE;
/*!40000 ALTER TABLE `alliance_resources` DISABLE KEYS */;
INSERT INTO `alliance_resources` VALUES (1,1,0,0,0,0,0,0,'2025-12-06 18:14:47','2025-12-06 18:14:47');
/*!40000 ALTER TABLE `alliance_resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alliances`
--

DROP TABLE IF EXISTS `alliances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alliances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT 'Alliance name',
  `tag` varchar(10) DEFAULT NULL COMMENT 'Alliance tag/abbreviation',
  `leader` varchar(255) DEFAULT NULL COMMENT 'Alliance leader name',
  `members_count` int NOT NULL DEFAULT '0' COMMENT 'Total members in alliance',
  `description` text COMMENT 'Alliance description',
  `bank_id` varchar(255) DEFAULT NULL COMMENT 'Bank identifier for alliance',
  `bank_name` varchar(255) DEFAULT NULL COMMENT 'Bank name for alliance',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `alliances_name` (`name`),
  UNIQUE KEY `alliances_bank_id` (`bank_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alliances`
--

LOCK TABLES `alliances` WRITE;
/*!40000 ALTER TABLE `alliances` DISABLE KEYS */;
INSERT INTO `alliances` VALUES (1,'Sacred Forces','SF-@','Frosty',93,'Main Alliance',NULL,NULL,'2025-12-06 18:14:47','2025-12-07 14:22:48');
/*!40000 ALTER TABLE `alliances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL COMMENT 'User who performed the action',
  `action` enum('CREATE','UPDATE','DELETE') NOT NULL COMMENT 'Type of action performed',
  `target_type` enum('user','alliance','bank','resource') NOT NULL COMMENT 'Type of target entity',
  `target_id` int NOT NULL COMMENT 'ID of the target entity',
  `details` longtext COMMENT 'Detailed information about the change (JSON format recommended)',
  `ip_address` varchar(45) DEFAULT NULL COMMENT 'IP address of the user (IPv4 or IPv6)',
  `user_agent` varchar(500) DEFAULT NULL COMMENT 'Browser/client information',
  `timestamp` datetime NOT NULL COMMENT 'When the action occurred',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `audit_logs_user_id` (`user_id`),
  KEY `audit_logs_target_type_target_id` (`target_type`,`target_id`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_contributions`
--

DROP TABLE IF EXISTS `member_contributions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_contributions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NOT NULL COMMENT 'Foreign key to users table',
  `alliance_id` int NOT NULL COMMENT 'Foreign key to alliances table',
  `week` int NOT NULL COMMENT 'Week number of the year',
  `date` date NOT NULL COMMENT 'Date of contribution',
  `food` bigint NOT NULL DEFAULT '0' COMMENT 'Food contribution',
  `wood` bigint NOT NULL DEFAULT '0' COMMENT 'Wood contribution',
  `stone` bigint NOT NULL DEFAULT '0' COMMENT 'Stone contribution',
  `gold` bigint NOT NULL DEFAULT '0' COMMENT 'Gold contribution',
  `total_rss` bigint NOT NULL DEFAULT '0' COMMENT 'Total resources contributed (sum of all resources)',
  `last_contribution` datetime DEFAULT NULL COMMENT 'Last contribution timestamp',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `member_contributions_member_id_alliance_id_week` (`member_id`,`alliance_id`,`week`),
  KEY `member_contributions_member_id` (`member_id`),
  KEY `member_contributions_alliance_id` (`alliance_id`),
  CONSTRAINT `member_contributions_ibfk_11` FOREIGN KEY (`member_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `member_contributions_ibfk_12` FOREIGN KEY (`alliance_id`) REFERENCES `alliances` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=191 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_contributions`
--

LOCK TABLES `member_contributions` WRITE;
/*!40000 ALTER TABLE `member_contributions` DISABLE KEYS */;
INSERT INTO `member_contributions` VALUES (1,556,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(2,528,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(3,530,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(6,587,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(7,567,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(9,510,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(11,519,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(12,543,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(13,537,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(19,512,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(20,548,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(22,550,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(24,503,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(26,521,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(28,591,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(30,585,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(31,531,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(37,576,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(43,555,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(47,544,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(48,560,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(50,525,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(52,565,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(54,513,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(55,566,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(59,532,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(61,583,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(62,538,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(64,508,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(73,552,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(74,516,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(76,558,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(77,517,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(81,526,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(82,546,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(83,533,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(85,520,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(87,553,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(88,588,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(89,573,1,49,'2025-12-06',0,0,0,0,0,'2025-12-06 19:17:28','2025-12-06 19:17:28','2025-12-06 19:17:28'),(90,505,1,1,'2025-12-05',0,0,0,4000000,0,NULL,'2025-12-06 19:18:03','2025-12-06 19:18:03'),(91,581,1,1,'2025-12-05',8000000,0,0,0,0,NULL,'2025-12-06 19:18:34','2025-12-06 19:18:34'),(93,592,1,1,'2025-12-05',0,0,0,5000000,0,NULL,'2025-12-06 19:20:04','2025-12-06 19:20:04'),(94,589,1,1,'2025-12-05',4000000,0,0,0,0,NULL,'2025-12-06 19:20:24','2025-12-06 19:20:24'),(95,564,1,1,'2025-12-06',0,0,0,11999998,0,NULL,'2025-12-06 19:20:38','2025-12-07 14:05:35'),(96,590,1,1,'2025-12-05',0,4000000,0,0,0,NULL,'2025-12-06 19:20:55','2025-12-06 19:20:55'),(98,593,1,1,'2025-12-05',4000000,0,0,0,0,NULL,'2025-12-06 19:27:47','2025-12-06 19:27:47'),(99,570,1,1,'2025-12-05',0,4000000,0,0,0,NULL,'2025-12-06 19:28:02','2025-12-06 19:28:02'),(100,557,1,1,'2025-12-05',0,0,3600000,0,0,NULL,'2025-12-06 19:28:43','2025-12-06 19:28:43'),(101,518,1,1,'2025-12-05',0,0,0,5200000,0,NULL,'2025-12-06 19:29:14','2025-12-06 19:29:14'),(102,522,1,1,'2025-12-05',4000000,0,0,0,0,NULL,'2025-12-06 19:29:29','2025-12-06 19:29:29'),(103,584,1,1,'2025-12-05',4000000,0,0,0,0,NULL,'2025-12-06 19:29:41','2025-12-06 19:29:41'),(104,541,1,1,'2025-12-05',3500000,0,0,0,0,NULL,'2025-12-06 19:30:00','2025-12-06 19:30:00'),(105,554,1,1,'2025-12-05',4000000,0,0,0,0,NULL,'2025-12-06 19:30:16','2025-12-06 19:30:16'),(106,571,1,1,'2025-12-05',0,0,5600000,0,0,NULL,'2025-12-06 19:30:30','2025-12-06 19:30:30'),(107,580,1,1,'2025-12-05',7000000,0,0,0,0,NULL,'2025-12-06 19:30:57','2025-12-06 19:30:57'),(108,559,1,1,'2025-12-05',5000000,0,0,0,0,NULL,'2025-12-06 19:31:15','2025-12-06 19:31:15'),(109,551,1,1,'2025-12-05',4400000,0,0,0,0,NULL,'2025-12-06 19:31:44','2025-12-06 19:31:44'),(110,536,1,1,'2025-12-05',0,0,4000000,0,0,NULL,'2025-12-06 19:32:05','2025-12-06 19:32:05'),(111,549,1,1,'2025-12-06',1599999,3199999,0,0,0,NULL,'2025-12-06 19:32:22','2025-12-07 07:21:30'),(112,524,1,1,'2025-12-05',0,4400000,0,0,0,NULL,'2025-12-06 19:32:40','2025-12-06 19:32:40'),(113,542,1,1,'2025-12-05',4000000,0,0,0,0,NULL,'2025-12-06 19:33:00','2025-12-06 19:33:00'),(114,515,1,1,'2025-12-05',4000000,0,0,0,0,NULL,'2025-12-06 19:33:15','2025-12-06 19:33:15'),(115,539,1,1,'2025-12-05',0,4000000,0,0,0,NULL,'2025-12-06 19:33:32','2025-12-06 19:33:32'),(116,527,1,1,'2025-12-05',0,4000000,0,0,0,NULL,'2025-12-06 19:33:45','2025-12-06 19:33:45'),(117,523,1,1,'2025-12-05',4000000,0,0,0,0,NULL,'2025-12-06 19:33:54','2025-12-06 19:33:54'),(118,574,1,1,'2025-12-05',0,0,4000000,0,0,NULL,'2025-12-06 19:34:04','2025-12-06 19:34:04'),(119,534,1,1,'2025-12-05',4500000,0,0,0,0,NULL,'2025-12-06 19:34:20','2025-12-06 19:34:20'),(120,577,1,1,'2025-12-05',4000000,0,0,0,0,NULL,'2025-12-06 19:34:31','2025-12-06 19:34:31'),(121,504,1,1,'2025-12-05',4000000,0,0,0,0,NULL,'2025-12-06 19:34:41','2025-12-06 19:34:41'),(122,563,1,1,'2025-12-06',5000000,5000000,5000000,5000000,0,NULL,'2025-12-06 19:35:08','2025-12-07 07:07:34'),(123,511,1,1,'2025-12-05',0,0,0,10000000,0,NULL,'2025-12-06 19:35:24','2025-12-06 19:35:24'),(125,507,1,1,'2025-12-05',0,0,4000000,0,0,NULL,'2025-12-06 19:36:03','2025-12-06 19:36:03'),(126,545,1,1,'2025-12-06',1370620,2629378,0,0,0,NULL,'2025-12-06 19:36:13','2025-12-07 07:00:08'),(127,536,1,2,'2025-12-06',1599999,0,4170742,0,0,NULL,'2025-12-07 07:03:08','2025-12-07 07:03:08'),(128,507,1,2,'2025-12-06',2800000,2800000,0,0,0,NULL,'2025-12-07 07:04:44','2025-12-07 07:04:44'),(129,511,1,2,'2025-12-06',3999999,0,0,0,0,NULL,'2025-12-07 07:05:27','2025-12-07 07:05:27'),(132,514,1,1,'2025-12-06',10000000,10000000,10000000,10000000,0,NULL,'2025-12-07 07:09:09','2025-12-07 07:09:09'),(134,594,1,1,'2025-12-06',4000000,4000000,0,0,0,NULL,'2025-12-07 07:11:43','2025-12-07 07:11:43'),(135,527,1,2,'2025-12-06',4000000,0,0,0,0,NULL,'2025-12-07 07:15:14','2025-12-07 07:15:14'),(136,523,1,2,'2025-12-06',3000000,1000000,0,0,0,NULL,'2025-12-07 07:16:58','2025-12-07 07:16:58'),(137,577,1,2,'2025-12-06',1700000,2337500,0,0,0,NULL,'2025-12-07 07:18:01','2025-12-07 07:18:01'),(138,589,1,2,'2025-12-06',1800000,1138435,661564,0,0,NULL,'2025-12-07 07:19:18','2025-12-07 07:19:18'),(139,539,1,2,'2025-12-06',2000000,2000000,0,0,0,NULL,'2025-12-07 07:22:17','2025-12-07 07:22:17'),(140,522,1,2,'2025-12-06',0,0,4290000,0,0,NULL,'2025-12-07 07:24:14','2025-12-07 07:24:14'),(141,559,1,2,'2025-12-06',4000565,0,0,0,0,NULL,'2025-12-07 07:24:53','2025-12-07 07:24:53'),(142,541,1,2,'2025-12-06',4036737,0,0,0,0,NULL,'2025-12-07 07:25:52','2025-12-07 07:25:52'),(143,551,1,2,'2025-12-06',1200000,1200000,1200000,462000,0,NULL,'2025-12-07 07:26:57','2025-12-07 07:26:57'),(144,518,1,2,'2025-12-06',0,0,4000000,0,0,NULL,'2025-12-07 07:28:42','2025-12-07 07:28:42'),(145,557,1,2,'2025-12-06',2599999,0,0,1062500,0,NULL,'2025-12-07 13:59:38','2025-12-07 13:59:38'),(146,590,1,2,'2025-12-06',5260000,1740000,0,0,0,NULL,'2025-12-07 14:00:39','2025-12-07 14:00:39'),(147,568,1,1,'2025-12-06',0,6398585,0,0,0,NULL,'2025-12-07 14:01:47','2025-12-07 14:01:47'),(148,568,1,2,'2025-12-06',10400000,0,0,0,0,NULL,'2025-12-07 14:02:51','2025-12-07 14:02:51'),(149,564,1,2,'2025-12-06',0,0,0,7999999,0,NULL,'2025-12-07 14:05:03','2025-12-07 14:05:03'),(150,572,1,1,'2025-12-06',4000000,0,0,0,0,NULL,'2025-12-07 14:06:25','2025-12-07 14:06:25'),(151,506,1,1,'2025-12-06',1822537,2177461,0,0,0,NULL,'2025-12-07 14:07:23','2025-12-07 14:07:23'),(153,535,1,1,'2025-12-06',0,0,4000000,0,0,NULL,'2025-12-07 14:08:31','2025-12-07 14:08:31'),(154,514,1,2,'2025-12-06',0,8000000,4000000,0,0,NULL,'2025-12-07 14:10:20','2025-12-07 14:10:20'),(155,586,1,1,'2025-12-06',2009956,2001892,0,0,0,NULL,'2025-12-07 14:11:40','2025-12-07 14:11:40'),(157,595,1,1,'2025-12-06',4000000,0,0,0,0,NULL,'2025-12-07 14:23:28','2025-12-07 14:23:28'),(158,537,1,1,'2025-12-06',4000420,0,0,0,0,NULL,'2025-12-07 14:26:03','2025-12-07 14:26:03'),(159,540,1,1,'2025-12-06',0,3999999,0,0,0,NULL,'2025-12-07 14:27:47','2025-12-07 14:27:47'),(160,569,1,1,'2025-12-06',0,12000000,0,0,0,NULL,'2025-12-07 14:28:21','2025-12-07 14:28:21'),(161,582,1,1,'2025-12-06',0,4031999,0,0,0,NULL,'2025-12-07 14:29:07','2025-12-07 14:31:02'),(162,550,1,1,'2025-12-06',0,4799999,0,0,0,NULL,'2025-12-07 14:33:20','2025-12-07 14:33:20'),(163,579,1,1,'2025-12-06',2000000,2000000,0,0,0,NULL,'2025-12-07 14:33:50','2025-12-07 14:33:50'),(164,558,1,1,'2025-12-06',3500000,3500000,0,0,0,NULL,'2025-12-07 14:34:45','2025-12-07 14:34:45'),(165,561,1,1,'2025-12-06',4000000,0,0,0,0,NULL,'2025-12-07 14:35:07','2025-12-07 14:35:07'),(166,566,1,1,'2025-12-06',3580871,419128,0,0,0,NULL,'2025-12-07 14:35:59','2025-12-07 14:35:59'),(167,575,1,1,'2025-12-06',3400000,0,0,0,0,NULL,'2025-12-07 14:37:13','2025-12-07 14:37:13'),(168,578,1,1,'2025-12-06',3999999,0,0,0,0,NULL,'2025-12-07 16:25:16','2025-12-07 16:25:16'),(169,547,1,1,'2025-12-06',4208322,0,0,0,0,NULL,'2025-12-07 16:27:25','2025-12-07 16:27:25'),(170,577,1,3,'2025-12-06',0,4000000,0,0,0,NULL,'2025-12-07 16:31:42','2025-12-07 16:31:42'),(171,561,1,2,'2025-12-06',0,4000000,0,0,0,NULL,'2025-12-07 16:32:19','2025-12-07 16:32:19'),(172,509,1,1,'2025-12-06',4000000,0,0,0,0,NULL,'2025-12-07 16:32:54','2025-12-07 16:32:54'),(173,559,1,3,'2025-12-06',5023759,0,0,0,0,NULL,'2025-12-07 16:34:04','2025-12-07 16:34:04'),(174,553,1,1,'2025-12-06',2006377,2001340,0,0,0,NULL,'2025-12-07 16:35:47','2025-12-07 16:35:47'),(175,536,1,3,'2025-12-06',2399999,2399999,0,0,0,NULL,'2025-12-07 16:39:00','2025-12-07 16:39:00'),(176,562,1,1,'2025-12-06',0,4000000,0,0,0,NULL,'2025-12-07 16:50:53','2025-12-07 16:50:53'),(177,579,1,2,'2025-12-06',1000000,1000000,1000000,1000000,0,NULL,'2025-12-07 17:13:55','2025-12-07 17:13:55'),(178,579,1,3,'2025-12-06',2000000,2000000,2000000,2000000,0,NULL,'2025-12-07 17:14:21','2025-12-07 17:14:21'),(179,557,1,3,'2025-12-06',0,0,4000000,0,0,NULL,'2025-12-07 17:15:16','2025-12-07 17:15:16'),(180,566,1,2,'2025-12-06',4000000,0,0,0,0,NULL,'2025-12-07 17:15:49','2025-12-07 17:15:49'),(181,507,1,3,'2025-12-07',0,0,4000000,6000000,0,NULL,'2025-12-08 13:09:19','2025-12-08 13:09:19'),(182,572,1,2,'2025-12-08',4500000,0,0,0,0,NULL,'2025-12-09 05:28:28','2025-12-09 05:28:28'),(183,524,1,2,'2025-12-08',0,0,4799999,0,0,NULL,'2025-12-09 05:34:04','2025-12-09 05:34:04'),(184,513,1,1,'2025-12-08',1255600,1255600,1255600,1255600,0,NULL,'2025-12-09 05:40:20','2025-12-09 05:40:20'),(186,575,1,2,'2025-12-08',0,5000000,0,0,0,NULL,'2025-12-09 05:53:06','2025-12-09 05:53:06'),(187,545,1,2,'2025-12-08',8000000,2016000,0,0,0,NULL,'2025-12-09 11:08:02','2025-12-09 11:08:02'),(188,529,1,1,'2025-12-08',3148842,1236255,1180704,0,0,NULL,'2025-12-09 11:09:11','2025-12-09 11:09:11'),(189,590,1,3,'2025-12-08',0,5000000,0,0,0,NULL,'2025-12-09 11:10:09','2025-12-09 11:10:09'),(190,515,1,2,'2025-12-08',4000000,1008000,0,0,0,NULL,'2025-12-09 11:13:00','2025-12-09 11:13:00');
/*!40000 ALTER TABLE `member_contributions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL COMMENT 'Unique user identifier (game ID or custom ID)',
  `name` varchar(255) NOT NULL COMMENT 'User name',
  `email` varchar(191) NOT NULL COMMENT 'Email address for login',
  `password` varchar(255) DEFAULT NULL COMMENT 'Hashed password using Argon2',
  `role` enum('Admin','R1','R2','R3','R4','R5') NOT NULL DEFAULT 'R5' COMMENT 'User role in alliance hierarchy',
  `alliance_id` int DEFAULT NULL COMMENT 'Foreign key to alliances table',
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active' COMMENT 'User account status',
  `joined_date` date DEFAULT NULL COMMENT 'Date when user joined alliance',
  `last_login` datetime DEFAULT NULL COMMENT 'Last login timestamp',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `user_id_2` (`user_id`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `user_id_3` (`user_id`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `user_id_4` (`user_id`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `user_id_5` (`user_id`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `user_id_6` (`user_id`),
  UNIQUE KEY `email_6` (`email`),
  KEY `users_alliance_id` (`alliance_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`alliance_id`) REFERENCES `alliances` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=596 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (501,'ADMIN-001','Diablo','admin@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$9Fm85IwPLzwvD0AI5/rErQ$+r7mv698m+/3M7u9X7GLK5p9jtS7KhsLIQH1gCwjBIc','Admin',NULL,'Active',NULL,NULL,'2025-12-06 14:16:23','2025-12-06 18:13:38'),(502,'123456789','nana','nana@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$Rk9yUUdK2DVRc7giijT7Rg$ItUu7wimZLP1eXN9S117ewB8QR3cW2kkeX2DI752J4M','Admin',NULL,'Active',NULL,NULL,'2025-12-06 14:29:31','2025-12-06 14:29:31'),(503,'21209803','ˢᶠAkanoOuO','AkanoOuO@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$AM0B8FcFwzJO3clwyJsCwA$Js1VOjLACOhm4SjQ6vKrvDbGyRIwjcdkANru2DsUV/I','R4',NULL,'Active',NULL,NULL,'2025-12-06 18:48:31','2025-12-06 18:48:31'),(504,'212094158','ˢᶠPink Toes','PinkToes@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$b9BXda25qxDaKL8xzNMWcg$G47MGP5LgqsooH5nueBHlMfT6nYTPh4ZWFMntVM9Mlw','R4',NULL,'Active',NULL,NULL,'2025-12-06 18:49:59','2025-12-06 18:49:59'),(505,'212082343','ˢᶠShaggy','Shaggy@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$TETbMtCF++ztIi7upRpQTA$ZxuFmwhrHjSU42O82Sv2Ue/mj4dHj9PZ3FIpPZCXx9s','R4',NULL,'Active',NULL,NULL,'2025-12-06 18:50:35','2025-12-06 18:50:35'),(506,'211701077','ˢᶠNUB WØNTZ','NUBWoNTZ@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$3W5UUXyppnjeNXPSw7U7Pw$vtxypwvzXtlx6do9ojfj25+R+lHX5lZjV0npU1Et3Gg','R4',NULL,'Active',NULL,NULL,'2025-12-06 18:51:35','2025-12-06 18:51:35'),(507,'211584106','ˢᶠVirdaap','Virdaap@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$PiXtONteD+O808++weFoQg$XDm1w+CPgcxpTWvR415Ge7jaIrHncSjECjmSeT/4PXY','R4',NULL,'Active',NULL,NULL,'2025-12-06 18:52:07','2025-12-06 18:52:16'),(508,'212081618','ˢᶠNUB MOIZ','NUBMOIZ@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$CbuJY1+nehkVTHRqn44BiA$JdOXm12U2D56ntaK43ITGH2TgT+MQBkkyEnh4GkIyJE','R4',NULL,'Active',NULL,NULL,'2025-12-06 18:52:51','2025-12-06 18:52:51'),(509,'212109825','ˢᶠTek Adri','TekAdri@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$TuLV2MgDbob8PZ/IKIzQmg$8WW7/dR9rYcIEEFGPoczWLt4cdkoZQZ50fpNelarLjQ','R4',NULL,'Active',NULL,NULL,'2025-12-06 18:53:27','2025-12-06 18:53:27'),(510,'211999282','ˢᶠ Lèza','Leza@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$IfQ0hr6Nk3r1pYj84wleNA$vX9JeW9OMwxZtnqzGuNubZEHW7QCY+BGKCdtpo0P2dU','R4',NULL,'Active',NULL,NULL,'2025-12-06 18:54:06','2025-12-06 18:54:06'),(511,'13131231313','ˢᶠK Aron','KAron@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$681EcfHDxpWfaoRjRGeTgQ$yNJtD4olfxMo3tGggWliVdn9zmzmIRaLOLNQuuY6UtE','R3',NULL,'Active',NULL,NULL,'2025-12-06 18:54:37','2025-12-06 18:54:37'),(512,'13213131231332','ˢᶠ 옥탑방김뿌엥','korea1@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$QqoiPOOQdl+f5DVkYRNwtg$Fuh5pleHaMWgSJbtxLhaar9PrpUhY8tzY19cg8HxdSQ','R3',NULL,'Active',NULL,NULL,'2025-12-06 18:55:12','2025-12-06 18:55:12'),(513,'user_1','ˢᶠKhê','user1@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(514,'user_2','ˢᶠWARZYN','user2@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(515,'user_3','ˢᶠAriTleZ','user3@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(516,'user_4','ˢᶠSøprano','user4@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(517,'user_5','ˢᶠUncrowned','user5@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(518,'user_6','ˢᶠBaecoom','user6@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(519,'user_7','ˢᶠ Như Như','user7@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(520,'user_8','ˢᶠŴįcķeð','user8@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(521,'user_9','ˢᶠApinBrutal','user9@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(522,'user_10','ˢᶠ S҉IGMA҉','user10@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(523,'user_11','ˢᶠRaccoon','user11@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(524,'user_12','ˢᶠSeraphim','user12@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(525,'user_13','ˢᶠHePol','user13@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(526,'user_14','ˢᶠVNoEdward','user14@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(527,'user_15','ˢᶠMinwangg','user15@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(528,'user_16','ˢᶠ AKA','user16@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(529,'user_17','ˢᶠROGUE','user17@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(530,'user_18','ˢᶠ Ánh suny','user18@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(531,'user_19','ˢᶠBERSERK','user19@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(532,'user_20','ˢᶠMagee','user20@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(533,'user_21','ˢᶠWal3x','user21@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(534,'user_22','ˢᶠNightfall','user22@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(535,'user_23','ˢᶠDOBERMAN','user23@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(536,'user_24','ˢᶠDiablo','user24@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(537,'user_25','ˢᶠ Psinchac','user25@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(538,'user_26','ˢᶠNAMEBVZ','user26@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(539,'user_27','ˢᶠDream','user27@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(540,'user_28','ˢᶠBQZZKURT','user28@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(541,'user_29','ˢᶠvirex','user29@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(542,'user_30','ˢᶠErbek','user30@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(543,'user_31','ˢᶠ peace','user31@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(544,'user_32','ˢᶠF2PVN','user32@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(545,'user_33','ˢᶠPersephone','user33@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(546,'user_34','ˢᶠVN Bờm','user34@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(547,'user_35','ˢᶠCat','user35@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(548,'user_36','ˢᶠ 若白丶','user36@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(549,'user_37','ˢᶠ DonBrutal','user37@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(550,'user_38','ˢᶠahThuw','user38@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(551,'user_39','ˢᶠAEGLOS','user39@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(552,'user_40','ˢᶠSILVER','user40@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(553,'user_41','ˢᶠ気持チー','user41@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(554,'user_42','ˢᶠ Thiên','user42@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(555,'user_43','ˢᶠDobruyDen','user43@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(556,'user_44','ˢᶠ  Luffe','user44@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(557,'user_45','ˢᶠDëmonic','user45@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(558,'user_46','ˢᶠThuỷZyZy','user46@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(559,'user_47','ˢᶠcapy86','user47@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(560,'user_48','ˢᶠGấu','user48@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(561,'user_49','ˢᶠARJAH','user49@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(562,'user_50','ˢᶠ Qwz7','user50@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(563,'user_51','ˢᶠ Judge','user51@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(564,'user_52','ˢᶠBigTep','user52@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(565,'user_53','ˢᶠKBP77','user53@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(566,'user_54','ˢᶠKikir A','user54@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(567,'user_55','ˢᶠ ismailKA','user55@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(568,'user_56','ˢᶠGuzalo','user56@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(569,'user_57','ˢᶠESCANOR','user57@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(570,'user_58','ˢᶠYNLove','user58@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(571,'user_59','ˢᶠLonelyWolf','user59@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(572,'user_60','ˢᶠCupers','user60@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(573,'user_61','ZuˢᶠBAMID乄','user61@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(574,'user_62','ˢᶠLinh Ká','user62@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(575,'user_63','ˢᶠ Thành PV','user63@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(576,'user_64','ˢᶠCoCo','user64@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(577,'user_65','ˢᶠBurvesnik','user65@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(578,'user_66','ˢᶠlucky','user66@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(579,'user_67','ˢᶠKeYtIDanZz','user67@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(580,'user_68','ˢᶠVarg','user68@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(581,'user_69','ˢᶠ Nailong','user69@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(582,'user_70','ˢᶠẢo Giác','user70@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(583,'user_71','ˢᶠMIN㋰','user71@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(584,'user_72','ˢᶠRuồi','user72@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(585,'user_73','ˢᶠBenkei乄','user73@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(586,'user_74','ˢᶠDead Vomit','user74@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(587,'user_75','ˢᶠ FanLy 969','user75@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(588,'user_76','ˢᶠシᶜᵘᵃ','user76@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(589,'user_77','ˢᶠ Sunshine','user77@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(590,'user_78','ˢᶠ AnhDQ','user78@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(591,'user_79','ˢᶠBabyyCat','user79@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8','R3',NULL,'Active','2025-12-06',NULL,'2025-12-06 19:16:08','2025-12-06 19:16:08'),(592,'265465432','ˢᶠNana Joyce','nanajoyce@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$nbkojiqXHRraPwCcZwTeAw$p/X49dr18aefhHQbUPvGg5/OSsXBgEBgLDQLdNVLRiU','R4',NULL,'Active',NULL,NULL,'2025-12-06 19:19:33','2025-12-06 19:19:33'),(593,'165465121','ˢᶠNVT','nvt@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$ChHOPa5mWV+cjiYda8Snmw$fP379V8drJiEobBktlItNf7wQhNFTRuqD1/G6YOUggQ','R3',NULL,'Active',NULL,NULL,'2025-12-06 19:27:19','2025-12-06 19:27:19'),(594,'2342424234','ˢᶠFrosty','Frosty@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$6I4CJceKqq14lYLp0JmQew$2l/SZwBMM3FndyTsM7yePkHpMPhqrrFdZB/VAI9l7/k','R5',NULL,'Active',NULL,NULL,'2025-12-07 07:10:52','2025-12-07 07:10:52'),(595,'211669093','ˢʳZeeyaa','Zeeyaa@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$iAdZqyTESkLu6zbhaU61vQ$R5jXTOJ+JQOph/MmvOLLWocxWnk6/zv4CmQ5BuNirUg','R1',NULL,'Active',NULL,NULL,'2025-12-07 14:22:38','2025-12-07 14:22:38');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-10  3:29:04
