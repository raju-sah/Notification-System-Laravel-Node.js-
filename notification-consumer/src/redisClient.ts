import Redis from 'ioredis';
import { FastifyInstance } from 'fastify';
import { processNotification } from './notificationService';

const redis = new Redis({
  host: '127.0.0.1',
  port: 6379,
});

export function subscribeToNotifications(fastify: FastifyInstance) {
  redis.subscribe('notifications', (err, count) => {
    if (err) {
      fastify.log.error('Failed to subscribe to Redis:', err);
      return;
    }
    fastify.log.info(`Subscribed to ${count} channels`);
  });

  redis.on('message', async (channel, message) => {
    try {
      const notification = JSON.parse(message);
      await processNotification(notification, fastify);
    } catch (error) {
      fastify.log.error('Error processing message:', error);
    }
  });
}

export default redis;