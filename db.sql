-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.2.0 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for a2
CREATE DATABASE IF NOT EXISTS `a2` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `a2`;

-- Dumping structure for table a2.dashboard
CREATE TABLE IF NOT EXISTS `dashboard` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `in` timestamp NULL DEFAULT NULL,
  `out` timestamp NULL DEFAULT NULL,
  `duration` time DEFAULT NULL,
  `break` time DEFAULT NULL,
  `user` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table a2.klanten
CREATE TABLE IF NOT EXISTS `klanten` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Bedrijfsnaam` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Voornaam` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'John',
  `Tussenvoegsel` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Achternaam` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Doe',
  `Functie` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Invalid',
  `Telefoonnummer` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Adres` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table a2.medewerkers
CREATE TABLE IF NOT EXISTS `medewerkers` (
  `ID` int NOT NULL,
  `Voornaam` varchar(50) NOT NULL DEFAULT '',
  `Tussenvoegsel` varchar(50) NOT NULL DEFAULT '',
  `Achternaam` varchar(50) NOT NULL DEFAULT '',
  `Geboortedatum` varchar(50) NOT NULL DEFAULT '',
  `Functie` varchar(50) NOT NULL DEFAULT '',
  `Werkmail` varchar(50) NOT NULL DEFAULT '',
  `Kantoorruimte` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table a2.opdrachten
CREATE TABLE IF NOT EXISTS `opdrachten` (
  `ID` int NOT NULL,
  `Klantnaam` varchar(50) DEFAULT NULL,
  `Titel` varchar(50) DEFAULT NULL,
  `Omschrijving` varchar(50) DEFAULT NULL,
  `Aanvraagdatum` varchar(50) DEFAULT NULL,
  `Benodigde kennis` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table a2.users
CREATE TABLE IF NOT EXISTS `users` (
  `identifier` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `middlename` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `lastname` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `sex` int DEFAULT NULL,
  `functie` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `company` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `group` int DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `adres` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`identifier`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table a2.werkzaamheden
CREATE TABLE IF NOT EXISTS `werkzaamheden` (
  `ID` int NOT NULL,
  `VoornaamMedewerker` varchar(50) DEFAULT NULL,
  `TussenvoegselMedewerker` varchar(50) DEFAULT NULL,
  `AchternaamMedewerker` varchar(50) DEFAULT NULL,
  `Aantal uren` varchar(50) DEFAULT NULL,
  `Projectnaam` varchar(50) DEFAULT NULL,
  `Omschrijving werkzaamheden` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
