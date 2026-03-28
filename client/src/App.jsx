import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AdminTeachersList from './pages/AdminTeachersList';
import AdminStudentsList from './pages/AdminStudentsList';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/teachers" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminTeachersList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/students" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminStudentsList />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Teacher Routes */}
        <Route 
          path="/teacher" 
          element={
            <ProtectedRoute allowedRoles={['Teacher']}>
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Student Routes */}
        <Route 
          path="/student" 
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback component */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
