import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending','accepted','rejected'], default: 'pending' },
  coverLetter: { type: String, default: '' }
}, { timestamps: true });

applicationSchema.index({ projectId:1, studentId:1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
