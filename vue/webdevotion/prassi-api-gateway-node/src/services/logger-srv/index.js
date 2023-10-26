require('dotenv').config();
const pino = require('pino');
const noir = require('pino-noir');
const blacklist = require('./blacklist');

let logger;

function init() {
  if (logger) return logger;

  const env = process.env.ENV || 'local';
  const level = process.env.LOG || 'trace';

  const prettyPrint = env !== 'PROD' ? { colorize: true, translateTime: true } : false;
  const serializers = noir(blacklist, '[Redacted]');
  // @ts-ignore
  logger = pino({ level, prettyPrint, serializers });

  logger.trace('Logger initialized');
  return logger;
}

module.exports = init;
