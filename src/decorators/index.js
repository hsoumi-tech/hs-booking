import Moderator from '../models/moderator'

export default fastify => {
  fastify.decorate('verifyJwt', async (req, res) => {
    let isAuthorized = false;
    const {
      authorization
    } = req.headers;
    if (authorization && typeof authorization === 'string') {
      const [, token] = authorization.split(' ');
      const data = await new Promise(resolve => {
        fastify.jwt.verify(token, (err, decoded) => {
          if (err) {
            isAuthorized = false;
            resolve(null);
          }

          resolve(decoded || {});
        });
      });
      if (data) {
        req.jwtData = data;
        isAuthorized = true;
      }
      if (req.jwtData && req.jwtData.id) {
        const moderator = await Moderator.findOne({
          _id: req.jwtData.id
        })
        if (!moderator) {
          isAuthorized = false;
        }
      } else {
        isAuthorized = false;
      }

    }
    if (!isAuthorized) {
      res.status(401);
      throw new Error('you are not authorized');
    }
  });
};