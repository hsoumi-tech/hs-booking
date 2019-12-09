import {
  getAllServices,
  addService,
  getServiceById,
  updateService,
  deleteService
} from '../../controllers/reservation';

export default (fastify, opts, next) => {
  // get all services
  fastify.get('/', async () => {
    const result = await getAllServices();
    return result;
  });

  // get service by id
  fastify.get('/:id', async req => {
    const result = await getServiceById(req.params.id);
    return result;
  });

  // add service
  const addServiceSchema = {
    body: {
      type: 'object',
      required: ['name', 'price', 'hotel'],
      properties: {
        name: {
          type: 'string'
        },
        price: {
          type: 'number',
          minimum: 0
        },
        daysBeforeReservation: {
          type: 'number',
          minimum: 0
        },
        quantity: {
          type: 'number',
          minimum: 1
        },
        hotel: {
          type: 'string'
        }
      }
    }
  };

  fastify.post(
    '/',
    {
      schema: addServiceSchema
    },
    async req => {
      const result = await addService(req.body);
      return result;
    }
  );

  // update service
  const updateServiceSchema = {
    body: {
      type: 'object',
      required: [],
      properties: {
        name: {
          type: 'string'
        },
        price: {
          type: 'number',
          minimum: 0
        },
        daysBeforeReservation: {
          type: 'number',
          minimum: 0
        },
        quantity: {
          type: 'number',
          minimum: 1
        },
        hotel: {
          type: 'string'
        }
      }
    }
  };

  fastify.put(
    '/:id',
    {
      schema: updateServiceSchema
    },
    async req => {
      const result = await updateService(
        Object.assign({}, req.body, {
          id: req.params.id
        })
      );
      return result;
    }
  );

  // delete service
  fastify.delete('/:id', async req => {
    const result = await deleteService(req.params.id);
    return result;
  });
  next();
};
