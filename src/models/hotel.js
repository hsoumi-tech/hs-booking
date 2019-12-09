import mongoose, {
  Schema
} from 'mongoose';

const hotelSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },

  adress: {
    type: String,
    trim: true
  },
  phoneNumber: Number
}, {
  timestamps: true
});

export default mongoose.model('Hotel', hotelSchema);