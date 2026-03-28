import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'Admin'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await axios.post('/api/auth/register', formData);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-800 to-emerald-800 p-4 transition-colors relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
            <div className="w-full max-w-md glass-panel p-8">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">School Portal</h1>
                    <p className="text-gray-600 font-medium">Create your account to get started</p>
                </div>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm font-semibold rounded-lg border border-red-200">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 text-sm font-semibold rounded-lg border border-green-200">
                        {success}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
                            <input 
                                type="text" name="first_name" required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="John" onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                            <input 
                                type="text" name="last_name" required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Doe" onChange={handleChange}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                        <input 
                            type="email" name="email" required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="admin@school.com" onChange={handleChange}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} name="password" required minLength="6"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-12"
                                placeholder="••••••••" onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-blue-600 focus:outline-none"
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
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                        <select 
                            name="role" value={formData.role} onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                        >
                            <option value="Admin">Admin (Setup School)</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Student">Student</option>
                        </select>
                    </div>

                    <button 
                        type="submit" disabled={loading}
                        className="w-full py-3 px-4 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Registering...' : 'Sign Up'}
                    </button>
                    
                    <p className="text-center text-sm font-medium text-gray-600 mt-4 pt-2">
                        Already have an account? <Link to="/" className="text-blue-600 hover:underline">Log in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
