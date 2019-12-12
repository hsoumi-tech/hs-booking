import {
  getAllReservations,
  addReservation,
  getReservationById,
  // updateReservation,
  deleteReservation
} from '../../controllers/reservation';

import sendMail from '../../utils/sendMail';

export default (fastify, opts, next) => {
  // get all reservation
  fastify.get('/', async () => {
    const result = await getAllReservations();
    return result;
  });

  // get reservation by id
  fastify.get('/:id', async req => {
    const result = await getReservationById(req.params.id);
    return result;
  });

  const addReservationSchema = {
    body: {
      type: 'object',
      required: ['room', 'startDate', 'endDate'],
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
        console.log("result", result.reservation)
        await sendMail({
          to: 'mahdi.hsoumi@hstech.tn',
          subject: 'HS BOOKING',
          html: `New Reservation: ${result.reservation}`
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
  fastify.delete('/:id', async req => {
    const result = await deleteReservation(req.params.id);
    return result;
  });
  next();
};