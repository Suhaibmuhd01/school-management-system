import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import ThemeToggle from '../components/ThemeToggle';
import ProfileModal from '../components/ProfileModal';
import { User, GraduationCap, FolderOpen, Book, CheckCircle } from 'lucide-react';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const [terms, setTerms] = useState([]);
    const [selectedTerm, setSelectedTerm] = useState('');
    const [results, setResults] = useState([]);
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                const token = localStorage.getItem('token');
                
                const metricsRes = await axios.get('/api/student/dashboard-metrics', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMetrics(metricsRes.data);

                const res = await axios.get('/api/student/report-terms', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const fetchedTerms = res.data;
                setTerms(fetchedTerms);
                
                if (fetchedTerms.length > 0) {
                    setSelectedTerm(`${fetchedTerms[0].academic_year}|${fetchedTerms[0].term}`);
                }
            } catch (err) {
                if (err.response?.status === 401) { localStorage.clear(); navigate('/'); }
            } finally {
                setLoading(false);
            }
        };
        fetchTerms();
    }, [navigate]);

    useEffect(() => {
        if (!selectedTerm) return;
        const fetchResults = async () => {
            try {
                const [year, term] = selectedTerm.split('|');
                const token = localStorage.getItem('token');
                const res = await axios.get(`/api/student/results?academic_year=${year}&term=${term}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setResults(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchResults();
    }, [selectedTerm]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans transition-colors dark:bg-gray-900">
            {/* Ultra-Premium Header */}
            <header className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 border-b border-teal-800 shadow-xl z-10 sticky top-0 px-8 py-6 flex justify-between items-center text-white">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center text-white text-2xl shadow-inner border border-white/30">
                        <GraduationCap className="w-8 h-8"/>
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight drop-shadow-md">Student Gateway</h2>
                        <p className="text-emerald-100 text-sm font-medium mt-1">Official Academic Reporting Portal</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block mr-2">
                        <p className="font-extrabold text-lg">{user.first_name} {user.last_name}</p>
                        <p className="text-emerald-200 text-xs font-bold uppercase tracking-wider">Active Scholar</p>
                    </div>
                    <ThemeToggle />
                    <button onClick={() => setIsProfileOpen(true)} className="ml-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-full transition shadow-sm backdrop-blur-sm text-lg cursor-pointer" title="Profile Settings"><User className="w-5 h-5"/></button>
                    <button onClick={handleLogout} className="ml-4 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-xl font-bold transition shadow-sm backdrop-blur-sm">
                        Logout
                    </button>
                </div>
            </header>

            <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8 animate-fade-in">
                
                {metrics && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center transition-colors">
                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
                                <GraduationCap className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">{user.first_name} {user.last_name}</h3>
                            <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-1 text-lg">{metrics.class_name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Active Scholar Profile</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700 transition-colors flex flex-col">
                            <h3 className="font-extrabold text-lg text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
                                <CheckCircle className="text-blue-500 w-5 h-5"/> Attendance Metrics
                            </h3>
                            {metrics.attendance.Present === 0 && metrics.attendance.Absent === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 font-medium text-sm">
                                    No Attendance Data Logged
                                </div>
                            ) : (
                                <div className="flex-1 h-32 relative mt-2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie 
                                                data={[
                                                    { name: 'Present', value: metrics.attendance.Present, color: '#10b981' },
                                                    { name: 'Absent', value: metrics.attendance.Absent, color: '#ef4444' }
                                                ]} 
                                                cx="50%" cy="50%" innerRadius={35} outerRadius={50} dataKey="value" stroke="none"
                                            >
                                                {[{color: '#10b981'}, {color: '#ef4444'}].map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="block text-xl font-extrabold text-gray-800 dark:text-gray-100">
                                            {metrics.attendance.Present + metrics.attendance.Absent}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between text-xs font-bold mt-2 px-2">
                                <span className="text-emerald-600 dark:text-emerald-400">● {metrics.attendance.Present} Present</span>
                                <span className="text-red-500 dark:text-red-400">● {metrics.attendance.Absent} Absent</span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700 transition-colors flex flex-col">
                            <h3 className="font-extrabold text-lg text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <Book className="text-purple-500 w-5 h-5"/> Enrolled Subject Outline
                            </h3>
                            <div className="flex-1 overflow-y-auto pr-2 space-y-2 max-h-40">
                                {metrics.subjects.length === 0 ? (
                                    <div className="text-center text-gray-400 font-medium text-sm mt-4">Unassigned to specific subjects</div>
                                ) : (
                                    metrics.subjects.map(sub => (
                                        <div key={sub.id} className="bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-600 font-semibold text-sm text-gray-700 dark:text-gray-200 truncate shadow-sm transition">
                                            {sub.subject_name}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden text-gray-800 dark:text-gray-100 transition-colors">
                    
                    <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/80 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div>
                            <h3 className="text-2xl font-extrabold tracking-tight text-emerald-700 dark:text-emerald-400">Term Result Overview</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Select a previously graded term below to instantly view your academic performance matrix.</p>
                        </div>
                        
                        <div className="w-full sm:w-72">
                            <select 
                                value={selectedTerm} 
                                onChange={(e) => setSelectedTerm(e.target.value)} 
                                className="w-full bg-white dark:bg-gray-700 border-2 border-emerald-200 dark:border-emerald-700 text-gray-800 dark:text-white rounded-xl p-3.5 font-bold shadow-sm outline-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900 transition cursor-pointer"
                            >
                                {terms.length === 0 ? <option value="">-- No Grades Published Yet --</option> : null}
                                {terms.map((t, idx) => (
                                    <option key={idx} value={`${t.academic_year}|${t.term}`}>
                                        {t.academic_year} • {t.term}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="p-8">
                        {loading ? (
                            <div className="py-20 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-500"></div></div>
                        ) : results.length > 0 ? (
                            <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                <table className="w-full text-left bg-white dark:bg-gray-800">
                                    <thead>
                                        <tr className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 uppercase text-xs font-extrabold tracking-wider border-b border-emerald-100 dark:border-gray-700">
                                            <th className="p-5">Subject</th>
                                            <th className="p-5 text-center">Class Block</th>
                                            <th className="p-5 text-center">C.A. Score</th>
                                            <th className="p-5 text-center">Exam Score</th>
                                            <th className="p-5 text-center">Total Score</th>
                                            <th className="p-5 text-center">Final Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {results.map((r, i) => (
                                            <tr key={i} className="hover:bg-emerald-50/50 dark:hover:bg-gray-700/50 transition">
                                                <td className="p-5 font-bold text-gray-900 dark:text-white">{r.subject_name}</td>
                                                <td className="p-5 text-center font-semibold text-gray-500 dark:text-gray-400">{r.class_name}</td>
                                                <td className="p-5 text-center font-mono font-medium text-gray-600 dark:text-gray-300">{parseFloat(r.ca_score)}</td>
                                                <td className="p-5 text-center font-mono font-medium text-gray-600 dark:text-gray-300">{parseFloat(r.exam_score)}</td>
                                                <td className="p-5 text-center font-mono font-extrabold text-emerald-600 dark:text-emerald-400">{parseFloat(r.total_score)}</td>
                                                <td className="p-5 text-center">
                                                    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-extrabold text-lg shadow-sm
                                                        ${r.grade === 'A' ? 'bg-green-100 text-green-700' :
                                                          r.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                                                          r.grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                                                          r.grade === 'D' ? 'bg-orange-100 text-orange-700' :
                                                          r.grade === 'E' ? 'bg-red-50 text-red-600' :
                                                          'bg-red-100 text-red-800'
                                                        }`}>
                                                        {r.grade}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-50 text-gray-400" />
                                <h4 className="text-xl font-extrabold text-gray-700 dark:text-gray-300">No Grades Published Yet</h4>
                                <p className="text-gray-500 dark:text-gray-400 font-medium mt-2 max-w-sm mx-auto">Your teachers have not uploaded any report cards for the selected academic term. Please check back later.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </div>
    );
};

export default StudentDashboard;
