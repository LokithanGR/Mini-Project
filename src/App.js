import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/ClientDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Chat from './pages/Chat';
import { useAuth } from './context/AuthContext';

function Home(){ return <div style={{padding:16}}><h2>Freelance Portal</h2><p>Categories: coding, content-writing, designing, editing</p></div> }

function PrivateRoute({ children, role }){
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

export default function App(){
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/client" element={<PrivateRoute role='client'><ClientDashboard/></PrivateRoute>} />
        <Route path="/student" element={<PrivateRoute role='student'><StudentDashboard/></PrivateRoute>} />
        <Route path="/chat/:projectId" element={<PrivateRoute><Chat/></PrivateRoute>} />
      </Routes>
    </div>
  );
}
