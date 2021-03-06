import {
  getAllRoomTypes,
  addRoomType,
  getRoomTypeById,
  updateRoomType,
  deleteRoomType
} from '../../controllers/hotel';

export default (fastify, opts, next) => {
  // get all room type
  fastify.get('/', {
    schema: {
      security: [{
        jwt: []
      }]
    },
    preHandler: fastify.verifyJwt
  }, async () => {
    const result = await getAllRoomTypes();
    return result;
  });

  // get room type by id
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
    const result = await getRoomTypeById(req.params.id);
    return result;
  });

  // add room type
  const addRoomTypeSchema = {
    security: [{
      jwt: []
    }],
    body: {
      type: 'object',
      required: ['name', 'description'],
      properties: {
        name: {
          type: 'string'
        },
        description: {
          type: 'string'
        }
      }
    }
  };

  fastify.post(
    '/', {
      schema: addRoomTypeSchema,
      preHandler: fastify.verifyJwt
    },
    async req => {
      const result = await addRoomType(req.body);
      return result;
    }
  );

  // update room type
  const updateRoomTypeSchema = {
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
        name: {
          type: 'string'
        },
        description: {
          type: 'string'
        }
      }
    }
  };

  fastify.put(
    '/:id', {
      schema: updateRoomTypeSchema,
      preHandler: fastify.verifyJwt
    },
    async req => {
      const result = await updateRoomType(
        Object.assign({}, req.body, {
          id: req.params.id
        })
      );
      return result;
    }
  );

  // delete room type
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
    const result = await deleteRoomType(req.params.id);
    return result;
  });
  next();
};