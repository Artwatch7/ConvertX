import { Elysia } from "elysia";

export const healthCheck = new Elysia()
  .get("/health", () => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version
    };
  });
