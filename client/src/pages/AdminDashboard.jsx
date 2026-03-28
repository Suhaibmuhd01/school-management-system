import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ThemeToggle from '../components/ThemeToggle';
import ProfileModal from '../components/ProfileModal';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { User, GraduationCap, Backpack, Plus, School, BookOpen, Link as LinkIcon } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Live Data State
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [modal, setModal] = useState(null); // 'user', 'class', 'subject', 'assignTeacher', 'assignStudent'
    const [formData, setFormData] = useState({});
    const [actionMsg, setActionMsg] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const [studentRes, teacherRes, classRes, subjectRes] = await Promise.all([
                axios.get('/api/admin/users/Student', config),
                axios.get('/api/admin/users/Teacher', config),
                axios.get('/api/admin/classes', config),
                axios.get('/api/admin/subjects', config)
            ]);

            setStudents(studentRes.data);
            setTeachers(teacherRes.data);
            setClasses(classRes.data);
            setSubjects(subjectRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            if (error.response?.status === 401) {
                localStorage.clear();
                navigate('/');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [navigate]);

    const handleFormChange = (e) => {
        // Prevent event loss by strictly capturing current values.
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleActionSubmit = async (e) => {
        e.preventDefault();
        setActionMsg({ type: '', text: '' });
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            if (modal === 'user') {
                await axios.post('/api/admin/users', formData, config);
                setActionMsg({ type: 'success', text: `${formData.role} account created successfully!` });
            } else if (modal === 'class') {
                await axios.post('/api/admin/classes', formData, config);
                setActionMsg({ type: 'success', text: 'Class created successfully!' });
            } else if (modal === 'subject') {
                await axios.post('/api/admin/subjects', formData, config);
                setActionMsg({ type: 'success', text: 'Subject created successfully!' });
            } else if (modal === 'assignTeacher' || modal === 'assignStudent') {
                const endpoint = modal === 'assignTeacher' ? '/api/admin/assign-teacher' : '/api/admin/assign-student';
                await axios.post(`${endpoint}`, formData, config);
                setActionMsg({ type: 'success', text: 'Assigned successfully!' });
            }
            
            fetchDashboardData(); // Refresh Data instantly
            setTimeout(() => { setModal(null); setFormData({}); setActionMsg({ type: '', text: '' }); }, 2000);
        } catch (err) {
            setActionMsg({ type: 'error', text: err.response?.data?.message || 'Operation failed. Check if email/data already exists.' });
        }
    };

    const openModal = (type, defaults = {}) => {
        setModal(type);
        setFormData(defaults);
        setActionMsg({ type: '', text: '' });
        setShowPassword(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-opacity-75"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 relative transition-colors">
            
            {/* Core Operation Modals */}
            {modal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in relative transition-all">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">
                                {modal === 'user' && `Register New Account`}
                                {modal === 'class' && `Add New Class`}
                                {modal === 'subject' && `Add Subject`}
                                {modal === 'assignTeacher' && `Assign Teacher to Class`}
                                {modal === 'assignStudent' && `Assign Student to Class`}
                            </h2>
                            <button onClick={() => setModal(null)} className="text-gray-400 hover:text-red-500 transition cursor-pointer">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className="p-6">
                            {actionMsg.text && (
                                <div className={`mb-6 p-4 rounded-lg text-sm font-bold shadow-sm ${actionMsg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {actionMsg.text}
                                </div>
                            )}

                            <form onSubmit={handleActionSubmit} className="space-y-4 text-left">
                                {modal === 'user' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold mb-1">First Name</label>
                                                <input type="text" name="first_name" required value={formData.first_name || ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold mb-1">Last Name</label>
                                                <input type="text" name="last_name" required value={formData.last_name || ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Email Address</label>
                                            <input type="email" name="email" required value={formData.email || ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Temporary Password</label>
                                            <div className="relative">
                                                <input 
                                                    type={showPassword ? "text" : "password"} 
                                                    name="password" required minLength="6" 
                                                    value={formData.password || ''}
                                                    onChange={handleFormChange} 
                                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition pr-12" 
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-blue-600 focus:outline-none"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Role</label>
                                            <select name="role" required value={formData.role || 'Student'} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white transition">
                                                <option value="Student">Student</option>
                                                <option value="Teacher">Teacher</option>
                                                <option value="Admin">Admin</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                {modal === 'class' && (
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Class Name</label>
                                        <input type="text" name="class_name" required value={formData.class_name || ''} placeholder="e.g. JSS 1A" onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-4 focus:ring-pink-100 focus:border-pink-500 outline-none transition" />
                                    </div>
                                )}

                                {modal === 'subject' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Subject Name</label>
                                            <input type="text" name="subject_name" required value={formData.subject_name || ''} placeholder="e.g. Mathematics" onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Subject Category</label>
                                            <select name="category" required value={formData.category || 'General'} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition bg-white">
                                                <option value="Core">Core (General)</option>
                                                <option value="Basic Education">Basic Education (JSS)</option>
                                                <option value="Language">Language</option>
                                                <option value="Religion">Religion</option>
                                                <option value="Science Core">Science Core</option>
                                                <option value="Science Elective">Science Elective</option>
                                                <option value="General Elective">General Elective</option>
                                                <option value="Trade">Trade / Entrepreneurship</option>
                                                <option value="General">Uncategorized</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {modal === 'assignTeacher' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Teacher</label>
                                            <select name="teacher_id" required value={formData.teacher_id || ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg p-3 outline-none bg-white">
                                                <option value="">-- Choose Teacher --</option>
                                                {teachers.map(t => <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Target Class</label>
                                            <select name="class_id" required value={formData.class_id || ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg p-3 outline-none bg-white">
                                                <option value="">-- Choose Class --</option>
                                                {classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Target Subject</label>
                                            <select name="subject_id" required value={formData.subject_id || ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg p-3 outline-none bg-white">
                                                <option value="">-- Choose Subject --</option>
                                                {subjects.map(s => <option key={s.id} value={s.id}>{s.subject_name}</option>)}
                                            </select>
                                        </div>
                                    </>
                                )}

                                {modal === 'assignStudent' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Student</label>
                                            <select name="student_id" required value={formData.student_id || ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg p-3 outline-none bg-white">
                                                <option value="">-- Choose Student --</option>
                                                {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Target Class</label>
                                            <select name="class_id" required value={formData.class_id || ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg p-3 outline-none bg-white">
                                                <option value="">-- Choose Class --</option>
                                                {classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
                                            </select>
                                        </div>
                                    </>
                                )}

                                <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-lg rounded-xl shadow-lg mt-8 transition transform hover:-translate-y-1">
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header Navbar */}
                <header className="bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-900 border-b border-indigo-950 shadow-xl z-20 sticky top-0 px-8 py-6 flex justify-between items-center transition-colors">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl backdrop-blur-md flex items-center justify-center text-white text-2xl shadow-inner border border-white/20">
                            <School className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">Admin Portal Workspace</h2>
                            <p className="text-blue-200 text-sm font-medium mt-1">Real-time School Management Engine</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block mr-2">
                            <p className="font-extrabold text-white text-lg">{user.first_name} {user.last_name}</p>
                            <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">System Administrator</p>
                        </div>
                        <ThemeToggle />
                        <button onClick={() => setIsProfileOpen(true)} className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-full transition shadow-sm backdrop-blur-sm text-lg cursor-pointer ml-3" title="Profile Settings"><User className="w-5 h-5"/></button>
                        <button onClick={() => { localStorage.clear(); navigate('/'); }} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-xl font-bold transition shadow-sm backdrop-blur-sm ml-3">
                            Logout
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-gray-900 transition-colors">
                    
                    {/* Live Database API Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 border-l-4 border-l-blue-500 transition-transform hover:-translate-y-1">
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase track">Students</p>
                            <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mt-2">{students.length}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 border-l-4 border-l-purple-500 transition-transform hover:-translate-y-1">
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase">Teachers</p>
                            <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mt-2">{teachers.length}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 border-l-4 border-l-pink-500 transition-transform hover:-translate-y-1">
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase">Classes</p>
                            <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mt-2">{classes.length}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 border-l-4 border-l-green-500 transition-transform hover:-translate-y-1">
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase">Subjects</p>
                            <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mt-2">{subjects.length}</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Interactive Logic Control Panel */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white dark:bg-gray-800 dark:border-gray-700 p-7 rounded-2xl shadow-sm border border-gray-100 transition-colors">
                                <h3 className="font-extrabold text-xl mb-5 text-gray-800 dark:text-gray-100 tracking-tight border-b dark:border-gray-700 pb-3">Registration Hub</h3>
                                <div className="space-y-4">
                                    <button onClick={() => openModal('user', { role: 'Student' })} className="w-full text-left px-5 py-4 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-100 transition font-extrabold text-blue-800 shadow-sm flex justify-between items-center group">
                                        <span>Add New Student</span>
                                        <span className="bg-white p-1.5 rounded shadow text-blue-600 group-hover:scale-110 transition"><Plus className="w-4 h-4"/></span>
                                    </button>
                                    <button onClick={() => openModal('user', { role: 'Teacher' })} className="w-full text-left px-5 py-4 rounded-xl border border-purple-100 bg-purple-50/50 hover:bg-purple-100 transition font-extrabold text-purple-800 shadow-sm flex justify-between items-center group">
                                        <span>Add New Teacher</span>
                                        <span className="bg-white p-1.5 rounded shadow text-purple-600 group-hover:scale-110 transition"><Plus className="w-4 h-4"/></span>
                                    </button>
                                    <button onClick={() => openModal('class')} className="w-full text-left px-5 py-4 rounded-xl border border-pink-100 bg-pink-50/50 hover:bg-pink-100 transition font-extrabold text-pink-800 shadow-sm flex justify-between items-center group">
                                        <span>Add New Class</span>
                                        <span className="bg-white p-1.5 rounded shadow text-pink-600 group-hover:scale-110 transition"><School className="w-4 h-4"/></span>
                                    </button>
                                    <button onClick={() => openModal('subject')} className="w-full text-left px-5 py-4 rounded-xl border border-green-100 bg-green-50/50 hover:bg-green-100 transition font-extrabold text-green-800 shadow-sm flex justify-between items-center group">
                                        <span>Add Subject</span>
                                        <span className="bg-white p-1.5 rounded shadow text-green-600 group-hover:scale-110 transition"><BookOpen className="w-4 h-4"/></span>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 dark:border-gray-700 p-7 rounded-2xl shadow-sm border border-gray-100 transition-colors">
                                <h3 className="font-extrabold text-xl mb-5 text-gray-800 dark:text-gray-100 tracking-tight border-b dark:border-gray-700 pb-3">Assignments Hub</h3>
                                <div className="space-y-4">
                                    <button onClick={() => openModal('assignTeacher')} className="w-full text-left px-5 py-4 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100 hover:border-blue-300 transition font-extrabold text-blue-900 shadow-sm flex justify-between group">
                                        Assign Teacher to Subject & Class <span className="bg-white p-1.5 rounded shadow text-blue-600 group-hover:scale-110 transition"><LinkIcon className="w-4 h-4"/></span>
                                    </button>
                                    <button onClick={() => openModal('assignStudent')} className="w-full text-left px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition font-extrabold text-gray-800 flex justify-between group">
                                        Assign Student to Class <span className="bg-white p-1.5 rounded shadow text-gray-600 group-hover:scale-110 transition"><LinkIcon className="w-4 h-4"/></span>
                                    </button>
                                    <button onClick={async () => {
                                        if (window.confirm('Execute mass promotion? SS3 will graduate, others advance.')) {
                                            try { 
                                                const res = await axios.post('/api/admin/promote-students', {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}); 
                                                alert(res.data.message); 
                                                fetchDashboardData(); 
                                            } catch(e) { alert('Promotion Failed: ' + e.message); }
                                        }
                                    }} className="w-full text-left px-5 py-4 rounded-xl border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-300 transition font-extrabold text-yellow-800 flex justify-between group">
                                        Mass Promote / Graduate Students <span className="bg-white p-1.5 rounded shadow text-yellow-600 group-hover:scale-110 transition"><GraduationCap className="w-4 h-4"/></span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Visual Analytics Hub */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <Link to="/admin/teachers" className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white hover:scale-105 transition transform flex flex-col items-center justify-center">
                                    <GraduationCap className="w-12 h-12 mb-3 drop-shadow-md"/>
                                    <h3 className="text-xl font-extrabold text-center drop-shadow-md">View Full Teachers Directory</h3>
                                </Link>
                                <Link to="/admin/students" className="bg-gradient-to-br from-blue-600 to-cyan-700 p-6 rounded-2xl shadow-lg text-white hover:scale-105 transition transform flex flex-col items-center justify-center">
                                    <Backpack className="w-12 h-12 mb-3 drop-shadow-md"/>
                                    <h3 className="text-xl font-extrabold text-center drop-shadow-md">View Full Students Directory</h3>
                                </Link>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 dark:border-gray-700 p-7 rounded-2xl shadow-sm border border-gray-100 transition-colors">
                                <h3 className="font-extrabold text-xl mb-6 text-gray-800 dark:text-gray-100 tracking-tight border-b dark:border-gray-700 pb-3">Population Distribution Matrix</h3>
                                <div className="h-80 w-full pt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={[
                                            { name: 'Students', count: students.length, fill: '#3b82f6' },
                                            { name: 'Teachers', count: teachers.length, fill: '#8b5cf6' },
                                            { name: 'Active Classes', count: classes.length, fill: '#ec4899' },
                                            { name: 'Total Subjects', count: subjects.length, fill: '#10b981' }
                                        ]} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                            <XAxis dataKey="name" tick={{fontWeight: 'bold', fill: '#4b5563'}} />
                                            <YAxis />
                                            <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '12px', fontWeight: 'bold'}} />
                                            <Bar dataKey="count" radius={[8, 8, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </div>
    );
};

export default AdminDashboard;
