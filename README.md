# <img src="https://img.icons8.com/fluency/48/000000/graduation-cap.png" width="36" height="36" align="center"> School Management System (SMS)

*A clean, fast, and easy-to-use system to manage school data, students, and teachers.*

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](#)
[![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)

---

## <img src="https://img.icons8.com/fluency/48/000000/dashboard-layout.png" width="28" height="28" align="center"> Overview
The **School Management System** helps School Admins, Teachers, and Students connect in one place. It makes tracking attendance, managing classes, and viewing results smooth and simple through beautifully designed dashboards.

## <img src="https://img.icons8.com/color/48/000000/star.png" width="28" height="28" align="center"> Key Features
1. **Three Different Dashboards**: Secure, separate custom dashboards for **Admins**, **Teachers**, and **Students**.
2. **Smart Subject Routing**: Automatically assigns subjects depending on the student's class (for example, JSS students get Basic Science, and SS students get Physics) without needing extra database tables.
3. **Beautiful Charts**: Uses Recharts to show attendance and school data in clean, interactive visuals.
4. **Modern Design & Dark Mode**: A stunning login page with a glass-like feel, and an easy-to-use Dark Mode toggle on every dashboard.
5. **Easy Deployment**: The Node.js server is built to easily serve the React frontend, making it extremely simple to upload to hosting platforms.

## <img src="https://img.icons8.com/color/48/000000/settings.png" width="28" height="28" align="center"> Technology Stack
- **Frontend**: React, Vite, Tailwind CSS, Recharts
- **Backend**: Node.js, Express.js, JSON Web Tokens (JWT), bcryptjs
- **Database**: MySQL

---

## <img src="https://img.icons8.com/fluency/48/000000/rocket.png" width="28" height="28" align="center"> Setup & Installation Guide

### Prerequisites
Make sure you have these installed on your computer:
- [Node.js](https://nodejs.org/)
- [XAMPP Server](https://www.apachefriends.org/index.html)

### 1. Database Setup
1. Open your XAMPP Control Panel.
2. Start the **MySQL** server.
3. Open your web browser and go to `http://localhost/phpmyadmin/`.
4. Create a new database:
   ```sql
   CREATE DATABASE school_db;
   ```
   
3. Import the provided database file into your new database:
   ```bash
   mysql -u root -p school_db < school_management_system.sql
   ```

### 2. Backend Setup
Open a terminal and navigate to your `server` folder.

1. Install all backend packages:
   ```bash
   cd server
   npm install
   ```
2. Create a `.env` file inside the `server` folder and add your database details:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=school_db

   # Server Port
   PORT=5000

   # Security Token
   JWT_SECRET=super_secret_key_123
   ```

### 3. Frontend Setup
Open a new terminal and navigate to the `client` folder.

1. Install all frontend packages:
   ```bash
   cd client
   npm install
   ```

### 4. Running the Application

#### Option A: Development Mode (For editing code)
Run this if you want to make changes to the code and see them update live.

1. Initialize the backend daemon: 
```bash
cd server && npm start
```
2. Start the Vite React client environment: 
```bash 
cd client && npm run dev
```

#### Option B: Production Mode (For deploying to the web)
Run this if you want to test exactly how the app will run when you host it online.

1. Build the frontend app:
```bash
cd client
npm run build
```
2. Start the Backend Server:
```bash
cd server
npm start
```
3. Open your browser and go to `http://localhost:5000`. The server will now load the entire application safely!

---

## <img src="https://img.icons8.com/color/48/000000/security-checked.png" width="28" height="28" align="center"> Security Summary
- Passwords are fully hashed and protected using `bcryptjs`.
- User logins are safely managed using JWT tokens.
- No sensitive API links are exposed in the frontend code.

## <img src="https://img.icons8.com/fluency/48/000000/group.png" width="28" height="28" align="center"> Contributing
Feel free to fork this project, submit pull requests, or open an issue if you find a bug!

## <img src="https://img.icons8.com/color/48/000000/document.png" width="28" height="28" align="center"> License
This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).
