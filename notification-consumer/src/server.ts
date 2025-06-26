import Fastify from 'fastify';
import cors from '@fastify/cors';
import { subscribeToNotifications } from './redisClient';
import { registerRoutes } from './api';

const fastify = Fastify({ logger: true });
fastify.register(cors, { origin: '*' });

// Register API routes
fastify.register(registerRoutes);

// Initialize Redis subscription
subscribeToNotifications(fastify);

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info('Server running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();