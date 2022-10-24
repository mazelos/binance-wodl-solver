import Redis, { RedisOptions } from 'ioredis';

class RedisManager extends Redis {
  private static _instance = new RedisManager({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  });

  private constructor(options: RedisOptions) {
    super(options);
  }

  static get instance() {
    return this._instance;
  }
}

export default RedisManager.instance;
