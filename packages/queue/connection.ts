import type { ConnectionOptions } from "bullmq";
import type { RedisOptions } from "ioredis";
import Redis from "ioredis";
import { keys } from "./keys";

const env = keys();

type RedisConfig = {
  host: string;
  port: number;
  password?: string;
  username?: string;
};

function parseRedisUrl(url: string): RedisConfig {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: Number(parsed.port) || 6379,
    password: parsed.password || undefined,
    username: parsed.username || undefined,
  };
}

const redisConfig: RedisConfig = env.REDIS_URL
  ? parseRedisUrl(env.REDIS_URL)
  : {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
    };

export const connectionOptions: ConnectionOptions = redisConfig;

let redisConnection: Redis | null = null;

export function getRedisConnection(): Redis {
  if (!redisConnection) {
    redisConnection = new Redis(redisConfig as RedisOptions);
  }
  return redisConnection;
}

export async function closeRedisConnection(): Promise<void> {
  if (redisConnection) {
    await redisConnection.quit();
    redisConnection = null;
  }
}
