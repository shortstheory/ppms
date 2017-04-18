-- MySQL dump 10.13  Distrib 5.7.17, for Linux (x86_64)
--
-- Host: localhost    Database: ppms
-- ------------------------------------------------------
-- Server version	5.7.17-0ubuntu0.16.10.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ADMIN`
--

DROP TABLE IF EXISTS `ADMIN`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ADMIN` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(25) NOT NULL,
  `PASSWORD` varchar(100) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ADMIN`
--

LOCK TABLES `ADMIN` WRITE;
/*!40000 ALTER TABLE `ADMIN` DISABLE KEYS */;
INSERT INTO `ADMIN` VALUES (1,'Basha','vyasBhavan101'),(2,'Shorya','EC_roxxx!');
/*!40000 ALTER TABLE `ADMIN` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DOCTOR`
--

DROP TABLE IF EXISTS `DOCTOR`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DOCTOR` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(25) NOT NULL,
  `PASSWORD` varchar(100) NOT NULL,
  `MOBILE` char(10) DEFAULT NULL,
  `ADMIN_ID` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `ADMIN_ID` (`ADMIN_ID`),
  CONSTRAINT `DOCTOR_ibfk_1` FOREIGN KEY (`ADMIN_ID`) REFERENCES `ADMIN` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DOCTOR`
--

LOCK TABLES `DOCTOR` WRITE;
/*!40000 ALTER TABLE `DOCTOR` DISABLE KEYS */;
INSERT INTO `DOCTOR` VALUES (1,'Parth Chaturvedi','rig_atharva_sama_yajur','9000000127',1),(2,'Rajiv Chaurasiya','hansadwani1556','9890000127',2),(3,'Aditi Shetty','doctor_hoon_mai!','9890000997',1);
/*!40000 ALTER TABLE `DOCTOR` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PATIENT`
--

DROP TABLE IF EXISTS `PATIENT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PATIENT` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(25) NOT NULL,
  `DOB` date DEFAULT NULL,
  `MOBILE` char(10) DEFAULT NULL,
  `ADDRESS` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PATIENT`
--

LOCK TABLES `PATIENT` WRITE;
/*!40000 ALTER TABLE `PATIENT` DISABLE KEYS */;
INSERT INTO `PATIENT` VALUES (1,'Kalpana Ahluwalia','2001-07-18','9998193761','Sainikpuri'),(2,'Abhijeet Yadav','1999-09-26','9091193761','Banjara Hills'),(3,'Shashank Yadav','2004-11-06','9091193905','Port Blair, Gachibowli'),(5,'Johnson Paul','2009-12-29','8701193905','Vancouver');
/*!40000 ALTER TABLE `PATIENT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `P_TAKES_V`
--

DROP TABLE IF EXISTS `P_TAKES_V`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `P_TAKES_V` (
  `PID` int(11) NOT NULL,
  `VID` int(11) NOT NULL,
  `VISIT_ID` int(11) NOT NULL,
  PRIMARY KEY (`PID`,`VID`,`VISIT_ID`),
  KEY `VID` (`VID`),
  KEY `VISIT_ID` (`VISIT_ID`),
  CONSTRAINT `P_TAKES_V_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `PATIENT` (`ID`),
  CONSTRAINT `P_TAKES_V_ibfk_2` FOREIGN KEY (`VID`) REFERENCES `VACCINE` (`ID`),
  CONSTRAINT `P_TAKES_V_ibfk_3` FOREIGN KEY (`VISIT_ID`) REFERENCES `P_VISITS_D` (`VISIT_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `P_TAKES_V`
--

LOCK TABLES `P_TAKES_V` WRITE;
/*!40000 ALTER TABLE `P_TAKES_V` DISABLE KEYS */;
INSERT INTO `P_TAKES_V` VALUES (1,3,2),(3,5,1);
/*!40000 ALTER TABLE `P_TAKES_V` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `P_VISITS_D`
--

DROP TABLE IF EXISTS `P_VISITS_D`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `P_VISITS_D` (
  `VISIT_ID` int(11) NOT NULL AUTO_INCREMENT,
  `PID` int(11) NOT NULL,
  `DID` int(11) NOT NULL,
  `VISIT_DATE` date NOT NULL,
  `DIAGNOSIS` varchar(500) DEFAULT NULL,
  `TREATMENT` varchar(500) DEFAULT NULL,
  `BILL_AMOUNT` int(11) DEFAULT NULL,
  PRIMARY KEY (`VISIT_ID`),
  KEY `PID` (`PID`),
  KEY `DID` (`DID`),
  CONSTRAINT `P_VISITS_D_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `PATIENT` (`ID`),
  CONSTRAINT `P_VISITS_D_ibfk_2` FOREIGN KEY (`DID`) REFERENCES `DOCTOR` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `P_VISITS_D`
--

LOCK TABLES `P_VISITS_D` WRITE;
/*!40000 ALTER TABLE `P_VISITS_D` DISABLE KEYS */;
INSERT INTO `P_VISITS_D` VALUES (1,3,1,'2017-02-17','Viral flu','Kuch nahi crocin le theek ho jaega',300),(2,1,1,'2017-03-10','Jaundice','Don\'t touch oil and fat!',300),(3,2,2,'2017-04-13','Cancer','Chemo, I guess',30000);
/*!40000 ALTER TABLE `P_VISITS_D` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VACCINE`
--

DROP TABLE IF EXISTS `VACCINE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `VACCINE` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(25) NOT NULL,
  `PRICE` int(11) NOT NULL,
  `STOCK` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VACCINE`
--

LOCK TABLES `VACCINE` WRITE;
/*!40000 ALTER TABLE `VACCINE` DISABLE KEYS */;
INSERT INTO `VACCINE` VALUES (1,'Varilrix',700,6),(2,'MMR',300,2),(3,'Rotarix',1100,4),(4,'Polio',40,12),(5,'DPT',400,7);
/*!40000 ALTER TABLE `VACCINE` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-04-14 19:23:08
