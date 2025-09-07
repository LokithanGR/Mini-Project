import express from 'express';
import Project from '../models/Project.js';
import Rating from '../models/Rating.js';
import { auth, requireRole } from '../middleware/auth.js';
const router = express.Router();

// Client rates student after completion
router.post('/', auth, requireRole('client'), async (req, res) => {
  const { projectId, score, review } = req.body;
  const project = await Project.findOne({ _id: projectId, clientId: req.user._id });
  if (!project) return res.status(404).json({ error: 'Project not found' });
  if (project.status !== 'completed') return res.status(400).json({ error: 'Project not completed' });
  if (!project.assignedStudentId) return res.status(400).json({ error: 'No student assigned' });
  try {
    const rating = await Rating.create({ projectId: project._id, clientId: req.user._id, studentId: project.assignedStudentId, score, review });
    res.json(rating);
  } catch (e) {
    res.status(400).json({ error: 'Rating failed', details: e.message });
  }
});

// list students worked under me
router.get('/students-worked', auth, requireRole('client'), async (req, res) => {
  const projects = await Project.find({ clientId: req.user._id, assignedStudentId: { $ne: null } }).populate('assignedStudentId','name email').sort({ createdAt: -1 });
  res.json(projects);
});

export default router;
