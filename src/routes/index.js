import roomType from './hotel/roomType';
import bedType from './hotel/bedType';
import room from './hotel/room';
import hotel from './hotel/hotel';
import reservation from './reservation/reservation';
import service from './reservation/service';
import pricePolicy from './reservation/pricePolicy';

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
  fastify.register(reservation, {
    prefix: 'reservation'
  });
  fastify.register(service, {
    prefix: 'reservation'
  });
  fastify.register(pricePolicy, {
    prefix: 'reservation'
  });

};