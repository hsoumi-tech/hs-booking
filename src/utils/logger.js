import pino from 'pino';

export default pino({
  prettyPrint: {
    colorize: true,
    translateTime: true,
    ignore: 'pid,hostname'
  }
});
