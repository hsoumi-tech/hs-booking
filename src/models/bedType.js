import mongoose, {
  Schema
} from 'mongoose';

const bedTypeSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  size: Number,
}, {
  timestamps: true
});

export default mongoose.model('BedType', bedTypeSchema);