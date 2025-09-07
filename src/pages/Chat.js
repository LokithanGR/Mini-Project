import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function Chat(){
  const { projectId } = useParams();
  const [messages,setMessages]=useState([]);
  const [text,setText]=useState('');

  const load = async ()=>{ const res = await api.get(`/messages/${projectId}`); setMessages(res.data); };

  useEffect(()=>{ load(); },[projectId]);

  const send = async ()=>{ if(!text.trim()) return; await api.post(`/messages/${projectId}`, { content: text }); setText(''); load(); };

  return (
    <div style={{padding:16}}>
      <h3>Chat</h3>
      <div style={{border:'1px solid #ddd', padding:8, height:300, overflowY:'auto'}}>
        {messages.map(m=> (<div key={m._id} style={{marginBottom:6}}><b>{m.senderId?.name || m.senderId}</b>: {m.content} <small>({new Date(m.createdAt).toLocaleString()})</small></div>))}
      </div>
      <div style={{marginTop:8}}><input value={text} onChange={e=>setText(e.target.value)} placeholder="Type message..." style={{width:'70%'}} /><button onClick={send}>Send</button></div>
    </div>
  );
}
