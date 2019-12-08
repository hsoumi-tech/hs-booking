import {
  getAllHotels,
  addHotel,
  getHotelById,
  updateHotel,
  deleteHotel
} from '../../controllers/hotel';

export default (fastify, opts, next) => {

  // get all hotel 
  fastify.get(
    '/',
    async () => {
      const result = await getAllHotels();
      return result;
    }
  );

  // get hotel by id
  fastify.get(
    '/:id',
    async req => {
      const result = await getHotelById(req.params.id);
      return result;
    }
  );

  // add hotel 
  const addHotelSchema = {
    body: {
      type: 'object',
      required: ['name', 'description', 'rooms', 'adress', 'phoneNumber'],
      properties: {
        name: {
          type: 'string'
        },
        description: {
          type: 'string'
        },
        rooms: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        adress: {
          type: 'string'
        },
        phoneNumber: {
          type: 'number'
        }
      }
    }
  };

  fastify.post(
    '/', {
      schema: addHotelSchema
    },
    async req => {
      const result = await addHotel(req.body);
      return result;
    }
  );

  // update hotel 
  const updateHotelSchema = {
    body: {
      type: 'object',
      required: [],
      properties: {
        name: {
          type: 'string'
        },
        description: {
          type: 'string'
        },
        rooms: {
          type: 'array',
          items: {
            type: 'string'
          },
        },
        adress: {
          type: 'string'
        },
        phoneNumber: {
          type: 'number'
        }
      }
    }
  };

  fastify.put(
    '/:id', {
      schema: updateHotelSchema
    },
    async req => {
      const result = await updateHotel(Object.assign({}, req.body, {
        id: req.params.id
      }));
      return result;
    }
  );

  // delete hotel 
  fastify.delete(
    '/:id',
    async req => {
      const result = await deleteHotel(req.params.id);
      return result;
    }
  );
  next();
};