/* eslint-disable @typescript-eslint/no-require-imports */

const { defineConfig } = require("prisma/config")

// Keep local SQLite working for hackathon/dev even when Prisma skips .env loading.
process.env.DATABASE_URL ||= "file:./prisma/dev.db"

module.exports = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "node prisma/seed.cjs",
  },
})
