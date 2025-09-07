import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, min:1, max:5, required: true },
  review: { type: String, default: '' }
}, { timestamps: true });

ratingSchema.index({ projectId:1, clientId:1, studentId:1 }, { unique: true });

export default mongoose.model('Rating', ratingSchema);
