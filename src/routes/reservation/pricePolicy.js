import {
  getAllPricePolicies,
  addPricePolicy,
  getPricePolicyById,
  updatePricePolicy,
  deletePricePolicy
} from '../../controllers/reservation';

export default (fastify, opts, next) => {
  // get all Price Policies
  fastify.get('/', {
    schema: {
      security: [{
        jwt: []
      }]
    },
    preHandler: fastify.verifyJwt
  }, async () => {
    const result = await getAllPricePolicies();
    return result;
  });

  // get price policy by id
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
    const result = await getPricePolicyById(req.params.id);
    return result;
  });

  // add price policy
  const addPricePolicySchema = {
    security: [{
      jwt: []
    }],
    body: {
      type: 'object',
      required: ['name', 'value', 'hotel'],
      properties: {
        name: {
          type: 'string'
        },
        value: {
          type: 'number'
        },
        maximumPerson: {
          type: 'number',
          minimum: 1
        },
        dayOfTheWeek: {
          type: 'number',
          minimum: 0,
          maximum: 6,
        },
        days: {
          type: 'array',
          items: {
            type: 'string',
            format: 'date-time'
          }
        },
        hotel: {
          type: 'string'
        }
      }
    }
  };

  fastify.post(
    '/', {
      schema: addPricePolicySchema,
      preHandler: fastify.verifyJwt
    },
    async req => {
      const result = await addPricePolicy(req.body);
      return result;
    }
  );

  // update price policy
  const updatePricePolicySchema = {
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
        value: {
          type: 'number'
        },
        maximumPerson: {
          type: 'number',
          minimum: 1,

        },
        dayOfTheWeek: {
          type: 'number',
          minimum: 0,
          maximum: 6,
        },
        days: {
          type: 'array',
          items: {
            type: 'string',
            format: 'date'
          }
        },
        hotel: {
          type: 'string'
        }
      }
    }
  };

  fastify.put(
    '/:id', {
      schema: updatePricePolicySchema,
      preHandler: fastify.verifyJwt
    },
    async req => {
      // const result = await updatePricePolicy(Object.assign({}, req.body, {
      //   id: req.params.id
      // }));
      const result = await updatePricePolicy(
        Object.assign({}, req.body, {
          id: req.params.id
        })
      );
      return result;
    }
  );

  // delete price policy
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
    const result = await deletePricePolicy(req.params.id);
    return result;
  });
  next();
};