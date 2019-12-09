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
    prefix: 'room-types'
  });
  fastify.register(bedType, {
    prefix: 'bed-types'
  });
  fastify.register(room, {
    prefix: 'rooms'
  });
  fastify.register(hotel, {
    prefix: 'hotels'
  });
  fastify.register(reservation, {
    prefix: 'reservations'
  });
  fastify.register(service, {
    prefix: 'services'
  });
  fastify.register(pricePolicy, {
    prefix: 'price-policies'
  });
};
