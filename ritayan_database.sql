-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: ritayan_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `ritayan_db`
--



--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `details` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
INSERT INTO `activity_logs` VALUES (1,1,'LOGIN','Admin logged in: admin','127.0.0.1','2026-10-01 21:10:58'),(2,1,'LOGIN','Admin logged in: admin','127.0.0.1','2026-10-01 21:11:39'),(3,1,'LOGIN','Admin logged in: admin','127.0.0.1','2026-10-01 21:11:57'),(4,1,'LOGIN','Admin logged in: admin','127.0.0.1','2026-10-01 21:17:45'),(5,1,'CREATE_COMIC','Created comic','127.0.0.1','2026-10-01 21:19:27'),(6,1,'UPLOAD_PAGES','Uploaded pages for comic ID: 4','127.0.0.1','2026-10-01 21:20:12'),(7,1,'CREATE_COMIC','Created comic','127.0.0.1','2026-10-01 21:21:18'),(8,1,'CREATE_COMIC','Created comic','127.0.0.1','2026-10-01 21:21:31'),(9,1,'CREATE_COMIC','Created comic','127.0.0.1','2026-10-01 21:24:15'),(10,1,'UPLOAD_PAGES','Uploaded pages for comic ID: 5','127.0.0.1','2026-10-01 21:25:00'),(11,1,'CREATE_COMIC','Created comic','127.0.0.1','2026-10-01 21:25:46'),(12,1,'UPLOAD_PAGES','Uploaded pages for comic ID: 6','127.0.0.1','2026-10-01 21:26:55'),(13,1,'UPLOAD_PAGES','Uploaded pages for comic ID: 6','127.0.0.1','2026-10-01 21:27:01'),(14,1,'UPLOAD_PAGES','Uploaded pages for comic ID: 6','127.0.0.1','2026-10-01 21:27:14'),(15,1,'REORDER_PAGES','Reordered comic pages','127.0.0.1','2026-10-01 21:27:38'),(16,1,'REORDER_PAGES','Reordered comic pages','127.0.0.1','2026-10-01 21:28:04'),(17,1,'PUBLISH_COMIC','Published comic ID: 6','127.0.0.1','2026-10-01 21:28:35'),(18,1,'DELETE_COMIC','Deleted comic ID: 1','127.0.0.1','2026-10-02 08:21:12'),(19,1,'DELETE_COMIC','Deleted comic ID: 2','127.0.0.1','2026-10-02 08:32:48'),(20,1,'DELETE_COMIC','Deleted comic ID: 3','127.0.0.1','2026-10-02 08:33:13'),(21,1,'DELETE_COMIC','Deleted comic ID: 4','127.0.0.1','2026-10-02 08:33:17'),(22,1,'LOGIN','Admin logged in: admin','127.0.0.1','2026-10-02 10:37:33'),(23,1,'LOGIN','Admin logged in: admin','127.0.0.1','2026-10-02 13:06:12'),(24,1,'LOGIN','Admin logged in: admin','127.0.0.1','2026-10-02 13:07:45');
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_roles`
--

DROP TABLE IF EXISTS `admin_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  `permissions` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_roles`
--

LOCK TABLES `admin_roles` WRITE;
/*!40000 ALTER TABLE `admin_roles` DISABLE KEYS */;
INSERT INTO `admin_roles` VALUES (1,'Super Admin','*');
/*!40000 ALTER TABLE `admin_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role_id` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `admin_roles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'admin','admin@ritayan.com','$2y$10$KXDA2JvP4SOjbhzOM4zgze2.jt4LRuIGptXTtkC5NR2eerblSPvG6',1,'2026-10-01 20:39:42');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `analytics`
--

DROP TABLE IF EXISTS `analytics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `analytics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_type` varchar(50) NOT NULL,
  `comic_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analytics`
--

LOCK TABLES `analytics` WRITE;
/*!40000 ALTER TABLE `analytics` DISABLE KEYS */;
/*!40000 ALTER TABLE `analytics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `characters`
--

