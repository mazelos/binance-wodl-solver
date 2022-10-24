import { PrismaClient } from '@prisma/client';

class PrismaManager {
  client: PrismaClient;
  private static _instance = new PrismaManager();

  private constructor() {
    this.client = new PrismaClient();
  }

  static get instance() {
    return this._instance;
  }
}

export default PrismaManager.instance.client;
