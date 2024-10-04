-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 30, 2024 at 03:15 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `assetms`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(100) NOT NULL,
  `email` varchar(250) NOT NULL,
  `password` varchar(140) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `email`, `password`, `name`, `photo`) VALUES
(1, 'admin2@gmail.com', '12345', NULL, NULL),
(2, 'admin@gmail.com', '12345', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `asset`
--

CREATE TABLE `asset` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `address` varchar(255) NOT NULL,
  `address1` varchar(255) DEFAULT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `receipt` varchar(255) DEFAULT NULL,
  `installation_date` date NOT NULL,
  `added_by` int(11) NOT NULL,
  `role` varchar(255) NOT NULL,
  `status` enum('active','inactive','maintenance','retired') NOT NULL DEFAULT 'active',
  `receipts` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `asset`
--

INSERT INTO `asset` (`id`, `category_id`, `quantity`, `price`, `address`, `address1`, `address2`, `receipt`, `installation_date`, `added_by`, `role`, `status`, `receipts`) VALUES
(7, 2, 12, 36.00, 'Subhash Road, Dehradun, देहरादून, Uttarakhand, 248001, India (Latitude: 30.3243, Longitude: 78.0464)', 'null', 'null', NULL, '2024-08-10', 0, '', 'retired', NULL),
(13, 2, 2, 510.00, '20.6463, 78.8983', NULL, NULL, NULL, '2024-08-10', 0, '', 'inactive', NULL),
(19, 3, 1, 34.00, '20.5997, 78.8830', NULL, NULL, 'c423f1c25a59d71cb3ef64fc8cb1fcda', '2024-08-10', 0, '', 'active', NULL),
(24, 3, 1, 15.00, '20.6269, 78.8967', NULL, NULL, 'e32902aa8bc1fdbb4aa0b38b34a62966', '2024-08-10', 0, '', 'active', NULL),
(27, 3, 5, 1.00, 'Kinhala, Samudrapur, Wardha, Maharashtra, India', NULL, NULL, '1723298632284-197145_MUSKAN.pdf', '2024-08-10', 0, '', 'active', NULL),
(28, 2, 12, 2.00, 'Nahan, सिरमौर, Himachal Pradesh, India (Latitude: 30.5619948, Longitude: 77.25707123688902)', NULL, NULL, NULL, '2024-08-10', 0, '', 'active', NULL),
(29, 2, 1, 40.00, 'Mangali, Samudrapur, Wardha, Maharashtra, India', NULL, NULL, '', '2024-08-10', 0, '', 'active', NULL),
(30, 2, 1, 1.00, 'Ubda, Samudrapur, Wardha, Maharashtra, India (Latitude: 20.5835, Longitude: 78.9080)', NULL, NULL, NULL, '0000-00-00', 0, '', 'retired', NULL),
(32, 2, 1, 2.00, 'Mangali, Samudrapur, Wardha, Maharashtra, India (Latitude: 20.5925, Longitude: 78.9273)', NULL, NULL, '1723446184547-aadhar.pdf', '2024-08-12', 0, '', 'active', NULL),
(34, 3, 1, 8388.00, 'Gulabgarh, Paonta Sahib, सिरमौर, Himachal Pradesh, 173021, India (Latitude: 30.4869, Longitude: 77.5811)', NULL, NULL, NULL, '2024-08-15', 0, '', 'active', NULL),
(35, 3, 1, 4.00, 'Dehradun, देहरादून, Uttarakhand, 248001, India (Latitude: 30.3104, Longitude: 78.0337)', NULL, NULL, '1723832584789-asset_report.pdf', '2024-08-16', 0, '', 'active', NULL),
(36, 2, 1, 2.00, 'Ashirwad Enclave, Dehradun, देहरादून, Uttarakhand, 248001, India (Latitude: 30.3300, Longitude: 78.0056)', 'Tilak road', '', NULL, '2024-08-21', 0, '', 'maintenance', NULL),
(37, 2, 1, 345.00, 'Ashirwad Enclave, Dehradun, देहरादून, Uttarakhand, 248001, India (Latitude: 30.3304, Longitude: 78.0081)', '', '', NULL, '2024-08-28', 0, '', 'maintenance', '1724828762166-Resume_Muskaan_Jain.pdf, 1724828762168-Screenshot 2024-08-13 111242.png'),
(39, 2, 2, 55.00, 'Dehradun, देहरादून, Uttarakhand, 248001, India (Latitude: 30.3104, Longitude: 78.0304)', '', '', NULL, '2024-08-29', 0, '', 'inactive', '1724917908408-Resume_Muskaan_Jain.pdf, 1724917908409-Screenshot 2024-08-13 111242.png'),
(40, 2, 15, 55.00, 'रामपुर, Uttar Pradesh, 244901, India (Latitude: 28.7703, Longitude: 79.0331)', '11 rameshwar mohalla ,Tilak road dehradun ', '', NULL, '2024-09-15', 0, '', 'inactive', '1726396484094-Claas 5 Maths.docx, 1726396484095-class -X Commerce.pdf'),
(41, 2, 1, 500.00, 'Ganeshpur, Samudrapur, Wardha, Maharashtra, India (Latitude: 20.6150, Longitude: 78.8970)', '11 rameshwar mohalla ,Tilak road dehradun ', '', NULL, '2024-09-18', 0, '', 'inactive', '1726630387876-Research_websites_and_free_resources (1).docx');

-- --------------------------------------------------------

--
-- Table structure for table `audit_trails`
--

CREATE TABLE `audit_trails` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action_type` enum('ADD','UPDATE','DELETE') NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audit_trails`
--

INSERT INTO `audit_trails` (`id`, `user_id`, `action_type`, `timestamp`, `details`) VALUES
(1, 1, 'ADD', '2024-07-30 15:06:49', 'Test entry');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`) VALUES
(1, '--'),
(2, 'pole'),
(3, 'point light pole'),
(4, 'bulb');

-- --------------------------------------------------------

--
-- Table structure for table `change_history`
--

CREATE TABLE `change_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action_type` enum('ADD','UPDATE','DELETE') NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `asset_id` int(11) NOT NULL,
  `old_value` text DEFAULT NULL,
  `new_value` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `last_logout` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`id`, `name`, `email`, `password`, `role`, `last_login`, `last_logout`) VALUES
(2, 'riya', 'riyaa@gmail.com', '123456', '2', NULL, NULL),
(4, 'chuskii', 'muskan@gmail.com', '12345', '1', '2024-07-30 04:12:59', NULL),
(5, 'riyaa jain', 'riyajain@gmail.com', '1234567', '1', '2024-08-02 07:51:43', NULL),
(6, 'mata shrii', 'mummy@gmail.com', '$2b$10$rJo5SQTB.XZZR.IvzbNxr.k4/V38KrUcT85c2z2.90LZlQ8sCClN6', '2', '2024-09-18 08:04:25', '2024-09-18 08:03:24'),
(7, 'riyajain', 'chiya@gmail.com', '123456789', '1', NULL, NULL),
(24, 'Muskan Jain ', 'muskaanjain2403@gmail.com', '', '2', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`) VALUES
(1, 'employer'),
(2, 'supervisor');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `resetPasswordToken` varchar(255) DEFAULT NULL,
  `resetPasswordExpires` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `asset`
--
ALTER TABLE `asset`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `audit_trails`
--
ALTER TABLE `audit_trails`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `change_history`
--
ALTER TABLE `change_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `asset_id` (`asset_id`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `asset`
--
ALTER TABLE `asset`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `audit_trails`
--
ALTER TABLE `audit_trails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `change_history`
--
ALTER TABLE `change_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `asset`
--
ALTER TABLE `asset`
  ADD CONSTRAINT `asset_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);

--
-- Constraints for table `change_history`
--
ALTER TABLE `change_history`
  ADD CONSTRAINT `change_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `employee` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `change_history_ibfk_2` FOREIGN KEY (`asset_id`) REFERENCES `asset` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
