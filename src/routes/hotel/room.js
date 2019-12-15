import {
  getAllRooms,
  addRoom,
  getRoomById,
  updateRoom,
  deleteRoom
} from '../../controllers/hotel';

export default (fastify, opts, next) => {
  // get all room
  fastify.get('/', {
    schema: {
      security: [{
        jwt: []
      }],
    },
    preHandler: fastify.verifyJwt
  }, async () => {
    const result = await getAllRooms();
    return result;
  });

  // get room by id
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
    const result = await getRoomById(req.params.id);
    return result;
  });

  // add room
  const addRoomSchema = {
    security: [{
      jwt: []
    }],
    body: {
      type: 'object',
      required: ['hotel', 'roomType', 'beds', 'occupancy', 'floorLevel', 'roomNumber', 'pricePerNight'],
      properties: {
        hotel: {
          type: 'string'
        },
        roomType: {
          type: 'string'
        },
        beds: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        occupancy: {
          type: 'number',
          minimum: 1
        },
        floorLevel: {
          type: 'number'
        },
        roomNumber: {
          type: 'number'
        },
        pricePerNight: {
          type: 'number',
          minimum: 0
        }
      }
    }
  };

  fastify.post(
    '/', {
      schema: addRoomSchema,
      preHandler: fastify.verifyJwt
    },
    async req => {
      const result = await addRoom(req.body);
      return result;
    }
  );

  // update room
  const updateRoomSchema = {
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
    body: {
      type: 'object',
      required: [],
      properties: {
        properties: {
          hotel: {
            type: 'string'
          },
          roomType: {
            type: 'string'
          },
          beds: {
            type: 'array'
          },
          occupancy: {
            type: 'number',
            minimum: 1
          },
          floorLevel: {
            type: 'number'
          },
          roomNumber: {
            type: 'number'
          },
          pricePerNight: {
            type: 'number',
            minimum: 0
          }
        }
      }
    }
  };

  fastify.put(
    '/:id', {
      schema: updateRoomSchema,
      preHandler: fastify.verifyJwt
    },
    async req => {
      const result = await updateRoom(
        Object.assign({}, req.body, {
          id: req.params.id
        })
      );
      return result;
    }
  );

  // delete room
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
    const result = await deleteRoom(req.params.id);
    return result;
  });
  next();
};