DROP TABLE IF EXISTS `characters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `characters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `title` varchar(150) DEFAULT NULL,
  `avatar_type` varchar(50) DEFAULT 'Avatar',
  `character_category` varchar(50) DEFAULT 'FISH',
  `yuga` varchar(50) DEFAULT 'Satya Yuga',
  `theme_color` varchar(50) DEFAULT '#F59E0B',
  `bg_gradient` text DEFAULT NULL,
  `avatar_image` varchar(255) DEFAULT NULL,
  `weapon_symbol` varchar(100) DEFAULT NULL,
  `power_level` int(11) DEFAULT 95,
  `description` text DEFAULT NULL,
  `lore_details` text DEFAULT NULL,
  `associated_slug` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `characters`
--

LOCK TABLES `characters` WRITE;
/*!40000 ALTER TABLE `characters` DISABLE KEYS */;
INSERT INTO `characters` VALUES (1,'MATSYA','The Primordial Fish Avatar','Dashavatara #1','FISH','Satya Yuga','#0284C7','linear-gradient(135deg, #020617 0%, #0369A1 50%, #0284C7 100%)','characters/matsya.jpg','Golden Horn & Sacred Vedas',98,'The divine fish incarnation who glides through the primordial ocean, creating water bubbles and light rays while rescuing King Manu\'s ark during Mahapralaya.','When the demonic titan Hayagriva stole the Vedas, dark chaos threatened creation. Appearing initially as a tiny golden fish in King Manu\'s palms, Matsya grew exponentially into a colossal horned leviathan. Tying the ark to His horn using serpent Vasuki, He navigated the deluge and vanquished the demon to restore divine wisdom.','ritayan-001','2026-10-02 10:17:50'),(2,'KURMA','The Cosmic Tortoise','Dashavatara #2','TORTOISE','Satya Yuga','#F59E0B','linear-gradient(135deg, #180202 0%, #78350F 50%, #B45309 100%)','characters/kurma.jpg','Indestructible Shell & Vortex',97,'The divine tortoise avatar whose impenetrable golden shell bears the staggering weight of Mount Mandara during the churning of the Ocean of Milk.','As Devas and Asuras attempted to churn the Ocean of Milk to extract Amrita, the massive pivot of Mount Mandara began sinking into the ocean bed. Lord Vishnu assumed the indestructible Kurma incarnation spanning millions of leagues, bearing the staggering friction of the churning mountain upon His shell.','ritayan-002','2026-10-02 10:17:50'),(3,'VARAHA','The Mighty Earth Boar','Dashavatara #3','BOAR','Satya Yuga','#10B981','linear-gradient(135deg, #022C22 0%, #064E3B 50%, #047857 100%)','characters/varaha.jpg','Golden Tusks & Bedrock Tremors',99,'The mighty boar incarnation who ruptures Rasatala with seismic earth cracking shockwaves to rescue Mother Earth from the abyssal ocean.','Emerging as a microscopic form from Brahma\'s nostril, Varaha expanded to cosmic magnitude with a roar that vibrated across realms. Plunging into Rasatala, He fought the tyrant Hiranyaksha in underwater combat lasting a thousand years before gently carrying Mother Earth upon His gleaming tusks.','ritayan-003','2026-10-02 10:17:50'),(4,'NARASIMHA','The Invincible Lion Avatar','Dashavatara #4','LION','Satya Yuga','#EF4444','linear-gradient(135deg, #450A0A 0%, #991B1B 50%, #DC2626 100%)','characters/narasimha.jpg','Fiery Mane & Lion Claws',100,'The fierce lion-man avatar who bursts from a stone pillar with roaring flames and lion claw slashes to vanquish Hiranyakashipu at twilight.','Bound by Brahma\'s boon that he could not be killed by man or beast, inside or outside, by day or night, nor by any weapon, Hiranyakashipu tormented devout Prahlada. At dusk, Lord Narasimha erupted from a stone pillar — neither man nor beast — placing the demon on His lap at the threshold to tear him with His bare claws.','ritayan-004','2026-10-02 10:17:50'),(5,'VASUKI','The King of Serpents','Naga King','SERPENT','Satya Yuga','#14B8A6','linear-gradient(135deg, #042F2E 0%, #115E59 50%, #0D9488 100%)','characters/vasuki.jpg','Slithering Serpent Coils & Venom Hiss',93,'The magnificent thousand-hooded Naga King whose slithering serpents and venomous hiss wrapped around Mount Mandara for Samudra Manthan.','Demonstrating heroic fortitude, Vasuki allowed Himself to be wrapped around Mount Mandara. As the Devas pulled His tail and Asuras His head, the slithering friction caused Him to emit noxious venom, testing the endurance of the universe before Shiva drank the poison.','ritayan-002','2026-10-02 10:17:50'),(6,'KING PARIKSHIT','Last Pandava King & Great Devotee','Kuru Dynasty King','ROYAL_DEVOTEE','Dvapara / Kali Yuga','#8B5CF6','linear-gradient(135deg, #2E1065 0%, #5B21B6 50%, #7C3AED 100%)','characters/parikshit.jpg','Royal Pandava Crown & Sacred Lotus',91,'The noble son of Abhimanyu and last ruler of the Pandava lineage, famed for his unwavering devotion and listening to Shrimad Bhagavata Purana at Sukatal.','Saved in Uttara\'s womb by Lord Krishna\'s Sudarshana Chakra, King Parikshit ruled Hastinapur with supreme righteousness. When cursed to be bitten by serpent Takshaka in seven days, he renounced his throne and sat on the banks of the Ganga to absorb the sublime nectar of Krishna\'s leelas from Sage Shukadeva.','ritayan-001','2026-10-02 10:17:50');
/*!40000 ALTER TABLE `characters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comic_metadata`
--

DROP TABLE IF EXISTS `comic_metadata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comic_metadata` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comic_id` int(11) NOT NULL,
  `key_name` varchar(50) NOT NULL,
  `value_content` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `comic_id` (`comic_id`),
  CONSTRAINT `comic_metadata_ibfk_1` FOREIGN KEY (`comic_id`) REFERENCES `comics` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comic_metadata`
--

LOCK TABLES `comic_metadata` WRITE;
/*!40000 ALTER TABLE `comic_metadata` DISABLE KEYS */;
/*!40000 ALTER TABLE `comic_metadata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comic_pages`
--

DROP TABLE IF EXISTS `comic_pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comic_pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comic_id` int(11) NOT NULL,
  `page_number` int(11) NOT NULL,
  `language_code` varchar(10) DEFAULT 'HI',
  `image_path` varchar(255) NOT NULL,
  `page_title` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `comic_id` (`comic_id`),
  CONSTRAINT `comic_pages_ibfk_1` FOREIGN KEY (`comic_id`) REFERENCES `comics` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comic_pages`
--

LOCK TABLES `comic_pages` WRITE;
/*!40000 ALTER TABLE `comic_pages` DISABLE KEYS */;
INSERT INTO `comic_pages` VALUES (12,6,2,'HI','comics/ritayan-006/pages/page-001.png','Page 1','2026-10-01 21:27:01'),(13,6,1,'HI','comics/ritayan-006/pages/page-002.png','Page 2','2026-10-01 21:27:14'),(58,7,1,'HI','comics/ritayan-001/pages/hi/page-001.svg','राजकीय तर्पण','2026-10-02 10:17:50'),(59,7,2,'HI','comics/ritayan-001/pages/hi/page-002.svg','मत्स्य का तीव्र विकास','2026-10-02 10:17:50'),(60,7,3,'HI','comics/ritayan-001/pages/hi/page-003.svg','महाप्रलय की चेतावनी','2026-10-02 10:17:50'),(61,7,4,'HI','comics/ritayan-001/pages/hi/page-004.svg','महाप्रलय का तूफान','2026-10-02 10:17:50'),(62,7,5,'HI','comics/ritayan-001/pages/hi/page-005.svg','वेदों का पुनरुद्धार','2026-10-02 10:17:50'),(63,7,1,'EN','comics/ritayan-001/pages/en/page-001.svg','The Royal Ritual','2026-10-02 10:17:50'),(64,7,2,'EN','comics/ritayan-001/pages/en/page-002.svg','The Rapid Growth','2026-10-02 10:17:50'),(65,7,3,'EN','comics/ritayan-001/pages/en/page-003.svg','The Great Warning','2026-10-02 10:17:50'),(66,7,4,'EN','comics/ritayan-001/pages/en/page-004.svg','The Cosmic Storm','2026-10-02 10:17:50'),(67,7,5,'EN','comics/ritayan-001/pages/en/page-005.svg','Recovery of Vedas','2026-10-02 10:17:50'),(68,7,1,'MR','comics/ritayan-001/pages/mr/page-001.svg','राजकीय तर्पण विधी','2026-10-02 10:17:50'),(69,7,2,'MR','comics/ritayan-001/pages/mr/page-002.svg','मत्स्याची जलद वाढ','2026-10-02 10:17:50'),(70,7,3,'MR','comics/ritayan-001/pages/mr/page-003.svg','महाप्रलयाची चेतावणी','2026-10-02 10:17:50'),(71,7,4,'MR','comics/ritayan-001/pages/mr/page-004.svg','महाप्रलयाचे वादळ','2026-10-02 10:17:50'),(72,7,5,'MR','comics/ritayan-001/pages/mr/page-005.svg','वेदांचे पुनरुज्जीवन','2026-10-02 10:17:50'),(73,8,1,'HI','comics/ritayan-002/pages/hi/page-001.svg','महा संधि','2026-10-02 10:17:50'),(74,8,2,'HI','comics/ritayan-002/pages/hi/page-002.svg','मंदराचल का डूबना','2026-10-02 10:17:50'),(75,8,3,'HI','comics/ritayan-002/pages/hi/page-003.svg','अक्षय पृष्ठ का आधार','2026-10-02 10:17:50'),(76,8,4,'HI','comics/ritayan-002/pages/hi/page-004.svg','हलाहल विष पान','2026-10-02 10:17:50'),(77,8,1,'EN','comics/ritayan-002/pages/en/page-001.svg','The Great Alliance','2026-10-02 10:17:50'),(78,8,2,'EN','comics/ritayan-002/pages/en/page-002.svg','Sinking of Mandara','2026-10-02 10:17:50'),(79,8,3,'EN','comics/ritayan-002/pages/en/page-003.svg','The Shell of Salvation','2026-10-02 10:17:50'),(80,8,4,'EN','comics/ritayan-002/pages/en/page-004.svg','Halahala Poison','2026-10-02 10:17:50'),(81,8,1,'MR','comics/ritayan-002/pages/mr/page-001.svg','महा युती','2026-10-02 10:17:50'),(82,8,2,'MR','comics/ritayan-002/pages/mr/page-002.svg','मंदराचल पर्वत बुडणे','2026-10-02 10:17:50'),(83,8,3,'MR','comics/ritayan-002/pages/mr/page-003.svg','अजिंक्य पाठीचा आधार','2026-10-02 10:17:50'),(84,8,4,'MR','comics/ritayan-002/pages/mr/page-004.svg','हलाहल विष प्राशन','2026-10-02 10:17:50'),(85,9,1,'HI','comics/ritayan-003/pages/hi/page-001.svg','पृथ्वी का रसातल गमन','2026-10-02 10:17:50'),(86,9,2,'HI','comics/ritayan-003/pages/hi/page-002.svg','वराह अवतार का प्राकट्य','2026-10-02 10:17:50'),(87,9,1,'EN','comics/ritayan-003/pages/en/page-001.svg','Earth Plunged','2026-10-02 10:17:50'),(88,9,2,'EN','comics/ritayan-003/pages/en/page-002.svg','Descent of Varaha','2026-10-02 10:17:50'),(89,9,1,'MR','comics/ritayan-003/pages/mr/page-001.svg','पृथ्वीचे रसातळ गमन','2026-10-02 10:17:50'),(90,9,2,'MR','comics/ritayan-003/pages/mr/page-002.svg','वराह अवताराचे आगमन','2026-10-02 10:17:50');
/*!40000 ALTER TABLE `comic_pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comics`
--

DROP TABLE IF EXISTS `comics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `issue_number` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `author` varchar(100) DEFAULT 'Ritayan Studio',
  `status` enum('draft','published','unpublished') DEFAULT 'draft',
  `cover_image` varchar(255) DEFAULT NULL,
  `release_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `issue_number` (`issue_number`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comics`
--

LOCK TABLES `comics` WRITE;
/*!40000 ALTER TABLE `comics` DISABLE KEYS */;
INSERT INTO `comics` VALUES (5,5,'Raja Pariskhit','','ritayan-005','','Ritayan Studio','draft','comics/ritayan-005/cover.png','2026-10-01','2026-10-01 21:24:15','2026-10-01 21:24:15'),(6,6,'Raja Parikshit','','ritayan-006','','Ritayan Studio','published','comics/ritayan-006/cover.png','2026-10-01','2026-10-01 21:25:46','2026-10-01 21:28:35'),(7,1,'MATSYA','प्रलय से पहले','ritayan-001','As the cosmic deluge threatens all life, Manu meets a small golden fish that grows into the mighty avatar destined to save creation.','Ritayan Studio','published','comics/ritayan-001/cover.svg','2026-01-15','2026-10-02 08:53:00','2026-10-02 08:53:00'),(8,2,'KURMA','समुद्र मंथन','ritayan-002','The Devas and Asuras churn the ocean of milk using Mount Mandara, supported on the indestructible back of the divine Tortoise.','Ritayan Studio','published','comics/ritayan-002/cover.svg','2026-03-10','2026-10-02 08:53:00','2026-10-02 08:53:00'),(9,3,'VARAHA','भू-उद्धार','ritayan-003','When Hiranyaksha drags Mother Earth into the depths of the cosmic abyss, the mighty Boar avatar descends to rescue her.','Ritayan Studio','draft','comics/ritayan-003/cover.svg','2026-06-01','2026-10-02 08:53:00','2026-10-02 08:53:00');
/*!40000 ALTER TABLE `comics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `media` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_size` int(11) DEFAULT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
/*!40000 ALTER TABLE `media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reading_history`
--

DROP TABLE IF EXISTS `reading_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reading_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `session_token` varchar(255) DEFAULT NULL,
  `comic_id` int(11) NOT NULL,
  `page_reached` int(11) DEFAULT 1,
  `completed` tinyint(1) DEFAULT 0,
  `read_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `comic_id` (`comic_id`),
  CONSTRAINT `reading_history_ibfk_1` FOREIGN KEY (`comic_id`) REFERENCES `comics` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reading_history`
--

LOCK TABLES `reading_history` WRITE;
/*!40000 ALTER TABLE `reading_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `reading_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reading_progress`
--

DROP TABLE IF EXISTS `reading_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reading_progress` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `session_token` varchar(255) DEFAULT NULL,
  `comic_id` int(11) NOT NULL,
  `current_page` int(11) DEFAULT 1,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_comic_idx` (`session_token`,`comic_id`),
  KEY `comic_id` (`comic_id`),
  CONSTRAINT `reading_progress_ibfk_1` FOREIGN KEY (`comic_id`) REFERENCES `comics` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reading_progress`
--

LOCK TABLES `reading_progress` WRITE;
/*!40000 ALTER TABLE `reading_progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `reading_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Aarav Sharma','aarav@example.com','$2y$10$BEIWiclJ7monGJcbNt.gneE/ZzKbNH4yEFjzMlMXJP7zioYfoSkki','2026-10-01 20:40:33'),(2,'Ananya Roy','ananya@example.com','$2y$10$BEIWiclJ7monGJcbNt.gneE/ZzKbNH4yEFjzMlMXJP7zioYfoSkki','2026-10-01 20:40:33');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `website_settings`
--

DROP TABLE IF EXISTS `website_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `website_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `website_settings`
--

LOCK TABLES `website_settings` WRITE;
/*!40000 ALTER TABLE `website_settings` DISABLE KEYS */;
INSERT INTO `website_settings` VALUES (1,'site_title','RITAYAN — युगों की गाथा','2026-10-01 20:40:33'),(2,'hero_title','RITAYAN: युगों की गाथा','2026-10-01 20:40:33'),(3,'hero_subtitle','Experience the grand epic of Indian mythology brought to life in interactive digital 3D graphic novels.','2026-10-01 20:40:33'),(4,'featured_issue_id','1','2026-10-01 20:40:33'),(5,'about_text','RITAYAN is a landmark digital comic platform dedicated to rendering ancient Vedic and Puranic chronicles into breathtaking visual graphic novel format.','2026-10-01 20:40:33'),(6,'contact_email','contact@ritayan.com','2026-10-01 20:40:33'),(7,'instagram_url','https://instagram.com/ritayan_comics','2026-10-01 20:40:33'),(8,'twitter_url','https://twitter.com/ritayan_comics','2026-10-01 20:40:33'),(9,'youtube_url','https://youtube.com/@ritayan','2026-10-01 20:40:33');
/*!40000 ALTER TABLE `website_settings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-02 20:24:23
