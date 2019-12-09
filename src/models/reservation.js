import mongoose, {
  Schema
} from 'mongoose';

const reservationSchema = new Schema({
  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room'
  },
  services: [{
    type: Schema.Types.ObjectId,
    ref: 'Service',
    default: null
  }],
  price: Number,
  startDate: Date,
  endDate: Date,
  adults: {
    type: Number,
    default: 1
  },
  kids: {
    type: Number,
    default: 0
  },
  babies: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Reservation', reservationSchema);