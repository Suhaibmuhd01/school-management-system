const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize the Express app
const app = express();

// Middlewares
app.use(cors()); // Allow cross-origin requests from the React frontend
app.use(express.json()); // Parse incoming JSON request bodies

// Import Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const profileRoutes = require('./routes/profileRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/profile', profileRoutes);

// Production Native Monolith Routing
const path = require('path');
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Define the PORT
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
