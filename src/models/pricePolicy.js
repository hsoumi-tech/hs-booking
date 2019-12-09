import mongoose, {
  Schema
} from 'mongoose';



// Days > dayOfTheWeek
// Days fi weset Days = Conflict 409
// dayOfTheWeek  fi weset dayOfTheWeek = Conflict 409

const pricePolicySchema = new Schema({
  name: String,
  value: {
    type: Number,
    default: 0
  },
  maximumPerson: {
    type: Number,
    default: null
  },
  dayOfTheWeek: {
    type: Number, // 0-6 (Sunday to Saturday)
    default: null
  },
  days: [{
    type: Date
  }],
  hotel: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel'
  },
}, {
  timestamps: true
});

export default mongoose.model('PricePolicy', pricePolicySchema);