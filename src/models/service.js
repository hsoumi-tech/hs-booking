import mongoose, {
  Schema
} from 'mongoose';

const serviceSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  price: Number,
  daysBeforeReservation: {
    type: Number,
    default: 0
  },
  quantity: {
    type: Number,
    default: 1
  },
  hotel: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel'
  },
}, {
  timestamps: true
});

export default mongoose.model('Service', serviceSchema);