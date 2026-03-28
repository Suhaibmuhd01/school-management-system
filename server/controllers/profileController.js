const db = require('../config/db');

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const [users] = await db.execute('SELECT id, first_name, last_name, email, phone, role FROM users WHERE id = ?', [userId]);
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(users[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { email, phone, new_password } = req.body;
        const userId = req.user.id;
        
        await db.execute('UPDATE users SET email = ?, phone = ? WHERE id = ?', [email, phone || null, userId]);
        
        if (new_password && new_password.trim().length >= 6) {
            const bcrypt = require('bcryptjs');
            const hash = await bcrypt.hash(new_password.trim(), 10);
            await db.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hash, userId]);
        }
        
        const [users] = await db.execute('SELECT id, first_name, last_name, email, phone, role FROM users WHERE id = ?', [userId]);
        
        res.status(200).json({ message: 'Profile updated', user: users[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};
