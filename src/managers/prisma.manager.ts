import { PrismaClient } from '@prisma/client';

class PrismaManager {
  client: PrismaClient;
  static instance: PrismaManager;

  constructor() {
    this.client = new PrismaClient();
  }

  static getInstance() {
    if (!PrismaManager.instance) {
      PrismaManager.instance = new PrismaManager();
    }
    return PrismaManager.instance;
  }
}

export default PrismaManager;
