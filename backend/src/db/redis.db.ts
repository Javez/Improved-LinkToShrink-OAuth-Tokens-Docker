import dotenv from 'dotenv';
import Redis from 'ioredis';
dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST || '',
  port: parseInt(process.env.REDIS_PORT || '6379')
});
redis.on('error', (error: any) => {
  console.error('Redis connection error:', error);
});

export default redis;
