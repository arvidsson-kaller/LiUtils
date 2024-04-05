import { Service } from "./backend-client";

export const BackendService = new Service({
  BASE: process.env.BACKEND_URL ?? "",
  HEADERS: {
    "api-key": process.env.BACKEND_API_KEY ?? "",
  },
}).default;

export const getUserBackendService = (jwt: string) =>
  new Service({
    BASE: process.env.BACKEND_URL ?? "",
    TOKEN: jwt,
  }).default;
