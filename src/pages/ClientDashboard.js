import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

export default function ClientDashboard() {
  const [form, setForm] = useState({ title: '', category: 'coding', description: '', budget: 0 });
  const [projects, setProjects] = useState([]);
  const [apps, setApps] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [rating, setRating] = useState({ score: 5, review: '' });

  const load = async () => {
    const res = await api.get('/projects/mine');
    setProjects(res.data);
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/projects', form);
    setForm({ title: '', category: 'coding', description: '', budget: 0 });
    load();
  };

  const viewApps = async (projectId) => {
    const res = await api.get(`/applications/project/${projectId}`);
    setSelectedProject(res.data.project);
    setApps(res.data.applications);
  };

  const decide = async (id, decision) => {
    await api.post(`/applications/${id}/decision`, { decision });
    viewApps(selectedProject._id);
    load();
  };

  const markCompleted = async (projectId) => {
    await api.post(`/projects/${projectId}/complete`);
    load();
  };

  const submitRating = async (projectId) => {
    try {
      await api.post('/ratings', {
        projectId,
        score: rating.score,
        review: rating.review
      });
      alert('Rated');
      setRating({ score: 5, review: '' });
      load();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Rating failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const studentsWorked = async () => {
    const res = await api.get('/ratings/students-worked');
    alert('Students:\n' + res.data.map(p => `${p.assignedStudentId?.name} - ${p.title} (${p.category})`).join('\n'));
  };

  return (
    <div style={{ padding: 16 }}>
      <h3>Client Dashboard</h3>
      <form onSubmit={create} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 16 }}>
        <h4>Post a Project</h4>
        <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /><br />
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
          <option value="coding">coding</option>
          <option value="content-writing">content-writing</option>
          <option value="designing">designing</option>
          <option value="editing">editing</option>
        </select><br />
        <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /><br />
        <input type="number" placeholder="Budget" value={form.budget} onChange={e => setForm({ ...form, budget: Number(e.target.value) })} /><br />
        <button type="submit">Create</button>
      </form>

      <h4>My Projects</h4>
      {projects.map(p => (
        <div key={p._id} style={{ border: '1px solid #eee', padding: 8, marginBottom: 8 }}>
          <b>{p.title}</b> — {p.category} — status: {p.status} — applications: {p.applicationsCount} {' '}
          <Link to={`/chat/${p._id}`}>Chat</Link>
          <div>
            <button onClick={() => viewApps(p._id)}>View Applications</button>
            {p.status === 'assigned' && <button onClick={() => markCompleted(p._id)}>Mark Completed</button>}
            {p.status === 'completed' && (
              <span>
                <input type="number" min="1" max="5" value={rating.score} onChange={e => setRating({ ...rating, score: Number(e.target.value) })} />
                <input placeholder="Review" value={rating.review} onChange={e => setRating({ ...rating, review: e.target.value })} />
                <button onClick={() => submitRating(p._id)}>Rate Student</button>
              </span>
            )}
          </div>
        </div>
      ))}

      {selectedProject && (
        <div style={{ marginTop: 16 }}>
          <h4>Applications for: {selectedProject.title}</h4>
          {apps.length === 0 && <p>No applications yet.</p>}
          {apps.map(a => (
            <div key={a._id} style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
              <div><b>{a.studentId?.name}</b> — {a.studentId?.email} — status: {a.status}</div>
              <div>Cover: {a.coverLetter}</div>

              {/* ✅ Resume Link Added */}
              {a.resume && (
                <div>
                  <a href={`http://localhost:5000/uploads/resumes/${a.resume}`} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </a>
                </div>
              )}

              {a.status === 'pending' && (
                <div>
                  <button onClick={() => decide(a._id, 'accepted')}>Accept</button>
                  <button onClick={() => decide(a._id, 'rejected')}>Reject</button>
                </div>
              )}
            </div>
          ))}
          <button onClick={studentsWorked}>See All Students Worked Under Me</button>
        </div>
      )}
    </div>
  );
}
