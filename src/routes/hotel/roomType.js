import {
  getAllRoomTypes,
  addRoomType,
  getRoomTypeById,
  updateRoomType,
  deleteRoomType
} from '../../controllers/hotel';

export default (fastify, opts, next) => {

  // get all room type 
  fastify.get(
    '/room-type',
    async () => {
      const result = await getAllRoomTypes();
      return result;
    }
  );

  // get room type by id
  fastify.get(
    '/room-type/:id',
    async req => {
      const result = await getRoomTypeById(req.params.id);
      return result;
    }
  );

  // add room type 
  const addRoomTypeSchema = {
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
    '/room-type', {
      schema: addRoomTypeSchema
    },
    async req => {
      const result = await addRoomType(req.body);
      return result;
    }
  );

  // update room type 
  const updateRoomTypeSchema = {
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
    '/room-type/:id', {
      schema: updateRoomTypeSchema
    },
    async req => {
      const result = await updateRoomType(Object.assign({}, req.body, {
        id: req.params.id
      }));
      return result;
    }
  );

  // delete room type 
  fastify.delete(
    '/room-type/:id',
    async req => {
      const result = await deleteRoomType(req.params.id);
      return result;
    }
  );
  next();
};