import mongoose, {
  Schema
} from 'mongoose';

const moderatorSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Moderator', moderatorSchema);