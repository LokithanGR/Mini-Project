import express from 'express';
import multer from 'multer';
import Application from '../models/Application.js';
import Project from '../models/Project.js';
import { auth, requireRole } from '../middleware/auth.js';
const router = express.Router();

// Setup multer for resume upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/resumes'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Student applies for project with resume
router.post('/:projectId/apply', auth, requireRole('student'), upload.single('resume'), async (req, res) => {
  const { projectId } = req.params;
  const { coverLetter } = req.body;
  const resume = req.file ? req.file.filename : null;

  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const existing = await Application.findOne({ projectId, studentId: req.user._id });
  if (existing) return res.status(400).json({ error: 'Already applied' });

  const app = await Application.create({
    projectId,
    studentId: req.user._id,
    coverLetter,
    resume,
    status: 'pending'
  });
  res.json(app);
});

// Client view applications for a project
router.get('/project/:projectId', auth, requireRole('client'), async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const applications = await Application.find({ projectId: project._id }).populate('studentId', 'name email');
  res.json({ project, applications });
});

// Client accept/reject application
router.post('/:id/decision', auth, requireRole('client'), async (req, res) => {
  const { decision } = req.body;
  const app = await Application.findById(req.params.id);
  if (!app) return res.status(404).json({ error: 'Application not found' });

  app.status = decision;
  await app.save();

  if (decision === 'accepted') {
    const project = await Project.findById(app.projectId);
    project.assignedStudentId = app.studentId;
    project.status = 'assigned';
    await project.save();
  }

  res.json(app);
});

export default router;
