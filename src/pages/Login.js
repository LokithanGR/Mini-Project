import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Login(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [err,setErr]=useState('');
  const nav = useNavigate(); const { login } = useAuth();
  const submit = async (e)=>{ e.preventDefault(); try{ await login(email,password); nav('/'); }catch(e){ setErr(e?.response?.data?.error || 'Login failed'); } };
  return (
    <div style={{padding:16, maxWidth:420}}>
      <h3>Login</h3>
      {err && <p style={{color:'red'}}>{err}</p>}
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /><br/>
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /><br/>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
