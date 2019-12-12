import mongoose from "mongoose";
import moment from "moment";
import Reservation from "../models/reservation";
import Room from "../models/room";
import Hotel from "../models/hotel";
import Service from "../models/service";
import PricePolicy from "../models/pricePolicy";

// ###############################################################################
// ### reservation
// ###############################################################################

export const getReservationById = async id => {
  if (mongoose.Types.ObjectId.isValid(id) === false) {
    return {
      code: 422,
      message: "invalid reservation id"
    };
  }
  return Reservation.findOne({
    _id: id
  });
};

export const getAllReservations = () => {
  return Reservation.find({});
};

export const addReservation = async ({
  room,
  services = null,
  startDate,
  endDate,
  adults = 1,
  kids = 0,
  babies = 0
}) => {
  let roomPopulated = "";
  if (mongoose.Types.ObjectId.isValid(room) === false) {
    return {
      code: 422,
      message: "invalid room id"
    };
  } else {
    roomPopulated = await Room.findOne({
      _id: room
    });

    if (!roomPopulated) {
      return {
        code: 404,
        message: "room not found"
      };
    }
  }

  startDate = moment(startDate, "DD/MM/YYYY");
  endDate = moment(endDate, "DD/MM/YYYY");
  let serviceTotalPrice = 0;
  if (services) {
    for (let i = 0; i < services.length; i++) {
      if (mongoose.Types.ObjectId.isValid(services[i]) === false) {
        return {
          code: 422,
          message: `invalid service id`
        };
      } else {
        const service = await Service.findOne({
          _id: services[i]
        });
        if (!service) {
          return {
            code: 404,
            message: "service not found"
          };
        } else if (!service.hotel.equals(roomPopulated.hotel)) {
          return {
            code: 404,
            message: "service not found in this hotel"
          };
        } else {
          const diffDays = Math.abs(moment().diff(startDate, "days"));
          if (service.daysBeforeReservation > diffDays) {
            return {
              code: 422,
              message: `the service: "${service.name}" must be reserved before "${service.daysBeforeReservation}" days of your reservation`
            };
          }
          const id = service._id
          const serviceReservations = await Reservation.find({
            services: {
              $elemMatch: {
                $eq: id
              }
            },
            $or: [{
                startDate: {
                  $lte: startDate.toDate()
                },
                endDate: {
                  $gte: startDate.toDate()
                }
              }, {
                startDate: {
                  $gte: startDate.toDate()
                },
                endDate: {
                  $lte: endDate.toDate()
                }
              }, {
                startDate: {
                  $lte: endDate.toDate()
                },
                endDate: {
                  $gte: endDate.toDate()
                }
              },
              {
                startDate: {
                  $lte: startDate.toDate()
                },
                endDate: {
                  $gte: endDate.toDate()
                }
              }
            ]
          });
          const serviceDemanded = 0
          services.forEach(s => {
            if (service._id == s._id) serviceDemanded++
          });
          if (serviceReservations.length > service.quantity || serviceDemanded > service.quantity) {
            return {
              code: 422,
              message: `the service is not available`
            };
          }

          serviceTotalPrice += service.price

        }
      }


    }
  }

  let finalPrice = 0;

  const pricePolicies = await PricePolicy.find({
    hotel: roomPopulated.hotel
  });

  if (pricePolicies.length > 0) {
    let pricePolicyDaysOfTheWeek = {};
    let pricePolicyDates = [];

    pricePolicies.forEach(pricePolicy => {
      if (
        !pricePolicy.maximumPerson ||
        pricePolicies.maximumPerson >= adults + kids + babies
      ) {
        if (pricePolicy.dayOfTheWeek) {
          pricePolicyDaysOfTheWeek[pricePolicy.dayOfTheWeek] =
            pricePolicy.value;
        }
        if (pricePolicy.days && pricePolicy.days.length > 0) {
          pricePolicyDates.push({
            value: pricePolicy.value,
            days: pricePolicy.days.map(x => moment(x).format("DD/MM/YYYY"))
          });
        }
      }
    });

    let basePrice = roomPopulated.pricePerNight;

    for (
      let date = startDate; startDate.isSameOrBefore(endDate); date.add(1, "days")
    ) {
      let dayPrice = 0;
      if (pricePolicyDaysOfTheWeek[date.day()]) {
        dayPrice = (pricePolicyDaysOfTheWeek[date.day()] / 100) * basePrice;
      }
      if (pricePolicyDates.length > 0) {
        const dateString = date.format("DD/MM/YYYY");
        const datePrice = pricePolicyDates.find(x =>
          x.days.includes(dateString)
        );
        if (datePrice) {
          dayPrice = (datePrice.value / 100) * basePrice;
        }
      }
      finalPrice += dayPrice + basePrice;
    }
  }

  finalPrice += serviceTotalPrice
  return {
    code: 200,
    reservation: await new Reservation({
      room,
      services,
      price: finalPrice,
      startDate,
      endDate,
      adults,
      kids,
      babies
    }).save()
  }
};

