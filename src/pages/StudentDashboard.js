import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const [category, setCategory] = useState('coding');
  const [projects, setProjects] = useState([]);
  const [cover, setCover] = useState('');
  const [resume, setResume] = useState(null); // resume state
  const [myApps, setMyApps] = useState([]);
  const [ongoing, setOngoing] = useState([]);

  const load = async () => {
    const res = await api.get('/projects', { params: { category } });
    setProjects(res.data);
    const my = await api.get('/applications/mine'); setMyApps(my.data);
    const on = await api.get('/projects/ongoing'); setOngoing(on.data);
  };

  useEffect(() => { load(); }, [category]);

  const apply = async (projectId) => {
    const formData = new FormData();
    formData.append('coverLetter', cover);
    if (resume) formData.append('resume', resume);

    await api.post(`/applications/${projectId}/apply`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    setCover('');
    setResume(null);
    load();
    alert('Applied successfully!');
  };

  return (
    <div style={{ padding: 16 }}>
      <h3>Student Dashboard</h3>

      <div style={{ marginBottom: 12 }}>
        <label>Category: </label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="coding">coding</option>
          <option value="content-writing">content-writing</option>
          <option value="designing">designing</option>
          <option value="editing">editing</option>
        </select>
      </div>

      <h4>Open Projects</h4>
      {projects.map(p => (
        <div key={p._id} style={{ border: '1px solid #eee', padding: 8, marginBottom: 8 }}>
          <b>{p.title}</b> — {p.category} — budget: ₹{p.budget} — status: {p.status}
          <div>{p.description}</div>
          <div style={{ marginTop: 4 }}>
            <input
              placeholder="Cover letter"
              value={cover}
              onChange={e => setCover(e.target.value)}
              style={{ marginRight: 8 }}
            />
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={e => setResume(e.target.files[0])}
              style={{ marginRight: 8 }}
            />
            <button onClick={() => apply(p._id)}>Apply</button>
          </div>
        </div>
      ))}

      <h4>My Applications</h4>
      {myApps.map(a => (
        <div key={a._id} style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          {a.projectId?.title} — status: {a.status}
          {a.status === 'accepted' && (
            <Link to={`/chat/${a.projectId?._id}`} style={{ marginLeft: 8 }}>Open Chat</Link>
          )}
        </div>
      ))}

      <h4>Ongoing/Completed</h4>
      {ongoing.map(p => (
        <div key={p._id} style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          {p.title} — {p.status} — <Link to={`/chat/${p._id}`}>Chat</Link>
        </div>
      ))}
    </div>
  );
}
