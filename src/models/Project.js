import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['coding','content-writing','designing','editing'], required: true },
  description: { type: String, required: true },
  budget: { type: Number, default: 0 },
  status: { type: String, enum: ['open','assigned','completed'], default: 'open' },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedStudentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  applicationsCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
