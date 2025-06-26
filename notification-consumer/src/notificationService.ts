import axios from "axios";
import { FastifyInstance } from "fastify";

// In-memory cache for recent notifications and token
const recentNotifications: any[] = [];
let authToken: string = "";

async function fetchAuthToken(fastify: FastifyInstance): Promise<string> {
  try {
    const response = await axios.post("http://localhost:8000/api/v1/login", {
      email: process.env.LARAVEL_API_EMAIL || "microservice@example.com",
      password: process.env.LARAVEL_API_PASSWORD || "password",
    });
    authToken = response.data.token;
    fastify.log.info("Successfully fetched Sanctum token");
    return authToken;
  } catch (error) {
    fastify.log.error("Failed to fetch Sanctum token:", error);
    throw error;
  }
}

export async function processNotification(
  notification: any,
  fastify: FastifyInstance
) {
  const maxRetries = 3;
  let attempt = 1;

  // Simulate sending notification
  console.log(`Simulating notification send: ${JSON.stringify(notification)}`);

  // Ensure token is available
  if (!authToken) {
    authToken = await fetchAuthToken(fastify);
  }

  const updateNotification = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/v1/notifications/update",
        {
          id: notification.id,
          status: "processed",
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      recentNotifications.push(notification);
      if (recentNotifications.length > 100) recentNotifications.shift();
      fastify.log.info(`Notification ${notification.id} processed`);
    } catch (error: any) {
      if (error.response?.status === 401 && attempt <= maxRetries) {
        fastify.log.warn(
          `Authentication failed for notification ${notification.id}, retrying token fetch`
        );
        authToken = await fetchAuthToken(fastify);
        setTimeout(updateNotification, 1000 * attempt);
        attempt++;
      } else if (attempt <= maxRetries) {
        fastify.log.warn(
          `Retry ${attempt} for notification ${notification.id}`
        );
        setTimeout(updateNotification, 1000 * attempt);
        attempt++;
      } else {
        fastify.log.error(
          `Failed to process notification ${notification.id}:`,
          error
        );
        // Update status to 'failed' on max retries
        try {
          await axios.post(
            "http://localhost:8000/api/v1/notifications/update",
            {
              id: notification.id,
              status: "failed",
            },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
        } catch (failError) {
          fastify.log.error(
            `Failed to update notification ${notification.id} to failed:`,
            failError
          );
        }
      }
    }
  };

  await updateNotification();
}

export function getRecentNotifications() {
  return recentNotifications;
}

export function getNotificationSummary() {
  return { totalNotifications: recentNotifications.length };
}
