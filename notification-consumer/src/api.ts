import { FastifyInstance } from 'fastify';
import { getRecentNotifications, getNotificationSummary } from './notificationService';

export async function registerRoutes(fastify: FastifyInstance) {
  // Recent Notifications API
  fastify.get('/recent', async (request, reply) => {
    const notifications = getRecentNotifications();
    return reply.send(notifications);
  });

  // Summary API
  fastify.get('/summary', async (request, reply) => {
    const summary = getNotificationSummary();
    return reply.send(summary);
  });
}