import mongoose, {
  Schema
} from 'mongoose';

const hotelSchema = new Schema({
  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room'
  },
  name: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  rooms: [{
    type: Schema.Types.ObjectId,
    ref: 'Room'
  }],
  adress: {
    type: String,
    trim: true
  },
  phoneNumber: Number
}, {
  timestamps: true
});

export default mongoose.model('Hotel', hotelSchema);