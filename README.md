# Complete School Management System (SMS)

This is a Full-Stack School Management System securely built with **Node.js, Express, MySQL, React, and Tailwind CSS**.

## Folder Structure
- `/server`: Contains the Node.js/Express backend REST API.
- `/client`: Contains the Vite/React frontend user interface.

---

## 🚀 How to Run Locally

### 1. Database Setup (XAMPP/phpMyAdmin)
1. Open XAMPP and start **Apache** and **MySQL**.
2. Go to `http://localhost/phpmyadmin/`.
3. Locate the `implementation_plan.md` artifact from Phase 1 and copy the SQL code. Run it to automatically generate your database and normalized tables.

### 2. Start the Backend API Server
1. Open a new terminal and navigate to the server folder:
   ```bash
   cd server
   ```
2. Verify that your `.env` configuration (like DB Username & Password) correctly matches your local XAMPP setup.
3. Start the backend:
   ```bash
   npm run dev
   ```
   *The server should now be proudly running on `http://localhost:5000`.*

### 3. Start the Frontend Client
1. Open a second terminal window and navigate to the client folder:
   ```bash
   cd client
   ```
2. Boot up the Vite dev server:
   ```bash
   npm run dev
   ```
   *Your app will be automatically accessible on `http://localhost:5173`.*

---

## 🌍 How to Deploy for Free

To make this project academic-defense-ready and publicly accessible.

### 1. Database Hosting (Aiven)
- Go to [Aiven.io](https://aiven.io/) and spin up a free MySQL instance.
- Copy your new remote DB credentials (Host, User, Password, Port) into your Backend environment variables.

### 2. Backend Hosting (Render.com)
- Push your `/server` folder to a GitHub repository.
- Create a free account on [Render](https://render.com/).
- Create a **New Web Service**, link your GitHub repo, and map the Root Directory to `server`.
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- *Add all your `.env` variables into the environment configuration tab on Render.*

### 3. Frontend Hosting (Vercel)
- In your `client/src/pages/Login.jsx` file, change `http://localhost:5000` to the Live API URL that Render gives you.
- Push your `/client` folder to GitHub.
- Log into [Vercel](https://vercel.com/) and click **Add New Project**.
- Import the Frontend repository. Vercel automatically detects Vite + React frameworks. Click **Deploy**.

🎉 **You now have a fully functional, beautifully engineered School Management System.**
