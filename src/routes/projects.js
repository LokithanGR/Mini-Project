import express from 'express';
import Project from '../models/Project.js';
import { auth, requireRole } from '../middleware/auth.js';
const router = express.Router();

// Create project (client)
router.post('/', auth, requireRole('client'), async (req, res) => {
  const { title, category, description, budget } = req.body;
  try {
    const project = await Project.create({ title, category, description, budget, clientId: req.user._id });
    res.json(project);
  } catch (e) {
    res.status(400).json({ error: 'Create failed', details: e.message });
  }
});

// List projects for students (filter by category) - show only open
router.get('/', auth, async (req, res) => {
  const { category } = req.query;
  const q = { status: 'open' };
  if (category) q.category = category;
  const projects = await Project.find(q).sort({ createdAt: -1 }).populate('clientId', 'name email');
  res.json(projects);
});

// Client: my projects
router.get('/mine', auth, requireRole('client'), async (req, res) => {
  const projects = await Project.find({ clientId: req.user._id }).sort({ createdAt: -1 }).populate('assignedStudentId', 'name email');
  res.json(projects);
});

// Student: ongoing
router.get('/ongoing', auth, requireRole('student'), async (req, res) => {
  const projs = await Project.find({ assignedStudentId: req.user._id, status: { $in: ['assigned','completed'] } }).populate('clientId','name email');
  res.json(projs);
});

// Mark complete (client)
router.post('/:id/complete', auth, requireRole('client'), async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, clientId: req.user._id });
  if (!project) return res.status(404).json({ error: 'Not found' });
  project.status = 'completed';
  await project.save();
  res.json(project);
});

export default router;
