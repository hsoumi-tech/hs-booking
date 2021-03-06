import mongoose from 'mongoose';
import RoomType from '../models/roomType'
import BedType from '../models/bedType'
import Room from '../models/room'
import Hotel from '../models/hotel'
import PricePolicy from '../models/pricePolicy';
import Reservation from '../models/reservation';
import Service from '../models/service';

// ###############################################################################
// ### room type
// ###############################################################################

export const getRoomTypeById = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id) === false) {
    return {
      code: 422,
      message: 'invalid room type id'
    };
  }
  return RoomType.findOne({
    _id: id
  })
};

export const getAllRoomTypes = () => {
  return RoomType.find({})
};

export const addRoomType = async ({
  name,
  description
}) => {

  return new RoomType({
    name,
    description
  }).save()
};


export const updateRoomType = async ({
  name,
  description,
  id
}) => {
  if (mongoose.Types.ObjectId.isValid(id) === false) {
    return {
      code: 422,
      message: 'invalid room type id'
    };
  }

  let roomType = await RoomType.findOne({
    _id: id
  })

  if (roomType) {
    roomType.name = name ? name : roomType.name;
    roomType.description = description ? description : roomType.description

    return roomType.save()
  } else {
    return {
      code: 404,
      message: 'room type not found'
    };
  }
};

export const deleteRoomType = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id) === false) {
    return {
      code: 422,
      message: 'invalid room type id'
    };
  }
  const roomTypeUsed = await Room.find({
    roomType: id
  })
  if (roomTypeUsed && roomTypeUsed.length > 0) {
    return {
      message: "room type is already used",
      rooms: roomTypeUsed
    }
  }
  return RoomType.findOneAndDelete({
    _id: id
  })
};

// ###############################################################################
// ### bed type
// ###############################################################################

export const getBedTypeById = async (bedTypeId) => {
  if (mongoose.Types.ObjectId.isValid(bedTypeId) === false) {
    return {
      code: 422,
      message: 'invalid bed type id'
    };
  }
  return BedType.findOne({
    _id: bedTypeId
  })
};

export const getAllBedTypes = () => {
  return BedType.find({})
};

export const addBedType = async ({
  name,
  description,
  size
}) => {

  return new BedType({
    name,
    description,
    size
  }).save()
};


export const updateBedType = async (id, {
  name,
  description,
  size,

}) => {
  if (mongoose.Types.ObjectId.isValid(id) === false) {
    return {
      code: 422,
      message: 'invalid bed type id'
    };
  }

  let bedType = await BedType.findOne({
    _id: id
  })

  if (bedType) {
    bedType.name = name ? name : bedType.name;
    bedType.description = description ? description : bedType.description
    bedType.size = size ? size : bedType.size

    return bedType.save()
  } else {
    return {
      code: 404,
      message: 'bed type not found'
    };
  }
};

export const deleteBedType = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id) === false) {
    return {
      code: 422,
      message: 'invalid bed type id'
    };
  }

  const bedTypeUsed = await Room.find({
    beds: {
      $elemMatch: {
        $eq: id
      }
    }
  })
  if (bedTypeUsed && bedTypeUsed.length > 0) {
    return {
      message: "bed type is already used",
      rooms: bedTypeUsed
    }
  }
  return BedType.findOneAndDelete({
    _id: id
  })
};

// ###############################################################################
// ### room
// ###############################################################################


export const getRoomById = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id) === false) {
    return {
      code: 422,
      message: 'invalid room id'
    };
  }
  return Room.findOne({
    _id: id
  })
};

export const getAllRooms = () => {
  return Room.find({})
};

export const addRoom = async ({
  hotel,
  roomType,
  beds,
  occupancy,
  floorLevel,
  roomNumber,
  pricePerNight
}) => {

  if (mongoose.Types.ObjectId.isValid(hotel) === false) {
    return {
      code: 422,
      message: 'invalid hotel id'
    };
  } else if (!await Hotel.findOne({
      _id: hotel
    })) {
    return {
      code: 404,
      message: 'hotel not found'
    };
  }

  if (mongoose.Types.ObjectId.isValid(roomType) === false) {
    return {
      code: 422,
      message: 'invalid roomType id'
    };
  } else if (!await RoomType.findOne({
      _id: roomType
    })) {
    return {
      code: 404,
      message: 'room type not found'
    };
  }

  for (let i = 0; i < beds.length; i++) {
    if (mongoose.Types.ObjectId.isValid(beds[i]) === false) {
      return {
        code: 422,
        message: `invalid bed id`
      };
    } else if (!await BedType.findOne({
        _id: beds[i]
      })) {
      return {
        code: 404,
        message: 'bed type not found'
      };
    }
  };


  return new Room({
    hotel,
    roomType,
    beds,
    occupancy,
    floorLevel,
    roomNumber,
    pricePerNight
  }).save()
};


