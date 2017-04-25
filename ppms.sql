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
-- Table structure for table `DOCTOR`
--

DROP TABLE IF EXISTS `DOCTOR`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DOCTOR` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(25) NOT NULL,
  `PASSWORD` varchar(200) DEFAULT NULL,
  `MOBILE` char(10) DEFAULT NULL,
  `SALT` varchar(20) DEFAULT NULL,
  `EMAIL` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DOCTOR`
--

LOCK TABLES `DOCTOR` WRITE;
/*!40000 ALTER TABLE `DOCTOR` DISABLE KEYS */;
INSERT INTO `DOCTOR` VALUES (5,'pranavasty','4757fa5407ac5d2313b72c88e922d79bfe84736e94610d3a354348d122491f911db507612ebaf9712f99f2d4c36a4f7982ac51d60ad700d17a6daebd08eef506','8142909120','271bb7ae24e1deee','f2105961@hyderabad.ac.in'),(6,'arnavdhamija','07e9e2ea92adb8d89f671100e60e2dd643b01cfe308fc92ab3cceed643ad67f714e2a926a7aeaf31f839b447db0deaf2acc68968dc4bf2a023de16430a3802b0','9878899561','22678918e8f19f0c','f2105954@hyderabad.ac.in'),(7,'sahilsangwan','398cc49f2d8e77a2364753571ee64e57a7ac9469115f5fef16405344b108412e0f14e428385d34346e365e604b32a4523c6cca8e96887f53b66d1c2bf3d964a5','9177067275','774a4c7026ad9a25','f2105965@hyderabad.ac.in');
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
  `SEX` varchar(6) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PATIENT`
--

LOCK TABLES `PATIENT` WRITE;
/*!40000 ALTER TABLE `PATIENT` DISABLE KEYS */;
INSERT INTO `PATIENT` VALUES (8,'Arjun Patel','1999-11-09','7881737901','Sainikpuri','Male'),(9,'Kalpana Ahluwalia','1998-08-09','7871290192','BITS','Female'),(10,'Kiran Yadav','2000-11-09','9998193761','Delhi','Female'),(11,'Sahil Kanaujia','1997-03-02','8991213713','BITS','Male');
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
  CONSTRAINT `P_TAKES_V_ibfk_3` FOREIGN KEY (`VISIT_ID`) REFERENCES `P_VISITS_D` (`VISIT_ID`),
  CONSTRAINT `P_TAKES_V_ibfk_4` FOREIGN KEY (`VID`) REFERENCES `VACCINE` (`ID`),
  CONSTRAINT `P_TAKES_V_ibfk_5` FOREIGN KEY (`VID`) REFERENCES `VACCINE` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `P_TAKES_V`
--

LOCK TABLES `P_TAKES_V` WRITE;
/*!40000 ALTER TABLE `P_TAKES_V` DISABLE KEYS */;
INSERT INTO `P_TAKES_V` VALUES (8,15,28),(11,16,29);
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
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `P_VISITS_D`
--

LOCK TABLES `P_VISITS_D` WRITE;
/*!40000 ALTER TABLE `P_VISITS_D` DISABLE KEYS */;
INSERT INTO `P_VISITS_D` VALUES (25,8,5,'2017-04-25','Viral flu.','Rest for 2 days.',500),(26,9,6,'2017-04-25','Cancer','Radiation therapy',10500),(27,10,6,'2017-04-25','Jaundice','Stay away from fats.',500),(28,8,6,'2017-04-25','No problem','Only vaccine',900),(29,11,6,'2017-04-25','Balding','Hair oil',1200),(30,9,7,'2017-04-25','Depression due to cancer.','We will talk to her.',500);
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
  `STOCK` int(11) DEFAULT '10',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID` (`ID`),
  UNIQUE KEY `ID_2` (`ID`),
  UNIQUE KEY `NAME` (`NAME`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VACCINE`
--

LOCK TABLES `VACCINE` WRITE;
/*!40000 ALTER TABLE `VACCINE` DISABLE KEYS */;
INSERT INTO `VACCINE` VALUES (14,'DaPT',800,12),(15,'Rotarix',400,11),(16,'Pentavax',700,9),(17,'Polio',60,16),(18,'Varilrix',1200,8);
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

-- Dump completed on 2017-04-25 10:11:02
