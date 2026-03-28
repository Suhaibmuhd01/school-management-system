-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 28, 2026 at 05:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `school_management_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `status` enum('Present','Absent') NOT NULL DEFAULT 'Present',
  `marked_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `student_id`, `class_id`, `date`, `status`, `marked_by`, `created_at`) VALUES
(1, 10, 5, '2026-03-27', 'Present', 3, '2026-03-27 21:25:17'),
(2, 16, 5, '2026-03-27', 'Absent', 3, '2026-03-27 21:25:25'),
(3, 22, 5, '2026-03-27', 'Present', 3, '2026-03-27 21:25:29');

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `class_name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`id`, `class_name`, `created_at`) VALUES
(1, 'JSS 1', '2026-03-26 16:36:35'),
(2, 'JSS 2', '2026-03-26 16:37:06'),
(3, 'JSS 3', '2026-03-26 16:37:14'),
(4, 'SS 1', '2026-03-26 16:37:22'),
(5, 'SS 2', '2026-03-26 16:37:33'),
(6, 'SS 3', '2026-03-26 16:37:43');

-- --------------------------------------------------------

--
-- Table structure for table `results`
--

CREATE TABLE `results` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `term` varchar(20) NOT NULL,
  `academic_year` varchar(20) NOT NULL,
  `ca_score` decimal(5,2) DEFAULT 0.00,
  `exam_score` decimal(5,2) DEFAULT 0.00,
  `total_score` decimal(5,2) DEFAULT 0.00,
  `grade` varchar(2) DEFAULT NULL,
  `uploaded_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` enum('Pending','Released') DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_classes`
--

CREATE TABLE `student_classes` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_classes`
--

INSERT INTO `student_classes` (`id`, `student_id`, `class_id`) VALUES
(1, 5, 6),
(2, 6, 1),
(3, 7, 2),
(4, 8, 3),
(5, 9, 4),
(6, 10, 5),
(7, 11, 6),
(8, 12, 1),
(9, 13, 2),
(10, 14, 3),
(11, 15, 4),
(12, 16, 5),
(13, 17, 6),
(14, 18, 1),
(15, 19, 2),
(16, 20, 3),
(17, 21, 4),
(18, 22, 5),
(19, 23, 6),
(20, 24, 1);

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL,
  `subject_name` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT 'General',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `subject_name`, `category`, `created_at`) VALUES
(1, 'Mathematics', 'Core', '2026-03-26 21:55:03'),
(2, 'English Language', 'Core', '2026-03-26 21:55:03'),
(3, 'Civic Education', 'Core', '2026-03-26 21:55:03'),
(4, 'Computer Studies', 'Core', '2026-03-26 21:55:03'),
(5, 'Basic Science', 'Basic Education', '2026-03-26 21:55:03'),
(6, 'Basic Technology', 'Basic Education', '2026-03-26 21:55:03'),
(7, 'Business Studies', 'Basic Education', '2026-03-26 21:55:03'),
(8, 'Cultural and Creative Arts (CCA)', 'Basic Education', '2026-03-26 21:55:03'),
(9, 'Social Studies', 'Basic Education', '2026-03-26 21:55:03'),
(10, 'Home Economics', 'Basic Education', '2026-03-26 21:55:03'),
(11, 'Physical and Health Education (PHE)', 'Basic Education', '2026-03-26 21:55:03'),
(12, 'French Language', 'Language', '2026-03-26 21:55:03'),
(13, 'Hausa Language', 'Language', '2026-03-26 21:55:03'),
(14, 'Yoruba Language', 'Language', '2026-03-26 21:55:03'),
(15, 'Christian Religious Studies (CRS)', 'Religion', '2026-03-26 21:55:03'),
(16, 'Islamic Religious Studies (IRS)', 'Religion', '2026-03-26 21:55:03'),
(17, 'Physics', 'Science Core', '2026-03-26 21:55:03'),
(18, 'Chemistry', 'Science Core', '2026-03-26 21:55:03'),
(19, 'Biology', 'Science Core', '2026-03-26 21:55:03'),
(20, 'Further Mathematics', 'Science Elective', '2026-03-26 21:55:03'),
(21, 'Agricultural Science', 'Science Elective', '2026-03-26 21:55:03'),
(22, 'Geography', 'General Elective', '2026-03-26 21:55:03'),
(23, 'Technical Drawing', 'Science Elective', '2026-03-26 21:55:03'),
(24, 'Economics', 'General Elective', '2026-03-26 21:55:03'),
(25, 'Data Processing', 'Trade', '2026-03-26 21:55:03'),
(26, 'Animal Husbandry', 'Trade', '2026-03-26 21:55:03'),
(27, 'Fishery', 'Trade', '2026-03-26 21:55:03');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_classes`
--

