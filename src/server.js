import Fastify from 'fastify';

// Plugins
import fastifyHelmet from 'fastify-helmet'; // https://github.com/fastify/fastify-helmet
import fastifyJwt from 'fastify-jwt'; // https://github.com/fastify/fastify-jwt
import fastifyRateLimit from 'fastify-rate-limit'; // https://github.com/fastify/fastify-rate-limit
import fastifySwagger from 'fastify-swagger'; // https://github.com/fastify/fastify-swagger
import fastifyBlipp from 'fastify-blipp'; // https://github.com/fastify/fastify-blipp
import fastifyMultipart from 'fastify-multipart'; // https://github.com/fastify/fastify-multipart

// Other
// import loadHooks from "./hooks/index";
// import loadDecorators from "./decorators";

// Local
import loadRoutes from './routes';
import './utils/db';
import { isProduction, apiUrl, apiPort, currentProtocol } from './utils/helper';

// Variables
const fastify = Fastify({
  maxParamLength: 300,
  ignoreTrailingSlash: true,
  disableRequestLogging: true,
  logger: {
    prettyPrint: {
      translateTime: true
    }
  }
});

// Load Plugins
fastify.register(fastifyBlipp);
fastify.register(fastifyHelmet);
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET
});
fastify.register(fastifyRateLimit);
fastify.register(fastifySwagger, {
  routePrefix: '/api-documentation',
  exposeRoute: isProduction === false,
  swagger: {
    info: {
      title: `${process.env.PROJECT_NAME} Documentation`,
      description: 'Swagger api',
      version: process.env.PROJECT_VERSION
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    host: apiUrl.toString().replace('http://', ''),
    schemes: [currentProtocol],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      Authorization: {
        type: 'Authorization',
        name: 'Authorization',
        in: 'header'
      }
    }
  }
});
fastify.register(fastifyMultipart);

// Load Routes
loadRoutes(fastify);

// Start Server
const start = async () => {
  try {
    await fastify.listen(apiPort, '0.0.0.0');
    fastify.blipp();
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error.message);
});
