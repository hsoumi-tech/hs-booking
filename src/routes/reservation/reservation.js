import {
  getAllReservations,
  addReservation,
  getReservationById,
  // updateReservation,
  deleteReservation
} from '../../controllers/reservation';
import sendMail from '../../utils/sendMail';
import moment from 'moment'
export default (fastify, opts, next) => {
  // get all reservation
  fastify.get('/', {
    schema: {
      security: [{
        jwt: []
      }]
    },
    preHandler: fastify.verifyJwt
  }, async () => {
    const result = await getAllReservations();
    return result;
  });

  // get reservation by id
  fastify.get('/:id', {
    schema: {
      security: [{
        jwt: []
      }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'string'
          }
        }
      },
    },
    preHandler: fastify.verifyJwt
  }, async req => {
    const result = await getReservationById(req.params.id);
    return result;
  });

  const addReservationSchema = {
    security: [{
      jwt: []
    }],
    body: {
      type: 'object',
      required: ['room', 'startDate', 'endDate', 'email'],
      properties: {
        room: {
          type: 'string'
        },
        services: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        startDate: {
          type: 'string'
        },
        endDate: {
          type: 'string'
        },
        adults: {
          type: 'number',
          minimum: 1
        },
        kids: {
          type: 'number',
          minimum: 0
        },
        babies: {
          type: 'number',
          minimum: 0
        },
        email: {
          type: 'string',
          format: 'email'
        }
      }
    }
  };

  fastify.post(
    '/', {
      schema: addReservationSchema
    },
    async req => {
      const result = await addReservation(req.body);
      if (result.reservation) {
        await sendMail({
          to: result.reservation.email,
          subject: `Reply from ${result.hotelName}`,
          html: `Your reservation: <br>
           Room number: ${result.room.roomNumber}<br> Floor Level: ${result.room.floorLevel}<br>
           Check in: ${moment(result.reservation.startDate).format("YYYY-MM-DD")} <br> Check out: ${moment(result.reservation.endDate).format("YYYY-MM-DD")}`
        });
      }
      return result;
    }
  );
  // update reservation
  // const updateReservationSchema = {
  //   body: {
  //     type: 'object',
  //     required: [],
  //     properties: {
  //       room: {
  //         type: 'string'
  //       },
  //       services: {
  //         type: 'array',
  //         items: {
  //           type: 'string'
  //         }
  //       },
  //       price: {
  //         type: 'number',
  //         minimum: 0
  //       },
  //       startDate: {
  //         type: 'string',
  //         format: 'date'
  //       },
  //       endDate: {
  //         type: 'string',
  //         format: 'date'
  //       },
  //       adults: {
  //         type: 'number',
  //         minimum: 1
  //       },
  //       kids: {
  //         type: 'number',
  //         minimum: 0
  //       },
  //       babies: {
  //         type: 'number',
  //         minimum: 0
  //       }
  //     }
  //   }
  // };

  // fastify.put(
  //   '/:id', {
  //     schema: updateReservationSchema
  //   },
  //   async req => {
  //     const result = await updateReservation(Object.assign({}, req.body, {
  //       id: req.params.id
  //     }));
  //     return result;
  //   }
  // );

  // delete reservation
  fastify.delete('/:id', {
    schema: {
      security: [{
        jwt: []
      }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'string'
          }
        }
      },
    },
    preHandler: fastify.verifyJwt
  }, async req => {
    const result = await deleteReservation(req.params.id);
    return result;
  });
  next();
};