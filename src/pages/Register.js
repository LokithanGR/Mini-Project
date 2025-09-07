import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Register(){
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [role,setRole]=useState('client'); const [err,setErr]=useState('');
  const nav = useNavigate(); const { register } = useAuth();
  const submit = async (e)=>{ e.preventDefault(); try{ await register({ name,email,password,role }); nav('/'); }catch(e){ setErr(e?.response?.data?.error || 'Register failed'); } };
  return (
    <div style={{padding:16, maxWidth:420}}>
      <h3>Register</h3>
      {err && <p style={{color:'red'}}>{err}</p>}
      <form onSubmit={submit}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} /><br/>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /><br/>
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /><br/>
        <select value={role} onChange={e=>setRole(e.target.value)}><option value="client">client</option><option value="student">student</option></select><br/>
        <button type="submit">Create account</button>
      </form>
    </div>
  );
}
