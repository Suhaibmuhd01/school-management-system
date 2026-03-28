import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileModal from '../components/ProfileModal';
import ThemeToggle from '../components/ThemeToggle';
import { User, ClipboardList, BarChart2, CheckSquare, CheckCircle, Check, X } from 'lucide-react';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [activeTab, setActiveTab] = useState('attendance'); 
    
    // Live Data
    const [formClasses, setFormClasses] = useState([]);
    const [subjClasses, setSubjClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [pendingResults, setPendingResults] = useState([]);
    const [markedStudents, setMarkedStudents] = useState([]);

    // Form states
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [resultForm, setResultForm] = useState({ student_id: '', ca_score: '', exam_score: '', term: 'First Term', academic_year: '2025/2026' });
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const fetchConfig = () => {
        const token = localStorage.getItem('token');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    useEffect(() => {
        const initDash = async () => {
            try {
                const [fRes, sRes, subRes] = await Promise.all([
                    axios.get('/api/teacher/form-classes', fetchConfig()),
                    axios.get('/api/teacher/subject-classes', fetchConfig()),
                    axios.get('/api/teacher/subjects', fetchConfig())
                ]);
                setFormClasses(fRes.data);
                setSubjClasses(sRes.data);
                setSubjects(subRes.data);
            } catch (err) {
                if (err.response?.status === 401) { localStorage.clear(); navigate('/'); }
            }
        };
        initDash();
    }, [navigate]);

    // Reset selection when tab changes
    useEffect(() => {
        setSelectedClass('');
        setStudents([]);
        setPendingResults([]);
        setMsg({type:'', text:''});
    }, [activeTab]);

    useEffect(() => {
        setMarkedStudents([]);
        setMsg({type:'', text:''});
    }, [selectedClass, date, activeTab]);

    // Fetch students or pending results when a class is selected
    useEffect(() => {
        if (!selectedClass) return;
        const fetchData = async () => {
            try {
                if (activeTab === 'attendance' || activeTab === 'results') {
                    const res = await axios.get(`/api/teacher/classes/${selectedClass}/students`, fetchConfig());
                    setStudents(res.data);
                }
                if (activeTab === 'approve') {
                    const res = await axios.get(`/api/teacher/classes/${selectedClass}/pending-results`, fetchConfig());
                    setPendingResults(res.data);
                }
            } catch (err) { console.error(err); }
        };
        fetchData();
    }, [selectedClass, activeTab]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleMarkAttendance = async (student_id, status) => {
        setMsg({ type: '', text: '' });
        try {
            await axios.post('/api/teacher/attendance', {
                student_id, class_id: selectedClass, date, status
            }, fetchConfig());
            setMarkedStudents(prev => [...prev, student_id]);
            setMsg({ type: 'success', text: `Attendance log successfully securely saved for student.` });
            setTimeout(() => setMsg({ type: '', text: '' }), 3000);
        } catch (err) {
            setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to mark attendance.' });
        }
    };

    const handleUploadResult = async (e) => {
        e.preventDefault();
        setMsg({ type: '', text: '' });
        try {
            const payload = { ...resultForm, class_id: selectedClass, subject_id: selectedSubject };
            const res = await axios.post('/api/teacher/results', payload, fetchConfig());
            setMsg({ type: 'success', text: `Result Saved (Pending Form Master Approval). Total: ${res.data.data.total_score} Grade: ${res.data.data.grade}` });
            setResultForm({ ...resultForm, ca_score: '', exam_score: '' });
        } catch (err) {
            setMsg({ type: 'error', text: err.response?.data?.message || 'Error saving result' });
        }
    };

    const handleReleaseResults = async () => {
        if(!window.confirm("Are you sure? This publishes all pending results directly to student report cards.")) return;
        try {
            const res = await axios.post('/api/teacher/results/release', { class_id: selectedClass }, fetchConfig());
            setMsg({ type: 'success', text: res.data.message });
            setPendingResults([]); // Clear the list since they are now released
        } catch (err) {
            setMsg({ type: 'error', text: err.response?.data?.message || 'Error releasing results' });
        }
    };

    // Determine the visible array of classes depending on the active mode tab
    const visibleClasses = activeTab === 'results' ? subjClasses : formClasses;
    const isFormMasterMode = activeTab === 'attendance' || activeTab === 'approve';

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 transition-colors dark:bg-gray-900">
            <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 px-6 py-4 flex justify-between items-center z-10 sticky top-0 transition-colors">
                <h1 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 hidden sm:block tracking-tight">Teacher Portal Workspace</h1>
                <div className="flex items-center gap-4 ml-auto">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">{user.first_name} {user.last_name}</span>
                    <ThemeToggle />
                    <button onClick={() => setIsProfileOpen(true)} className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full transition shadow-sm text-lg cursor-pointer" title="Profile Settings"><User className="w-5 h-5"/></button>
                    <button onClick={handleLogout} className="px-5 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition shadow-sm">Logout</button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto p-6 mt-6 animate-fade-in">
                <div className="mb-8 p-6 bg-gradient-to-r from-indigo-700 to-purple-600 dark:from-indigo-900 dark:to-purple-900 text-white rounded-2xl shadow-lg relative overflow-hidden transition-colors">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-extrabold tracking-tight">Welcome back, {user.first_name}!</h2>
                        <p className="text-indigo-100 mt-2 font-medium">As a Form Master, manage attendance and release grades. As an Academic Subject Teacher, grade explicitly assigned subjects.</p>
                    </div>
                    <div className="absolute right-0 top-0 opacity-20 transform translate-x-10 -translate-y-10">
                        <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"></path></svg>
                    </div>
                </div>

                <div className="flex border-b mb-8 border-indigo-100 dark:border-gray-700 overflow-x-auto gap-2">
                    <button className={`px-4 sm:px-6 py-3 font-bold transition rounded-t-lg whitespace-nowrap align-middle ${activeTab === 'attendance' ? 'bg-indigo-50 dark:bg-indigo-900/40 border-b-2 border-indigo-600 text-indigo-700 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`} onClick={() => setActiveTab('attendance')}>
                        <ClipboardList className="inline-block w-5 h-5 mr-2 -mt-1" /> Mark Attendance (Form Master)
                    </button>
                    <button className={`px-4 sm:px-6 py-3 font-bold transition rounded-t-lg whitespace-nowrap align-middle ${activeTab === 'results' ? 'bg-indigo-50 dark:bg-indigo-900/40 border-b-2 border-indigo-600 text-indigo-700 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`} onClick={() => setActiveTab('results')}>
                        <BarChart2 className="inline-block w-5 h-5 mr-2 -mt-1" /> Upload Results (Subject Teacher)
                    </button>
                    <button className={`px-4 sm:px-6 py-3 font-bold transition rounded-t-lg whitespace-nowrap align-middle ${activeTab === 'approve' ? 'bg-indigo-50 dark:bg-indigo-900/40 border-b-2 border-indigo-600 text-indigo-700 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`} onClick={() => setActiveTab('approve')}>
                        <CheckSquare className="inline-block w-5 h-5 mr-2 -mt-1" /> Release Grades (Form Master)
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-20 transition-colors">
                    
                    <div className="mb-8 p-6 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 grid md:grid-cols-2 gap-6 items-center">
                        <div>
                            <label className="block text-sm font-extrabold text-indigo-900 dark:text-indigo-300 mb-2">Step 1: Select Your {isFormMasterMode ? 'Form Class' : 'Subject Class'}</label>
                            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full border-gray-300 dark:border-gray-600 rounded-lg p-3.5 bg-white dark:bg-gray-700 border shadow-sm outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-500 transition font-medium text-gray-800 dark:text-gray-200">
                                <option value="">-- View My Assigned Classes --</option>
                                {visibleClasses.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
                            </select>
                            {visibleClasses.length === 0 && (
                                <p className="mt-2 text-sm text-red-500 font-bold italic">You are not designated as a {isFormMasterMode ? 'Form Master' : 'Subject Teacher'} for any class.</p>
                            )}
                        </div>
                        <div className="text-sm text-indigo-700 dark:text-indigo-400 font-medium">
                            * {isFormMasterMode ? 'Only Form Masters can verify classroom attendance registries and explicitly release collected grades to the students.' : 'Subject Teachers can upload raw grades. The Form Master will audit and publish them to report cards.'}
                        </div>
                    </div>

                    {msg.text && (
                        <div className={`mb-6 p-4 rounded-xl font-bold shadow-sm ${msg.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : 'bg-red-100 text-red-800 border-l-4 border-red-500'}`}>
                            {msg.text}
                        </div>
                    )}

                    {activeTab === 'attendance' && selectedClass && (
                        <div className="animate-fade-in">
                            <div className="mb-8 w-full md:w-1/3">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Register Date</label>
                                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 border shadow-sm outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition dark:text-gray-200" />
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="grid grid-cols-12 gap-4 bg-gray-50 dark:bg-gray-900 p-3 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider rounded-t-xl border-b border-gray-200 dark:border-gray-700">
                                    <div className="col-span-7 sm:col-span-8 pl-2">Student Directory</div>
                                    <div className="col-span-5 sm:col-span-4 text-center">Action</div>
                                </div>
                                <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-96 overflow-y-auto">
                                    {students.length === 0 && <div className="p-8 text-center text-gray-400 italic font-medium">No students currently assigned to this classroom.</div>}
                                    {students.map(s => (
                                        <div key={s.id} className="grid grid-cols-12 gap-4 p-3 items-center hover:bg-indigo-50/40 dark:hover:bg-indigo-900/20 transition text-gray-800 dark:text-gray-200">
                                            <div className="col-span-7 sm:col-span-8 flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-md bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 flex items-center justify-center font-bold text-xs shadow-sm">
                                                    {s.first_name[0]}
                                                </div>
                                                <span className="font-semibold text-sm sm:text-base truncate">{s.first_name} {s.last_name}</span>
                                            </div>
                                            <div className="col-span-5 sm:col-span-4 flex justify-end gap-2 pr-1">
                                                {markedStudents.includes(s.id) ? (
                                                    <span className="px-4 py-1.5 bg-indigo-100 text-indigo-700 font-extrabold text-xs rounded-lg border border-indigo-200 flex items-center shadow-sm">
                                                        <CheckCircle className="inline-block w-4 h-4 mr-1" /> Logged
                                                    </span>
                                                ) : (
                                                    <>
                                                        <button onClick={() => handleMarkAttendance(s.id, 'Present')} className="px-3 sm:px-4 py-1.5 bg-green-50 dark:bg-green-900/30 hover:bg-green-500 text-green-700 dark:text-green-400 hover:text-white border border-green-200 dark:border-green-800 rounded-lg text-xs font-bold transition shadow-sm flex items-center gap-1 focus:ring-2 focus:ring-green-200">
                                                            <Check className="w-4 h-4" /> <span className="hidden xl:inline">Present</span>
                                                        </button>
                                                        <button onClick={() => handleMarkAttendance(s.id, 'Absent')} className="px-3 sm:px-4 py-1.5 bg-red-50 dark:bg-red-900/30 hover:bg-red-500 text-red-600 dark:text-red-400 hover:text-white border border-red-200 dark:border-red-800 rounded-lg text-xs font-bold transition shadow-sm flex items-center gap-1 focus:ring-2 focus:ring-red-200">
                                                            <X className="w-4 h-4" /> <span className="hidden xl:inline">Absent</span>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'results' && selectedClass && (
                        <div className="animate-fade-in">
                            <form onSubmit={handleUploadResult} className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm max-w-4xl mx-auto">
                                <h3 className="text-xl font-extrabold text-gray-800 dark:text-gray-200 mb-6 border-b dark:border-gray-700 pb-4">Subject Result Configuration</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Target Student</label>
                                        <select required value={resultForm.student_id} onChange={(e) => setResultForm({...resultForm, student_id: e.target.value})} className="w-full border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 border outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition dark:text-gray-200 font-medium">
                                            <option value="">-- Target Student --</option>
                                            {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Academic Subject</label>
                                        <select required value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 border outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition dark:text-gray-200 font-medium">
                                            <option value="">-- Target Subject --</option>
                                            {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.subject_name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Continuous Assessment (CA) Score</label>
                                        <input required type="number" step="0.01" max="100" placeholder="e.g. 30" value={resultForm.ca_score} onChange={(e) => setResultForm({...resultForm, ca_score: e.target.value})} className="w-full border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 border outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition dark:text-gray-200 font-medium font-mono" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Final Examination Score</label>
                                        <input required type="number" step="0.01" max="100" placeholder="e.g. 70" value={resultForm.exam_score} onChange={(e) => setResultForm({...resultForm, exam_score: e.target.value})} className="w-full border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 border outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition dark:text-gray-200 font-medium font-mono" />
                                    </div>
                                </div>
                                
                                <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-lg rounded-xl shadow-lg transition transform hover:-translate-y-1 focus:ring-4 focus:ring-indigo-300">
                                    Submit Result To Form Master
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'approve' && selectedClass && (
                        <div className="animate-fade-in">
                            <div className="flex justify-between items-center mb-6 border-b dark:border-gray-700 pb-4">
                                <h3 className="text-xl font-extrabold text-gray-800 dark:text-gray-200">Pending Grades Review</h3>
                                <button onClick={handleReleaseResults} disabled={pendingResults.length === 0} className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-lg transition hover:-translate-y-1">
                                    Approve & Release All {pendingResults.length} Results
                                </button>
                            </div>

                            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                <table className="w-full text-left bg-white dark:bg-gray-800">
                                    <thead className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 text-sm">
                                        <tr>
                                            <th className="p-4 font-bold tracking-wide">Student</th>
                                            <th className="p-4 font-bold tracking-wide">Subject</th>
                                            <th className="p-4 font-bold tracking-wide text-center">CA</th>
                                            <th className="p-4 font-bold tracking-wide text-center">Exam</th>
                                            <th className="p-4 font-bold tracking-wide text-center">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {pendingResults.map(r => (
                                            <tr key={r.id} className="hover:bg-indigo-50/30 dark:hover:bg-gray-700 transition text-gray-800 dark:text-gray-300">
                                                <td className="p-4 font-bold flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs">
                                                        {r.first_name[0]}
                                                    </div>
                                                    {r.first_name} {r.last_name}
                                                </td>
                                                <td className="p-4 text-sm font-medium">{r.subject_name}</td>
                                                <td className="p-4 text-center font-mono">{r.ca_score}</td>
                                                <td className="p-4 text-center font-mono">{r.exam_score}</td>
                                                <td className="p-4 text-center font-extrabold text-indigo-600 dark:text-indigo-400">{r.total_score}</td>
                                            </tr>
                                        ))}
                                        {pendingResults.length === 0 && (
                                            <tr><td colSpan="5" className="p-12 text-center text-gray-500 font-semibold italic">There are no pending unreleased results globally recorded for this class.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </main>
            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </div>
    );
};

export default TeacherDashboard;
