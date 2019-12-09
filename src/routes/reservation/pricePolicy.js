import {
  getAllPricePolicies,
  addPricePolicy,
  getPricePolicyById,
  updatePricePolicy,
  deletePricePolicy
} from '../../controllers/reservation';

export default (fastify, opts, next) => {

  // get all Price Policies
  fastify.get(
    '/price-policy',
    async () => {
      const result = await getAllPricePolicies();
      return result;
    }
  );

  // get price policy by id
  fastify.get(
    '/price-policy/:id',
    async req => {
      const result = await getPricePolicyById(req.params.id);
      return result;
    }
  );

  // add price policy 
  const addPricePolicySchema = {
    body: {
      type: 'object',
      required: ['name', 'value', 'hotel'],
      properties: {
        name: {
          type: 'string'
        },
        value: {
          type: 'number',
        },
        maximumPerson: {
          type: 'number',
          minimum: 1
        },
        dayOfTheWeek: {
          type: 'number',
          minimum: 0
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
        },
      }
    }
  };

  fastify.post(
    '/price-policy', {
      schema: addPricePolicySchema
    },
    async req => {
      const result = await addPricePolicy(req.body);
      return result;
    }
  );

  // update price policy 
  const updatePricePolicySchema = {
    body: {
      type: 'object',
      required: [],
      properties: {
        name: {
          type: 'string'
        },
        value: {
          type: 'number',
        },
        maximumPerson: {
          type: 'number',
          minimum: 1
        },
        dayOfTheWeek: {
          type: 'number',
          minimum: 0
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
        },
      }
    }
  };

  fastify.put(
    '/price-policy/:id', {
      schema: updatePricePolicySchema
    },
    async req => {
      // const result = await updatePricePolicy(Object.assign({}, req.body, {
      //   id: req.params.id
      // }));
      const result = await updatePricePolicy(Object.assign({}, req.body, {
        id: req.params.id
      }));
      return result;
    }
  );

  // delete price policy 
  fastify.delete(
    '/price-policy/:id',
    async req => {
      const result = await deletePricePolicy(req.params.id);
      return result;
    }
  );
  next();
};