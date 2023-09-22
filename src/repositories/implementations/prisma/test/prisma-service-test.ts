import { PrismaService } from '../prisma-client.service';

export const prismaServiceTest = new PrismaService({
  datasources: {
    db: {
      url: process.env.TEST_PRISMA_URL,
    },
  },
});