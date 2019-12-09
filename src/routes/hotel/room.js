import { getAllRooms, addRoom, getRoomById, updateRoom, deleteRoom } from '../../controllers/hotel';

export default (fastify, opts, next) => {
  // get all room
  fastify.get('/', async () => {
    const result = await getAllRooms();
    return result;
  });

  // get room by id
  fastify.get('/:id', async req => {
    const result = await getRoomById(req.params.id);
    return result;
  });

  // add room
  const addRoomSchema = {
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
    '/',
    {
      schema: addRoomSchema
    },
    async req => {
      const result = await addRoom(req.body);
      return result;
    }
  );

  // update room
  const updateRoomSchema = {
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
    '/:id',
    {
      schema: updateRoomSchema
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
  fastify.delete('/:id', async req => {
    const result = await deleteRoom(req.params.id);
    return result;
  });
  next();
};
