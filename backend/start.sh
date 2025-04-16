#!/bin/sh
echo "Generating Prisma client..."
npx prisma generate
echo "Starting server..."
node dist/server.js