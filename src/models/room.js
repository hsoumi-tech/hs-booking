import mongoose, {
  Schema
} from 'mongoose';

const roomSchema = new Schema({
  roomType: {
    type: Schema.Types.ObjectId,
    ref: 'RoomType'
  },
  beds: [{
    type: Schema.Types.ObjectId,
    ref: 'BedType'
  }],
  // The allowed total occupancy for the accommodation in persons (including infants etc). 
  occupancy: Number,
  // 0=> is Ground Floor;1=> 1st Floor; -1=> Basement Level one (2=> 2nd Floor etc) 
  floorLevel: Number,
  roomNumber: Number,
  pricePerNight: Number
}, {
  timestamps: true
});

export default mongoose.model('Room', roomSchema);