// export const updateReservation = async ({
//   room,
//   services,
//   price,
//   startDate,
//   endDate,
//   adults,
//   kids,
//   babies,
//   id
// }) => {
//   if (mongoose.Types.ObjectId.isValid(id) === false) {
//     return {
//       code: 422,
//       message: "invalid reservation id"
//     };
//   }

//   let reservation = await Reservation.findOne({
//     _id: id
//   });

//   if (reservation) {
//     let roomPopulated = await Room.findOne({
//       _id: reservation.room
//     });
//     if (room) {
//       if (mongoose.Types.ObjectId.isValid(room) === false) {
//         return {
//           code: 422,
//           message: "invalid room id"
//         };
//       } else if (
//         !(await Room.findOne({
//           _id: room
//         }))
//       ) {
//         return {
//           code: 404,
//           message: "room not found"
//         };
//       } else {
//         roomPopulated = await Room.findOne({
//           _id: room
//         });
//       }
//     }
//     if (services) {
//       for (let i = 0; i < services.length; i++) {
//         if (mongoose.Types.ObjectId.isValid(services[i]) === false) {
//           return {
//             code: 422,
//             message: `
// invalid service id `
//           };
//         } else {
//           const service = await Service.findOne({
//             _id: services[i]
//           });
//           if (!service) {
//             return {
//               code: 404,
//               message: "service not found"
//             };
//           } else if (service.hotel != roomPopulated.hotel) {
//             return {
//               code: 404,
//               message: "service not found in this hotel"
//             };
//           }
//         }
//       }
//     }

//     reservation.reservation = reservation ?
//       reservation :
//       reservation.reservation;
//     reservation.services = services ? services : reservation.services;
//     reservation.price = price ? price : reservation.price;
//     reservation.startDate = startDate ? startDate : reservation.startDate;
//     reservation.endDate = endDate ? endDate : reservation.endDate;
//     reservation.adults = adults ? adults : reservation.adults;
//     reservation.kids = kids ? kids : reservation.kids;
//     reservation.babies = babies ? babies : reservation.babies;

//     return reservation.save();
//   } else {
//     return {
//       code: 404,
//       message: "reservation not found"
//     };
//   }
// };

export const deleteReservation = async id => {
  if (mongoose.Types.ObjectId.isValid(id) === false) {
    return {
      code: 422,
      message: "invalid reservation id"
    };
  }
  return Reservation.findOneAndDelete({
    _id: id
  });
};

// ###############################################################################
// ### service
// ###############################################################################

export const getServiceById = async id => {
  if (mongoose.Types.ObjectId.isValid(id) === false) {
    return {
      code: 422,
      message: "invalid service id"
    };
  }
  return Service.findOne({
    _id: id
  });
};

export const getAllServices = () => {
  return Service.find({});
};

export const addService = async ({
  name,
  price,
  daysBeforeReservation = 0,
  quantity = 1,
  hotel
}) => {
  if (mongoose.Types.ObjectId.isValid(hotel) === false) {
    return {
      code: 422,
      message: "invalid hotel id"
    };
  } else if (
    !(await Hotel.findOne({
      _id: hotel
    }))
  ) {
    return {
      code: 404,
      message: "hotel not found"
    };
  }

  return new Service({
    name,
    price,
    daysBeforeReservation,
    quantity,
    hotel
  }).save();
};

