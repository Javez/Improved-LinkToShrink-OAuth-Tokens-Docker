import dotenv from 'dotenv';
import Redis from 'ioredis';
dotenv.config();

const redis = new Redis({
  host: "redis" || '',
  port: parseInt(process.env.REDIS_PORT || '4000')
});
redis.on('error', (error: any) => {
  console.error('Redis connection error:', error);
});

export default redis;
