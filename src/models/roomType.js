import mongoose, {
  Schema
} from 'mongoose';

const roomTypeSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('RoomType', roomTypeSchema);