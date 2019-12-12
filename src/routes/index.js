import roomType from './hotel/roomType';
import bedType from './hotel/bedType';
import room from './hotel/room';
import hotel from './hotel/hotel';
import reservation from './reservation/reservation';
import service from './reservation/service';
import pricePolicy from './reservation/pricePolicy';
import Moderator from '../models/moderator';
import moderators from './moderator/moderator';
import bcrypt from 'bcrypt';

export default fastify => {
  fastify.ready(async () => {
    const moderator = await Moderator.findOne({
      name: process.env.ROOT_MODERATOR_NAME
    })
    if (!moderator) {
      new Moderator({
        name: process.env.ROOT_MODERATOR_PASSWORD,
        password: bcrypt.hashSync(process.env.ROOT_MODERATOR_PASSWORD, 10)
      }).save()
    }
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
  fastify.register(moderators, {
    prefix: 'moderator'
  });
};