/* eslint-disable @typescript-eslint/no-require-imports */

const { defineConfig } = require("prisma/config")

module.exports = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "node prisma/seed.cjs",
  },
})
