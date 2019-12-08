export default fastify => {
  fastify.addHook('preSerialization', async (req, res, payload) => {
    const newPayload = payload;

    // if code is sent set it to status
    if (newPayload.code) {
      res.status(newPayload.code);
    }

    // if message is sent, return it without any other data
    if (newPayload.message) {
      return {
        message: newPayload.message
      };
    }

    // Check if a password is sent and remove it
    if (newPayload.password) {
      delete newPayload.password;
    }
    return newPayload;
  });
};
