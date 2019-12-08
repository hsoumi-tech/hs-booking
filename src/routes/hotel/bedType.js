import {
  getAllBedTypes,
  addBedType,
  getBedTypeById,
  updateBedType,
  deleteBedType
} from '../../controllers/hotel';

export default (fastify, opts, next) => {

  // get all bed type 
  fastify.get(
    '/bed-type',
    async () => {
      const result = await getAllBedTypes();
      return result;
    }
  );

  // get bed type by id
  fastify.get(
    '/bed-type/:id',
    async req => {
      const result = await getBedTypeById(req.params.id);
      return result;
    }
  );

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
    '/bed-type', {
      schema: addBedTypeSchema
    },
    async req => {
      const result = await addBedType(req.body);
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
    '/bed-type/:id', {
      schema: updateBedTypeSchema
    },
    async req => {
      const result = await updateBedType(Object.assign({}, req.body, {
        id: req.params.id
      }));
      return result;
    }
  );

  // delete bed type 
  fastify.delete(
    '/bed-type/:id',
    async req => {
      const result = await deleteBedType(req.params.id);
      return result;
    }
  );
  next();
};