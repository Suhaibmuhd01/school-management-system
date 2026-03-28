import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ThemeToggle from '../components/ThemeToggle';

const AdminTeachersList = () => {
    const navigate = useNavigate();
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/admin/users/Teacher', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTeachers(res.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    localStorage.clear();
                    navigate('/');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchTeachers();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col">
            <header className="bg-gradient-to-r from-purple-900 to-indigo-800 border-b shadow-md px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/admin" className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </Link>
                    <h2 className="text-2xl font-extrabold text-white">Teachers Directory</h2>
                </div>
                <ThemeToggle />
            </header>
            
            <main className="flex-1 p-8">
                {loading ? (
                    <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div></div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-2xl shadow-sm border border-gray-200 overflow-hidden max-w-5xl mx-auto transition-colors">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-bold uppercase text-xs">
                                <tr>
                                    <th className="p-5 border-b dark:border-gray-700">Teacher Profile</th>
                                    <th className="p-5 border-b dark:border-gray-700">Email Address</th>
                                    <th className="p-5 border-b dark:border-gray-700">Phone Number</th>
                                    <th className="p-5 border-b dark:border-gray-700">Registration Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {teachers.map(t => (
                                    <tr key={t.id} className="hover:bg-purple-50/50 dark:hover:bg-gray-700/50 transition">
                                        <td className="p-5 font-bold text-gray-800 dark:text-gray-100 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400 font-extrabold flex items-center justify-center text-lg">{t.first_name[0]}</div>
                                            {t.first_name} {t.last_name}
                                        </td>
                                        <td className="p-5 text-gray-600 dark:text-gray-300 font-medium">{t.email}</td>
                                        <td className="p-5 text-gray-600 dark:text-gray-300 font-mono">{t.phone || 'N/A'}</td>
                                        <td className="p-5 text-gray-400 dark:text-gray-500 font-bold text-sm">{new Date(t.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {teachers.length === 0 && <tr><td colSpan="4" className="p-10 text-center text-gray-500 dark:text-gray-400 font-medium italic">No teachers currently active in the system.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};
export default AdminTeachersList;
