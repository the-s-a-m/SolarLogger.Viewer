-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 07, 2017 at 12:41 PM
-- Server version: 10.1.21-MariaDB
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `solarlogger`
--

-- --------------------------------------------------------

--
-- Table structure for table `loggerdata`
--

CREATE TABLE `loggerdata` (
  `idx` bigint(20) NOT NULL COMMENT 'Index',
  `idx_installationcode` varchar(200) CHARACTER SET utf8 NOT NULL COMMENT 'code of solar installation',
  `created` datetime NOT NULL COMMENT 'date of receiving',
  `data` varchar(6000) CHARACTER SET utf8 NOT NULL COMMENT 'received data'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `solarinstallationcodes`
--

CREATE TABLE `solarinstallationcodes` (
  `idx` bigint(20) NOT NULL COMMENT 'index',
  `solarinstallationcode` varchar(250) CHARACTER SET utf8 NOT NULL COMMENT 'allowed codes',
  `name` varchar(20) CHARACTER SET utf8 NOT NULL COMMENT 'Name of solar installation'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `loggerdata`
--
ALTER TABLE `loggerdata`
  ADD PRIMARY KEY (`idx`),
  ADD UNIQUE KEY `idx` (`idx`),
  ADD KEY `indexed_code` (`idx_installationcode`),
  ADD KEY `idx_installationcode` (`idx_installationcode`);

--
-- Indexes for table `solarinstallationcodes`
--
ALTER TABLE `solarinstallationcodes`
  ADD PRIMARY KEY (`idx`),
  ADD UNIQUE KEY `solarinstallationcode` (`solarinstallationcode`),
  ADD UNIQUE KEY `idx` (`idx`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `solarinstallationcode_2` (`solarinstallationcode`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `loggerdata`
--
ALTER TABLE `loggerdata`
  MODIFY `idx` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Index', AUTO_INCREMENT=306;
--
-- AUTO_INCREMENT for table `solarinstallationcodes`
--
ALTER TABLE `solarinstallationcodes`
  MODIFY `idx` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'index', AUTO_INCREMENT=5;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
