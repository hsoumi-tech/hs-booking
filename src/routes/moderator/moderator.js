import {
  signin,
  addModerator
} from '../../controllers/moderator';

export default (fastify, opts, next) => {
  // add bed type
  const schema = {
    body: {
      type: 'object',
      required: ['name', 'password'],
      properties: {
        name: {
          type: 'string',
        },
        password: {
          type: 'string',

        }
      }
    }
  };

  fastify.post(
    '/signin', {
      schema
    },
    async req => {
      const result = await signin(req.body);
      if (result.code === 200) {
        return {
          token: fastify.jwt.sign({
            id: result.moderator._id
          })
        };
      }
      return result;
    }

  );

  fastify.post(
    '/add-moderator', {
      schema,
      preHandler: fastify.verifyJwt
    },
    async req => {
      const result = await addModerator(req.body);
      return result;
    }
  );


  next();
};