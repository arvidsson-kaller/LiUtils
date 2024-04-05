/**
 * Environments variables declared here.
 */

/* eslint-disable node/no-process-env */

export default {
  NodeEnv: process.env.NODE_ENV ?? '',
  Port: process.env.PORT ?? 0,
  PostgreConnectionString: process.env.POSTGRES_URL ?? '',
  Auth: {
    ApiKey: process.env.API_KEY ?? '',
    Jwt: {
      Secret: process.env.JWT_SECRET ?? '',
    },
  },
} as const;