export const updateService = async ({
  name,
  price,
  daysBeforeReservation = 0,
  quantity = 1,
  hotel,
  id
}) => {
  if (mongoose.Types.ObjectId.isValid(id) === false) {
    return {
      code: 422,
      message: "invalid service id"
    };
  }

  let service = await Service.findOne({
    _id: id
  });

  if (service) {
    if (hotel) {
      if (mongoose.Types.ObjectId.isValid(hotel) === false) {
        return {
          code: 422,
          message: "invalid hotel id"
        };
      } else if (
        !(await Hotel.findOne({
          _id: hotel
        }))
      ) {
        return {
          code: 404,
          message: "hotel not found"
        };
      }
    }

    service.name = name ? name : service.name;
    service.price = price ? price : service.price;
    service.daysBeforeReservation = daysBeforeReservation ?
      daysBeforeReservation :
      service.daysBeforeReservation;
    service.quantity = quantity ? quantity : service.quantity;
    service.hotel = hotel ? hotel : service.hotel;

    return service.save();
  } else {
    return {
      code: 404,
      message: "service not found"
    };
  }
};

export const deleteService = async id => {
  
  if (mongoose.Types.ObjectId.isValid(id) === false) {
    return {
      code: 422,
      message: "invalid service id"
    };
  }

  return Service.findOneAndDelete({
    _id: id
  });
};

// ###############################################################################
// ### price policy
// ###############################################################################

export const getPricePolicyById = async id => {
  if (mongoose.Types.ObjectId.isValid(id) === false) {
    return {
      code: 422,
      message: "invalid price policy id"
    };
  }
  return PricePolicy.findOne({
    _id: id
  });
};

export const getAllPricePolicies = () => {
  return PricePolicy.find({});
};

export const addPricePolicy = async ({
  name,
  value,
  maximumPerson = null,
  dayOfTheWeek = null,
  days = null,
  hotel
}) => {
  if (mongoose.Types.ObjectId.isValid(hotel) === false) {
    return {
      code: 422,
      message: "invalid hotel id"
    };
  } else if (
    !(await Hotel.findOne({
      _id: hotel
    }))
  ) {
    return {
      code: 404,
      message: "hotel not found"
    };
  }

  const pricePolicyExist = await PricePolicy.findOne({
    hotel,
    $or: [{
        dayOfTheWeek: dayOfTheWeek
      },
      {
        $and: [{
            days: {
              $in: days
            }
          },
          {
            days: {
              $ne: null
            },
          }
        ]
      }
    ]
  })
  console.log(pricePolicyExist)
  if (pricePolicyExist) {
    return {
      code: 409,
      message: "offer allready exists"
    }
  }


  return new PricePolicy({
    name,
    value,
    maximumPerson,
    dayOfTheWeek,
    days,
    hotel
  }).save();
};

export const updatePricePolicy = async ({
  name,
  value,
  maximumPerson = null,
  dayOfTheWeek = null,
  days = null,
  hotel,
  id
}) => {
  if (mongoose.Types.ObjectId.isValid(id) === false) {
    return {
      code: 422,
      message: "invalid price policy id"
    };
  }

  let pricePolicy = await PricePolicy.findOne({
    _id: id
  });

  if (pricePolicy) {
    if (hotel) {
      if (mongoose.Types.ObjectId.isValid(hotel) === false) {
        return {
          code: 422,
          message: "invalid hotel id"
        };
      } else if (
        !(await Hotel.findOne({
          _id: hotel
        }))
      ) {
        return {
          code: 404,
          message: "hotel not found"
        };
      }
    }

    pricePolicy.name = name ? name : pricePolicy.name;
    pricePolicy.value = value ? value : pricePolicy.value;
    pricePolicy.maximumPerson = maximumPerson ?
      maximumPerson :
      pricePolicy.maximumPerson;
    pricePolicy.dayOfTheWeek = dayOfTheWeek ?
      dayOfTheWeek :
      pricePolicy.dayOfTheWeek;
    pricePolicy.days = days ? days : pricePolicy.days;
    pricePolicy.hotel = hotel ? hotel : pricePolicy.hotel;

    return pricePolicy.save();
  } else {
    return {
      code: 404,
      message: "price policy not found"
    };
  }
};

export const deletePricePolicy = async id => {
  if (mongoose.Types.ObjectId.isValid(id) === false) {
    return {
      code: 422,
      message: "invalid price policy id"
    };
  }
  return PricePolicy.findOneAndDelete({
    _id: id
  });
};