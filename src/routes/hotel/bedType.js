import {
  getAllBedTypes,
  addBedType,
  getBedTypeById,
  updateBedType,
  deleteBedType
} from '../../controllers/hotel';

export default (fastify, opts, next) => {
  // get all bed type
  fastify.get('/', {
    preHandler: fastify.verifyJwt
  }, async () => {
    const result = await getAllBedTypes();
    return result;
  });

  // get bed type by id
  fastify.get('/:id', {
    preHandler: fastify.verifyJwt
  }, async req => {
    const result = await getBedTypeById(req.jwtData.id, req.params.id);
    return result;
  });

  // add bed type
  const addBedTypeSchema = {
    body: {
      type: 'object',
      required: ['name', 'description', 'size'],
      properties: {
        name: {
          type: 'string'
        },
        description: {
          type: 'string'
        },
        size: {
          type: 'number',
          minimum: 1
        }
      }
    }
  };

  fastify.post(
    '/', {
      schema: addBedTypeSchema,
      preHandler: fastify.verifyJwt
    },
    async req => {
      const result = await addBedType(req.jwtData.id, req.body);
      return result;
    }
  );

  // update bed type
  const updateBedTypeSchema = {
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
        size: {
          type: 'number',
          minimum: 1
        }
      }
    }
  };

  fastify.put(
    '/:id', {
      schema: updateBedTypeSchema,
      preHandler: fastify.verifyJwt
    },
    async req => {
      const result = await updateBedType(req.params.id, req.body)

      return result;
    }
  );

  // delete bed type
  fastify.delete('/:id', {
    preHandler: fastify.verifyJwt
  }, async req => {
    const result = await deleteBedType(req.params.id);
    return result;
  });
  next();
};