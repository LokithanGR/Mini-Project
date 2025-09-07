import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function NavBar(){
  const { user, logout } = useAuth();
  return (
    <nav style={{display:'flex',gap:12,padding:12,borderBottom:'1px solid #ddd'}}>
      <Link to="/">Home</Link>
      {user?.role === 'client' && <Link to="/client">Client</Link>}
      {user?.role === 'student' && <Link to="/student">Student</Link>}
      {!user && (<><Link to="/login">Login</Link><Link to="/register">Register</Link></>)}
      {user && (<span style={{marginLeft:'auto'}}>Hi, {user.name} ({user.role}) <button onClick={logout}>Logout</button></span>)}
    </nav>
  );
}