CREATE TABLE `teacher_classes` (
  `id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teacher_classes`
--

INSERT INTO `teacher_classes` (`id`, `teacher_id`, `class_id`) VALUES
(1, 2, 6),
(2, 3, 5),
(4, 26, 3),
(5, 28, 2),
(6, 31, 1);

-- --------------------------------------------------------

--
-- Table structure for table `teacher_subjects`
--

CREATE TABLE `teacher_subjects` (
  `id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teacher_subjects`
--

INSERT INTO `teacher_subjects` (`id`, `teacher_id`, `class_id`, `subject_id`, `created_at`) VALUES
(6, 3, 4, 25, '2026-03-27 21:43:36'),
(7, 3, 5, 25, '2026-03-27 21:43:53'),
(8, 3, 6, 25, '2026-03-27 21:44:07'),
(9, 2, 5, 18, '2026-03-27 22:28:18'),
(10, 2, 3, 15, '2026-03-27 22:28:18'),
(11, 2, 3, 6, '2026-03-27 22:28:18'),
(12, 4, 2, 1, '2026-03-27 22:28:18'),
(13, 4, 5, 21, '2026-03-27 22:28:18'),
(14, 4, 1, 9, '2026-03-27 22:28:18'),
(15, 26, 5, 24, '2026-03-27 22:28:18'),
(16, 27, 6, 14, '2026-03-27 22:28:18'),
(17, 28, 4, 27, '2026-03-27 22:28:18'),
(18, 28, 1, 6, '2026-03-27 22:28:18'),
(19, 29, 6, 22, '2026-03-27 22:28:18'),
(20, 29, 1, 23, '2026-03-27 22:28:18'),
(21, 29, 4, 20, '2026-03-27 22:28:18'),
(22, 30, 2, 24, '2026-03-27 22:28:18'),
(23, 31, 3, 2, '2026-03-27 22:28:18'),
(24, 32, 4, 15, '2026-03-27 22:28:18'),
(25, 33, 4, 17, '2026-03-27 22:28:18'),
(26, 33, 1, 4, '2026-03-27 22:28:18'),
(27, 34, 5, 16, '2026-03-27 22:28:18'),
(28, 34, 3, 15, '2026-03-27 22:28:18');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('Admin','Teacher','Student') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password_hash`, `role`, `created_at`, `updated_at`, `phone`) VALUES
(1, 'Jibrin', 'Hassan Muhammad', 'admin@school.com', '$2a$10$V.ZKg6l.9TYcCFPMvO2wWu7/AL0hUG3ex6isTw3xINzWi9xdvsALq', 'Admin', '2026-03-26 16:07:12', '2026-03-28 16:06:04', '08129140311'),
(2, 'Mukhtar', 'Muhammad Ghali', 'mgm@gmail.com', '$2a$10$6eFfsCRGLvwg/dNuufswAerOGkqKLciuYg07HxgsoAU0N81wBWh8q', 'Teacher', '2026-03-26 16:52:39', '2026-03-27 10:02:37', '09083927880'),
(3, 'James', 'udu eba', 'udunyohe@gmail.com', '$2a$10$MkQ2C6/DTlJHPWS4tuVs3OROyqRM9.s6UEtEQUoZRqdLV0W3kTLbe', 'Teacher', '2026-03-26 16:55:37', '2026-03-27 10:02:37', '08116083413'),
(4, 'Umar', 'Alhassan Muhammad', 'umaralhassan@gmail.com', '$2a$10$yfV28pKKDMz5owBroqB/8eoyKD8E.x2ywHGFZojr.GOkakIVynePm', 'Teacher', '2026-03-26 16:57:09', '2026-03-27 10:02:37', '08190233958'),
(5, 'Ahmad', 'Ringim', 'ahmadzubairu@gmail.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Student', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '08039694507'),
(6, 'Khadija', 'Kabir Turajo', 'khadijakabir@gmail.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Student', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '08032090045'),
(7, 'Mustapha', 'Ahmad Shehu', 'mustaphashehuahmad@gmail.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Student', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '08072460315'),
(8, 'Michael', 'David', 'michaeldavid@gmail.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Student', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '08097935604'),
(9, 'Farouq', 'Sani Ahmad', 'faroqazare2025@gmail.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Student', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '08038633677'),
(10, 'Olivia', 'Wilson Johnson', 'olivia27@gmail.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Student', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '07032619454'),
(11, 'Mukhtar', 'Tijjani Gumel', 'mtgumel@gmail.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Student', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '09092066565'),
(12, 'Fatima', 'Sunusi Abdullahi', 'fatimasa@gmail.com.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Student', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '08115689684'),
(13, 'Husna', 'Aminu sayyed', 'Husnasayyed44.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Student', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '08099504937'),
(14, 'Hasna', 'Aminu sayyed', 'student10@school.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Student', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '08139386678'),
(15, 'zainab', 'Zakariyya Muhammad', 'student11@school.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Student', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '07032802469'),
(16, 'AMina', 'Abbati Abdulhadi', 'student12@school.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Student', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '09088766845'),
(17, 'Hafsa', 'Muhammad Aliyu', 'student13@school.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Student', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '08041347863'),
(18, 'Khadija', 'Aliyu Haruna', 'student14@school.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Student', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '08076707813'),
(19, 'Maryam', 'Muhammad Abdullahi', 'student15@school.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Student', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '08095317721'),
(20, 'Fatima', 'Uba Lawal', 'student16@school.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Student', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '08040666404'),
(21, 'Muhammad', 'Uba Lawal', 'student17@school.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Student', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '09094802210'),
(22, 'Nusaiba', 'Baba Yusuf', 'student18@school.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Student', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '07085244384'),
(23, 'Salma', 'Bello', 'student19@school.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Student', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '08146423446'),
(24, 'Salma', 'Abdullahi', 'student20@school.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Student', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '07024846045'),
(26, 'Abdullahi', 'Aliyu Gaya', 'teacher2@school.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Teacher', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '08054263870'),
(27, 'Hindu', 'Muhammad Abdullahi', 'teacher3@school.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Teacher', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '07087399150'),
(28, 'Maryam', 'Adam Ahmad', 'teacher4@school.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Teacher', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '09092209056'),
(29, 'Ibrahim', 'Sunusi Abdullahi', 'teacher5@school.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Teacher', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '08165379746'),
(30, 'Safiyya', 'Hussain Falaki', 'teacher6@school.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Teacher', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '09052333705'),
(31, 'Amina', 'Auwal Dabo', 'teacher7@school.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Teacher', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '08145922711'),
(32, 'Sulaiman', 'Tahir Abdullahi', 'teacher8@school.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Teacher', '2026-03-26 20:19:29', '2026-03-28 10:14:43', '07041528192'),
(33, 'Shehu', 'Abdullahi Kabir', 'teacher9@school.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Teacher', '2026-03-26 20:19:29', '2026-03-28 10:14:43', NULL),
(34, 'Zainab', 'Sulaiman Yahya', 'teacher10@school.com', '$2a$10$swfOMpGs0hIYRRM9o03yMuRKckCoXnu6ZUVgXCy5nkGCypvN9EVU2', 'Teacher', '2026-03-26 20:19:29', '2026-03-28 10:14:43', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_id` (`student_id`,`class_id`,`date`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `marked_by` (`marked_by`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `class_name` (`class_name`);

--
-- Indexes for table `results`
--
ALTER TABLE `results`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_id` (`student_id`,`class_id`,`subject_id`,`term`,`academic_year`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `subject_id` (`subject_id`),
  ADD KEY `uploaded_by` (`uploaded_by`);

--
-- Indexes for table `student_classes`
--
ALTER TABLE `student_classes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_id` (`student_id`,`class_id`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subject_name` (`subject_name`);

--
-- Indexes for table `teacher_classes`
--
ALTER TABLE `teacher_classes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `teacher_id` (`teacher_id`,`class_id`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexes for table `teacher_subjects`
--
ALTER TABLE `teacher_subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `teacher_id` (`teacher_id`,`class_id`,`subject_id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `subject_id` (`subject_id`);

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
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `results`
--
ALTER TABLE `results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `student_classes`
--
ALTER TABLE `student_classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `teacher_classes`
--
ALTER TABLE `teacher_classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `teacher_subjects`
--
ALTER TABLE `teacher_subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_3` FOREIGN KEY (`marked_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `results`
--
ALTER TABLE `results`
  ADD CONSTRAINT `results_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `results_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `results_ibfk_3` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `results_ibfk_4` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_classes`
--
ALTER TABLE `student_classes`
  ADD CONSTRAINT `student_classes_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_classes_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `teacher_classes`
--
ALTER TABLE `teacher_classes`
  ADD CONSTRAINT `teacher_classes_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `teacher_classes_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `teacher_subjects`
--
ALTER TABLE `teacher_subjects`
  ADD CONSTRAINT `teacher_subjects_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `teacher_subjects_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `teacher_subjects_ibfk_3` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
