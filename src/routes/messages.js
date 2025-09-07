import express from 'express';
import Project from '../models/Project.js';
import Message from '../models/Message.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();

// get messages for a project (only client & assigned student)
router.get('/:projectId', auth, async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  const allowed = String(project.clientId) === String(req.user._id) || String(project.assignedStudentId) === String(req.user._id);
  if (!allowed) return res.status(403).json({ error: 'Forbidden' });
  const msgs = await Message.find({ projectId: project._id }).sort({ createdAt: 1 }).populate('senderId','name').populate('receiverId','name');
  res.json(msgs);
});

// send message
router.post('/:projectId', auth, async (req, res) => {
  const { content } = req.body;
  const project = await Project.findById(req.params.projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  const isClient = String(project.clientId) === String(req.user._id);
  const isStudent = String(project.assignedStudentId) === String(req.user._id);
  if (!isClient && !isStudent) return res.status(403).json({ error: 'Forbidden' });
  const receiverId = isClient ? project.assignedStudentId : project.clientId;
  if (!receiverId) return res.status(400).json({ error: 'Messaging allowed only after acceptance' });
  const msg = await Message.create({ projectId: project._id, senderId: req.user._id, receiverId, content });
  res.json(msg);
});

export default router;
