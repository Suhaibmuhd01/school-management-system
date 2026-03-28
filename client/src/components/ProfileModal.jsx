import { useState, useEffect } from 'react';
import { User, X } from 'lucide-react';
import axios from 'axios';

const ProfileModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({ email: '', phone: '', new_password: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            const fetchProfile = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get('/api/profile', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setFormData({ email: res.data.email || '', phone: res.data.phone || '' });
                } catch (err) {
                    console.error(err);
                }
            };
            fetchProfile();
            setMessage('');
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('/api/profile', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Profile updated successfully!');
            const user = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify({ ...user, ...res.data.user }));
            setTimeout(onClose, 1500);
        } catch (err) {
            setMessage('Error updating profile: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transition-colors border border-gray-200 dark:border-gray-700">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center text-white">
                    <h2 className="text-xl font-extrabold tracking-wide">Personal Settings</h2>
                    <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition focus:outline-none"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-8">
                    {message && <div className="mb-5 p-3 bg-blue-50 text-blue-700 rounded-xl text-center text-sm font-bold border border-blue-100">{message}</div>}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-2 border-4 border-white dark:border-gray-700 shadow-sm">
                                <User className="w-10 h-10" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Update your contact details</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Email Address</label>
                            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/40 outline-none text-gray-800 dark:text-gray-100 transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Phone Number</label>
                            <input type="text" placeholder="+234..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/40 outline-none text-gray-800 dark:text-gray-100 transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">New Password <span className="text-gray-400 font-normal">(Optional)</span></label>
                            <input type="password" placeholder="Leave blank to keep unchanged" minLength="6" value={formData.new_password || ''} onChange={e => setFormData({...formData, new_password: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/40 outline-none text-gray-800 dark:text-gray-100 transition" />
                        </div>
                        <div className="pt-4 flex gap-3">
                            <button type="button" onClick={onClose} className="flex-1 py-3.5 px-4 font-bold rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition focus:outline-none">Cancel</button>
                            <button type="submit" disabled={loading} className="flex-1 py-3.5 px-4 font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition focus:outline-none">{loading ? 'Saving...' : 'Save Profile'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default ProfileModal;