export const updateRoom = async ({
  hotel,
  roomType,
  beds,
  occupancy,
  floorLevel,
  roomNumber,
  pricePerNight,
  id
}) => {

  if (mongoose.Types.ObjectId.isValid(id) === false) {
    return {
      code: 422,
      message: 'invalid room id'
    };
  }

  let room = await Room.findOne({
    _id: id
  })

  if (room) {
    if (hotel) {
      if (mongoose.Types.ObjectId.isValid(hotel) === false) {
        return {
          code: 422,
          message: 'invalid hotel id'
        };
      } else if (!await Hotel.findOne({
          _id: hotel
        })) {
        return {
          code: 404,
          message: 'hotel not found'
        };
      }
    }

    if (roomType) {
      if (mongoose.Types.ObjectId.isValid(roomType) === false) {
        return {
          code: 422,
          message: 'invalid roomType id'
        };
      } else if (!await RoomType.findOne({
          _id: roomType
        })) {
        return {
          code: 404,
          message: 'room type not found'
        };
      }
    }

    if (beds) {
      beds.forEach(async (bed, i) => {
        if (mongoose.Types.ObjectId.isValid(bed) === false) {
          return {
            code: 422,
            message: `invalid beds[${i}] id`
          };
        } else if (!await BedType.findOne({
            _id: bed
          })) {
          return {
            code: 404,
            message: 'bed type not found'
          };
        }
      });
    }

    room.hotel = hotel ? hotel : room.hotel;
    room.roomType = roomType ? roomType : room.roomType;
    room.beds = beds ? beds : room.beds
    room.occupancy = occupancy ? occupancy : room.occupancy
    room.floorLevel = floorLevel ? floorLevel : room.floorLevel
    room.roomNumber = roomNumber ? roomNumber : room.roomNumber
    room.pricePerNight = pricePerNight ? pricePerNight : room.pricePerNight

    return room.save()
  } else {
    return {
      code: 404,
      message: 'room not found'
    };
  }
};

export const deleteRoom = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id) === false) {
    return {
      code: 422,
      message: 'invalid room id'
    };
  }

  const roomUsed = await Reservation.find({
    room: id
  })
  if (roomUsed && roomUsed.length > 0) {
    return {
      message: "room is already used",
      rooms: roomUsed
    }
  }

  return Room.findOneAndDelete({
    _id: id
  })
};

// ###############################################################################
// ### hotel
// ###############################################################################


export const getHotelById = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id) === false) {
    return {
      code: 422,
      message: 'invalid hotel id'
    };
  }
  return Hotel.findOne({
    _id: id
  })
};

export const getAllHotels = () => {
  return Hotel.find({})
};

export const addHotel = async ({
  name,
  description,
  adress,
  phoneNumber
}) => {




  return new Hotel({
    name,
    description,
    adress,
    phoneNumber
  }).save()
};


export const updateHotel = async ({
  name,
  description,
  adress,
  phoneNumber,
  id
}) => {

  if (mongoose.Types.ObjectId.isValid(id) === false) {
    return {
      code: 422,
      message: 'invalid hotel id'
    };
  }

  let hotel = await Hotel.findOne({
    _id: id
  })

  if (hotel) {
    hotel.name = name ? name : hotel.name;
    hotel.description = description ? description : hotel.description
    hotel.adress = adress ? adress : hotel.adress
    hotel.phoneNumber = phoneNumber ? phoneNumber : hotel.phoneNumber

    return hotel.save()
  } else {
    return {
      code: 404,
      message: 'hotel not found'
    };
  }
};

export const deleteHotel = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id) === false) {
    return {
      code: 422,
      message: 'invalid hotel id'
    };
  }
  const hotel = await Hotel.findOne({
    _id: id
  })
  if (!hotel) {
    return {
      code: 404,
      message: "hotel not found"
    }
  }


  let rommsId = []
  const rooms = await Room.find({
    hotel: hotel.id
  })
  await rooms.forEach(element => {
    rommsId.push(element._id)
  });

  console.log("rommsId", rommsId)

  // delete all reservation related to room of hotel
  console.log("rommsId reservations delete", await Reservation.deleteMany({
    room: {
      $in: rommsId
    }
  }))


  // delete all rooms related to hotel
  console.log("romms delete", await Room.deleteMany({
    _id: {
      $in: rommsId
    }
  }))

  let servicesId = []
  const services = await Service.find({
    hotel: hotel.id
  })

  services.forEach(element => {
    servicesId.push(element._id)
  });

  console.log("servicesId", servicesId)

  // delete all reservation related to services of hotel

  console.log("servicesId reservations delete", await Reservation.deleteMany({
    services: {
      $elemMatch: {
        $in: servicesId
      }
    }
  }))

  // delete all Services related to the hotel
  console.log("Services delete", await Service.deleteMany({
    _id: {
      $in: servicesId
    }
  }))

  // delete all Price Policies related to the hotel
  console.log("delete price policy", await PricePolicy.deleteMany({
    hotel: hotel.id
  }))

  // delete the hotel
  const deleteHotel = await Hotel.findOneAndDelete({
    _id: id
  })
  console.log("deleteHotel", deleteHotel)
  return deleteHotel
};