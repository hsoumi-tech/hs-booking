import roomType from './hotel/roomType';
import bedType from './hotel/bedType';
import room from './hotel/room';
import hotel from './hotel/hotel';

export default fastify => {
  fastify.get('/', async (req, res) => {
    return {
      welcome: 'api'
    };
  });
  fastify.register(roomType, {
    prefix: 'hotel'
  });
  fastify.register(bedType, {
    prefix: 'hotel'
  });
  fastify.register(room, {
    prefix: 'hotel'
  });
  fastify.register(hotel, {
    prefix: 'hotel'
  });

};