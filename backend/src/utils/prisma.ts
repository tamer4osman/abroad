import { PrismaClient } from '@prisma/client';

// Use a single instance of Prisma Client across the entire application
const prisma = new PrismaClient();

export default prisma;